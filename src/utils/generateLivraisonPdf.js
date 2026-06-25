import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { addPdfHeader } from "./pdfHeader";
import { OREUS_FONT_BASE64 } from "./oreusFontBase64";
import { COLORS, PAGE } from "./pdfTheme";

import {
  addText,
  drawRoundedBox,
  safeText,
  formatDate,
} from "./pdfHelpers";

function getSignatureImage(signatureBase64) {
  if (!signatureBase64) return null;

  if (signatureBase64.startsWith("data:image")) {
    return signatureBase64;
  }

  return `data:image/png;base64,${signatureBase64}`;
}

function registerOreusFont(doc) {
  try {
    doc.addFileToVFS("PLUTOREUS.TTF", OREUS_FONT_BASE64);
    doc.addFont("PLUTOREUS.TTF", "plutoreus", "normal");
  } catch (error) {
    console.warn("Police OREUS non chargée :", error);
  }
}

function isValidComment(value) {
  const text = safeText(value || "").trim();

  return (
    text &&
    text !== "-" &&
    text.toLowerCase() !== "null" &&
    text.toLowerCase() !== "undefined" &&
    text.toLowerCase() !== "aucun commentaire"
  );
}

function getCommentaireForCaisse(commentaires, numcaisse) {
  if (!commentaires || !numcaisse) return "";

  const caisseKey = String(numcaisse).trim();
  const caisseKeyClean = caisseKey.replace(/\s/g, "");

  if (typeof commentaires === "string") {
    try {
      const parsed = JSON.parse(commentaires);
      return getCommentaireForCaisse(parsed, caisseKey);
    } catch {
      return "";
    }
  }

  if (Array.isArray(commentaires)) {
    const found = commentaires.find((item) => {
      const label = safeText(
        item.label ||
          item.caisse ||
          item.numcaisse ||
          item.key ||
          item.name ||
          ""
      );

      const cleanLabel = label.trim();
      const cleanLabelNoSpace = cleanLabel.replace(/\s/g, "");

      return (
        cleanLabel === caisseKey ||
        cleanLabel.includes(caisseKey) ||
        caisseKey.includes(cleanLabel) ||
        cleanLabelNoSpace.includes(caisseKeyClean)
      );
    });

    return safeText(
      found?.value ||
        found?.commentaire ||
        found?.comment ||
        found?.texte ||
        ""
    );
  }

  if (typeof commentaires === "object") {
    const entries = Object.entries(commentaires);

    const exact = entries.find(([key]) => {
      return String(key).trim() === caisseKey;
    });

    if (exact) {
      return safeText(exact[1]);
    }

    const included = entries.find(([key]) => {
      const cleanKey = String(key).trim();
      const cleanKeyNoSpace = cleanKey.replace(/\s/g, "");

      return (
        cleanKey.includes(caisseKey) ||
        caisseKey.includes(cleanKey) ||
        cleanKeyNoSpace.includes(caisseKeyClean)
      );
    });

    if (included) {
      return safeText(included[1]);
    }

    const nested = entries.find(([, value]) => {
      if (!value || typeof value !== "object") return false;

      const possibleCaisse = safeText(
        value.numcaisse ||
          value.caisse ||
          value.label ||
          value.key ||
          ""
      );

      return possibleCaisse === caisseKey || possibleCaisse.includes(caisseKey);
    });

    if (nested) {
      const valueObj = nested[1];

      return safeText(
        valueObj.commentaire ||
          valueObj.comment ||
          valueObj.value ||
          valueObj.texte ||
          ""
      );
    }
  }

  return "";
}

function getCommentaireGlobal(livraison) {
  if (isValidComment(livraison.commentaire_global)) {
    return safeText(livraison.commentaire_global);
  }

  if (livraison.commentaires && typeof livraison.commentaires === "string") {
    try {
      const parsed = JSON.parse(livraison.commentaires);
      return getCommentaireGlobal({
        ...livraison,
        commentaires: parsed,
      });
    } catch {
      return "";
    }
  }

  if (livraison.commentaires && typeof livraison.commentaires === "object") {
    const global =
      livraison.commentaires.commentaire_global ||
      livraison.commentaires.global ||
      livraison.commentaires.commentaireGlobal ||
      "";

    return isValidComment(global) ? safeText(global) : "";
  }

  return "";
}

function normalizeCaisses(livraison) {
  if (Array.isArray(livraison.caisses) && livraison.caisses.length > 0) {
    return livraison.caisses.map((caisse) => {
      const patients = Array.isArray(caisse.patients) ? caisse.patients : [];

      const nombrePatients = Number(
        caisse.nombre_patients || patients.length || 0
      );

      const nombrePiluliers = Number(
        caisse.nombre_piluliers ||
          patients.reduce((sum, patient) => {
            return sum + Number(patient.nbpilulier || 0);
          }, 0)
      );

      const commentaire =
        caisse.commentaire ||
        caisse.commentaire_caisse ||
        caisse.commentaires ||
        getCommentaireForCaisse(livraison.commentaires, caisse.numcaisse) ||
        getCommentaireForCaisse(livraison.commentaires, caisse.caisse) ||
        "";

      return {
        numcaisse: caisse.numcaisse || "-",

        date_debut_livraison:
          caisse.date_debut_livraison || livraison.date_debut_livraison,

        date_fin_livraison:
          caisse.date_fin_livraison || livraison.date_fin_livraison,

        nombre_patients: nombrePatients,
        nombre_piluliers: nombrePiluliers,

        commentaire: isValidComment(commentaire) ? safeText(commentaire) : "",

        patients,
      };
    });
  }

  const patients = Array.isArray(livraison.patients) ? livraison.patients : [];

  const nombrePatients = Number(
    livraison.nombre_patients || patients.length || 0
  );

  const nombrePiluliers = Number(
    livraison.nombre_piluliers ||
      patients.reduce((sum, patient) => {
        return sum + Number(patient.nbpilulier || 0);
      }, 0)
  );

  const commentaire =
    livraison.commentaire_caisse ||
    livraison.commentaire ||
    getCommentaireForCaisse(livraison.commentaires, livraison.numcaisse) ||
    getCommentaireForCaisse(livraison.commentaires, livraison.caisse) ||
    "";

  return [
    {
      numcaisse: livraison.numcaisse || "-",

      date_debut_livraison: livraison.date_debut_livraison,
      date_fin_livraison: livraison.date_fin_livraison,

      nombre_patients: nombrePatients,
      nombre_piluliers: nombrePiluliers,

      commentaire: isValidComment(commentaire) ? safeText(commentaire) : "",

      patients,
    },
  ];
}

function ensureSpace(doc, y, neededHeight) {
  if (y + neededHeight <= PAGE.bottomLimit) return y;

  doc.addPage();
  return PAGE.topNewPage;
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);

    doc.setDrawColor(...COLORS.light);
    doc.setLineWidth(0.25);
    doc.line(PAGE.margin, 284, PAGE.width - PAGE.margin, 284);

    addText(
      doc,
      "OREUS — Rapport de livraison professionnel",
      PAGE.margin,
      289,
      {
        size: 7,
        color: COLORS.blueDark,
      }
    );

    try {
      doc.setFont("plutoreus", "normal");
      doc.setFontSize(9);

      const firstPart = "OR";
      const secondPart = "EUS";

      const firstWidth = doc.getTextWidth(firstPart);
      const secondWidth = doc.getTextWidth(secondPart);
      const totalWidth = firstWidth + secondWidth;

      const startX = PAGE.width / 2 - totalWidth / 2;
      const logoY = 289;

      doc.setTextColor(...COLORS.blueDark);
      doc.text(firstPart, startX, logoY);

      doc.setTextColor(...COLORS.dark);
      doc.text(secondPart, startX + firstWidth, logoY);
    } catch {
      addText(doc, "OREUS", PAGE.width / 2, 289, {
        size: 7,
        color: COLORS.blue,
        font: "bold",
        align: "center",
      });
    }

    addText(doc, `Page ${i} / ${pageCount}`, PAGE.width - PAGE.margin, 289, {
      size: 7,
      color: COLORS.gray,
      font: "bold",
      align: "right",
    });
  }
}

function addSectionTitle(doc, title, y) {
  const titleHeight = 7;

  y += 4;

  addText(doc, title, PAGE.margin, y, {
    size: 12,
    font: "bold",
    color: COLORS.blue,
  });

  doc.setDrawColor(...COLORS.blue);
  doc.setLineWidth(0.8);
  doc.line(PAGE.margin, y + 2.5, PAGE.margin + 55, y + 2.5);

  return y + titleHeight + 3;
}
function cleanPdfText(value) {
  return safeText(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7EÀ-ÿ]/g, "")
    .trim();
}
function addCommentaireCaisse(doc, caisse, y) {
const commentaire = cleanPdfText(caisse.commentaire);
  if (!isValidComment(commentaire)) {
    return y;
  }

  const contentWidth = PAGE.width - PAGE.margin * 2;
  const boxX = PAGE.margin;
  const boxW = contentWidth;

  const badgeW = 24;
  const badgeX = boxX + 8;
  const badgeY = y + 5;

  const textX = badgeX + badgeW + 12;
  const textW = boxW - badgeW - 30;

  // Important : couper les longs mots sans espaces
  const preparedComment = breakLongWords(commentaire, 55);

  const lines = doc.splitTextToSize(preparedComment, textW);

  // Hauteur dynamique selon le nombre de lignes
  const boxHeight = Math.max(18, 10 + lines.length * 4);

  y = ensureSpace(doc, y, boxHeight + 8);

  // Box principale blanche
  drawRoundedBox(doc, boxX, y, boxW, boxHeight, {
    fill: COLORS.white,
    border: COLORS.border,
    radius: 7,
    lineWidth: 0.35,
  });

  // Badge NOTE
  doc.setFillColor(...COLORS.blueLight);
  doc.roundedRect(badgeX, y + 5, badgeW, 8, 4, 4, "F");

  addText(doc, "NOTE", badgeX + badgeW / 2, y + 10, {
    size: 6.3,
    color: COLORS.blueDark,
    font: "bold",
    align: "center",
  });

  // Texte du commentaire avec retour à la ligne
  addText(doc, lines, textX, y + 10.2, {
    size: 8,
    color: COLORS.dark,
    font: "bold",
    maxWidth: textW,
  });

  return y + boxHeight + 7;
}

function addPatientsByCaisse(doc, caisses, y) {
  for (const caisse of caisses) {
    y = ensureSpace(doc, y, 42);

    y = addSectionTitle(doc, "Patients", y);

    addText(
      doc,
      `Période : ${formatDate(caisse.date_debut_livraison)} - ${formatDate(
        caisse.date_fin_livraison
      )}`,
      PAGE.margin,
      y,
      {
        size: 8,
        color: COLORS.gray,
        font: "bold",
      }
    );

    y += 5;

    const patients = Array.isArray(caisse.patients) ? caisse.patients : [];

    const body =
      patients.length > 0
        ? patients.map((patient) => [
            safeText(patient.nompatient),
            safeText(patient.nbpilulier || 0),
          ])
        : [["Aucun patient trouvé", "-"]];

    body.push([
      `Total patients : ${safeText(
        caisse.nombre_patients || patients.length || 0
      )}`,
      `Total piluliers : ${safeText(caisse.nombre_piluliers || 0)}`,
    ]);

    autoTable(doc, {
      startY: y,
      margin: {
        left: PAGE.margin,
        right: PAGE.margin,
        top: PAGE.topNewPage,
        bottom: 18,
      },
      tableWidth: PAGE.width - PAGE.margin * 2,
      head: [["Nom patient", "Nombre piluliers"]],
      body,
      theme: "grid",
      pageBreak: "auto",
      rowPageBreak: "avoid",

      styles: {
        font: "helvetica",
        fontSize: 7.2,
        cellPadding: {
          top: 1.6,
          right: 2.2,
          bottom: 1.6,
          left: 2.2,
        },
        minCellHeight: 5.5,
        lineColor: COLORS.light,
        lineWidth: 0.12,
        textColor: COLORS.dark,
        overflow: "linebreak",
        valign: "middle",
      },

      headStyles: {
        fillColor: COLORS.blueLight,
        textColor: COLORS.dark,
        fontStyle: "bold",
        fontSize: 7.8,
        halign: "center",
        valign: "middle",
        cellPadding: {
          top: 2,
          right: 2.2,
          bottom: 2,
          left: 2.2,
        },
        minCellHeight: 6.5,
        lineWidth: 0.25,
        lineColor: COLORS.border,
      },

      alternateRowStyles: {
        fillColor: COLORS.light,
      },

      columnStyles: {
        0: { cellWidth: 155 },
        1: { cellWidth: 30, halign: "center" },
      },

      didParseCell(data) {
        const isTotalRow = data.row.index === body.length - 1;

        if (isTotalRow) {
          data.cell.styles.fillColor = COLORS.blueLight;
          data.cell.styles.textColor = COLORS.dark;
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fontSize = 8;

          if (data.column.index === 1) {
            data.cell.styles.halign = "center";
          }
        }
      },
    });

    y = doc.lastAutoTable.finalY + 4;

    y = addCommentaireCaisse(doc, caisse, y);
  }

  return y;
}

function addCommentaires(doc, livraison, y) {
  return y;
}
function breakLongWords(text, maxLength = 55) {
  return safeText(text)
    .split(" ")
    .map((word) => {
      if (word.length <= maxLength) return word;

      return word.match(new RegExp(`.{1,${maxLength}}`, "g")).join(" ");
    })
    .join(" ");
}
function addSignature(doc, livraison, signatureImage, y) {
  const commentaireGlobal = getCommentaireGlobal(livraison);
  const hasCommentaireGlobal = isValidComment(commentaireGlobal);

  const contentWidth = PAGE.width - PAGE.margin * 2;
  const headerHeight = 16;

  let commentLines = [];
  let commentBoxHeight = 0;
  let commentGap = 0;

  if (hasCommentaireGlobal) {
    const commentW = contentWidth - 14;
    const badgeW = 36;
    const textW = commentW - badgeW - 28;

    const preparedComment = breakLongWords(commentaireGlobal, 48);

    commentLines = doc.splitTextToSize(preparedComment, textW);

    commentBoxHeight = Math.max(18, 10 + commentLines.length * 4);
    commentGap = 6;
  }

  const boxHeight = 72 + commentBoxHeight + commentGap;

  y = ensureSpace(doc, y, boxHeight + 8);

  drawRoundedBox(doc, PAGE.margin, y, contentWidth, boxHeight, {
    fill: COLORS.white,
    border: COLORS.border,
    radius: 9,
    lineWidth: 0.45,
  });

  doc.setFillColor(...COLORS.blueLight);
  doc.roundedRect(PAGE.margin, y, contentWidth, headerHeight, 9, 9, "F");

  addText(
    doc,
    "Livraison validée électroniquement",
    PAGE.margin + 7,
    y + headerHeight / 2 + 1,
    {
      size: 10,
      font: "bold",
      color: COLORS.blueDark,
    }
  );

  let signatureAreaY = y + 24;

  if (hasCommentaireGlobal) {
    const commentX = PAGE.margin + 7;
    const commentY = y + 21;
    const commentW = contentWidth - 14;

    drawRoundedBox(doc, commentX, commentY, commentW, commentBoxHeight, {
      fill: COLORS.white,
      border: COLORS.border,
      radius: 7,
      lineWidth: 0.35,
    });

    const badgeW = 36;
    const badgeX = commentX + 8;
    const badgeY = commentY + 5;

    doc.setFillColor(...COLORS.blueLight);
    doc.roundedRect(badgeX, badgeY, badgeW, 8, 4, 4, "F");

    addText(doc, "NOTE GLOBALE", badgeX + badgeW / 2, badgeY + 4.9, {
      size: 5.1,
      color: COLORS.blueDark,
      font: "bold",
      align: "center",
    });

    const textX = badgeX + badgeW + 10;
    const textW = commentW - badgeW - 28;

    addText(doc, commentLines, textX, commentY + 10.2, {
      size: 8,
      color: COLORS.dark,
      font: "bold",
      maxWidth: textW,
    });

    signatureAreaY = commentY + commentBoxHeight + 7;
  }

  const signBoxX = PAGE.margin + 7;
  const signBoxY = signatureAreaY + 3;
  const signBoxW = 78;
  const signBoxH = 36;

  addText(doc, "Signature", signBoxX, signBoxY - 3.5, {
    size: 8.5,
    font: "bold",
    color: COLORS.gray,
  });

  doc.setFillColor(...COLORS.light);
  doc.setDrawColor(...COLORS.blueDark);
  doc.setLineWidth(0.35);
  doc.roundedRect(signBoxX, signBoxY, signBoxW, signBoxH, 5, 5, "FD");

  if (signatureImage) {
    try {
      doc.addImage(
        signatureImage,
        "PNG",
        signBoxX + 5,
        signBoxY + 5,
        signBoxW - 10,
        signBoxH - 10
      );
    } catch {
      addText(doc, "Signature illisible", signBoxX + 10, signBoxY + 19, {
        size: 8,
        color: [180, 0, 0],
        font: "bold",
      });
    }
  } else {
    addText(doc, "Signature non disponible", signBoxX + 10, signBoxY + 19, {
      size: 8,
      color: COLORS.gray,
      font: "bold",
    });
  }

  const infoX = signBoxX + signBoxW + 12;
  const infoY = signBoxY;
  const infoW = contentWidth - signBoxW - 26;
  const infoH = signBoxH;

  drawRoundedBox(doc, infoX, infoY, infoW, infoH, {
    fill: COLORS.blueLight,
    border: COLORS.border,
    radius: 6,
    lineWidth: 0.25,
  });

  const signerName = safeText(
    livraison.nom_signataire || livraison.signataire || "-"
  );

  const validationDate = formatDate(
    livraison.date_action || livraison.date_signature
  );

  const colW = infoW / 2;
  const leftCenterX = infoX + colW / 2;
  const rightCenterX = infoX + colW + colW / 2;

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.25);
  doc.line(infoX + colW, infoY + 7, infoX + colW, infoY + 29);

  addText(doc, "NOM DU SIGNATAIRE", leftCenterX, infoY + 11, {
    size: 7.5,
    color: COLORS.gray,
    font: "bold",
    align: "center",
  });

  addText(doc, signerName, leftCenterX, infoY + 19, {
    size: 11,
    color: COLORS.dark,
    font: "bold",
    align: "center",
    maxWidth: colW - 10,
  });

  addText(doc, "DATE DE VALIDATION", rightCenterX, infoY + 11, {
    size: 7.5,
    color: COLORS.gray,
    font: "bold",
    align: "center",
  });

  addText(doc, validationDate, rightCenterX, infoY + 19, {
    size: 11,
    color: COLORS.dark,
    font: "bold",
    align: "center",
  });

  addText(
    doc,
    "Ce document confirme la validation de la livraison et la signature du réceptionnaire.",
    PAGE.margin + 7,
    y + boxHeight - 6,
    {
      size: 7.2,
      color: COLORS.gray,
      maxWidth: contentWidth - 14,
    }
  );

  return y + boxHeight + 8;
}

export async function generateLivraisonPdf(livraison, profile = {}) {
  const doc = new jsPDF("p", "mm", "a4");

  registerOreusFont(doc);

  const signatureImage = getSignatureImage(livraison.signature_base64);
  const caisses = normalizeCaisses(livraison);

  console.log("COMMENTAIRES BRUTS PDF =", livraison.commentaires);
  console.log("CAISSES PDF NORMALISÉES =", caisses);

  let y = addPdfHeader(doc, livraison, profile);

  y = addPatientsByCaisse(doc, caisses, y);

  y = addCommentaires(doc, livraison, y);

  addSignature(doc, livraison, signatureImage, y);

  addFooter(doc);

  const caisseName =
    caisses.length > 1
      ? caisses.map((caisse) => caisse.numcaisse).join("_")
      : caisses[0]?.numcaisse || livraison.numcaisse || "livraison";

  const fileName = `bon_livraison_${safeText(caisseName)}_${safeText(
    livraison.id
  )}.pdf`
    .replaceAll(" ", "_")
    .replaceAll("/", "-")
    .replaceAll(",", "_")
    .replaceAll("\\", "-");

  doc.save(fileName);
}