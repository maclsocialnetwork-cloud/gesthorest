-- =============================================================
-- MIGRATION APPRENANTS V2 — Gesthorest International
-- Supprime la dépendance à Supabase Auth
-- Ajoute password_hash + statut (en_attente / actif / bloque)
-- À exécuter dans Supabase SQL Editor
-- =============================================================

-- 1. Ajouter les colonnes password_hash et statut
ALTER TABLE web_gesthorest.apprenants
  ADD COLUMN IF NOT EXISTS password_hash text,
  ADD COLUMN IF NOT EXISTS statut text NOT NULL DEFAULT 'en_attente';

-- 2. Contrainte sur les valeurs de statut
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_schema = 'web_gesthorest'
      AND table_name = 'apprenants'
      AND constraint_name = 'apprenants_statut_check'
  ) THEN
    ALTER TABLE web_gesthorest.apprenants
      ADD CONSTRAINT apprenants_statut_check
      CHECK (statut IN ('en_attente', 'actif', 'bloque'));
  END IF;
END;
$$;

-- 3. Les apprenants déjà créés via Supabase Auth → statut 'actif'
UPDATE web_gesthorest.apprenants
SET statut = 'actif'
WHERE user_id IS NOT NULL AND statut = 'en_attente';

-- 4. Rendre user_id nullable (plus requis)
ALTER TABLE web_gesthorest.apprenants
  ALTER COLUMN user_id DROP NOT NULL;

-- 5. Mettre à jour la RLS : service_role a tous les droits (déjà le cas)
-- Les routes API utilisent createAdminClient() (service_role), pas de RLS nécessaire
GRANT ALL ON web_gesthorest.apprenants TO service_role;
