import { createClient } from "../../lib/supabase/server";
import { DollarSign, Package, Users, ShoppingBag } from "lucide-react";
import StatCard from "../../components/bits/StatCard";
import AdminManagementClient from "./AdminManagementClient";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch recent orders securely
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      `id, total_amount, order_status, created_at, customer_email, shipping_address`,
    )
    .order("created_at", { ascending: false })
    .limit(5);
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // Fetch total orders
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Compute total revenue cleanly
  const { data: allOrders } = await supabase
    .from("orders")
    .select("total_amount");
  const revenue =
    allOrders?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

  // Render Stats
  const stats = [
    {
      label: "Total Revenue",
      value: revenue,
      prefix: "₹",
      icon: <DollarSign size={24} />,
    },
    {
      label: "Orders",
      value: orderCount || 0,
      prefix: "",
      icon: <Package size={24} />,
    },
    {
      label: "Products",
      value: productCount || 0,
      prefix: "",
      icon: <ShoppingBag size={24} />,
    },
  ];

  return (
    <div>
      <h1
        style={{
          fontSize: "2rem",
          fontFamily: "var(--font-heading)",
          textTransform: "uppercase",
          marginBottom: "2rem",
        }}
      >
        Dashboard
      </h1>

      {/* Stats Grid powered by AnimatedCounter */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            prefix={stat.prefix}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Admin Email Configuration Tool */}
      <AdminManagementClient />

      {/* Recent Orders Display */}
      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: "1rem",
          marginTop: "3rem",
        }}
      >
        Recent Orders
      </h2>
      <div style={{ border: "var(--border-thick)", overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
            padding: "0.75rem 1.5rem",
            background: "var(--cl-text)",
            color: "var(--cl-bg)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span>Order Date</span>
          <span>Customer</span>
          <span>Total</span>
          <span>Status</span>
          <span>ID</span>
        </div>
        {recentOrders?.map((order, i) => (
          <div
            key={order.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
              padding: "1rem 1.5rem",
              alignItems: "center",
              borderTop: i > 0 ? "1px solid var(--cl-muted)" : "none",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>
              {new Date(order.created_at).toLocaleDateString()}
            </span>
            <span
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                paddingRight: "1rem",
              }}
            >
              {order.customer_email ||
                order.users?.email ||
                order.shipping_address?.email ||
                "N/A"}
            </span>
            <span style={{ fontWeight: 600 }}>₹{order.total_amount}</span>
            <span>
              <span
                style={{
                  padding: "0.2rem 0.5rem",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  background:
                    order.order_status === "delivered"
                      ? "var(--cl-success)"
                      : order.order_status === "shipped" ||
                          order.order_status === "out_for_delivery"
                        ? "var(--cl-accent)"
                        : "var(--cl-primary)",
                  color: "var(--cl-bg)",
                }}
              >
                {order.order_status || "processing"}
              </span>
            </span>
            <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>
              ){order.id.slice(-6)}
            </span>
          </div>
        ))}
        {(!recentOrders || recentOrders.length === 0) && (
          <div style={{ padding: "2rem", textAlign: "center", opacity: 0.5 }}>
            No recent orders.
          </div>
        )}
      </div>
    </div>
  );
}
