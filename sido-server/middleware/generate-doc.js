const {
  Document,
  ImportDotx,
  Header,
  Footer,
  Packer,
  Paragraph,
  ImageRun,
  TextRun,
  AlignmentType,
} = require("docx");
const fs = require("fs");
const path = require("path");

const generateDoc = (data) => {
  console.log("Generating...", data);
  const docPath = `public/documents/${data.date}-${data.owner}.docx`;
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: data.sido_address
              .split("\n")
              .map(
                (line) => new TextRun({ break: 1, text: line, size: 2 * 12 })
              ),
          }),
          new Paragraph({
            children: data.regulator_address
              .split("\n")
              .map(
                (line) => new TextRun({ break: 1, text: line, size: 2 * 12 })
              ),
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.date}`,
                size: 2 * 12,
                break: 1,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `To Whom it may concern,`,
                size: 2 * 12,
                break: 1,
              }),
            ],
          }),
          new Paragraph({
            children: [], // Just newline without text
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `RE: Request for formalization for ${data.business}`,
                bold: true,
                underline: true,
                size: 2 * 12,
                allCaps: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `This letter is written in request for the start of formalization of ${data.business} owned by ${data.owner}.`,
                size: 2 * 12,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.owner} is a registered member of SIDO and is located at ${data.branch}. The business is in the ${data.business_sector} sector.`,
                size: 2 * 12,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Thank you for your patience and cooperation. We look forward to hearing from you soon.",
                size: 2 * 12,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Yours Sincerely,",
                size: 2 * 12,
                break: 1,
              }),
              new TextRun({
                break: 4,
                text: `${data.staff}`,
                size: 2 * 12,
              }),
              new TextRun({
                text: data.staffRole,
                size: 2 * 12,
                break: 1,
              }),
              new TextRun({
                text: data.staffPhone,
                size: 2 * 12,
                break: 1,
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(docPath, buffer);
  });
  return docPath;
};

const createDocument = (req, res) => {
  const { id } = req.params;
  const { owner, staff } = req.body;
  const data = {
    sido_address: `Small Industries Development Organization,\nP. O. Box. 461,\nDodoma.\nTel: +255  222 151 948\nE-mail: dg@sido.go.tz`,
    regulator_address:
      "Tanzania Revenue Authority\nP.O.Box 11491\n Dar es Salaam",
    date: new Date().toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    }),
    owner: `${owner.first_name} ${owner.last_name}`,
    business: owner.business_name,
    business_sector: owner.sector.name,
    branch: staff.branch_name,
    staff: `${staff.first_name} ${staff.last_name}`,
    staffRole: staff.role_name,
    staffPhone: staff.phone_number,
  };
  const result = generateDoc(data);
  console.log("Result", result);
  res.status(200).json({
    success: true,
    file_path: result,
    file_name: `${data.date}-${data.owner}.docx`,
  });
};

module.exports = {
  createDocument,
};
