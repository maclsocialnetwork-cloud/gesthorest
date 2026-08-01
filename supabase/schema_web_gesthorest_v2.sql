-- ============================================================
-- GESTHOREST INTERNATIONAL — Schéma V2 (delta à appliquer sur V1)
-- Projet : APOHIGHTECH · Schéma : web_gesthorest
-- Supabase SQL Editor — appliquer APRÈS schema_web_gesthorest.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. NOUVELLES TABLES V2
-- ────────────────────────────────────────────────────────────

-- NEWSLETTER SUBSCRIBERS
-- Collecte les e-mails via le bloc newsletter de la page d'accueil
CREATE TABLE IF NOT EXISTS web_gesthorest.newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  prenom      TEXT,
  source      TEXT DEFAULT 'site_web',     -- d'où vient l'inscription
  actif       BOOLEAN DEFAULT true,         -- false = désabonné
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- DEMANDES FDFP
-- Collecte les formulaires de demande d'accompagnement FDFP
CREATE TABLE IF NOT EXISTS web_gesthorest.fdfp_demandes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom                 TEXT NOT NULL,
  entreprise          TEXT NOT NULL,
  email               TEXT NOT NULL,
  telephone           TEXT,
  formation_souhaitee TEXT,
  statut              TEXT DEFAULT 'nouveau'
    CHECK (statut IN ('nouveau','en_cours','validé','refusé')),
  notes               TEXT,                   -- notes internes admin
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- TÉLÉCHARGEMENTS
-- Catalogue des documents téléchargeables (brochures, guides, formulaires)
CREATE TABLE IF NOT EXISTS web_gesthorest.telechargements (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre               TEXT NOT NULL,
  description         TEXT,
  type_document       TEXT DEFAULT 'catalogue'
    CHECK (type_document IN ('catalogue','guide','brochure','formulaire','attestation','autre')),
  url_fichier         TEXT,                   -- lien vers Supabase Storage ou externe
  actif               BOOLEAN DEFAULT true,
  nb_telechargements  INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- DEMANDES DE TÉLÉCHARGEMENT
-- Capture le lead (nom + email) avant téléchargement
CREATE TABLE IF NOT EXISTS web_gesthorest.telechargements_demandes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telechargement_id UUID REFERENCES web_gesthorest.telechargements(id) ON DELETE SET NULL,
  nom             TEXT NOT NULL,
  prenom          TEXT NOT NULL,
  email           TEXT NOT NULL,
  telephone       TEXT,
  entreprise      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 2. ALTÉRATIONS DES TABLES EXISTANTES
-- ────────────────────────────────────────────────────────────

-- equipe : ajouter colonne actif (V2 Admin Editor le requiert)
DO $$ BEGIN
  ALTER TABLE web_gesthorest.equipe ADD COLUMN actif BOOLEAN DEFAULT true;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- temoignages : renommer visible → actif pour cohérence V2
-- (si colonne "actif" n'existe pas déjà)
DO $$ BEGIN
  ALTER TABLE web_gesthorest.temoignages ADD COLUMN actif BOOLEAN DEFAULT true;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- temoignages : synchroniser actif avec visible au premier run
UPDATE web_gesthorest.temoignages SET actif = visible WHERE actif IS NULL;

-- formations : ajouter colonnes V2
DO $$ BEGIN
  ALTER TABLE web_gesthorest.formations
    ADD COLUMN financement_fdfp BOOLEAN DEFAULT false,
    ADD COLUMN competences_acquises JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN duree_jours INT,
    ADD COLUMN formateur_nom TEXT,
    ADD COLUMN formateur_titre TEXT,
    ADD COLUMN formateur_photo TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- sessions : renommer places_total → places_totales si nécessaire
-- (le code V2 utilise places_totales)
DO $$ BEGIN
  ALTER TABLE web_gesthorest.sessions
    RENAME COLUMN places_total TO places_totales;
EXCEPTION WHEN undefined_column THEN NULL; END $$;

-- ────────────────────────────────────────────────────────────
-- 3. RLS — NOUVELLES TABLES
-- ────────────────────────────────────────────────────────────

ALTER TABLE web_gesthorest.newsletter_subscribers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.fdfp_demandes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.telechargements            ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.telechargements_demandes   ENABLE ROW LEVEL SECURITY;

-- Téléchargements : lecture publique
CREATE POLICY IF NOT EXISTS "telechargements_select_public"
  ON web_gesthorest.telechargements FOR SELECT USING (true);

-- Newsletter : insertion publique (n'importe qui peut s'inscrire)
CREATE POLICY IF NOT EXISTS "newsletter_insert_public"
  ON web_gesthorest.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- FDFP demandes : insertion publique
CREATE POLICY IF NOT EXISTS "fdfp_demandes_insert_public"
  ON web_gesthorest.fdfp_demandes FOR INSERT WITH CHECK (true);

-- Téléchargements demandes : insertion publique
CREATE POLICY IF NOT EXISTS "telechargements_demandes_insert_public"
  ON web_gesthorest.telechargements_demandes FOR INSERT WITH CHECK (true);

-- ────────────────────────────────────────────────────────────
-- 4. SERVICE_ROLE — ACCÈS COMPLET AUX NOUVELLES TABLES
-- ────────────────────────────────────────────────────────────

CREATE POLICY IF NOT EXISTS "service_role_all_newsletter"
  ON web_gesthorest.newsletter_subscribers FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "service_role_all_fdfp_demandes"
  ON web_gesthorest.fdfp_demandes FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "service_role_all_telechargements"
  ON web_gesthorest.telechargements FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "service_role_all_telechargements_demandes"
  ON web_gesthorest.telechargements_demandes FOR ALL USING (auth.role() = 'service_role');

-- ────────────────────────────────────────────────────────────
-- 5. INDEXES PERFORMANCE
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_newsletter_email
  ON web_gesthorest.newsletter_subscribers (email);

CREATE INDEX IF NOT EXISTS idx_fdfp_statut
  ON web_gesthorest.fdfp_demandes (statut);

CREATE INDEX IF NOT EXISTS idx_fdfp_created
  ON web_gesthorest.fdfp_demandes (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_telechargements_actif
  ON web_gesthorest.telechargements (actif);

CREATE INDEX IF NOT EXISTS idx_inscriptions_created
  ON web_gesthorest.inscriptions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inscriptions_statut
  ON web_gesthorest.inscriptions (statut);

-- ────────────────────────────────────────────────────────────
-- 6. FONCTION : incrémenter nb_telechargements
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION web_gesthorest.increment_download(doc_id UUID)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE web_gesthorest.telechargements
  SET nb_telechargements = COALESCE(nb_telechargements, 0) + 1,
      updated_at = now()
  WHERE id = doc_id;
$$;

-- ────────────────────────────────────────────────────────────
-- 7. DONNÉES SEED V2
-- ────────────────────────────────────────────────────────────

-- Quelques documents téléchargeables de démo
INSERT INTO web_gesthorest.telechargements (titre, description, type_document, actif) VALUES
  ('Catalogue des formations 2024–2025', 'L''ensemble de nos programmes de formation avec tarifs et calendrier.', 'catalogue', true),
  ('Guide du financement FDFP', 'Tout ce que vous devez savoir pour faire financer vos formations par le FDFP.', 'guide', true),
  ('Brochure institutionnelle Gesthorest', 'Présentation du cabinet : missions, valeurs, certifications et références.', 'brochure', true),
  ('Formulaire d''inscription individuelle', 'Formulaire à remplir et retourner par e-mail pour toute inscription individuelle.', 'formulaire', true),
  ('Formulaire plan de formation FDFP', 'Modèle officiel de plan de formation à soumettre au FDFP.', 'formulaire', true),
  ('Guide e-learning Gesthorest', 'Mode d''emploi pour accéder et utiliser notre plateforme e-learning.', 'guide', true)
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 8. VUE : tableau de bord admin simplifié
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW web_gesthorest.v_dashboard AS
SELECT
  (SELECT COUNT(*) FROM web_gesthorest.inscriptions
   WHERE statut = 'confirme'
     AND created_at >= date_trunc('month', now()))             AS inscriptions_mois,
  (SELECT COUNT(*) FROM web_gesthorest.inscriptions
   WHERE statut = 'en_attente')                                 AS en_attente,
  (SELECT COUNT(*) FROM web_gesthorest.apprenants
   WHERE created_at >= date_trunc('month', now()))              AS nouveaux_apprenants,
  (SELECT COALESCE(SUM(montant), 0)
   FROM web_gesthorest.inscriptions
   WHERE statut = 'confirme'
     AND type_paiement = 'en_ligne'
     AND created_at >= date_trunc('month', now()))              AS ca_mois_en_ligne,
  (SELECT COUNT(*) FROM web_gesthorest.fdfp_demandes
   WHERE statut = 'nouveau')                                    AS fdfp_nouvelles,
  (SELECT COUNT(*) FROM web_gesthorest.newsletter_subscribers
   WHERE actif = true)                                          AS newsletter_abonnes;

GRANT SELECT ON web_gesthorest.v_dashboard TO authenticated, service_role;

-- FIN DU SCHEMA V2
-- ============================================================
