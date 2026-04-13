/**
 * Influencer entity types
 * Generated from Supabase schema for KRO-267
 */

// Enum types (matching PostgreSQL enums)
export type InfluencerCategory =
  | 'Diseño Gráfico & Religión'
  | 'Fitness Coaching & Fisicoculturismo'
  | 'Motociclismo & Aventuras'
  | 'Gastronomía & Parrilla'
  | 'Sin categoría'
  | 'Bienestar & Running'
  | 'Lifestyle & Opinión'
  | 'Cine & Creación de Contenido'
  | 'Viajes & Narrativa Histórica'
  | 'Moda Masculina & Estilo de Vida'
  | 'Motivación Personal'
  | 'Perfil Personal / Profesional'
  | 'Periodismo & Noticias'
  | 'Música & Producción Musical'
  | 'Arte, Fotografía & Moda'
  | 'Tecnología & Emprendimiento'
  | 'Tecnología & Educación'
  | 'Perfil Personal / Idiomas'
  | 'Fitness & Nutrición'
  | 'Entretenimiento & Lifestyle'
  | 'Perfil Personal / Juvenil'
  | 'Trabajo Social & Fitness'
  | 'Deporte & Gastronomía'
  | 'Música (Cantautor)';

export type InfluencerStatus = 'Prospecto' | 'Contactado' | 'Confirmado' | 'Publicado';

// Database row type
export interface Influencer {
  id: string;
  name: string | null;
  phone: string | null;
  email: string;
  instagram_url: string | null;
  followers: number;
  engagement_rate: number;
  category: InfluencerCategory;
  country: string | null;
  city: string | null;
  status: InfluencerStatus;
  created_at: string;
  updated_at: string;
}

// Input type for creating new influencer
export type InfluencerCreateInput = Pick<
  Influencer,
  | 'name'
  | 'phone'
  | 'email'
  | 'instagram_url'
  | 'followers'
  | 'engagement_rate'
  | 'category'
  | 'country'
  | 'city'
  | 'status'
>;

// Input type for updating influencer
export type InfluencerUpdateInput = Partial<InfluencerCreateInput>;

// Filter types for queries
export interface InfluencerFilters {
  category?: InfluencerCategory;
  status?: InfluencerStatus;
  country?: string;
  city?: string;
  minFollowers?: number;
  maxFollowers?: number;
}

// Category display labels
export const INFLUENCER_CATEGORIES: { value: InfluencerCategory; label: string }[] = [
  { value: 'Diseño Gráfico & Religión', label: 'Diseño Gráfico & Religión' },
  { value: 'Fitness Coaching & Fisicoculturismo', label: 'Fitness Coaching & Fisicoculturismo' },
  { value: 'Motociclismo & Aventuras', label: 'Motociclismo & Aventuras' },
  { value: 'Gastronomía & Parrilla', label: 'Gastronomía & Parrilla' },
  { value: 'Sin categoría', label: 'Sin categoría' },
  { value: 'Bienestar & Running', label: 'Bienestar & Running' },
  { value: 'Lifestyle & Opinión', label: 'Lifestyle & Opinión' },
  { value: 'Cine & Creación de Contenido', label: 'Cine & Creación de Contenido' },
  { value: 'Viajes & Narrativa Histórica', label: 'Viajes & Narrativa Histórica' },
  { value: 'Moda Masculina & Estilo de Vida', label: 'Moda Masculina & Estilo de Vida' },
  { value: 'Motivación Personal', label: 'Motivación Personal' },
  { value: 'Perfil Personal / Profesional', label: 'Perfil Personal / Profesional' },
  { value: 'Periodismo & Noticias', label: 'Periodismo & Noticias' },
  { value: 'Música & Producción Musical', label: 'Música & Producción Musical' },
  { value: 'Arte, Fotografía & Moda', label: 'Arte, Fotografía & Moda' },
  { value: 'Tecnología & Emprendimiento', label: 'Tecnología & Emprendimiento' },
  { value: 'Tecnología & Educación', label: 'Tecnología & Educación' },
  { value: 'Perfil Personal / Idiomas', label: 'Perfil Personal / Idiomas' },
  { value: 'Fitness & Nutrición', label: 'Fitness & Nutrición' },
  { value: 'Entretenimiento & Lifestyle', label: 'Entretenimiento & Lifestyle' },
  { value: 'Perfil Personal / Juvenil', label: 'Perfil Personal / Juvenil' },
  { value: 'Trabajo Social & Fitness', label: 'Trabajo Social & Fitness' },
  { value: 'Deporte & Gastronomía', label: 'Deporte & Gastronomía' },
  { value: 'Música (Cantautor)', label: 'Música (Cantautor)' },
];

// Status display labels
export const INFLUENCER_STATUSES: { value: InfluencerStatus; label: string }[] = [
  { value: 'Prospecto', label: 'Prospecto' },
  { value: 'Contactado', label: 'Contactado' },
  { value: 'Confirmado', label: 'Confirmado' },
  { value: 'Publicado', label: 'Publicado' },
];