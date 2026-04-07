import AdminMessagesClient from "./AdminMessagesClient";
import { getAdminMessages } from "../../../lib/supabase/engagement";

export default async function AdminMessagesPage() {
  const { messages } = await getAdminMessages();

  return <AdminMessagesClient initialMessages={messages || []} />;
}

