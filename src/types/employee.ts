export interface Assignment {
    id: string
    employee_id: string
    order_item_id: string
    assigned_at: string
    status: string
    notes: string | null
    order_items: {
      id: string
      order_id: string
      user_id: string
      stack_id: number
      status: string
      progress_percent: number
      step: number
      stacks: {
        id: number
        name: string
        type: string
      } | null
      profiles: {
        user_id: string
        name: string | null
        email: string | null
      } | null
    }
  }