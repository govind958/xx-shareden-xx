'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Organization {
  id: string
  user_id: string
  org_name: string
  org_slug: string
  company_logo: string | null
  industry_type: string
  created_at: string
  updated_at: string
}

/**
 * Get the current user's organization
 */
export async function getUserOrganization(): Promise<Organization | null> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }
  
  // Get user's organization
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  
  if (error) {
    throw new Error(`Failed to fetch organization: ${error.message}`)
  }
  
  return data
}

/**
 * Create a new organization for the current user
 */
export async function createOrganization(
  org_name: string,
  org_slug: string,
  company_logo: string | null,
  industry_type: string
): Promise<Organization> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }
  
  // Check if user already has an organization
  const existing = await getUserOrganization()
  if (existing) {
    throw new Error('User already has an organization')
  }
  
  // Create organization with user_id
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      user_id: user.id,
      org_name,
      org_slug,
      company_logo,
      industry_type,
    })
    .select('*')
    .single()
  
  if (error) {
    throw new Error(`Failed to create organization: ${error.message}`)
  }
  
  revalidatePath('/private')
  return data
}

/**
 * Update the current user's organization
 */
export async function updateOrganization(
  id: string,
  org_name: string,
  org_slug: string,
  company_logo: string | null,
  industry_type: string
): Promise<void> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }
  
  // Update organization (only if it belongs to the user)
  const { error } = await supabase
    .from('organizations')
    .update({
      org_name,
      org_slug,
      company_logo,
      industry_type,
    })
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) {
    throw new Error(`Failed to update organization: ${error.message}`)
  }
  
  revalidatePath('/private')
}

