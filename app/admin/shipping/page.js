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
    <div className="admin-body">
      <div
        className="admin-header brut-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1>Global Shipping Configurations</h1>
        <button
          onClick={handleSave}
          className="brutalist-button brutalist-button--sm"
          disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Save size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {message && (
        <div
          style={{ marginBottom: "1rem", color: "var(--brutalist-primary)" }}
        >
          <b>{message}</b>
        </div>
      )}

      <form
        className="brut-card"
        onSubmit={handleSave}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label
            className="brutalist-label"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            Kerala Base Fee (₹)
          </label>
          <input
            type="number"
            className="brutalist-input"
            value={config.kerala}
            onChange={(e) =>
              setConfig({ ...config, kerala: parseInt(e.target.value) || 0 })
            }
            required
            min="0"
          />
          <small style={{ color: "#666" }}>
            Default lowest tier shipping rate within Kerala outline
            jurisdiction.
          </small>
        </div>

        <div>
          <label
            className="brutalist-label"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            Rest of India Base Fee (₹)
          </label>
          <input
            type="number"
            className="brutalist-input"
            value={config.rest_of_india}
            onChange={(e) =>
              setConfig({
                ...config,
                rest_of_india: parseInt(e.target.value) || 0,
              })
            }
            required
            min="0"
          />
          <small style={{ color: "#666" }}>
            All generic non-KL domestic addresses.
          </small>
        </div>

        <div>
          <label
            className="brutalist-label"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            Free Shipping Offer Threshold (₹)
          </label>
          <input
            type="number"
            className="brutalist-input"
            value={config.free_shipping_threshold}
            onChange={(e) =>
              setConfig({
                ...config,
                free_shipping_threshold: parseInt(e.target.value) || 0,
              })
            }
            required
            min="0"
          />
          <small style={{ color: "#666" }}>
            Currently free shipping forces overrides when final cart passes this
            mark.
          </small>
        </div>

        <div>
          <label
            className="brutalist-label"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            International Fee (₹)
          </label>
          <input
            type="number"
            className="brutalist-input"
            value={config.international}
            onChange={(e) =>
              setConfig({
                ...config,
                international: parseInt(e.target.value) || 0,
              })
            }
            required
            min="0"
          />
          <small style={{ color: "#666", display: "block" }}>
            Base rate if International shipping enabled. Checkout currently{" "}
            <b>disabled</b> for out of India IPs regardless of setting.
          </small>
        </div>
      </form>
    </div>
  );
}
