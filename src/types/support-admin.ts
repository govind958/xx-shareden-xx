export interface Ticket {
    id: string | number
    user_id: number
    clientName: string // UI Display purpose (typically joined from Users table)
    subject: string
    category: TicketCategory
    priority: TicketPriority
    description: string
    attachment_url?: string | null
    status: TicketStatus
    created_at: string
    updated_at: string
  }
  export type TicketCategory = "technical" | "billing" | "feature" | "account" | "other"

  export type TicketPriority = "low" | "medium" | "high" | "urgent"
  
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
