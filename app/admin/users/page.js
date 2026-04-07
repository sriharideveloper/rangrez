import { createClient } from "../../../lib/supabase/server";
import AdminUsersClient from "./AdminUsersClient";
import { getUser } from "../../actions/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Users & Roles | RANGREZ",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const currentUser = await getUser();

  if (!currentUser || currentUser.profile?.role !== "admin") {
    // Optional: check if there are 0 admins total for bootstrap UI
    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin");
    if (admins && admins.length === 0) {
      // Fallthrough to allow bootstrap view
    } else {
      // Normal block
      redirect("/");
    }
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", opacity: 0.5 }}>
        Error fetching users: {error.message}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <AdminUsersClient initialUsers={users} currentUser={currentUser} />
    </div>
  );
}

