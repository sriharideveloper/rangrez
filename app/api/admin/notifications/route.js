import { getAdminNotifications } from "../../../../lib/supabase/admin_notifications";

export async function GET() {
  const { notifications } = await getAdminNotifications();
  return Response.json({ notifications });
}
