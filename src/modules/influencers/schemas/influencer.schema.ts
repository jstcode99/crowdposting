/**
 * Influencer registration validation schema
 * Uses Zod for form validation
 */

import { z } from "zod"
import {
  INFLUENCER_CATEGORIES,
  INFLUENCER_STATUSES,
  type InfluencerCategory,
  type InfluencerStatus,
} from "@/types/influencer"

// Instagram URL regex pattern
const instagramUrlPattern =
  /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/

// Category enum values
const categoryValues = INFLUENCER_CATEGORIES.map((c) => c.value) as [
  InfluencerCategory,
  ...InfluencerCategory[],
]

// Status enum values
const statusValues = INFLUENCER_STATUSES.map((s) => s.value) as [
  InfluencerStatus,
  ...InfluencerStatus[],
]

export const influencerSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .max(20, "El teléfono no puede exceder 20 caracteres"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingresa un email válido"),
  instagram_url: z
    .string()
    .min(1, "La URL de Instagram es requerida")
    .regex(
      instagramUrlPattern,
      "Ingresa una URL de Instagram válida (ej: https://instagram.com/usuario)"
    ),
  followers: z
    .number({ message: "Los seguidores deben ser un número" })
    .int("Los seguidores deben ser un número entero")
    .min(0, "Los seguidores no pueden ser negativos"),
  engagement_rate: z
    .number({ message: "La tasa de engagement debe ser un número" })
    .min(0, "La tasa de engagement no puede ser negativa")
    .max(100, "La tasa de engagement no puede exceder 100%"),
  category: z.enum(categoryValues, {
    message: "Selecciona una categoría válida",
  }),
  country: z
    .string()
    .min(1, "El país es requerido")
    .max(100, "El país no puede exceder 100 caracteres"),
  city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(100, "La ciudad no puede exceder 100 caracteres"),
  status: z.enum(statusValues, {
    message: "Selecciona un estado válido",
  }),
})

export type InfluencerInput = z.infer<typeof influencerSchema>

export const defaultInfluencerValues: InfluencerInput = {
  name: "",
  phone: "",
  email: "",
  instagram_url: "",
  followers: 0,
  engagement_rate: 0,
  category: "Sin categoría",
  country: "",
  city: "",
  status: "Prospecto",
}
