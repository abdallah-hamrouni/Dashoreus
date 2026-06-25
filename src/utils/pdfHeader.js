import { COLORS, PAGE } from "./pdfTheme";
import {
  addText,
  drawRoundedBox,
  addLabelValue,
  safeText,
  formatDate,
} from "./pdfHelpers";

function cleanValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "-"
  ) {
    return "";
  }

  return String(value).trim();
}

function getPharmacyName(livraison) {
  return (
    livraison.nompharma ||
    livraison.nom_pharmacie ||
    livraison.pharmacie ||
    livraison.nomPharmacie ||
    "Pharmacie Oreus"
  );
}

function getResidenceName(livraison) {
  return (
    livraison.nom_residence ||
    livraison.nomresid ||
    livraison.residence ||
    livraison.etablissement ||
    "-"
  );
}

function getResidenceAddress1(livraison) {
  return cleanValue(
    livraison.adr1resid ||
      livraison.adresse_residence ||
      livraison.adresseResidence ||
      livraison.adresse
  );
}

function getResidenceAddress2(livraison) {
  return cleanValue(
    livraison.adr2resid ||
      livraison.adresse2_residence ||
      livraison.adresse2Residence
  );
}

function getResidencePostalCode(livraison) {
  return cleanValue(
    livraison.cpresid ||
      livraison.cp_residence ||
      livraison.code_postal_residence ||
      livraison.codePostalResidence ||
      livraison.code_postal
  );
}

function getResidenceCity(livraison) {
  return cleanValue(
    livraison.villeresid ||
      livraison.ville_residence ||
      livraison.villeResidence ||
      livraison.ville ||
      livraison.city
  );
}

function getSignatureDate(livraison) {
  return (
    livraison.date_action ||
    livraison.date_signature ||
    livraison.dateSignature ||
    "-"
  );
}

export function addPdfHeader(doc, livraison, profile = {}) {
  const { margin, width } = PAGE;
  const centerX = width / 2;

  const pharmacyName = getPharmacyName(livraison);
  const residenceName = getResidenceName(livraison);
  const signatureDate = getSignatureDate(livraison);

  const residenceAddress1 = getResidenceAddress1(livraison);
  const residenceAddress2 = getResidenceAddress2(livraison);
  const residencePostalCode = getResidencePostalCode(livraison);
  const residenceCity = getResidenceCity(livraison);

  const residencePostalCity = [residencePostalCode, residenceCity]
    .filter(Boolean)
    .join(" ");

  const addressText = cleanValue(profile.address);
  const postalCodeText = cleanValue(profile.postalCode);
  const cityText = cleanValue(profile.city || profile.ville);

  const postalCityText = [postalCodeText, cityText].filter(Boolean).join(" ");

  let y = 14;

  /**
   * Haut du PDF :
   * Nom pharmacie + coordonnées
   */
  addText(doc, pharmacyName, margin, y, {
    size: 14,
    font: "bold",
    color: COLORS.dark,
  });

  if (addressText) {
    const addressLines = doc.splitTextToSize(addressText, 95);

    addText(doc, addressLines, margin, y + 6, {
      size: 8.5,
      font: "bold",
      color: COLORS.dark,
    });

    y += 6 + addressLines.length * 4;
  } else {
    y += 6;
  }

  if (postalCityText) {
    addText(doc, postalCityText, margin, y + 2, {
      size: 8.5,
      font: "bold",
      color: COLORS.dark,
    });

    y += 5;
  }

  y += 5;

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.25);
  doc.line(margin, y, width - margin, y);

  y += 11;

  /**
   * Titre principal
   */
  addText(doc, "Bon de livraison", centerX, y, {
    size: 24,
    font: "bold",
    color: COLORS.dark,
    align: "center",
  });

  y += 13;

  /**
   * Cadre informations livraison
   */
  const infoBoxWidth = 115;

  // Hauteur réduite pour éviter le grand vide
  const infoBoxHeight = 27;

  const infoBoxX = PAGE.margin;
  const infoBoxY = y;

  drawRoundedBox(doc, infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight, {
    fill: COLORS.white,
    border: COLORS.blue,
    radius: 8,
    lineWidth: 0.55,
  });

  const innerPadding = 8;
  const innerWidth = infoBoxWidth - innerPadding * 2;
  const colW = innerWidth / 2;

  const firstX = infoBoxX + innerPadding;
  const secondX = infoBoxX + innerPadding + colW + 25;
  const contentY = infoBoxY + 5;

  /**
   * Nom résidence
   */
  addLabelValue(
    doc,
    "Adresse de livraison",
    safeText(residenceName),
    firstX,
    contentY,
    colW - 4,
    {
      labelSize: 6.5,
      valueSize: 8.8,
      gap: 4.5,
      maxLines: 2,
    }
  );

  /**
   * Date de livraison en police 9
   */
  addLabelValue(
    doc,
    "Date de livraison",
    formatDate(signatureDate),
    secondX,
    contentY,
    colW - 4,
    {
      labelSize: 6.5,
      valueSize: 9,
      gap: 4.5,
      maxLines: 1,
    }
  );

  /**
   * Adresse résidence sous le nom
   */
  let residenceInfoY = contentY + 10.5;

  if (residenceAddress1) {
    const addressLines = doc.splitTextToSize(residenceAddress1, colW + 24);

    addText(doc, addressLines, firstX, residenceInfoY, {
      size: 9,
      font: "bold",
      color: COLORS.dark,
      maxWidth: colW + 24,
    });

    residenceInfoY += addressLines.length * 3.6;
  }

  if (residenceAddress2) {
    const address2Lines = doc.splitTextToSize(residenceAddress2, colW + 24);

    addText(doc, address2Lines, firstX, residenceInfoY, {
      size: 8.5,
      font: "normal",
      color: COLORS.gray,
      maxWidth: colW + 24,
    });

    residenceInfoY += address2Lines.length * 3.4;
  }

  if (residencePostalCity) {
    addText(doc, residencePostalCity, firstX, residenceInfoY, {
      size: 9,
      font: "bold",
      color: COLORS.dark,
      maxWidth: colW + 24,
    });
  }

  // Petit espace après le cadre pour gagner de la place
  return infoBoxY + infoBoxHeight + 3;
}