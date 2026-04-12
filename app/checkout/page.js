"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Check,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { loadRazorpay } from "../../utils/razorpay";
import { validateCoupon } from "../../lib/supabase/coupons";
import { getShippingConfig } from "../../lib/supabase/shipping";
import { useEffect, useMemo } from "react";

export default function Checkout() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingConfig, setShippingConfig] = useState([]);

  useEffect(() => {
    async function loadShipping() {
      const config = await getShippingConfig();
      setShippingConfig(config || []);
    }
    loadShipping();
  }, []);
  const [orderComplete, setOrderComplete] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [eligibleSubtotal, setEligibleSubtotal] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "percentage") {
      discountAmount = (eligibleSubtotal * appliedCoupon.discount_value) / 100;
    } else {
      // For fixed discounts on specific items, limit it to the eligible subtotal
      discountAmount = Math.min(appliedCoupon.discount_value, eligibleSubtotal);
    }
  }
  discountAmount = Math.min(discountAmount, subtotal);

  const afterDiscount = subtotal - discountAmount;

  // Shipping Fee Logic
  const shipping = useMemo(() => {
    // Safety fallback
    if (!shippingConfig || shippingConfig.length === 0) return 79;

    const thresholdConfig = shippingConfig.find(
      (c) => c.destination === "free_shipping_threshold",
    );
    const threshold =
      thresholdConfig?.is_active && thresholdConfig.fee > 0
        ? Number(thresholdConfig.fee)
        : 999;

    if (afterDiscount >= threshold) return 0;

    const isKerala =
      address.state?.toLowerCase() === "kerala" ||
      address.state?.toLowerCase() === "kl";

    let config = null;
    if (isKerala) {
      config = shippingConfig.find((c) => c.destination === "kerala");
    } else {
      config = shippingConfig.find((c) => c.destination === "rest_of_india");
    }

    return config?.is_active ? Number(config.fee) : 79;
  }, [shippingConfig, address.state, afterDiscount]);

  const total = Math.max(0, afterDiscount + shipping);

  const handleApplyCoupon = async () => {
    if (!couponInput) {
      setAppliedCoupon(null);
      setEligibleSubtotal(0);
      return;
    }

    setCouponError("");
    setCouponLoading(true);
    // Pass items instead of subtotal to determine eligible products
    const res = await validateCoupon(couponInput, items);

    if (res.error) {
      setCouponError(res.error);
      setAppliedCoupon(null);
      setEligibleSubtotal(0);
    } else {
      setAppliedCoupon(res.coupon);
      setEligibleSubtotal(res.eligibleSubtotal);
      setCouponInput("");
    }
    setCouponLoading(false);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay failed to load");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          items: items.map((i) => ({
            id: i.id,
            title: i.title,
            qty: i.quantity,
            price: i.price,
            product_id: i.id,
            quantity: i.quantity,
          })),
          subtotal: getSubtotal(),
          discount_amount: getSubtotal() - eligibleSubtotal,
          coupon_code: appliedCoupon ? appliedCoupon.code : null,
          total: total,
          shipping_fee: shipping,
          address: address,
        }),
      });
      const order = await res.json();

      if (order.error) {
        alert(order.error);
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Rangrez Henna",
        description: `Order of ${items.length} item(s)`,
        order_id: order.id,
        handler: async (response) => {
          // Keep loading true while verifying
          setLoading(true);
          // Verify payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items,
              total,
              shipping_fee: shipping,
              address,
            }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            setOrderComplete(result.order_id || true);
            clearCart();
          } else {
            alert(
              `Order creation delayed. Your payment (ID: ${response.razorpay_payment_id}) was successful, but there was an issue finalizing your order. Please screenshot this and contact support.`,
            );
            setLoading(false);
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: "#A44A3F" },
        modal: {
          ondismiss: function () {
            // User closed the popup, unlock the pay button
            setLoading(false);
            console.log("Checkout aborted by user");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        alert(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "var(--cl-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
            }}
          >
            <Check size={40} color="var(--cl-bg)" />
          </div>
        </motion.div>
        <h1
          style={{
            fontSize: "3rem",
            fontFamily: "var(--font-heading)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Order Confirmed!
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            opacity: 0.7,
            maxWidth: "500px",
            marginBottom: "2rem",
          }}
        >
          Thank you for your order. You will receive a confirmation email
          shortly.
        </p>
        <Link href="/shop" className="brutalist-button brutalist-button--sm">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h2 className="title-section" style={{ marginBottom: "1rem" }}>
          Your cart is empty
        </h2>
        <Link href="/shop" className="brutalist-button brutalist-button--sm">
          <ArrowLeft size={18} /> Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        className="border-b"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        <h1 className="title-large">Checkout</h1>
      </div>

      {/* Stepper */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "2rem",
          gap: "0",
        }}
      >
        {["Shipping", "Payment"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  step > i
                    ? "var(--cl-success)"
                    : step === i + 1
                      ? "var(--cl-primary)"
                      : "var(--cl-muted)",
                color: "var(--cl-bg)",
                fontWeight: 700,
                fontSize: "0.85rem",
                transition: "var(--transition-snap)",
              }}
            >
              {step > i + 1 ? <Check size={16} /> : i + 1}
            </div>
            <span
              style={{
                marginLeft: "0.5rem",
                fontWeight: step === i + 1 ? 700 : 400,
                fontSize: "0.9rem",
                textTransform: "uppercase",
              }}
            >
              {s}
            </span>
            {i === 0 && (
              <div
                style={{
                  width: "60px",
                  height: "2px",
                  background:
                    step > 1 ? "var(--cl-success)" : "var(--cl-muted)",
                  margin: "0 1rem",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 2rem 4rem",
        }}
      >
        {/* Form / Payment */}
        <div style={{ flex: "1 1 500px", paddingRight: "2rem" }}>
          {step === 1 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleAddressSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                Shipping Address
              </h2>
              {[
                {
                  id: "name",
                  label: "Full Name",
                  type: "text",
                  placeholder: "Your name",
                },
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "rangrezstencils@gmail.com",
                },
                {
                  id: "phone",
                  label: "Phone",
                  type: "tel",
                  placeholder: "+91 XXXXX XXXXX",
                },
                {
                  id: "line1",
                  label: "Address",
                  type: "text",
                  placeholder: "House no, street, area",
                },
                {
                  id: "city",
                  label: "City",
                  type: "text",
                  placeholder: "City",
                },
                {
                  id: "state",
                  label: "State",
                  type: "text",
                  placeholder: "State",
                },
                {
                  id: "pincode",
                  label: "Pin Code",
                  type: "text",
                  placeholder: "6-digit pincode",
                },
              ].map((f) => (
                <div key={f.id}>
                  <label className="input-label" htmlFor={f.id}>
                    {f.label}
                  </label>
                  {f.id === "state" ? (
                    <select
                      id={f.id}
                      required
                      className="input-field"
                      value={address[f.id]}
                      onChange={(e) =>
                        setAddress({ ...address, [f.id]: e.target.value })
                      }
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                        backgroundColor: "var(--bg)",
                        backgroundImage:
                          "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1em",
                        cursor: "pointer",
                        color: "black",
                      }}
                    >
                      <option value="" disabled style={{ color: "black" }}>
                        Select State (Shipping within India only)
                      </option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                      <option value="" style={{color: "black"}}></option>
                    </select>
                  ) : (
                    <input
                      id={f.id}
                      type={f.type}
                      required
                      placeholder={f.placeholder}
                      className="input-field"
                      value={address[f.id]}
                      onChange={(e) =>
                        setAddress({ ...address, [f.id]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="brutalist-button brutalist-button--sm brutalist-button--full"
                style={{ marginTop: "1rem", padding: "1rem" }}
              >
                Continue to Payment
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.5rem" }}>Payment</h2>
              <div
                style={{
                  padding: "1.5rem",
                  border: "var(--border-thick)",
                  background: "var(--cl-surface)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Shield size={20} color="var(--cl-success)" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Secure payment via Razorpay
                  </span>
                </div>
                <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                  Your payment information is encrypted and processed securely.
                  We never store your card details.
                </p>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => setStep(1)}
                  className="brutalist-button brutalist-button--outline"
                  style={{ flex: 1, padding: "1rem" }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="brutalist-button brutalist-button--sm"
                  style={{
                    flex: 2,
                    padding: "1rem",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <CreditCard size={18} />{" "}
                  {loading ? "Processing..." : `Pay ₹${total}`}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ flex: "0 0 340px", minWidth: "280px" }}>
          <div
            style={{
              border: "var(--border-thick)",
              padding: "1.5rem",
              position: "sticky",
              top: "100px",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              Order Summary
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.9rem",
                  }}
                >
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon UI */}
            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "var(--border-thin)",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Tag size={18} /> Apply Discount
              </h3>

              {appliedCoupon ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "var(--border-thin)",
                    background: "var(--cl-success)",
                    color: "var(--cl-bg)",
                    padding: "0.75rem 1rem",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Check size={16} /> {appliedCoupon.code} APPLIED
                  </span>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setEligibleSubtotal(0);
                    }}
                    style={{
                      textDecoration: "underline",
                      fontWeight: 800,
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      color: "inherit",
                      padding: 0,
                    }}
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="DISCOUNT CODE"
                        className="input-field"
                        style={{
                          padding: "0.75rem 1rem",
                          textTransform: "uppercase",
                          flex: 1,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="brutalist-button brutalist-button--sm"
                        style={{
                          padding: "0.75rem 1.5rem",
                          minWidth: "100px",
                          background: "var(--cl-text)",
                          color: "var(--cl-bg)",
                          border: "var(--border-thin)",
                        }}
                      >
                        {couponLoading ? "..." : "APPLY"}
                      </button>
                    </div>
                  </div>
                  {couponError && (
                    <div
                      style={{
                        color: "var(--cl-danger)",
                        fontSize: "0.85rem",
                        border: "2px solid var(--cl-danger)",
                        padding: "0.5rem",
                        marginTop: "0.75rem",
                        fontWeight: 700,
                        background: "rgba(255, 68, 68, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>⚠</span> {couponError}
                    </div>
                  )}
                </>
              )}
            </div>

            <div
              style={{
                borderTop: "var(--border-thin)",
                paddingTop: "1rem",
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                }}
              >
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.9rem",
                    color: "var(--cl-success)",
                    fontWeight: 600,
                  }}
                >
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                }}
              >
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  borderTop: "var(--border-thick)",
                  paddingTop: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
