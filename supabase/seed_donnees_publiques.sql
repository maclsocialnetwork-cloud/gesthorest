-- =============================================================
-- SEED DONNÉES PUBLIQUES — Gesthorest International
-- À exécuter manuellement dans Supabase SQL Editor
-- Schema : web_gesthorest
-- =============================================================

-- 1. CHIFFRES CLÉS (StatsCounter)
CREATE TABLE IF NOT EXISTS web_gesthorest.chiffres_cles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('counter','badge','text')),
  valeur int,
  suffixe text,
  libelle text NOT NULL,
  sous_texte text,
  prefixe text,
  icone text,
  ordre int DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.chiffres_cles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_chiffres" ON web_gesthorest.chiffres_cles;
CREATE POLICY "public_read_chiffres" ON web_gesthorest.chiffres_cles FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON web_gesthorest.chiffres_cles TO anon, authenticated;
GRANT ALL ON web_gesthorest.chiffres_cles TO service_role;

DELETE FROM web_gesthorest.chiffres_cles;
INSERT INTO web_gesthorest.chiffres_cles (type, valeur, suffixe, libelle, sous_texte, prefixe, icone, ordre) VALUES
('badge', NULL, NULL, 'Agréé FDFP', 'Fonds pour le Développement de la Formation Professionnelle', NULL, 'ShieldCheck', 1),
('counter', 50, '+', 'formations au catalogue', NULL, NULL, NULL, 2),
('counter', 200, '+', 'entreprises accompagnées', NULL, NULL, NULL, 3),
('counter', 3500, '+', 'apprenants formés', NULL, NULL, NULL, 4),
('counter', 94, '%', 'de satisfaction client', NULL, NULL, NULL, 5),
('text', NULL, NULL, 'en Côte d''Ivoire', 'et en Europe', 'Partout', NULL, 6);

-- 2. CLIENTS (ClientsCarousel)
CREATE TABLE IF NOT EXISTS web_gesthorest.clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nom text NOT NULL,
  logo_url text,
  rangee int DEFAULT 1,
  ordre int DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_clients" ON web_gesthorest.clients;
CREATE POLICY "public_read_clients" ON web_gesthorest.clients FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON web_gesthorest.clients TO anon, authenticated;
GRANT ALL ON web_gesthorest.clients TO service_role;

DELETE FROM web_gesthorest.clients;
INSERT INTO web_gesthorest.clients (nom, rangee, ordre) VALUES
('Ecobank CI', 1, 1), ('Orange CI', 1, 2), ('MTN CI', 1, 3), ('Nestlé CI', 1, 4), ('TotalEnergies CI', 1, 5),
('Société Générale CI', 1, 6), ('SODECI', 1, 7), ('CIE', 1, 8), ('Bolloré Africa', 1, 9), ('SIB', 1, 10),
('CFAO Motors', 2, 1), ('SIFCA', 2, 2), ('Air Côte d''Ivoire', 2, 3), ('Moov Africa', 2, 4), ('BIAO-CI', 2, 5),
('NSIA Banque', 2, 6), ('Coris Bank CI', 2, 7), ('CANAL+ Afrique', 2, 8), ('BNETD', 2, 9), ('Afrique Télécom', 2, 10);

-- 3. GALERIE PHOTOS
CREATE TABLE IF NOT EXISTS web_gesthorest.galerie (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url text NOT NULL,
  titre text NOT NULL,
  ordre int DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.galerie ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_galerie" ON web_gesthorest.galerie;
CREATE POLICY "public_read_galerie" ON web_gesthorest.galerie FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON web_gesthorest.galerie TO anon, authenticated;
GRANT ALL ON web_gesthorest.galerie TO service_role;

DELETE FROM web_gesthorest.galerie;
INSERT INTO web_gesthorest.galerie (photo_url, titre, ordre) VALUES
('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', 'Formation professionnelle en Afrique', 1),
('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80', 'Salle de réunion professionnelle', 2),
('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', 'Équipe africaine en formation', 3),
('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', 'Formatrice africaine en présentation', 4),
('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', 'Salle de formation moderne', 5),
('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80', 'Atelier de formation groupe', 6);

-- 4. TÉMOIGNAGES
CREATE TABLE IF NOT EXISTS web_gesthorest.temoignages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nom text NOT NULL,
  poste text,
  entreprise text,
  photo_url text,
  texte text NOT NULL,
  note int DEFAULT 5,
  visible boolean DEFAULT true,
  ordre int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.temoignages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_temoignages" ON web_gesthorest.temoignages;
CREATE POLICY "public_read_temoignages" ON web_gesthorest.temoignages FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON web_gesthorest.temoignages TO anon, authenticated;
GRANT ALL ON web_gesthorest.temoignages TO service_role;

DELETE FROM web_gesthorest.temoignages;
INSERT INTO web_gesthorest.temoignages (nom, poste, entreprise, photo_url, texte, note, ordre) VALUES
('Aïcha Kouamé', 'Directrice RH', 'Groupe Ivoire Distribution',
 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200&q=80',
 'Une formation très pratique qui a permis à nos managers d''améliorer leur performance opérationnelle en 3 mois. Le suivi post-formation est vraiment appréciable.', 5, 1),
('Kouassi Adjoua', 'Directeur Général', 'Sud Finance SA',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
 'Gesthorest a su monter un dossier FDFP impeccable pour nous. Nos équipes ont été formées sans débourser un centime de notre trésorerie. Très professionnel.', 5, 2),
('Fatou Diabaté', 'Manager RH', 'Atlantique Industries',
 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
 'Le programme sur mesure conçu pour nos équipes commerciales a dépassé nos attentes. Un retour sur investissement concret et mesurable dès les premières semaines.', 5, 3);

-- 5. AVANTAGES (WhyUs)
CREATE TABLE IF NOT EXISTS web_gesthorest.avantages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icone text NOT NULL,
  titre text NOT NULL,
  description text NOT NULL,
  ordre int DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.avantages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_avantages" ON web_gesthorest.avantages;
CREATE POLICY "public_read_avantages" ON web_gesthorest.avantages FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON web_gesthorest.avantages TO anon, authenticated;
GRANT ALL ON web_gesthorest.avantages TO service_role;

DELETE FROM web_gesthorest.avantages;
INSERT INTO web_gesthorest.avantages (icone, titre, description, ordre) VALUES
('Target', 'Accompagnement personnalisé', 'Chaque entreprise est unique. Nous adaptons nos formations à vos réalités terrain et à vos objectifs spécifiques.', 1),
('Users', 'Formateurs experts certifiés', 'Tous nos formateurs sont des praticiens expérimentés avec des certifications reconnues dans leur domaine.', 2),
('FileText', 'Programmes adaptés à vos besoins', 'Nos programmes sont co-construits avec vous pour garantir la pertinence et l''efficacité de la formation.', 3),
('Banknote', 'Accompagnement FDFP complet', 'Nous gérons pour vous le montage et le suivi de vos dossiers FDFP, de A à Z, sans frais supplémentaires.', 4),
('Trophy', 'Formations orientées résultats', 'Des formations pratiques avec des mises en situation réelles pour garantir un transfert de compétences immédiat.', 5),
('RefreshCw', 'Suivi après formation', 'Notre accompagnement ne s''arrête pas à la fin de la session. Nous assurons un suivi post-formation personnalisé.', 6);

-- 6. SERVICES
CREATE TABLE IF NOT EXISTS web_gesthorest.services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icone text NOT NULL,
  titre text NOT NULL,
  description text NOT NULL,
  lien text NOT NULL,
  ordre int DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_services" ON web_gesthorest.services;
CREATE POLICY "public_read_services" ON web_gesthorest.services FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON web_gesthorest.services TO anon, authenticated;
GRANT ALL ON web_gesthorest.services TO service_role;

DELETE FROM web_gesthorest.services;
INSERT INTO web_gesthorest.services (icone, titre, description, lien, ordre) VALUES
('GraduationCap', 'Formations Premium', 'Un catalogue riche de formations professionnelles animées par des experts reconnus.', '/catalogue', 1),
('UserCog', 'Accompagnement sur mesure', 'Des programmes intra-entreprise conçus selon vos besoins et objectifs spécifiques.', '/sur-mesure', 2),
('Briefcase', 'Recrutement & RH', 'Sourcing, évaluation et conseil RH pour attirer et fidéliser les meilleurs talents.', '/recrutement', 3),
('CalendarDays', 'Événements & Masterclass', 'Des rencontres et masterclass animées par des experts pour enrichir vos compétences.', '/evenements', 4),
('Globe2', 'Offres Internationales', 'Une expertise qui traverse les frontières entre l''Afrique de l''Ouest et l''Europe.', '/international', 5),
('LayoutDashboard', 'Espace Apprenant', 'Suivez vos formations, téléchargez vos attestations et supports en un seul endroit.', '/espace-apprenant', 6);

-- 7. DOMAINES D'EXPERTISE
CREATE TABLE IF NOT EXISTS web_gesthorest.domaines (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  libelle text NOT NULL,
  slug text NOT NULL UNIQUE,
  ordre int DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.domaines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_domaines" ON web_gesthorest.domaines;
CREATE POLICY "public_read_domaines" ON web_gesthorest.domaines FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON web_gesthorest.domaines TO anon, authenticated;
GRANT ALL ON web_gesthorest.domaines TO service_role;

DELETE FROM web_gesthorest.domaines;
INSERT INTO web_gesthorest.domaines (libelle, slug, ordre) VALUES
('Management', 'management', 1),
('Ressources Humaines', 'ressources-humaines', 2),
('Finance & Comptabilité', 'finance-comptabilite', 3),
('Bureautique & Digital', 'bureautique-digital', 4),
('Qualité & Process', 'qualite-process', 5),
('Leadership', 'leadership', 6),
('Communication', 'communication', 7),
('Sécurité au Travail', 'securite-travail', 8);

-- 8. CERTIFICATIONS
CREATE TABLE IF NOT EXISTS web_gesthorest.certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nom text NOT NULL,
  icone text,
  logo_url text,
  ordre int DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_certifications" ON web_gesthorest.certifications;
CREATE POLICY "public_read_certifications" ON web_gesthorest.certifications FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON web_gesthorest.certifications TO anon, authenticated;
GRANT ALL ON web_gesthorest.certifications TO service_role;

DELETE FROM web_gesthorest.certifications;
INSERT INTO web_gesthorest.certifications (nom, icone, ordre) VALUES
('Agréé FDFP', 'ShieldCheck', 1),
('Certifié ISO 9001:2015', 'Award', 2),
('12 ans d''expertise', 'Clock', 3),
('Présence Afrique-Europe', 'Globe2', 4);

-- 9. PARAMÈTRES SITE (clé/valeur)
CREATE TABLE IF NOT EXISTS web_gesthorest.parametres_site (
  cle text PRIMARY KEY,
  valeur text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE web_gesthorest.parametres_site ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_parametres" ON web_gesthorest.parametres_site;
CREATE POLICY "public_read_parametres" ON web_gesthorest.parametres_site FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON web_gesthorest.parametres_site TO anon, authenticated;
GRANT ALL ON web_gesthorest.parametres_site TO service_role;

DELETE FROM web_gesthorest.parametres_site;
INSERT INTO web_gesthorest.parametres_site (cle, valeur) VALUES
('email_contact', 'contact@gesthorest.com'),
('telephone_ci', '+225 07 47 12 33 21'),
('telephone_fr', '+33 6 71 97 11 59'),
('adresse_ci', 'Abidjan — Côte d''Ivoire'),
('adresse_fr', 'Paris — France'),
('hero_image', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'),
('hero_stat_value', '3 500+'),
('hero_stat_label', 'Apprenants formés');
