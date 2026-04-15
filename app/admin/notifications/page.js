import AdminNotificationsClient from "./AdminNotificationsClient";
import { getAdminNotifications } from "../../../lib/supabase/admin_notifications";

export default async function AdminNotificationsPage() {
  const { notifications } = await getAdminNotifications();
  return (
    <AdminNotificationsClient initialNotifications={notifications || []} />
  );
}
