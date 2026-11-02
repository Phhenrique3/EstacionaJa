import PDFDocument = require("pdfkit");
import { vehicleModel } from "../../../vehicle/models/vehicleModel";

function formatDate(dateValue: Date | string): string {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

type TableColumn = {
  title: string;
  x: number;
  width: number;
};

function drawHeader(doc: PDFKit.PDFDocument) {
  const margin = 40;
  const pageWidth = doc.page.width;

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("#111111")
    .text("EstacioneJa", margin, 30);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#555555")
    .text("Relatorio de Veiculos Cadastrados", margin, 55);

  doc
    .fontSize(9)
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
    .text(`Pagina ${pageNumber}`, margin, pageHeight - 35, {
      width: pageWidth - margin * 2,
      align: "center",
      lineBreak: false,
    });
}

function drawTableHeader(doc: PDFKit.PDFDocument, y: number) {
  const margin = 40;

  const definitions = [
    { title: "#", width: 25 },
    { title: "Placa", width: 70 },
    { title: "Marca", width: 75 },
    { title: "Modelo", width: 85 },
    { title: "Cor", width: 60 },
    { title: "Proprietario", width: 130 },
    { title: "E-mail", width: 170 },
    { title: "Telefone", width: 95 },
  ];

  let x = margin;

  const columns: TableColumn[] = definitions.map((column) => {
    const result = {
      ...column,
      x,
    };

    x += column.width;

    return result;
  });

  const headerHeight = 26;
  const tableWidth = columns.reduce((total, column) => total + column.width, 0);

  doc.rect(margin, y, tableWidth, headerHeight).fillColor("#eeeeee").fill();

  doc.font("Helvetica-Bold").fontSize(8).fillColor("#111111");

  columns.forEach((column) => {
    doc.text(column.title, column.x + 5, y + 7, {
      width: column.width - 10,
      lineBreak: false,
    });
  });

  doc.rect(margin, y, tableWidth, headerHeight).strokeColor("#cccccc").stroke();

  return {
    columns,
    nextY: y + headerHeight,
  };
}

function calculateRowHeight(
  doc: PDFKit.PDFDocument,
  columns: TableColumn[],
  values: string[],
): number {
  const padding = 5;

  doc.font("Helvetica").fontSize(8);

  const heights = values.map((value, index) =>
    doc.heightOfString(value, {
      width: columns[index].width - padding * 2,
    }),
  );

  return Math.max(28, ...heights.map((height) => height + 14));
}

function drawVehicle(
  doc: PDFKit.PDFDocument,
  y: number,
  columns: TableColumn[],
  values: string[],
  rowHeight: number,
) {
  const padding = 5;

  doc.font("Helvetica").fontSize(8).fillColor("#222222");

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
  async listVehicle() {
    return vehicleModel.findAll();
  },

  async vehiclePDF(): Promise<Buffer> {
    const vehicles = await vehicleModel.findAll();

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 40,
      autoFirstPage: true,
    });

    const buffers: Buffer[] = [];

    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on("data", (chunk: Buffer) => {
        buffers.push(chunk);
      });

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
      .text(`Total de veiculos: ${vehicles.length}`);

    doc.moveDown();

    if (vehicles.length === 0) {
      doc.text("Nenhum veiculo cadastrado.");

      drawFooter(doc, pageNumber);
      doc.end();

      return pdfPromise;
    }

    let tableInfo = drawTableHeader(doc, doc.y + 8);
    let currentY = tableInfo.nextY;

    for (const [index, vehicle] of vehicles.entries()) {
      const values = [
        String(index + 1),
        vehicle.placa,
        vehicle.marca ?? "-",
        vehicle.modelo ?? "-",
        vehicle.cor ?? "-",
        vehicle.client.name,
        vehicle.client.email ?? "Nao informado",
        vehicle.client.telefone,
      ];

      const rowHeight = calculateRowHeight(doc, tableInfo.columns, values);

      if (currentY + rowHeight > doc.page.height - 65) {
        drawFooter(doc, pageNumber);

        doc.addPage();
        pageNumber++;

        drawHeader(doc);

        tableInfo = drawTableHeader(doc, doc.y);
        currentY = tableInfo.nextY;
      }

      currentY = drawVehicle(
        doc,
        currentY,
        tableInfo.columns,
        values,
        rowHeight,
      );
    }

    drawFooter(doc, pageNumber);

    doc.end();

    return pdfPromise;
  },
};
