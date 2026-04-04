import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Ticket, Inbox, Star, FileText } from "lucide-react";
import { getUser } from "../actions/auth";

export default async function AdminLayout({ children }) {
  const user = await getUser();
  
  if (!user || user.profile?.role !== "admin") {
    redirect("/");
  }
  const links = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/orders", label: "Orders", icon: <Package size={18} /> },
    { href: "/admin/products", label: "Products", icon: <ShoppingBag size={18} /> },
    { href: "/admin/blogs", label: "Blogs", icon: <FileText size={18} /> },
    { href: "/admin/coupons", label: "Coupons", icon: <Ticket size={18} /> },
    { href: "/admin/messages", label: "Inbox", icon: <Inbox size={18} /> },
    { href: "/admin/reviews", label: "Testimonials", icon: <Star size={18} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: "0 2rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "var(--cl-bg)" }}>RANGREZ</h2>
          <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginTop: "0.25rem" }}>Admin Panel</p>
        </div>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="admin-sidebar__link" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {l.icon} {l.label}
          </Link>
        ))}
        <div style={{ marginTop: "auto", padding: "1rem 2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Link href="/" style={{ fontSize: "0.85rem", opacity: 0.5 }}>← Back to Shop</Link>
        </div>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
