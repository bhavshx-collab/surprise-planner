// usePDFExport.js — generates a beautiful PDF from the plan
import { useCallback } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function usePDFExport(printRef) {
  const generatePDF = useCallback(async () => {
    const element = printRef?.current;
    if (!element) return;

    // Show the element temporarily for capture
    element.style.display = "block";
    element.style.position = "fixed";
    element.style.top = "-9999px";
    element.style.left = "0";
    element.style.width = "720px";
    element.style.zIndex = "-1";

    await new Promise((r) => setTimeout(r, 120));

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 720,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / (imgWidth / 2); // account for scale:2
      const totalHeight = (imgHeight / 2) * ratio;

      let yPos = 0;
      let pageNum = 0;

      while (yPos < totalHeight) {
        if (pageNum > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -yPos, pdfWidth, totalHeight);
        yPos += pdfHeight;
        pageNum++;
      }

      pdf.save("surprise-plan.pdf");
    } finally {
      element.style.display = "none";
      element.style.position = "";
      element.style.top = "";
      element.style.left = "";
      element.style.width = "";
      element.style.zIndex = "";
    }
  }, [printRef]);

  return { generatePDF };
}
