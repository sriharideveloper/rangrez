"use client";

import { useEffect, useState } from "react";
import {
  getShippingConfig,
  updateShippingConfig,
} from "../../../lib/supabase/shipping";
import { Save } from "lucide-react";

export default function ShippingAdmin() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getShippingConfig();
      // Default fallback structure
      const grouped = {
        kerala: data?.find((c) => c.destination === "kerala")?.fee || 50,
        rest_of_india:
          data?.find((c) => c.destination === "rest_of_india")?.fee || 80,
        international:
          data?.find((c) => c.destination === "international")?.fee || 2500,
        free_shipping_threshold:
          data?.find((c) => c.destination === "free_shipping_threshold")?.fee ||
          1000,
      };

      setConfig(grouped);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = [
        {
          destination: "kerala",

          fee: config.kerala,
          is_active: true,
        },
        {
          destination: "rest_of_india",

          fee: config.rest_of_india,
          is_active: true,
        },
        {
          destination: "international",

          fee: config.international,
          is_active: true,
        },
        {
          destination: "free_shipping_threshold",

          fee: config.free_shipping_threshold,
          is_active: true,
        },
      ];
      const res = await updateShippingConfig(payload);
      if (!res.success) throw new Error(res.error);
      setMessage("Configuration saved successfully.");
    } catch (err) {
      setMessage("Error saving: " + err.message);
    }

    setSaving(false);
  };

  if (loading) return <div className="admin-body">Loading...</div>;

  return (
    <div
      className="admin-body"
      style={{ maxWidth: 540, margin: "0 auto", padding: "1rem" }}
    >
      <form
        onSubmit={handleSave}
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 16px #0001",
          padding: "1.5rem 1.2rem 1.2rem 1.2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            marginBottom: 0,
          }}
        >
          Global Shipping Configurations
        </h1>

        {/* Sticky Save button for mobile */}
        <button
          type="submit"
          disabled={saving}
          style={{
            position: "sticky",
            top: 0,
            alignSelf: "flex-end",
            zIndex: 2,
            background: "var(--cl-text)",
            color: "var(--cl-bg)",
            border: "none",
            borderRadius: 18,
            fontWeight: 700,
            fontSize: "1.1rem",
            padding: "0.7rem 2.2rem 0.7rem 2.2rem",
            marginBottom: "1.2rem",
            boxShadow: "0 2px 8px #0002",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          <Save size={18} style={{ marginRight: 8 }} />{" "}
          {saving ? "Saving..." : "Save"}
        </button>

        {message && (
          <div
            style={{
              marginBottom: "0.5rem",
              color: "var(--cl-success)",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {/* Kerala Fee */}
        <div
          style={{
            background: "#f8f7f4",
            borderRadius: 12,
            padding: "1.1rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label
            style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 2 }}
          >
            Kerala Base Fee (₹)
          </label>
          <input
            type="number"
            value={config.kerala}
            onChange={(e) =>
              setConfig({ ...config, kerala: parseInt(e.target.value) || 0 })
            }
            required
            min="0"
            style={{
              fontSize: "1.1rem",
              padding: "0.7rem 1rem",
              borderRadius: 8,
              border: "1.5px solid #e0e0e0",
              outline: "none",
              marginBottom: 2,
              background: "#fff",
            }}
          />
          <div style={{ color: "#7a6f5c", fontSize: 13, marginTop: 2 }}>
            Default lowest tier shipping rate within Kerala outline
            jurisdiction.
          </div>
        </div>

        {/* Rest of India Fee */}
        <div
          style={{
            background: "#f8f7f4",
            borderRadius: 12,
            padding: "1.1rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label
            style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 2 }}
          >
            Rest of India Base Fee (₹)
          </label>
          <input
            type="number"
            value={config.rest_of_india}
            onChange={(e) =>
              setConfig({
                ...config,
                rest_of_india: parseInt(e.target.value) || 0,
              })
            }
            required
            min="0"
            style={{
              fontSize: "1.1rem",
              padding: "0.7rem 1rem",
              borderRadius: 8,
              border: "1.5px solid #e0e0e0",
              outline: "none",
              marginBottom: 2,
              background: "#fff",
            }}
          />
          <div style={{ color: "#7a6f5c", fontSize: 13, marginTop: 2 }}>
            All generic non-KL domestic addresses.
          </div>
        </div>

        {/* Free Shipping Threshold */}
        <div
          style={{
            background: "#f8f7f4",
            borderRadius: 12,
            padding: "1.1rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label
            style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 2 }}
          >
            Free Shipping Offer Threshold (₹)
          </label>
          <input
            type="number"
            value={config.free_shipping_threshold}
            onChange={(e) =>
              setConfig({
                ...config,
                free_shipping_threshold: parseInt(e.target.value) || 0,
              })
            }
            required
            min="0"
            style={{
              fontSize: "1.1rem",
              padding: "0.7rem 1rem",
              borderRadius: 8,
              border: "1.5px solid #e0e0e0",
              outline: "none",
              marginBottom: 2,
              background: "#fff",
            }}
          />
          <div style={{ color: "#7a6f5c", fontSize: 13, marginTop: 2 }}>
            Currently free shipping forces overrides when final cart passes this
            mark.
          </div>
        </div>

        {/* International Fee */}
        <div
          style={{
            background: "#f8f7f4",
            borderRadius: 12,
            padding: "1.1rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label
            style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 2 }}
          >
            International Fee (₹)
          </label>
          <input
            type="number"
            value={config.international}
            onChange={(e) =>
              setConfig({
                ...config,
                international: parseInt(e.target.value) || 0,
              })
            }
            required
            min="0"
            style={{
              fontSize: "1.1rem",
              padding: "0.7rem 1rem",
              borderRadius: 8,
              border: "1.5px solid #e0e0e0",
              outline: "none",
              marginBottom: 2,
              background: "#fff",
            }}
          />
          <div style={{ color: "#7a6f5c", fontSize: 13, marginTop: 2 }}>
            Base rate if International shipping enabled. Checkout currently{" "}
            <b>disabled</b> for out of India IPs regardless of setting.
          </div>
        </div>
      </form>
    </div>
  );
}
