import fs from "fs";

const font = fs.readFileSync("./src/assets/PLUTOREUS.TTF");
const base64 = font.toString("base64");

fs.writeFileSync(
  "./src/utils/   oreusFontBase64.js",
  `export const OREUS_FONT_BASE64 = "${base64}";`
);

console.log("Police OREUS convertie avec succès.");