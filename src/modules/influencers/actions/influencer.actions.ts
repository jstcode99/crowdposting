"use server"

import { revalidateTag } from "next/cache"
import { supabase } from "@/lib/supabase/client"
import { influencerSchema } from "@modules/influencers/schemas/influencer.schema"

export async function createInfluencerAction(formData: FormData) {
  // Convert FormData to object
  const rawData = Object.fromEntries(formData)

  // Parse followers and engagement_rate as numbers
  const dataWithNumbers = {
    ...rawData,
    followers: Number(rawData.followers) || 0,
    engagement_rate: Number(rawData.engagement_rate) || 0,
  }

  // Validate with Zod schema
  const validated = influencerSchema.parse(dataWithNumbers)

  // Check if email already exists
  const { data: existingEmail } = await supabase
    .from("influencers")
    .select("email")
    .eq("email", validated.email)
    .single()

  if (existingEmail) {
    throw new Error("El email ya está registrado")
  }

  // Insert into database
  const { data, error } = await supabase
    .from("influencers")
    .insert({
      name: validated.name,
      phone: validated.phone,
      email: validated.email,
      instagram_url: validated.instagram_url,
      followers: validated.followers,
      engagement_rate: validated.engagement_rate,
      category: validated.category,
      country: validated.country,
      city: validated.city,
      status: validated.status,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Revalidate (in Next.js this would revalidate cache)
  revalidateTag("influencers")

  return data
}
