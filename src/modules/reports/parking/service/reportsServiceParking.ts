import PDFDocument = require("pdfkit");
import { ParkingSessionModel } from "../../../parkingSession/models/parkingSessionModel";

/** Converte uma data para o formato brasileiro usado no relatório. */
function formatDate(dateValue: Date | string) {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

/** Formata um valor monetário no padrão brasileiro. */
function formatCurrency(value: unknown) {
  if (value === null || value === undefined) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

/** Desenha a identificação do relatório, a data de geração e a linha separadora. */
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
    .text("Relatório de Sessões de Estacionamento", margin, 55);

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

/** Desenha a linha inferior e o número da página no rodapé. */
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

/** Desenha os títulos e as dimensões das colunas da tabela de sessões. */
function drawTableHeader(doc: PDFKit.PDFDocument, y: number) {
  const margin = 40;

  const columns = [
    // Índice sequencial da sessão no relatório.
    { title: "#", x: margin, width: 25 },
    // Placa do veículo estacionado.
    { title: "Placa", x: margin + 25, width: 75 },
    // Cliente vinculado ao veículo.
    { title: "Cliente", x: margin + 100, width: 105 },
    // Categoria do veículo usada na cobrança.
    { title: "Categoria", x: margin + 205, width: 85 },
    // Número da vaga ocupada pela sessão.
    { title: "Vaga", x: margin + 290, width: 55 },
    // Data e hora de entrada no estacionamento.
    { title: "Entrada", x: margin + 345, width: 85 },
    // Data e hora de saída; fica "Em aberto" enquanto a sessão estiver ativa.
    { title: "Saída", x: margin + 430, width: 85 },
    // Tempo total estacionado, em minutos.
    { title: "Tempo", x: margin + 515, width: 60 },
    // Forma de cobrança aplicada à sessão.
    { title: "Cobrança", x: margin + 575, width: 75 },
    // Valor final calculado para a sessão.
    { title: "Valor", x: margin + 650, width: 70 },
    // Situação da sessão: ABERTO, FECHADO ou CANCELADO.
    { title: "Status", x: margin + 720, width: 40 },
  ];

  const headerHeight = 24;

  doc.save();

  doc.rect(margin, y, 760, headerHeight).fillColor("#eeeeee").fill();

  doc.restore();

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#111111");

  columns.forEach((column) => {
    doc.text(column.title, column.x + 5, y + 7, {
      width: column.width - 10,
    });
  });

  doc.rect(margin, y, 760, headerHeight).strokeColor("#cccccc").stroke();

  return {
    columns,
    nextY: y + headerHeight,
  };
}

/** Desenha uma linha da tabela e calcula sua altura para textos longos. */
function drawParkingSessionRow(
  doc: PDFKit.PDFDocument,
  y: number,
  columns: { title: string; x: number; width: number }[],
  values: string[],
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
  /** Busca e retorna todas as sessões de estacionamento. */
  async listParkingSessions() {
    const parkingSessions = await ParkingSessionModel.findAll();

    return parkingSessions;
  },

  /** Gera o PDF paisagem com resumo, sessões e paginação. */
  async generateParkingSessionsPdf() {
    const parkingSessions = await ParkingSessionModel.findAll();

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
      .text(`Total de sessões: ${parkingSessions.length}`);

    doc.moveDown();

    if (parkingSessions.length === 0) {
      doc.fontSize(11).text("Nenhuma sessão de estacionamento encontrada.");
      drawFooter(doc, pageNumber);
      doc.end();

      return pdfPromise;
    }

    let tableInfo = drawTableHeader(doc, doc.y + 8);
    let currentY = tableInfo.nextY;

    parkingSessions.forEach((session, index) => {
      const values = [
        String(index + 1),
        session.vehicle.placa,
        session.vehicle.client.name,
        session.vehicle.category.name,
        session.parkingSpot.numero,
        formatDate(session.entrada),
        session.saida ? formatDate(session.saida) : "Em aberto",
        session.tempo_total_minutos !== null
          ? `${session.tempo_total_minutos} min`
          : "Em aberto",
        session.tipo_cobranca,
        formatCurrency(session.valor_total),
        session.status,
      ];

      doc.font("Helvetica").fontSize(8);

      const estimatedRowHeight = Math.max(
        28,
        ...values.map((value, valueIndex) =>
          doc.heightOfString(value, {
            width: tableInfo.columns[valueIndex].width - 10,
          }),
        ),
      );

      if (currentY + estimatedRowHeight > doc.page.height - 65) {
        drawFooter(doc, pageNumber);

        doc.addPage();
        pageNumber++;

        drawHeader(doc);

        tableInfo = drawTableHeader(doc, doc.y);
        currentY = tableInfo.nextY;
      }

      currentY = drawParkingSessionRow(doc, currentY, tableInfo.columns, values);
    });

    drawFooter(doc, pageNumber);

    doc.end();

    return pdfPromise;
  },
};
