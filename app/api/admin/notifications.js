import { getAdminNotifications } from "../../../lib/supabase/admin_notifications";

export default async function handler(req, res) {
  const { notifications } = await getAdminNotifications();
  return Response.json({ notifications });
}
