export interface SubStack {
  id: string
  stack_id: string
  name: string
  price: number
  is_free: boolean
  created_at: string
}

export interface Stack {
  id: string
  name: string
  description?: string
  type?: string
  base_price: number
  active: boolean
  created_at: string
  sub_stacks?: SubStack[]     // <--- include sub_stacks here
}
