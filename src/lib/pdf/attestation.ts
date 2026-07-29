import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type AttestationData = {
  nom: string;
  prenom: string;
  formationTitre: string;
  dateDebut: string;
  dateFin: string;
  duree: string;
};

const NAVY = rgb(0x1b / 255, 0x2a / 255, 0x4a / 255);
const ORANGE = rgb(0xf5 / 255, 0x82 / 255, 0x1f / 255);
const TEXT = rgb(0x2d / 255, 0x37 / 255, 0x48 / 255);
const LIGHT_GRAY = rgb(0.6, 0.6, 0.6);

export async function generateAttestationPdf(data: AttestationData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const { width, height } = page.getSize();
  let y = height - 60;

  // Border decorative
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: NAVY,
    borderWidth: 2,
  });

  page.drawRectangle({
    x: 35,
    y: 35,
    width: width - 70,
    height: height - 70,
    borderColor: ORANGE,
    borderWidth: 0.5,
  });

  // Logo
  const logoText = "Gesthorest";
  const logoWidth = bold.widthOfTextAtSize(logoText, 28);
  page.drawText(logoText, {
    x: (width - logoWidth) / 2 - 40,
    y,
    size: 28,
    font: bold,
    color: NAVY,
  });
  page.drawText("International", {
    x: (width - logoWidth) / 2 + logoWidth - 30,
    y,
    size: 14,
    font: bold,
    color: ORANGE,
  });

  y -= 22;
  const subtitleText = "Training & Recruitment";
  const subtitleWidth = regular.widthOfTextAtSize(subtitleText, 10);
  page.drawText(subtitleText, {
    x: (width - subtitleWidth) / 2,
    y,
    size: 10,
    font: regular,
    color: TEXT,
  });

  // Decorative line
  y -= 30;
  page.drawLine({
    start: { x: 100, y },
    end: { x: width - 100, y },
    thickness: 2,
    color: ORANGE,
  });

  // Title
  y -= 50;
  const title = "ATTESTATION DE FORMATION";
  const titleWidth = bold.widthOfTextAtSize(title, 22);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y,
    size: 22,
    font: bold,
    color: NAVY,
  });

  // Body text
  y -= 60;
  const certifyText = "Nous soussignés, Gesthorest International, certifions que :";
  page.drawText(certifyText, {
    x: 70,
    y,
    size: 12,
    font: regular,
    color: TEXT,
  });

  y -= 50;
  const fullName = `${data.prenom} ${data.nom}`;
  const nameWidth = bold.widthOfTextAtSize(fullName, 18);
  page.drawText(fullName, {
    x: (width - nameWidth) / 2,
    y,
    size: 18,
    font: bold,
    color: NAVY,
  });

  y -= 40;
  const followedText = "a suivi avec succès la formation :";
  const followedWidth = regular.widthOfTextAtSize(followedText, 12);
  page.drawText(followedText, {
    x: (width - followedWidth) / 2,
    y,
    size: 12,
    font: regular,
    color: TEXT,
  });

  y -= 35;
  const formationWidth = bold.widthOfTextAtSize(data.formationTitre, 16);
  page.drawText(data.formationTitre, {
    x: (width - Math.min(formationWidth, width - 140)) / 2,
    y,
    size: 16,
    font: bold,
    color: ORANGE,
  });

  y -= 50;
  const details: [string, string][] = [
    ["Durée", data.duree],
    ["Période", `du ${data.dateDebut} au ${data.dateFin}`],
  ];

  for (const [label, value] of details) {
    const detailLine = `${label} : ${value}`;
    const detailWidth = regular.widthOfTextAtSize(detailLine, 12);
    page.drawText(detailLine, {
      x: (width - detailWidth) / 2,
      y,
      size: 12,
      font: regular,
      color: TEXT,
    });
    y -= 24;
  }

  // Decorative line
  y -= 20;
  page.drawLine({
    start: { x: 150, y },
    end: { x: width - 150, y },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  });

  // Signature
  y -= 50;
  const dateText = `Fait à Abidjan, le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
  page.drawText(dateText, {
    x: width - 70 - regular.widthOfTextAtSize(dateText, 11),
    y,
    size: 11,
    font: regular,
    color: TEXT,
  });

  y -= 30;
  const signatureLabel = "Le Directeur Général";
  page.drawText(signatureLabel, {
    x: width - 70 - bold.widthOfTextAtSize(signatureLabel, 11),
    y,
    size: 11,
    font: bold,
    color: NAVY,
  });

  y -= 20;
  const signatureName = "Gesthorest International";
  page.drawText(signatureName, {
    x: width - 70 - italic.widthOfTextAtSize(signatureName, 10),
    y,
    size: 10,
    font: italic,
    color: LIGHT_GRAY,
  });

  // Footer
  page.drawText("Agréé FDFP · Certifié ISO 9001:2015", {
    x: 70,
    y: 55,
    size: 9,
    font: regular,
    color: LIGHT_GRAY,
  });

  const contact = "contact@gesthorest.com · +225 07 47 12 33 21";
  page.drawText(contact, {
    x: width - 70 - regular.widthOfTextAtSize(contact, 9),
    y: 55,
    size: 9,
    font: regular,
    color: LIGHT_GRAY,
  });

  return pdfDoc.save();
}
