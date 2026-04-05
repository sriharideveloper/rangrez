import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  Inbox,
  Star,
  FileText,
  Users,
} from "lucide-react";
import { getUser } from "../actions/auth";

import { createClient } from "../../lib/supabase/server";

export default async function AdminLayout({ children }) {
  const user = await getUser();

  if (!user || user.profile?.role !== "admin") {
    // If not admin, check if the system has exactly 0 admins.
    // If 0 admins exist, let the first person bootstrap the admin account.
    const supabase = await createClient();
    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .limit(1);
    if (!admins || admins.length > 0) {
      redirect("/");
    }
  }
  const links = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/orders", label: "Orders", icon: <Package size={18} /> },
    {
      href: "/admin/products",
      label: "Products",
      icon: <ShoppingBag size={18} />,
    },
    { href: "/admin/blogs", label: "Blogs", icon: <FileText size={18} /> },
    { href: "/admin/coupons", label: "Coupons", icon: <Ticket size={18} /> },
    { href: "/admin/messages", label: "Inbox", icon: <Inbox size={18} /> },
    { href: "/admin/reviews", label: "Testimonials", icon: <Star size={18} /> },
    { href: "/admin/users", label: "Users & Roles", icon: <Users size={18} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div
          style={{
            padding: "0 2rem 2rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.8rem",
              color: "var(--cl-bg)",
            }}
          >
            RANGREZ
          </h2>
          <p
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              opacity: 0.5,
              marginTop: "0.25rem",
            }}
          >
            Admin Panel
          </p>
        </div>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="admin-sidebar__link"
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {l.icon} {l.label}
          </Link>
        ))}
        <div
          style={{
            marginTop: "auto",
            padding: "1rem 2rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Link href="/" style={{ fontSize: "0.85rem", opacity: 0.5 }}>
            ← Back to Shop
          </Link>
        </div>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
