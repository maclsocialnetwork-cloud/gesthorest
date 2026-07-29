-- ============================================================
-- GESTHOREST INTERNATIONAL — Schéma complet Supabase
-- Projet : APOHIGHTECH (schéma web_gesthorest)
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. SCHÉMA & GRANTS
-- ────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS web_gesthorest;

GRANT USAGE ON SCHEMA web_gesthorest TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA web_gesthorest TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA web_gesthorest TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA web_gesthorest GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA web_gesthorest GRANT SELECT ON TABLES TO anon, authenticated;

-- ────────────────────────────────────────────────────────────
-- 2. TABLES
-- ────────────────────────────────────────────────────────────

-- FORMATEURS
CREATE TABLE IF NOT EXISTS web_gesthorest.formateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL DEFAULT '',
  titre TEXT,
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FORMATIONS
CREATE TABLE IF NOT EXISTS web_gesthorest.formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titre TEXT NOT NULL,
  domaine TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'Présentiel',
  duree TEXT NOT NULL DEFAULT '1 jour',
  description TEXT,
  programme JSONB DEFAULT '[]'::jsonb,
  objectifs JSONB DEFAULT '[]'::jsonb,
  public_cible TEXT,
  prerequis TEXT,
  prix NUMERIC,
  devise TEXT DEFAULT 'FCFA',
  statut TEXT DEFAULT 'brouillon' CHECK (statut IN ('publiee','brouillon','archivee')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SESSIONS
CREATE TABLE IF NOT EXISTS web_gesthorest.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID NOT NULL REFERENCES web_gesthorest.formations(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  lieu TEXT NOT NULL DEFAULT 'Abidjan',
  places_total INT NOT NULL DEFAULT 20,
  places_restantes INT NOT NULL DEFAULT 20,
  formateur_id UUID REFERENCES web_gesthorest.formateurs(id) ON DELETE SET NULL,
  statut TEXT DEFAULT 'ouverte' CHECK (statut IN ('ouverte','complete','annulee')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- APPRENANTS
CREATE TABLE IF NOT EXISTS web_gesthorest.apprenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  entreprise TEXT,
  role TEXT DEFAULT 'apprenant' CHECK (role IN ('admin','formateur','apprenant')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INSCRIPTIONS
CREATE TABLE IF NOT EXISTS web_gesthorest.inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES web_gesthorest.sessions(id) ON DELETE CASCADE,
  apprenant_id UUID NOT NULL REFERENCES web_gesthorest.apprenants(id) ON DELETE CASCADE,
  type_paiement TEXT DEFAULT 'cabinet' CHECK (type_paiement IN ('en_ligne','cabinet')),
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente','confirme','annule')),
  montant NUMERIC,
  devise TEXT DEFAULT 'FCFA',
  reference_cinetpay TEXT,
  numero_bon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);

-- EVALUATIONS
CREATE TABLE IF NOT EXISTS web_gesthorest.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscription_id UUID NOT NULL REFERENCES web_gesthorest.inscriptions(id) ON DELETE CASCADE,
  note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- EVENEMENTS
CREATE TABLE IF NOT EXISTS web_gesthorest.evenements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  date_evenement DATE NOT NULL,
  lieu TEXT,
  places INT DEFAULT 50,
  prix NUMERIC,
  devise TEXT DEFAULT 'FCFA',
  statut TEXT DEFAULT 'publie' CHECK (statut IN ('publie','brouillon','annule')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ARTICLES
CREATE TABLE IF NOT EXISTS web_gesthorest.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  titre TEXT NOT NULL,
  contenu TEXT,
  image_url TEXT,
  categorie TEXT,
  statut TEXT DEFAULT 'publie' CHECK (statut IN ('publie','brouillon')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CANDIDATURES
CREATE TABLE IF NOT EXISTS web_gesthorest.candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  poste_souhaite TEXT NOT NULL,
  secteur TEXT,
  message TEXT,
  cv_url TEXT,
  statut TEXT DEFAULT 'recu' CHECK (statut IN ('recu','en_examen','retenu','non_retenu')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- EQUIPE
CREATE TABLE IF NOT EXISTS web_gesthorest.equipe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL DEFAULT '',
  titre TEXT,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  ordre INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TEMOIGNAGES
CREATE TABLE IF NOT EXISTS web_gesthorest.temoignages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  entreprise TEXT,
  texte TEXT NOT NULL,
  note INT DEFAULT 5 CHECK (note BETWEEN 1 AND 5),
  photo_url TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SETTINGS
CREATE TABLE IF NOT EXISTS web_gesthorest.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cle TEXT UNIQUE NOT NULL,
  valeur TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SUR MESURE DEMANDES
CREATE TABLE IF NOT EXISTS web_gesthorest.sur_mesure_demandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise TEXT NOT NULL,
  secteur TEXT,
  effectif TEXT,
  thematique TEXT NOT NULL,
  delai TEXT,
  message TEXT,
  email TEXT,
  telephone TEXT,
  statut TEXT DEFAULT 'recu',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS web_gesthorest.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objet TEXT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  entreprise TEXT,
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 3. ENABLE RLS
-- ────────────────────────────────────────────────────────────

ALTER TABLE web_gesthorest.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.apprenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.formateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.candidatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.temoignages ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.sur_mesure_demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_gesthorest.contact_messages ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- 4. RLS POLICIES
-- ────────────────────────────────────────────────────────────

-- Lecture publique (anon + authenticated)
CREATE POLICY "formations_select_public" ON web_gesthorest.formations FOR SELECT USING (true);
CREATE POLICY "sessions_select_public" ON web_gesthorest.sessions FOR SELECT USING (true);
CREATE POLICY "formateurs_select_public" ON web_gesthorest.formateurs FOR SELECT USING (true);
CREATE POLICY "evenements_select_public" ON web_gesthorest.evenements FOR SELECT USING (true);
CREATE POLICY "articles_select_public" ON web_gesthorest.articles FOR SELECT USING (true);
CREATE POLICY "equipe_select_public" ON web_gesthorest.equipe FOR SELECT USING (true);
CREATE POLICY "temoignages_select_public" ON web_gesthorest.temoignages FOR SELECT USING (true);
CREATE POLICY "settings_select_public" ON web_gesthorest.settings FOR SELECT USING (true);

-- Apprenants : lecture propre profil
CREATE POLICY "apprenants_select_own" ON web_gesthorest.apprenants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "apprenants_update_own" ON web_gesthorest.apprenants
  FOR UPDATE USING (auth.uid() = user_id);

-- Inscription publique (signup crée le profil)
CREATE POLICY "apprenants_insert_auth" ON web_gesthorest.apprenants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Inscriptions : lecture propres inscriptions
CREATE POLICY "inscriptions_select_own" ON web_gesthorest.inscriptions
  FOR SELECT USING (
    apprenant_id IN (
      SELECT id FROM web_gesthorest.apprenants WHERE user_id = auth.uid()
    )
  );

-- Evaluations : insertion + lecture propres
CREATE POLICY "evaluations_select_own" ON web_gesthorest.evaluations
  FOR SELECT USING (
    inscription_id IN (
      SELECT i.id FROM web_gesthorest.inscriptions i
      JOIN web_gesthorest.apprenants a ON a.id = i.apprenant_id
      WHERE a.user_id = auth.uid()
    )
  );

CREATE POLICY "evaluations_insert_own" ON web_gesthorest.evaluations
  FOR INSERT WITH CHECK (
    inscription_id IN (
      SELECT i.id FROM web_gesthorest.inscriptions i
      JOIN web_gesthorest.apprenants a ON a.id = i.apprenant_id
      WHERE a.user_id = auth.uid()
    )
  );

-- Candidatures : insertion publique (anon peut déposer)
CREATE POLICY "candidatures_insert_public" ON web_gesthorest.candidatures
  FOR INSERT WITH CHECK (true);

-- Sur mesure demandes : insertion publique
CREATE POLICY "sur_mesure_insert_public" ON web_gesthorest.sur_mesure_demandes
  FOR INSERT WITH CHECK (true);

-- Contact messages : insertion publique
CREATE POLICY "contact_messages_insert_public" ON web_gesthorest.contact_messages
  FOR INSERT WITH CHECK (true);

-- Inscriptions : insertion par service_role (API route) — couvert par le GRANT ALL

-- ────────────────────────────────────────────────────────────
-- 5. SERVICE_ROLE FULL ACCESS (backup policies)
-- ────────────────────────────────────────────────────────────

CREATE POLICY "service_role_all_formations" ON web_gesthorest.formations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_sessions" ON web_gesthorest.sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_apprenants" ON web_gesthorest.apprenants FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_inscriptions" ON web_gesthorest.inscriptions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_evaluations" ON web_gesthorest.evaluations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_formateurs" ON web_gesthorest.formateurs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_evenements" ON web_gesthorest.evenements FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_articles" ON web_gesthorest.articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_candidatures" ON web_gesthorest.candidatures FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_equipe" ON web_gesthorest.equipe FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_temoignages" ON web_gesthorest.temoignages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_settings" ON web_gesthorest.settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_sur_mesure" ON web_gesthorest.sur_mesure_demandes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_contact" ON web_gesthorest.contact_messages FOR ALL USING (auth.role() = 'service_role');

-- ────────────────────────────────────────────────────────────
-- 6. STORAGE BUCKET (candidatures)
-- ────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('candidatures', 'candidatures', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('supports', 'supports', true)
ON CONFLICT (id) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 7. DONNÉES SEED
-- ────────────────────────────────────────────────────────────

-- Formateurs
INSERT INTO web_gesthorest.formateurs (id, nom, prenom, titre, bio, email) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'Ouattara', 'Jean-Marc', 'Consultant senior en management', 'Plus de 15 ans d''expérience en management et leadership en Afrique de l''Ouest.', 'jm.ouattara@gesthorest.com'),
  ('f1000000-0000-0000-0000-000000000002', 'Cissé', 'Aminata', 'Consultante RH & Talent Management', 'Spécialiste du recrutement et de la gestion des talents, certifiée SHRM.', 'a.cisse@gesthorest.com'),
  ('f1000000-0000-0000-0000-000000000003', 'Kouamé', 'Serge', 'Expert-comptable, formateur finance', 'Auditeur qualité certifié ISO 9001, expert en finance d''entreprise.', 's.kouame@gesthorest.com'),
  ('f1000000-0000-0000-0000-000000000004', 'Yao', 'Grâce', 'Formatrice bureautique certifiée', 'Spécialiste Excel, Power BI et outils collaboratifs Microsoft 365.', 'g.yao@gesthorest.com')
ON CONFLICT DO NOTHING;

-- Formations
INSERT INTO web_gesthorest.formations (id, slug, titre, domaine, format, duree, description, programme, objectifs, public_cible, prerequis, prix, devise, statut) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'manager-equipe-performante',
    'Manager une équipe performante',
    'management',
    'Présentiel',
    '3 jours',
    'Cette formation outille les managers pour piloter leur équipe avec assurance : fixer des objectifs clairs, déléguer efficacement, motiver au quotidien et gérer les situations difficiles.',
    '[{"titre":"Module 1 — Les fondamentaux du management","points":["Les styles de management et leur impact sur l''équipe","Positionnement du manager vis-à-vis de son équipe"]},{"titre":"Module 2 — Piloter la performance","points":["Fixer des objectifs SMART","Suivre et évaluer la performance individuelle et collective"]},{"titre":"Module 3 — Motiver et déléguer","points":["Les leviers de motivation en contexte africain","Déléguer sans perdre le contrôle"]}]'::jsonb,
    '["Adopter une posture managériale adaptée à son équipe","Fixer des objectifs clairs et mesurables","Déléguer efficacement en conservant la maîtrise des résultats","Gérer les situations de tension au sein de l''équipe"]'::jsonb,
    'Managers, chefs d''équipe, responsables de service.',
    'Une première expérience d''encadrement d''équipe est recommandée.',
    250000, 'FCFA', 'publiee'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'recrutement-gestion-talents',
    'Recrutement et gestion des talents',
    'ressources-humaines',
    'Blended',
    '4 jours',
    'Maîtrisez l''ensemble du processus de recrutement, du sourcing à l''intégration, ainsi que les fondamentaux de la gestion des talents pour fidéliser vos meilleurs collaborateurs.',
    '[{"titre":"Module 1 — Sourcing et sélection","points":["Définir un profil de poste et une fiche de recrutement","Techniques de sourcing et d''entretien structuré"]},{"titre":"Module 2 — Gestion des talents","points":["Identifier et cartographier les talents clés","Construire des parcours de fidélisation"]}]'::jsonb,
    '["Structurer un processus de recrutement fiable","Conduire des entretiens efficaces et non-discriminants","Mettre en place une stratégie de gestion des talents"]'::jsonb,
    'DRH, responsables RH, chargés de recrutement.',
    'Aucun prérequis spécifique.',
    320000, 'FCFA', 'publiee'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'finance-pour-non-financiers',
    'Finance pour non-financiers',
    'finance-comptabilite',
    'Présentiel',
    '2 jours',
    'Une formation pratique pour comprendre les états financiers, piloter un budget et dialoguer efficacement avec la direction financière.',
    '[{"titre":"Module 1 — Lire un bilan et un compte de résultat","points":["Comprendre les grands équilibres financiers","Analyser la rentabilité"]},{"titre":"Module 2 — Piloter un budget","points":["Construire et suivre un budget opérationnel","Analyser les écarts"]}]'::jsonb,
    '["Lire et interpréter les documents financiers de l''entreprise","Participer activement à la construction budgétaire","Dialoguer efficacement avec la fonction finance"]'::jsonb,
    'Managers opérationnels, chefs de projet, non-financiers.',
    'Aucun prérequis.',
    180000, 'FCFA', 'publiee'
  )
ON CONFLICT (slug) DO NOTHING;

-- Sessions
INSERT INTO web_gesthorest.sessions (id, formation_id, date_debut, date_fin, lieu, places_total, places_restantes, formateur_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', '2026-09-14', '2026-09-16', 'Abidjan', 20, 12, 'f1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', '2026-11-09', '2026-11-11', 'Abidjan', 20, 20, 'f1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', '2026-09-28', '2026-10-01', 'Abidjan', 18, 5, 'f1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', '2026-12-07', '2026-12-10', 'Paris', 15, 15, 'f1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', '2026-09-21', '2026-09-22', 'Abidjan', 25, 18, 'f1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', '2026-10-19', '2026-10-20', 'Abidjan', 25, 25, 'f1000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- Articles
INSERT INTO web_gesthorest.articles (slug, titre, contenu, image_url, categorie, statut) VALUES
  (
    '5-tendances-rh-2026-afrique-ouest',
    '5 tendances RH à suivre en 2026 en Afrique de l''Ouest',
    'La fonction RH connaît une transformation profonde en Afrique de l''Ouest, portée par la digitalisation des processus et l''évolution des attentes des collaborateurs. Parmi les tendances marquantes : le développement du recrutement digital, la montée en puissance de la marque employeur, et une attention croissante portée à la qualité de vie au travail.',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80',
    'Tendances RH', 'publie'
  ),
  (
    'temoignage-groupe-ivoire-distribution',
    'Témoignage : comment le Groupe Ivoire Distribution a transformé son management',
    'Le Groupe Ivoire Distribution a fait appel à Gesthorest International pour renforcer les compétences managériales de ses équipes encadrantes. Sur trois mois, un programme sur mesure a été déployé, combinant formation présentielle et suivi individualisé. Résultat : une nette amélioration de la cohésion d''équipe.',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80',
    'Témoignages', 'publie'
  ),
  (
    'gesthorest-renouvelle-certification-iso-9001',
    'Gesthorest International renouvelle sa certification ISO 9001:2015',
    'Gesthorest International est fier d''annoncer le renouvellement de sa certification ISO 9001:2015, gage de la qualité de ses prestations de formation et de recrutement. Cette certification récompense les efforts continus du cabinet.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    'Actualités cabinet', 'publie'
  )
ON CONFLICT (slug) DO NOTHING;

-- Événements
INSERT INTO web_gesthorest.evenements (titre, description, date_evenement, lieu, places, prix, devise, statut) VALUES
  (
    'Masterclass — Leadership au féminin',
    'Une rencontre exclusive avec des dirigeantes africaines pour échanger sur les clés du leadership et de la performance durable.',
    '2026-09-25', 'Abidjan — Sofitel Hôtel Ivoire', 80, 25000, 'FCFA', 'publie'
  ),
  (
    'Petit-déjeuner RH — L''IA au service des RH',
    'Un temps d''échange convivial sur les usages concrets de l''intelligence artificielle dans la fonction RH.',
    '2026-10-15', 'Abidjan — Gesthorest International', 40, NULL, 'FCFA', 'publie'
  )
ON CONFLICT DO NOTHING;

-- Équipe
INSERT INTO web_gesthorest.equipe (nom, prenom, titre, bio, photo_url, ordre) VALUES
  ('Diabaté', 'Ibrahim', 'Directeur Général', 'Fondateur de Gesthorest International, Ibrahim Diabaté a plus de 20 ans d''expérience dans la formation professionnelle et le conseil RH en Afrique de l''Ouest.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 1),
  ('Touré', 'Fatou', 'Responsable Formation', 'Ingénieure pédagogique passionnée, Fatou conçoit et coordonne l''ensemble des programmes de formation du cabinet.', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80', 2),
  ('Cissé', 'Aminata', 'Consultante RH', 'Spécialiste du recrutement et de la gestion des talents, Aminata accompagne les entreprises dans leurs défis RH.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', 3),
  ('N''Guessan', 'Koffi', 'Chargé Relations Internationales', 'Koffi développe les partenariats entre l''Afrique et l''Europe, coordonnant les programmes de formation transnationaux.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 4)
ON CONFLICT DO NOTHING;

-- Témoignages
INSERT INTO web_gesthorest.temoignages (nom, entreprise, texte, note, photo_url, visible) VALUES
  ('Kouassi Adjoua', 'Sud Finance SA', 'Gesthorest a transformé notre approche managériale. Nos cadres sont plus confiants, nos équipes plus soudées. Un accompagnement rigoureux avec un vrai suivi post-formation.', 5, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80', true),
  ('Mariam Diallo', 'Groupe Ivoire Distribution', 'La formation sur mesure déployée par Gesthorest a dépassé nos attentes. Les formateurs sont excellents et les contenus parfaitement adaptés à notre contexte.', 5, 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80', true),
  ('Yves Kaboré', 'BSIC Bank', 'Nous avons fait appel à Gesthorest pour le recrutement de 3 postes clés. Un process structuré, des candidats de qualité, et un suivi irréprochable.', 4, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', true)
ON CONFLICT DO NOTHING;

-- Settings
INSERT INTO web_gesthorest.settings (cle, valeur) VALUES
  ('nom_cabinet', 'Gesthorest International'),
  ('slogan', 'Former aujourd''hui, réussir demain'),
  ('email_contact', 'contact@gesthorest.com'),
  ('tel_1', '+225 07 47 12 33 21'),
  ('tel_2', '+33 6 71 97 11 59'),
  ('adresse_1', 'Abidjan — Côte d''Ivoire'),
  ('adresse_2', 'Paris — France')
ON CONFLICT (cle) DO NOTHING;

-- ============================================================
-- FIN DU SCRIPT — Gesthorest International
-- ============================================================
