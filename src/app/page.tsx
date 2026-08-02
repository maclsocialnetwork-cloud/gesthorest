import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/home/Hero'
import StatsCounter, { type StatRow } from '@/components/home/StatsCounter'
import WhyUs, { type AvantageRow } from '@/components/home/WhyUs'
import Services, { type ServiceRow } from '@/components/home/Services'
import DomainsChips, { type DomaineRow } from '@/components/home/DomainsChips'
import ClientsCarousel, { type ClientRow } from '@/components/home/ClientsCarousel'
import GallerySection, { type GalerieRow } from '@/components/home/GallerySection'
import Testimonials, { type TemoignageRow } from '@/components/home/Testimonials'
import Newsletter from '@/components/ui/Newsletter'
import TrustBanner, { type CertificationRow } from '@/components/home/TrustBanner'
import FinalCta from '@/components/home/FinalCta'

const FB_STATS: StatRow[] = [
  { type: 'badge', valeur: null, suffixe: null, libelle: 'Agréé FDFP', sous_texte: 'Fonds pour le Développement de la Formation Professionnelle', prefixe: null, icone: 'ShieldCheck' },
  { type: 'counter', valeur: 50, suffixe: '+', libelle: 'formations au catalogue', sous_texte: null, prefixe: null, icone: null },
  { type: 'counter', valeur: 200, suffixe: '+', libelle: 'entreprises accompagnées', sous_texte: null, prefixe: null, icone: null },
  { type: 'counter', valeur: 3500, suffixe: '+', libelle: 'apprenants formés', sous_texte: null, prefixe: null, icone: null },
  { type: 'counter', valeur: 94, suffixe: '%', libelle: 'de satisfaction client', sous_texte: null, prefixe: null, icone: null },
  { type: 'text', valeur: null, suffixe: null, libelle: "en Côte d'Ivoire", sous_texte: 'et en Europe', prefixe: 'Partout', icone: null },
]
const FB_CLIENTS: ClientRow[] = [
  { nom: 'Ecobank CI', rangee: 1 }, { nom: 'Orange CI', rangee: 1 }, { nom: 'MTN CI', rangee: 1 },
  { nom: 'Nestlé CI', rangee: 1 }, { nom: 'TotalEnergies CI', rangee: 1 }, { nom: 'Société Générale CI', rangee: 1 },
  { nom: 'SODECI', rangee: 1 }, { nom: 'CIE', rangee: 1 }, { nom: 'Bolloré Africa', rangee: 1 }, { nom: 'SIB', rangee: 1 },
  { nom: 'CFAO Motors', rangee: 2 }, { nom: 'SIFCA', rangee: 2 }, { nom: "Air Côte d'Ivoire", rangee: 2 },
  { nom: 'Moov Africa', rangee: 2 }, { nom: 'BIAO-CI', rangee: 2 }, { nom: 'NSIA Banque', rangee: 2 },
  { nom: 'Coris Bank CI', rangee: 2 }, { nom: 'CANAL+ Afrique', rangee: 2 }, { nom: 'BNETD', rangee: 2 }, { nom: 'Afrique Télécom', rangee: 2 },
]
const FB_GALERIE: GalerieRow[] = [
  { photo_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', titre: 'Formation professionnelle en Afrique' },
  { photo_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80', titre: 'Salle de réunion professionnelle' },
  { photo_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', titre: 'Équipe africaine en formation' },
  { photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', titre: 'Formatrice africaine en présentation' },
  { photo_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', titre: 'Salle de formation moderne' },
  { photo_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80', titre: 'Atelier de formation groupe' },
]
const FB_TEMOIGNAGES: TemoignageRow[] = [
  { nom: 'Aïcha Kouamé', poste: 'Directrice RH', entreprise: 'Groupe Ivoire Distribution', photo_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200&q=80', texte: "Une formation très pratique qui a permis à nos managers d'améliorer leur performance opérationnelle en 3 mois. Le suivi post-formation est vraiment appréciable.", note: 5 },
  { nom: 'Kouassi Adjoua', poste: 'Directeur Général', entreprise: 'Sud Finance SA', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80', texte: 'Gesthorest a su monter un dossier FDFP impeccable pour nous. Nos équipes ont été formées sans débourser un centime de notre trésorerie. Très professionnel.', note: 5 },
  { nom: 'Fatou Diabaté', poste: 'Manager RH', entreprise: 'Atlantique Industries', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80', texte: "Le programme sur mesure conçu pour nos équipes commerciales a dépassé nos attentes. Un retour sur investissement concret et mesurable dès les premières semaines.", note: 5 },
]
const FB_AVANTAGES: AvantageRow[] = [
  { icone: 'Target', titre: 'Accompagnement personnalisé', description: 'Chaque entreprise est unique. Nous adaptons nos formations à vos réalités terrain et à vos objectifs spécifiques.' },
  { icone: 'Users', titre: 'Formateurs experts certifiés', description: 'Tous nos formateurs sont des praticiens expérimentés avec des certifications reconnues dans leur domaine.' },
  { icone: 'FileText', titre: 'Programmes adaptés à vos besoins', description: "Nos programmes sont co-construits avec vous pour garantir la pertinence et l'efficacité de la formation." },
  { icone: 'Banknote', titre: 'Accompagnement FDFP complet', description: 'Nous gérons pour vous le montage et le suivi de vos dossiers FDFP, de A à Z, sans frais supplémentaires.' },
  { icone: 'Trophy', titre: 'Formations orientées résultats', description: 'Des formations pratiques avec des mises en situation réelles pour garantir un transfert de compétences immédiat.' },
  { icone: 'RefreshCw', titre: 'Suivi après formation', description: "Notre accompagnement ne s'arrête pas à la fin de la session. Nous assurons un suivi post-formation personnalisé." },
]
const FB_SERVICES: ServiceRow[] = [
  { icone: 'GraduationCap', titre: 'Formations Premium', description: 'Un catalogue riche de formations professionnelles animées par des experts reconnus.', lien: '/catalogue' },
  { icone: 'UserCog', titre: 'Accompagnement sur mesure', description: 'Des programmes intra-entreprise conçus selon vos besoins et objectifs spécifiques.', lien: '/sur-mesure' },
  { icone: 'Briefcase', titre: 'Recrutement & RH', description: 'Sourcing, évaluation et conseil RH pour attirer et fidéliser les meilleurs talents.', lien: '/recrutement' },
  { icone: 'CalendarDays', titre: 'Événements & Masterclass', description: 'Des rencontres et masterclass animées par des experts pour enrichir vos compétences.', lien: '/evenements' },
  { icone: 'Globe2', titre: 'Offres Internationales', description: "Une expertise qui traverse les frontières entre l'Afrique de l'Ouest et l'Europe.", lien: '/international' },
  { icone: 'LayoutDashboard', titre: 'Espace Apprenant', description: 'Suivez vos formations, téléchargez vos attestations et supports en un seul endroit.', lien: '/espace-apprenant' },
]
const FB_DOMAINES: DomaineRow[] = [
  { libelle: 'Management', slug: 'management' }, { libelle: 'Ressources Humaines', slug: 'ressources-humaines' },
  { libelle: 'Finance & Comptabilité', slug: 'finance-comptabilite' }, { libelle: 'Bureautique & Digital', slug: 'bureautique-digital' },
  { libelle: 'Qualité & Process', slug: 'qualite-process' }, { libelle: 'Leadership', slug: 'leadership' },
  { libelle: 'Communication', slug: 'communication' }, { libelle: 'Sécurité au Travail', slug: 'securite-travail' },
]
const FB_CERTIFICATIONS: CertificationRow[] = [
  { nom: 'Agréé FDFP', icone: 'ShieldCheck' }, { nom: 'Certifié ISO 9001:2015', icone: 'Award' },
  { nom: "12 ans d'expertise", icone: 'Clock' }, { nom: 'Présence Afrique-Europe', icone: 'Globe2' },
]

async function getHomeData() {
  try {
    const supabase = createClient()
    const [statsR, clientsR, galerieR, temR, avR, servR, domR, certR] = await Promise.all([
      supabase.from('chiffres_cles').select('type, valeur, suffixe, libelle, sous_texte, prefixe, icone').eq('visible', true).order('ordre'),
      supabase.from('clients').select('nom, rangee').eq('visible', true).order('ordre'),
      supabase.from('galerie').select('photo_url, titre').eq('visible', true).order('ordre'),
      supabase.from('temoignages').select('nom, poste, entreprise, photo_url, texte, note').eq('visible', true).order('ordre'),
      supabase.from('avantages').select('icone, titre, description').eq('visible', true).order('ordre'),
      supabase.from('services').select('icone, titre, description, lien').eq('visible', true).order('ordre'),
      supabase.from('domaines').select('libelle, slug').eq('visible', true).order('ordre'),
      supabase.from('certifications').select('nom, icone').eq('visible', true).order('ordre'),
    ])
    return {
      stats: statsR.data?.length ? statsR.data : FB_STATS,
      clients: clientsR.data?.length ? clientsR.data : FB_CLIENTS,
      galerie: galerieR.data?.length ? galerieR.data : FB_GALERIE,
      temoignages: temR.data?.length ? temR.data : FB_TEMOIGNAGES,
      avantages: avR.data?.length ? avR.data : FB_AVANTAGES,
      services: servR.data?.length ? servR.data : FB_SERVICES,
      domaines: domR.data?.length ? domR.data : FB_DOMAINES,
      certifications: certR.data?.length ? certR.data : FB_CERTIFICATIONS,
    }
  } catch {
    return {
      stats: FB_STATS, clients: FB_CLIENTS, galerie: FB_GALERIE, temoignages: FB_TEMOIGNAGES,
      avantages: FB_AVANTAGES, services: FB_SERVICES, domaines: FB_DOMAINES, certifications: FB_CERTIFICATIONS,
    }
  }
}

export default async function Home() {
  const data = await getHomeData()

  return (
    <>
      <Hero />
      <StatsCounter stats={data.stats} />
      <WhyUs avantages={data.avantages} />
      <Services services={data.services} />
      <DomainsChips domaines={data.domaines} />
      <ClientsCarousel clients={data.clients} />
      <GallerySection photos={data.galerie} />
      <Testimonials testimonials={data.temoignages} />
      <Newsletter />
      <TrustBanner certifications={data.certifications} />
      <FinalCta />
    </>
  )
}
