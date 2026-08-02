-- =============================================================
-- SEED ÉQUIPE + TABLE SETTINGS — Gesthorest International
-- À exécuter manuellement dans Supabase SQL Editor
-- =============================================================

-- 1. TABLE ÉQUIPE
CREATE TABLE IF NOT EXISTS web_gesthorest.equipe (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nom text NOT NULL,
  prenom text NOT NULL,
  titre text,
  bio text,
  photo_url text,
  ordre int DEFAULT 0,
  actif boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.equipe ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_equipe" ON web_gesthorest.equipe;
CREATE POLICY "public_read_equipe" ON web_gesthorest.equipe
  FOR SELECT TO anon, authenticated USING (actif = true);
GRANT SELECT ON web_gesthorest.equipe TO anon, authenticated;
GRANT ALL ON web_gesthorest.equipe TO service_role;

-- Seed équipe
DELETE FROM web_gesthorest.equipe;
INSERT INTO web_gesthorest.equipe (prenom, nom, titre, bio, ordre) VALUES
('Gesthorest', 'Direction', 'Directrice Générale',
 'Experte en développement des compétences avec plus de 15 ans d''expérience en Côte d''Ivoire et en Europe. Pilote la stratégie et le développement de Gesthorest International.', 1),
('Jean-Baptiste', 'Konan', 'Directeur Pédagogique',
 'Spécialiste en ingénierie de formation, il conçoit et supervise tous les programmes de formation du cabinet.', 2),
('Aminata', 'Touré', 'Responsable Relations Clients',
 'Interlocutrice privilégiée de nos partenaires entreprises, elle assure le suivi de satisfaction et la fidélisation de nos clients.', 3);

-- 2. TABLE SETTINGS (pour Mission/Vision/Valeurs)
CREATE TABLE IF NOT EXISTS web_gesthorest.settings (
  cle text PRIMARY KEY,
  valeur text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON web_gesthorest.settings;
CREATE POLICY "public_read_settings" ON web_gesthorest.settings
  FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON web_gesthorest.settings TO anon, authenticated;
GRANT ALL ON web_gesthorest.settings TO service_role;

INSERT INTO web_gesthorest.settings (cle, valeur) VALUES
('mission', 'Accompagner les entreprises, institutions et professionnels vers l''excellence grâce à des formations pratiques, des programmes sur mesure et un suivi de qualité.'),
('vision', 'Devenir le cabinet de référence en développement des compétences humaines en Afrique de l''Ouest et en Europe, reconnu pour la qualité et l''impact de ses interventions.'),
('valeurs', 'Excellence
Proximité
Innovation
Résultats
Intégrité'),
('certifications_texte', 'Gesthorest International est agréé FDFP et certifié ISO 9001:2015, garantissant des formations de qualité reconnues par les instances professionnelles.')
ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur;
