# PROMPT CLAUDE CODE — GESTHOREST INTERNATIONAL
# À coller dans Claude Code ouvert dans :
# C:\Users\HP\Documents\ApoHighTech\Projet site prospection Google maps\Gesthorest

---

Tu es mon assistant vibe coding. Je vais te demander de construire le site complet de **Gesthorest International**, un cabinet de formation professionnelle et de recrutement basé à Abidjan (Côte d'Ivoire) et Paris (France).

Tu travailles de manière **totalement autonome** : tu crées tous les fichiers, tu initialises le projet, tu crées le repo GitHub, tu déploies sur Vercel. Tu me demandes validation uniquement aux étapes clés (fin d'étape importante). Je ne touche à aucun fichier manuellement.

À la toute fin, tu me fourniras uniquement les fichiers SQL à exécuter dans Supabase.

---

## RÈGLES TECHNIQUES IMPÉRATIVES (ne jamais dévier)

- PowerShell uniquement : toujours `;` jamais `&&` pour chaîner les commandes
- Ne jamais éditer les fichiers manuellement : tout passe par le terminal Claude Code
- `.env.local` créé via `New-Item` ou redirection PowerShell, jamais collé directement
- `SUPABASE_SERVICE_ROLE_KEY` jamais préfixé `NEXT_PUBLIC_`
- GitHub org : `maclsocialnetwork-cloud`
- Repo à créer : `maclsocialnetwork-cloud/gesthorest`
- Vercel project name : `gesthorest`
- Toujours vérifier qu'un `npm install` s'est bien terminé avant de continuer

---

## STACK TECHNIQUE

- Framework : Next.js 14 App Router (TypeScript)
- Styles : Tailwind CSS
- Base de données : Supabase (projet APOHIGHTECH partagé, schéma `web_gesthorest`)
- Paiement : CinetPay (placeholders uniquement — clés à renseigner plus tard par le client)
- Déploiement : GitHub (`maclsocialnetwork-cloud/gesthorest`) + Vercel
- Fonts : Google Fonts — Poppins (titres) + Inter (corps)
- Icons : lucide-react
- Formulaires : react-hook-form + zod
- Emails : Resend (placeholder — clé à renseigner plus tard)
- PDF bons de commande : pdf-lib

---

## IDENTITÉ GESTHOREST

**Nom :** Gesthorest International
**Sous-titre :** Training & Recruitment
**Slogan :** Former aujourd'hui, réussir demain
**Mission :** Accompagner les entreprises, institutions et professionnels vers l'excellence grâce à des solutions sur mesure, pratiques et orientées performance.
**Email :** contact@gesthorest.com
**Téléphone 1 :** +225 07 47 12 33 21
**Téléphone 2 :** +33 6 71 97 11 59
**Adresse 1 :** Abidjan — Côte d'Ivoire
**Adresse 2 :** Paris — France
**Site :** www.gesthorest.com
**Certifications :** Agréé FDFP · Certifié ISO 9001:2015

---

## CHARTE GRAPHIQUE (respecter exactement)

```
--color-primary:   #1B2A4A   /* bleu marine foncé — navbar, footer, titres */
--color-accent:    #F5821F   /* orange vif — CTA, badges, accents */
--color-accent-2:  #E67E22   /* orange secondaire — hover states */
--color-light:     #F8F9FC   /* fond sections alternées */
--color-white:     #FFFFFF
--color-text:      #2D3748   /* corps de texte */
--color-text-light:#6B7280   /* texte secondaire */
```

Police titres : **Poppins** (700, 600)
Police corps : **Inter** (400, 500)
Border-radius global : `0.5rem` (cartes, boutons)
Bouton primaire : fond `#F5821F`, texte blanc, hover `#E67E22`
Bouton secondaire : bordure `#1B2A4A`, texte `#1B2A4A`, hover fond `#1B2A4A` texte blanc

**Modules activés :**
- MODULE_RH = true
- MODULE_INTERNATIONAL = true
- MODULE_EVENEMENTS = true
- MODULE_BLOG = true
- PAIEMENT_EN_LIGNE = true (CinetPay — placeholders)
- PAIEMENT_CABINET = true

---

## ÉTAPE 1 — INITIALISATION PROJET

Dans le dossier courant (`Gesthorest`), exécute :

```powershell
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Puis installe toutes les dépendances :

```powershell
npm install @supabase/supabase-js @supabase/ssr lucide-react react-hook-form @hookform/resolvers zod pdf-lib resend ; npm install -D @types/node
```

Crée le fichier `.env.local` avec ce contenu exact :

```
NEXT_PUBLIC_SUPABASE_URL=https://nalszlyqekumoqqkfami.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REMPLACER_PAR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=REMPLACER_PAR_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=https://gesthorest.vercel.app
CINETPAY_API_KEY=PLACEHOLDER_A_RENSEIGNER
CINETPAY_SITE_ID=PLACEHOLDER_A_RENSEIGNER
CINETPAY_WEBHOOK_SECRET=PLACEHOLDER_A_RENSEIGNER
RESEND_API_KEY=PLACEHOLDER_A_RENSEIGNER
```

Configure `tailwind.config.ts` pour intégrer les couleurs Gesthorest :

```typescript
// Dans le theme.extend.colors :
gesthorest: {
  primary: '#1B2A4A',
  accent: '#F5821F',
  'accent-hover': '#E67E22',
  light: '#F8F9FC',
  text: '#2D3748',
  'text-light': '#6B7280',
}
```

Ajoute dans `globals.css` l'import Google Fonts Poppins + Inter et les classes utilitaires de base.

Configure `next.config.js` pour autoriser les images depuis `images.unsplash.com` et `nalszlyqekumoqqkfami.supabase.co`.

Crée le client Supabase dans `src/lib/supabase/client.ts` et `src/lib/supabase/server.ts` avec le schéma `web_gesthorest`.

**→ Demande-moi validation avant de continuer.**

---

## ÉTAPE 2 — LAYOUT GLOBAL

Crée le layout principal `src/app/layout.tsx` avec :
- Import fonts Poppins + Inter
- Metadata complète (title, description, og:image, favicon)
- Wrapper `<html lang="fr">`

Crée la **Navbar** (`src/components/layout/Navbar.tsx`) :
- Fond blanc en haut de page, fond `#1B2A4A` au scroll (transition smooth)
- Logo texte : "**Gesthorest**" en Poppins bold `#1B2A4A` + sous-titre "International" en orange
- Menu desktop : Accueil | À propos | Formations | Sur mesure | Recrutement | Événements | Actualités | Contact
- Bouton CTA "Espace apprenant" (outline orange) à droite
- Menu burger mobile avec drawer latéral
- Lien actif souligné en orange

Crée le **Footer** (`src/components/layout/Footer.tsx`) :
- Fond `#1B2A4A`, texte blanc
- 4 colonnes : Logo + mission | Formations (liens catalogue) | Contact (adresses Abidjan + Paris, emails, tels) | Certifications (badges FDFP + ISO)
- Barre bottom : copyright + réseaux sociaux
- Responsive 1 colonne sur mobile

**→ Demande-moi validation avant de continuer.**

---

## ÉTAPE 3 — PAGE ACCUEIL

Crée `src/app/page.tsx` avec ces sections dans l'ordre :

### Section HERO
- Fond dégradé `#1B2A4A` → `#243752`
- Colonne gauche : Badge "Agréé FDFP · ISO 9001:2015" | H1 "Former aujourd'hui,**réussir demain**" (accent orange sur 2ème ligne) | Sous-titre mission | Double CTA : "Voir nos formations" (bouton orange) + "Nous contacter" (bouton outline blanc)
- Colonne droite : image hero laptop/bureau professionnel (Unsplash placeholder) avec overlay subtil
- Particules ou formes géométriques légères en fond pour donner de la profondeur (pas d'animation excessive)

### Section CHIFFRES CLÉS
- Fond blanc
- 4 compteurs animés au scroll (Intersection Observer) :
  - 12+ ans d'expérience
  - 3 500+ apprenants formés
  - 94% de satisfaction
  - 2 pays de présence
- Chaque compteur : grand chiffre orange, label marine

### Section SERVICES (6 cartes)
- Titre de section : "Nos expertises"
- Grille 3×2 desktop, 1 col mobile
- Cartes avec icône lucide-react, titre, description courte, lien "En savoir plus"
- Cartes : Formations Premium | Accompagnement sur mesure | Recrutement & RH | Événements & Masterclass | Offres Internationales | Espace Apprenant
- Hover : bordure orange gauche + légère élévation

### Section DOMAINES DE FORMATION
- Fond `#F8F9FC`
- Titre : "Nos domaines d'expertise"
- Chips/badges cliquables : Management | Ressources Humaines | Finance & Comptabilité | Bureautique & Digital | Qualité & Process | Leadership | Communication | Sécurité au Travail
- Chaque chip : clic → filtre sur /catalogue

### Section TÉMOIGNAGES
- Fond blanc
- 3 cartes témoignages (données fictives réalistes — DRH, Directeurs, Managers ivoiriens)
- Photo avatar placeholder, nom, entreprise, texte, 5 étoiles orange
- Carousel sur mobile

### Section CERTIFICATIONS & CONFIANCE
- Fond `#1B2A4A`
- Bandeau : "Votre partenaire certifié et agréé"
- Badges FDFP + ISO 9001:2015 + "12 ans d'expertise" + "Présence Afrique-Europe"

### Section CTA FINAL
- Fond orange `#F5821F`
- Texte blanc : "Prêt à transformer vos équipes ?"
- Bouton blanc → /contact

**→ Demande-moi validation avant de continuer.**

---

## ÉTAPE 4 — PAGE CATALOGUE + FICHE FORMATION

### Page Catalogue `/catalogue`

Crée `src/app/catalogue/page.tsx` :

- Header de page : fond marine, titre "Catalogue des formations", breadcrumb
- Barre de filtres sticky :
  - Domaine (select) : tous les domaines
  - Format (radio) : Tous | Présentiel | Distanciel | Blended
  - Durée (select) : Toutes | 1-2 jours | 3-5 jours | 1 semaine+
  - Bouton "Réinitialiser"
- Grille de cartes (3 col desktop, 2 tablette, 1 mobile)
- Chaque carte :
  - Badge domaine (couleur par domaine)
  - Titre formation
  - Format + Durée + Prochaine session
  - Prix (ex: "150 000 FCFA") ou "Nous contacter"
  - CTA "Voir la formation" → /catalogue/[slug]
- Données issues de Supabase table `formations` schéma `web_gesthorest`
- Si table vide : afficher 6 cartes de seed fictives hardcodées en attendant

### Page Fiche Formation `/catalogue/[slug]`

Crée `src/app/catalogue/[slug]/page.tsx` :

**Layout 70/30 :**

Bloc gauche (70%) :
- Breadcrumb : Accueil > Catalogue > [Titre]
- Badge domaine + badge format
- Titre H1
- Description complète
- Accordéon "Programme" par module
- Liste "Objectifs pédagogiques"
- "Public cible & prérequis"
- Carte formateur (photo placeholder, nom, titre)

Bloc droit (30%) sticky :
- Card blanche avec ombre
- Prix TTC en grand (orange)
- Durée | Format | Lieu
- Prochaine session (date) + places restantes
- Séparateur
- **Bouton 1 :** "S'inscrire & payer en ligne" (orange plein) → modal CinetPay (placeholder — affiche message "Paiement en ligne bientôt disponible" si clés non configurées)
- **Bouton 2 :** "Réserver — Payer au cabinet" (outline marine) → modal formulaire

**Modal réservation (Payer au cabinet) :**
- Champs : Nom*, Prénom*, Email*, Téléphone*, Entreprise, Session choisie (select dates disponibles)
- Validation zod
- Soumission → route API `/api/reservations/creer` :
  - Insère dans table `inscriptions` avec statut `en_attente`
  - Génère numéro bon : `BC-YYYYMMDD-XXXX`
  - Génère PDF bon de commande (pdf-lib) avec : logo textuel Gesthorest, détails formation, N° bon, montant, coordonnées cabinet
  - Envoie email apprenant (Resend — placeholder si clé absente : log console)
  - Envoie notification email admin
- Toast succès : "Votre réservation est confirmée ! Vous recevrez votre bon de commande par email."

**→ Demande-moi validation avant de continuer.**

---

## ÉTAPE 5 — PAGES STATIQUES

### Page À Propos `/a-propos`
- Header marine avec titre + breadcrumb
- Section Histoire : texte enrichi sur Gesthorest (contenu fictif réaliste)
- Section Mission / Vision / Valeurs : 3 blocs avec icônes lucide-react
- Section Équipe : 4 cartes (Directeur Général, Responsable Formation, Consultante RH, Chargée Relations Internationales) — données fictives avec photos Unsplash
- Section Certifications : logos/badges FDFP + ISO + présentation des agréments
- Section Implantations : carte stylisée Abidjan + Paris avec coordonnées

### Page Sur Mesure `/sur-mesure`
- Hero section avec titre "Formations sur mesure pour vos équipes"
- Pitch de l'offre intra-entreprise
- Les 4 étapes du processus (icônes + texte) : Diagnostic → Conception → Déploiement → Évaluation
- Avantages (grille 3 col)
- **Formulaire de demande intra :**
  - Entreprise*, Secteur d'activité*, Effectif à former*, Thématique souhaitée*, Délai souhaité, Message
  - Validation zod
  - Route API `/api/sur-mesure/demande` → email admin (log console si Resend non configuré)
  - Confirmation toast

### Page Recrutement `/recrutement`
- Hero : "Trouvez les talents qui font la différence"
- Services RH : Sourcing & Chasse de têtes | Évaluation & Assessment | Conseil RH | Outplacement
- Processus de recrutement (timeline visuelle : 5 étapes)
- Formulaire "Déposer un besoin" : Entreprise, Poste, Profil recherché, Délai, Budget (optionnel), Message
- CTA → /candidats pour les candidats

### Page Espace Candidat `/candidats`
- Hero : "Rejoignez les meilleures équipes en Afrique et en Europe"
- Formulaire dépôt CV :
  - Nom*, Prénom*, Email*, Téléphone*, Poste souhaité*, Secteur, Message de motivation
  - Upload CV (PDF — stocké dans Supabase Storage bucket `candidatures`)
  - Route API `/api/candidatures/deposer` → insertion table `candidatures` + email admin
  - Confirmation toast

### Page Offres Internationales `/international`
- Hero : "Une expertise qui traverse les frontières"
- Présentation ancrage Afrique-Europe (carte stylisée)
- Types de missions : Formations inter-pays | Programmes diaspora | Missions bailleurs de fonds | Partenariats institutionnels
- Zones géographiques : Afrique de l'Ouest | Afrique Centrale | Europe (France)
- Formulaire contact spécifique : Pays, Organisation, Type de mission, Description du besoin

### Page Événements `/evenements`
- Liste des prochains événements (données seed fictives : 3 événements)
- Chaque événement : date, lieu, thème, places, prix, bouton inscription
- Archive événements passés (accordéon)

### Page Actualités `/actualites`
- Grille d'articles (données seed fictives : 6 articles)
- Filtres par catégorie : Tendances RH | Témoignages | Actualités cabinet | Conseils formation
- Page article individuel `/actualites/[slug]`

### Page Contact `/contact`
- Layout 2 colonnes
- Formulaire : Objet (Formation | Sur mesure | Recrutement | Partenariat | Autre), Nom, Prénom, Email, Téléphone, Entreprise, Message
- Colonne droite : coordonnées complètes Abidjan + Paris, emails, téléphones
- Embed Google Maps (placeholder iframe Abidjan)
- Route API `/api/contact` → email admin + auto-réponse apprenant

**→ Demande-moi validation avant de continuer.**

---

## ÉTAPE 6 — ESPACE APPRENANT

### Auth Supabase

Crée les pages :
- `/espace-apprenant` → redirect vers `/espace-apprenant/connexion` si non connecté
- `/espace-apprenant/connexion` → formulaire email + mot de passe (Supabase Auth)
- `/espace-apprenant/inscription` → formulaire complet nouvel apprenant

Middleware Next.js (`src/middleware.ts`) pour protéger toutes les routes `/espace-apprenant/*` sauf `/connexion` et `/inscription`.

### Dashboard apprenant `/espace-apprenant/dashboard`

Sections :
- **Mes formations** : liste des inscriptions confirmées (statut, date session, formateur)
- **Mes réservations en attente** : liste avec statut "En attente de paiement au cabinet" + rappel coordonnées cabinet
- **Mes supports** : liste des PDFs téléchargeables par formation (depuis Supabase Storage)
- **Mes attestations** : bouton "Télécharger mon attestation" (généré dynamiquement en PDF avec pdf-lib : logo Gesthorest, nom apprenant, formation, date, signature du directeur)
- **Mes évaluations** : formulaire satisfaction (note 1-5 étoiles + commentaire) pour chaque formation terminée
- **Mon profil** : édition nom, prénom, téléphone, entreprise, mot de passe

**→ Demande-moi validation avant de continuer.**

---

## ÉTAPE 7 — BACK-OFFICE ADMIN

Route protégée `/admin` — accès uniquement si `role = 'admin'` dans table `apprenants`.

### Dashboard KPI `/admin`

Cartes métriques :
- CA du mois (paiements CinetPay confirmés)
- CA en attente (réservations paiement cabinet)
- Inscrits confirmés (30 derniers jours)
- Réservations en attente (badge rouge si > 5)
- Taux remplissage moyen des sessions ouvertes
- Taux conversion réservation → paiement
- Nouveaux apprenants ce mois

Graphiques (recharts ou simple CSS) :
- Courbe inscriptions sur 12 mois
- Répartition par domaine de formation (donut)
- Top 5 formations les plus commandées

### Gestion des formations `/admin/formations`
- Table avec colonnes : Titre | Domaine | Format | Prix | Statut | Sessions | Actions
- Bouton "Nouvelle formation" → formulaire complet (tous champs + gestion des sessions)
- Actions par ligne : Modifier | Archiver | Voir les inscrits
- Gestion sessions : dates, lieu, places total, formateur

### Gestion des inscriptions `/admin/inscriptions`

**File 1 — Confirmées :**
Colonnes : Nom apprenant | Formation | Session | Montant | Date | Mode paiement | Actions
Actions : Envoyer convocation | Générer attestation PDF | Voir détail

**File 2 — En attente (paiement au cabinet) :**
Colonnes : Nom | Formation | Session | Montant | N° Bon | Date réservation | Actions
Actions : ✅ Confirmer (→ file 1) | 📧 Relancer email | ❌ Annuler
Badge rouge animé si réservation > 48h sans action

### Gestion des utilisateurs `/admin/utilisateurs`
- Table : Nom | Email | Téléphone | Entreprise | Formations suivies | Rôle | Date inscription
- Fiche apprenant : historique complet, attestations générées, évaluations données
- Modifier rôle (admin / formateur / apprenant)
- Créer apprenant manuellement (inscription off-line)

### Gestion des contenus `/admin/contenus`
- **Articles** : liste + éditeur (titre, contenu textarea riche, image URL, catégorie, statut publié/brouillon)
- **Événements** : liste + formulaire CRUD
- **Témoignages** : liste + formulaire CRUD (nom, entreprise, texte, note, visible)
- **Équipe** : liste + formulaire CRUD (nom, titre, bio, photo URL, ordre)

### Gestion des candidatures `/admin/candidatures`
- Table : Nom | Email | Poste souhaité | Date | CV (lien) | Statut
- Actions : Marquer "En cours d'examen" | "Retenu" | "Non retenu" | Voir CV

### Paramètres `/admin/parametres`
- Informations du cabinet (modifiables sans redéploiement → table `settings`)
- Gestion comptes admin

**→ Demande-moi validation avant de continuer.**

---

## ÉTAPE 8 — FICHIERS SQL SUPABASE

Génère un fichier `supabase/schema_web_gesthorest.sql` complet avec :

```sql
-- Créer le schéma
CREATE SCHEMA IF NOT EXISTS web_gesthorest;

-- Grants
GRANT USAGE ON SCHEMA web_gesthorest TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA web_gesthorest TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA web_gesthorest TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA web_gesthorest GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA web_gesthorest GRANT SELECT ON TABLES TO anon, authenticated;
```

Tables à créer dans `web_gesthorest` :

**formations** : id, slug, titre, domaine, format, duree, description, programme (jsonb), objectifs (jsonb), public_cible, prerequis, prix, devise (défaut 'FCFA'), statut (publiee/brouillon/archivee), created_at, updated_at

**sessions** : id, formation_id (FK), date_debut, date_fin, lieu, places_total, places_restantes, formateur_id (FK), statut, created_at

**inscriptions** : id, session_id (FK), apprenant_id (FK), type_paiement (en_ligne/cabinet), statut (en_attente/confirme/annule), montant, devise, reference_cinetpay, numero_bon, created_at, confirmed_at

**apprenants** : id, user_id (FK auth.users), nom, prenom, email, telephone, entreprise, role (admin/formateur/apprenant défaut), created_at

**formateurs** : id, nom, prenom, titre, bio, photo_url, email

**evaluations** : id, inscription_id (FK), note (1-5), commentaire, created_at

**evenements** : id, titre, description, date_evenement, lieu, places, prix, devise, statut, created_at

**articles** : id, slug UNIQUE, titre, contenu, image_url, categorie, statut (publie/brouillon), created_at

**candidatures** : id, nom, prenom, email, telephone, poste_souhaite, secteur, message, cv_url, statut (recu/en_examen/retenu/non_retenu), created_at

**equipe** : id, nom, prenom, titre, bio, photo_url, linkedin_url, ordre

**temoignages** : id, nom, entreprise, texte, note (1-5), photo_url, visible (boolean défaut true), created_at

**settings** : id, cle text UNIQUE, valeur text, updated_at

**sur_mesure_demandes** : id, entreprise, secteur, effectif, thematique, delai, message, email, telephone, statut, created_at

**contact_messages** : id, objet, nom, prenom, email, telephone, entreprise, message, lu (boolean), created_at

Ajoute les **RLS policies** :
- `apprenants` : lecture propre profil (auth.uid() = user_id)
- `inscriptions` : lecture propres inscriptions
- `evaluations` : insertion/lecture propres évaluations
- `formations`, `sessions`, `articles`, `evenements`, `equipe`, `temoignages`, `settings` : lecture publique (anon)
- `candidatures`, `sur_mesure_demandes`, `contact_messages` : insertion publique, lecture service_role uniquement

Ajoute les **données seed** :
- 3 formations fictives (Management, RH, Finance) avec 2 sessions chacune
- 3 articles fictifs
- 2 événements fictifs
- 4 membres équipe fictifs
- 3 témoignages fictifs
- Settings de base : nom_cabinet, slogan, email_contact, tel_1, tel_2, adresse_1, adresse_2

**→ Ce fichier SQL sera fourni à MACL pour exécution manuelle dans Supabase.**

---

## ÉTAPE 9 — PWA

Crée `public/manifest.json` :
```json
{
  "name": "Gesthorest International",
  "short_name": "Gesthorest",
  "theme_color": "#1B2A4A",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

Ajoute les meta PWA dans le layout.

---

## ÉTAPE 10 — GITHUB + VERCEL

### GitHub

```powershell
git init ; git add . ; git commit -m "feat: init Gesthorest International - full stack Next.js 14"
```

Crée le repo via GitHub CLI :
```powershell
gh repo create maclsocialnetwork-cloud/gesthorest --public --source=. --remote=origin --push
```

Si `gh` non disponible, donne les commandes `git remote add` + `git push` manuellement.

### Vercel

```powershell
npx vercel --prod --yes
```

Configure les variables d'environnement Vercel :
```powershell
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
npx vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel env add CINETPAY_API_KEY production
npx vercel env add CINETPAY_SITE_ID production
npx vercel env add CINETPAY_WEBHOOK_SECRET production
npx vercel env add RESEND_API_KEY production
```

Lance un build final :
```powershell
npx vercel --prod
```

---

## ÉTAPE 11 — LIVRAISON FINALE

À la fin de tout le déploiement, génère et affiche :

1. **URL Vercel** du site déployé
2. **URL GitHub** du repo
3. **Le fichier SQL complet** `supabase/schema_web_gesthorest.sql` à copier-coller dans Supabase SQL Editor (projet APOHIGHTECH)
4. **Checklist finale** : variables d'environnement à renseigner (CinetPay, Resend), logo à ajouter, domaine personnalisé à connecter

---

## DÉMARRAGE

Lance l'**Étape 1** maintenant et demande-moi validation avant de passer à l'Étape 2.
