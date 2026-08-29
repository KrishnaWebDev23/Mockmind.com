import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export const downloadReport = async (
  elementId: string,
  fileName = "Interview_Performance_Report.pdf"
) => {
  const reportElement = document.getElementById(elementId);

  if (!reportElement) {
    console.error("Report element not found");
    return;
  }

  try {
    const image = await toPng(reportElement, {
      cacheBust: true,
      pixelRatio: 2,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imageProperties = pdf.getImageProperties(image);

    const imageHeight =
      (imageProperties.height * pdfWidth) /
      imageProperties.width;


    if (imageHeight <= pdfHeight) {
      pdf.addImage(
        image,
        "PNG",
        0,
        10,
        pdfWidth,
        imageHeight
      );
    } else {

      let heightLeft = imageHeight;
      let position = 10;

      while (heightLeft > 0) {

        pdf.addImage(
          image,
          "PNG",
          0,
          position,
          pdfWidth,
          imageHeight
        );

        heightLeft -= pdfHeight;

        if (heightLeft > 0) {
          pdf.addPage();
          position = -(imageHeight - heightLeft);
        }
      }
    }

    pdf.save(fileName);

  } catch (error) {
    console.error(
      "Failed to generate PDF:",
      error
    );
  }
};