-- Migration: Create influencers table with all required fields
-- Task: KRO-267 - Complete table creation

-- 1. Create enum for category (23 categories)
DO $$ BEGIN
  CREATE TYPE influencer_category AS ENUM (
    'Diseño Gráfico & Religión',
    'Fitness Coaching & Fisicoculturismo',
    'Motociclismo & Aventuras',
    'Gastronomía & Parrilla',
    'Sin categoría',
    'Bienestar & Running',
    'Lifestyle & Opinión',
    'Cine & Creación de Contenido',
    'Viajes & Narrativa Histórica',
    'Moda Masculina & Estilo de Vida',
    'Motivación Personal',
    'Perfil Personal / Profesional',
    'Periodismo & Noticias',
    'Música & Producción Musical',
    'Arte, Fotografía & Moda',
    'Tecnología & Emprendimiento',
    'Tecnología & Educación',
    'Perfil Personal / Idiomas',
    'Fitness & Nutrición',
    'Entretenimiento & Lifestyle',
    'Perfil Personal / Juvenil',
    'Trabajo Social & Fitness',
    'Deporte & Gastronomía',
    'Música (Cantautor)'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create enum for status
DO $$ BEGIN
  CREATE TYPE influencer_status AS ENUM (
    'Prospecto',
    'Contactado',
    'Confirmado',
    'Publicado'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Create influencers table with all required fields
CREATE TABLE IF NOT EXISTS public.influencers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255),
  phone varchar(50),
  email varchar(255) NOT NULL UNIQUE,
  instagram_url text,
  followers integer DEFAULT 0,
  engagement_rate decimal(5,2) DEFAULT 0.00,
  category influencer_category DEFAULT 'Sin categoría',
  country varchar(100),
  city varchar(100),
  status influencer_status DEFAULT 'Prospecto',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
CREATE POLICY "Allow public read access to influencers"
  ON public.influencers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage influencers"
  ON public.influencers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_influencers_email ON public.influencers(email);
CREATE INDEX IF NOT EXISTS idx_influencers_category ON public.influencers(category);
CREATE INDEX IF NOT EXISTS idx_influencers_status ON public.influencers(status);
CREATE INDEX IF NOT EXISTS idx_influencers_name ON public.influencers(name);
CREATE INDEX IF NOT EXISTS idx_influencers_followers ON public.influencers(followers DESC);
CREATE INDEX IF NOT EXISTS idx_influencers_country_city ON public.influencers(country, city);
CREATE INDEX IF NOT EXISTS idx_influencers_created_at ON public.influencers(created_at DESC);

-- 7. Add constraint for Instagram URL validation
ALTER TABLE public.influencers
ADD CONSTRAINT valid_instagram_url
CHECK (
  instagram_url IS NULL OR 
  instagram_url ~* '^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._\-]+\/?$'
);

-- 8. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Add trigger for updated_at
DROP TRIGGER IF EXISTS update_influencers_updated_at ON public.influencers;
CREATE TRIGGER update_influencers_updated_at
  BEFORE UPDATE ON public.influencers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();