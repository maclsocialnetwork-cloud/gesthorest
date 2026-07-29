import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type BonCommandeData = {
  numeroBon: string;
  formationTitre: string;
  sessionDate: string;
  sessionLieu: string;
  montant: number | null;
  devise: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise?: string;
};

const NAVY = rgb(0x1b / 255, 0x2a / 255, 0x4a / 255);
const ORANGE = rgb(0xf5 / 255, 0x82 / 255, 0x1f / 255);
const TEXT = rgb(0x2d / 255, 0x37 / 255, 0x48 / 255);

export async function generateBonCommandePdf(data: BonCommandeData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  let y = height - 60;

  page.drawText("Gesthorest", {
    x: 50,
    y,
    size: 26,
    font: bold,
    color: NAVY,
  });
  page.drawText("International", {
    x: 50 + bold.widthOfTextAtSize("Gesthorest ", 26),
    y,
    size: 14,
    font: bold,
    color: ORANGE,
  });

  y -= 20;
  page.drawText("Training & Recruitment", { x: 50, y, size: 10, font: regular, color: TEXT });

  y -= 50;
  page.drawText("BON DE COMMANDE", { x: 50, y, size: 18, font: bold, color: NAVY });

  y -= 30;
  page.drawText(`N° de bon : ${data.numeroBon}`, { x: 50, y, size: 11, font: bold, color: TEXT });

  y -= 40;
  const lines: [string, string][] = [
    ["Formation", data.formationTitre],
    ["Session", `${data.sessionDate} — ${data.sessionLieu}`],
    ["Montant", data.montant !== null ? `${data.montant.toLocaleString("fr-FR")} ${data.devise}` : "Sur devis"],
    ["Apprenant", `${data.prenom} ${data.nom}`],
    ["Email", data.email],
    ["Téléphone", data.telephone],
    ...(data.entreprise ? ([["Entreprise", data.entreprise]] as [string, string][]) : []),
  ];

  for (const [label, value] of lines) {
    page.drawText(`${label} :`, { x: 50, y, size: 11, font: bold, color: NAVY });
    page.drawText(value, { x: 180, y, size: 11, font: regular, color: TEXT });
    y -= 22;
  }

  y -= 20;
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  });

  y -= 30;
  page.drawText("Coordonnées du cabinet", { x: 50, y, size: 12, font: bold, color: NAVY });
  y -= 18;
  const coordonnees = [
    "Abidjan — Côte d'Ivoire · Paris — France",
    "contact@gesthorest.com",
    "+225 07 47 12 33 21 · +33 6 71 97 11 59",
  ];
  for (const line of coordonnees) {
    page.drawText(line, { x: 50, y, size: 10, font: regular, color: TEXT });
    y -= 16;
  }

  page.drawText("Agréé FDFP · Certifié ISO 9001:2015", {
    x: 50,
    y: 40,
    size: 9,
    font: regular,
    color: rgb(0.6, 0.6, 0.6),
  });

  return pdfDoc.save();
}
