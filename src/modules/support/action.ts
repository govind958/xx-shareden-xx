'use server';

import { createClient } from '@/utils/supabase/server';


export async function createSupportTicket(formData: FormData) {
  const supabase = await createClient();

  const attachmentUrl = formData.get('attachment_url');
  const { data: supportTicket, error: supportTicketError } = await supabase
    .from('support_tickets')
    .insert({
      user_id: formData.get('user_id'),
      subject: formData.get('subject'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      description: formData.get('description'),
      attachment_url: attachmentUrl && String(attachmentUrl).trim() ? String(attachmentUrl) : null,
    })
    .select()
    .single();

  if (supportTicketError) {
    console.error('Error creating support ticket:', supportTicketError.message);
    return { success: false, error: supportTicketError.message };
  }

  return { success: true, data: supportTicket };
}

export async function getSupportTicketCounts(userId: string) {
  const supabase = await createClient();

  const [openResult, closedResult] = await Promise.all([
    supabase.from('support_tickets')
    .select('id', { count: 'exact' , head: true})
    .eq('user_id', userId)
    .in('status',['open', 'in_progress']),
    supabase
    .from('support_tickets')
    .select('id', { count: 'exact' , head: true})
    .eq('user_id', userId)
    .in('status',['resolved', 'closed']),
  ]);

  return {
    open: openResult.count || 0,
    closed: closedResult.count || 0,
  };
}

export async function getSupportTickets(userId: string) {
  const { tickets } = await getSupportTicketsWithCounts(userId);
  return tickets;
}

/**
 * Fetch all support tickets and derive open/closed counts in a single DB call.
 * Replaces the old pattern of calling getSupportTicketCounts + getSupportTickets separately.
 */
export async function getSupportTicketsWithCounts(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('support_tickets')
    .select('id, subject, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching support tickets:", error.message);
    return { tickets: [], open: 0, closed: 0 };
  }

  const rows = data ?? [];
  let open = 0;
  let closed = 0;

  const tickets = rows.map((row) => {
    if (row.status === 'open' || row.status === 'in_progress') {
      open++;
    } else {
      closed++;
    }
    return {
      id: row.id,
      title: row.subject,
      status: row.status,
      date: formatTicketDate(row.created_at),
    };
  });

  return { tickets, open, closed };
}


function formatTicketDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === d.toDateString();
  if (isToday) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (isYesterday) return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}