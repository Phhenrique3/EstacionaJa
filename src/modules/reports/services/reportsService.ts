import PDFDocument = require("pdfkit");
import { ClientModel } from "../../client/models/clientModel";

function formatDate(dateValue: Date | string) {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhone(phone: string) {
  const numbers = onlyNumbers(phone);

  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}

function formatDocument(tipoDocumento: string, documento: string) {
  const numbers = onlyNumbers(documento);

  if (tipoDocumento === "CPF" && numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  if (tipoDocumento === "CNPJ" && numbers.length === 14) {
    return numbers.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  return documento;
}

function drawHeader(doc: PDFKit.PDFDocument) {
  const margin = 40;
  const pageWidth = doc.page.width;

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("#111111")
    .text("EstacioneJá", margin, 30);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#555555")
    .text("Relatório de Clientes Cadastrados", margin, 55);

  doc
    .fontSize(9)
    .fillColor("#555555")
    .text(`Gerado em: ${formatDate(new Date())}`, pageWidth - 280, 35, {
      width: 240,
      align: "right",
    });

  doc
    .moveTo(margin, 82)
    .lineTo(pageWidth - margin, 82)
    .strokeColor("#cccccc")
    .stroke();

  doc.y = 105;
}

function drawFooter(doc: PDFKit.PDFDocument, pageNumber: number) {
  const margin = 40;
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  doc
    .moveTo(margin, pageHeight - 45)
    .lineTo(pageWidth - margin, pageHeight - 45)
    .strokeColor("#cccccc")
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#555555")
    .text(`Página ${pageNumber}`, margin, pageHeight - 35, {
      width: pageWidth - margin * 2,
      align: "center",
    });
}

function drawTableHeader(doc: PDFKit.PDFDocument, y: number) {
  const margin = 40;

  const columns = [
    { title: "#", x: margin, width: 30 },
    { title: "Nome", x: margin + 30, width: 150 },
    { title: "E-mail", x: margin + 180, width: 180 },
    { title: "Telefone", x: margin + 360, width: 90 },
    { title: "Tipo", x: margin + 450, width: 60 },
    { title: "Documento", x: margin + 510, width: 120 },
    { title: "Cadastro", x: margin + 630, width: 90 },
  ];

  const headerHeight = 24;

  doc.save();

  doc
    .rect(margin, y, 720, headerHeight)
    .fillColor("#eeeeee")
    .fill();

  doc.restore();

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#111111");

  columns.forEach((column) => {
    doc.text(column.title, column.x + 5, y + 7, {
      width: column.width - 10,
    });
  });

  doc
    .rect(margin, y, 720, headerHeight)
    .strokeColor("#cccccc")
    .stroke();

  return {
    columns,
    nextY: y + headerHeight,
  };
}

function drawClientRow(
  doc: PDFKit.PDFDocument,
  y: number,
  columns: { title: string; x: number; width: number }[],
  values: string[]
) {
  const padding = 5;

  doc.font("Helvetica").fontSize(8).fillColor("#222222");

  const heights = values.map((value, index) => {
    return doc.heightOfString(value, {
      width: columns[index].width - padding * 2,
    });
  });

  const rowHeight = Math.max(28, Math.max(...heights) + 14);

  values.forEach((value, index) => {
    const column = columns[index];

    doc
      .rect(column.x, y, column.width, rowHeight)
      .strokeColor("#dddddd")
      .stroke();

    doc.text(value, column.x + padding, y + 7, {
      width: column.width - padding * 2,
      lineGap: 1,
    });
  });

  return y + rowHeight;
}

export const reportsService = {
  async listClients() {
    const clients = await ClientModel.findAll();

    return clients;
  },

  async generateClientsPdf() {
    const clients = await ClientModel.findAll();

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 40,
    });

    const buffers: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => {
      buffers.push(chunk);
    });

    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      doc.on("error", reject);
    });

    let pageNumber = 1;

    drawHeader(doc);

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor("#111111")
      .text("Resumo", 40, doc.y);

    doc.moveDown(0.4);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#333333")
      .text(`Total de clientes cadastrados: ${clients.length}`);

    doc.moveDown();

    if (clients.length === 0) {
      doc.fontSize(11).text("Nenhum cliente cadastrado.");
      drawFooter(doc, pageNumber);
      doc.end();

      return pdfPromise;
    }

    let tableInfo = drawTableHeader(doc, doc.y + 8);
    let currentY = tableInfo.nextY;

    clients.forEach((client, index) => {
      const values = [
        String(index + 1),
        client.name,
        client.email ?? "Não informado",
        formatPhone(client.telefone),
        client.tipo_documento,
        formatDocument(client.tipo_documento, client.documento),
        formatDate(client.createdAt),
      ];

      doc.font("Helvetica").fontSize(8);

      const estimatedRowHeight = Math.max(
        28,
        ...values.map((value, valueIndex) =>
          doc.heightOfString(value, {
            width: tableInfo.columns[valueIndex].width - 10,
          })
        )
      );

      if (currentY + estimatedRowHeight > doc.page.height - 65) {
        drawFooter(doc, pageNumber);

        doc.addPage();
        pageNumber++;

        drawHeader(doc);

        tableInfo = drawTableHeader(doc, doc.y);
        currentY = tableInfo.nextY;
      }

      currentY = drawClientRow(doc, currentY, tableInfo.columns, values);
    });

    drawFooter(doc, pageNumber);

    doc.end();

    return pdfPromise;
  },
};