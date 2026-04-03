"use server"


import { createClient } from "@/utils/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { TicketStatus } from "@/src/types/support-admin"


// Uses service role to access auth.users
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}


export async function getTickets() {
  const supabase = await createClient()
  const adminSupabase = getAdminClient()
 
  // 1. Fetch all tickets
  const { data: tickets, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false })
 
  if (error) throw new Error(error.message)
  if (!tickets || tickets.length === 0) return []
 
  // 2. Get unique user_ids
  const userIds = [...new Set(tickets.map((t) => t.user_id))]
 
  // 3. Fetch emails from auth.users via admin client
  const { } = await adminSupabase
    .from("auth.users")  // won't work directly — use listUsers workaround below
    .select("id, email")
    .in("id", userIds)
 
  // NOTE: Supabase doesn't allow direct auth.users queries even with service role
  // via the .from() builder. Use the Admin Auth API instead:
  const emailMap: Record<string, string> = {}
 
  await Promise.all(
    userIds.map(async (uid) => {
      const { data } = await adminSupabase.auth.admin.getUserById(uid)
      if (data?.user?.email) {
        emailMap[uid] = data.user.email
      }
    })
  )
 
  // 4. Merge email as clientName
  return tickets.map((ticket) => ({
    ...ticket,
    clientName: emailMap[ticket.user_id] ?? ticket.user_id,
  }))
}
 
export async function updateTicketStatus(
  ticketId: number,
  newStatus: TicketStatus
) {
  const supabase = await createClient()
 
  const { error } = await supabase
    .from("support_tickets")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId)
 
  if (error) throw new Error(error.message)
  return { success: true }
}
 
export async function deleteTicket(ticketId: number) {
  const supabase = await createClient()
 
  const { error } = await supabase
    .from("support_tickets")
    .delete()
    .eq("id", ticketId)
 
  if (error) throw new Error(error.message)
  return { success: true }
}
 