import { useState } from "react"

type PendingEmployee = {
    id: string
    name: string
    email: string
    role: string
    specialization?: string | null
    approval_status: string
    phone?: string | null
    created_at: string
  }
  
  type PendingInvitation = {
    id: string
    email: string
    status: string
    invited_by: string
    created_at: string
    expires_at: string
  }
  
  export type { PendingEmployee, PendingInvitation }