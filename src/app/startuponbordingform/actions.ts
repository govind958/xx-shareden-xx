'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function insertForm(formData: FormData) {
  console.log("📩 insertForm called with formData:", Object.fromEntries(formData.entries()))

  const supabase = await createClient()
  console.log("✅ Supabase client created")

  // 1️⃣ Get currently logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.error("❌ Error fetching user:", userError.message)
    throw new Error("Error fetching user: " + userError.message)
  }
  if (!user) {
    console.warn("⚠️ No user found (not logged in)")
    throw new Error("Not logged in")
  }
  console.log("👤 Logged-in user:", user.id, user.email)

  // 2️⃣ Extract form values
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  // const imageUrl = formData.get("image_url") as string // ❌ Commented out
  const label = formData.get("label") as string
  console.log("📝 Extracted values:", { title, description, label })

  // 3️⃣ Insert into Supabase `forms` table
  const { error } = await supabase.from("forms").insert([
    {
      user_id: user.id,   // ✅ linked to profile
      title,
      description,
      // image_url: imageUrl, // ❌ Commented out
      label,
    }
  ])

  if (error) {
    console.error("❌ Error inserting form:", error.message)
    throw new Error(error.message)
  }

  console.log("✅ Form successfully inserted into DB")

  // 4️⃣ Revalidate & redirect (optional)
  await revalidatePath('/private')
  console.log("🔄 Revalidated /private")
}
