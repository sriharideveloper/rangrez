"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { loadRazorpay } from "../utils/razorpay";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem } = useCartStore();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0,
  );

  const handleCheckout = async () => {
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const data = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotal }),
      }).then((t) => t.json());

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key123",
        amount: data.amount,
        currency: data.currency,
        name: "Rangrez Henna",
        description: "Payment for Henna Stencils",
        order_id: data.id,
        handler: function (response) {
          alert(`Payment Successful! Id: ${response.razorpay_payment_id}`);
          closeCart();
        },
        prefill: {
          name: "Jane Doe",
          email: "jane.doe@example.com",
          contact: "9999999999",
        },
        theme: { color: "#943126" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Error initiating checkout. Try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "var(--cl-text)",
              zIndex: 90,
              cursor: "pointer",
            }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "circOut" }}
            className="border-l"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "450px",
              backgroundColor: "var(--cl-bg)",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              className="border-b"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "2rem" }}>Your Cart</h2>
              <button
                onClick={closeCart}
                style={{
                  padding: "0.25rem",
                  borderRadius: "50%",
                  border: "2px solid var(--cl-text)",
                  display: "flex",
                }}
              >
                <X size={20} color="var(--cl-text)" />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto" }}>
              {items.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    opacity: 0.6,
                    marginTop: "2rem",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.5rem",
                  }}
                >
                  Your cart is empty.
                </div>
              ) : (
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  {items.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          height: "100px",
                          backgroundColor: "var(--cl-secondary)",
                          border: "var(--border-thick)",
                        }}
                      >
                        {/* Placeholder for thumbnail */}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span style={{ fontWeight: "600" }}>
                            {item.title}
                          </span>
                          <span style={{ fontWeight: "600" }}>
                            ₹{item.price}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            opacity: 0.7,
                            marginBottom: "0.75rem",
                          }}
                        >
                          Size: {item.size || "Standard"}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "2px solid var(--cl-text)",
                              borderRadius: "4px",
                            }}
                          >
                            <button style={{ padding: "0.25rem 0.5rem" }}>
                              <Minus size={14} />
                            </button>
                            <span
                              style={{
                                padding: "0 0.5rem",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                              }}
                            >
                              {item.quantity || 1}
                            </span>
                            <button style={{ padding: "0.25rem 0.5rem" }}>
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            style={{
                              fontSize: "0.8rem",
                              textDecoration: "underline",
                              textUnderlineOffset: "4px",
                              textTransform: "uppercase",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div
              className="border-t"
              style={{
                padding: "2rem 1.5rem",
                backgroundColor: "var(--cl-bg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                }}
              >
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  textAlign: "center",
                  opacity: 0.7,
                  marginBottom: "1rem",
                }}
              >
                Shipping & taxes calculated at checkout.
              </p>
              <button
                onClick={handleCheckout}
                className="btn-primary"
                style={{ width: "100%" }}
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
