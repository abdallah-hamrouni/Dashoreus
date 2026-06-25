import { COLORS } from "./pdfTheme";

export function safeText(value) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

export function formatDate(date) {
  if (!date) return "-";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return safeText(date);

  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function addText(doc, text, x, y, options = {}) {
  const {
    size = 10,
    color = COLORS.dark,
    font = "normal",
    maxWidth,
    align,
  } = options;

  doc.setFont("helvetica", font);
  doc.setFontSize(size);
  doc.setTextColor(...color);

  const finalText = Array.isArray(text) ? text : safeText(text);

  if (maxWidth && !Array.isArray(finalText)) {
    const lines = doc.splitTextToSize(finalText, maxWidth);
    doc.text(lines, x, y, align ? { align } : undefined);
    return lines.length;
  }

  doc.text(finalText, x, y, align ? { align } : undefined);
  return Array.isArray(finalText) ? finalText.length : 1;
}

export function drawRoundedBox(doc, x, y, w, h, options = {}) {
  const {
    fill = COLORS.white,
    border = COLORS.border,
    radius = 4,
    lineWidth = 0.3,
  } = options;

  doc.setFillColor(...fill);
  doc.setDrawColor(...border);
  doc.setLineWidth(lineWidth);
  doc.roundedRect(x, y, w, h, radius, radius, "FD");
}

export function addLabelValue(doc, label, value, x, y, w) {
  addText(doc, label.toUpperCase(), x, y, {
    size: 7,
    color: COLORS.gray,
    font: "bold",
  });

  const lines = doc.splitTextToSize(safeText(value), w);

  addText(doc, lines.slice(0, 2), x, y + 5, {
    size: 8.5,
    color: COLORS.dark,
    font: "bold",
  });
}