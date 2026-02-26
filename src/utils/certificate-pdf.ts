import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const handleDownloadPDF = async (
  name: string,
  elementId = "certificate",
  filenamePrefix = "certificate"
) => {
  const node = document.getElementById(elementId);
  if (!node) return;

  try {
    // scale: 2 or greater will provide higher resolution regardless of actual on-screen px dimensions
    const canvas = await html2canvas(node, {
      scale: window.devicePixelRatio ? window.devicePixelRatio * 1.5 : 2,
      useCORS: true,
      backgroundColor: "#0D1221", // Fill background correctly
      removeContainer: true, // Prevents bounding issues
      logging: false,
      onclone: (doc) => {
        // Fix background rendering specifically for dark theme pages
        const cert = doc.getElementById(elementId);
        if (cert) {
          cert.style.background = "linear-gradient(135deg, #020816 0%, #0D1221 100%)";
          cert.style.borderRadius = "0"; // avoid antialiasing corner artifacts
        }

        doc
          .querySelectorAll("[data-pdf-hide]")
          .forEach((el) => ((el as HTMLElement).style.display = "none"));

        const title = doc.querySelector(`#${elementId} h1`) as HTMLElement | null;
        if (title) {
          title.style.background = "";
          title.style.webkitBackgroundClip = "";
          title.style.backgroundClip = "";
          title.style.color = "#E5E7EB";
          title.style.textShadow = "none";
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");
    
    // jsPDF A4 landscape in mm: 297 x 210
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // Preserve the visual aspect ratio and center vertically/horizontally in the A4 page
    const ratio = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height
    );
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.setFillColor(13, 18, 33);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight, undefined, "FAST");
    
    const safeName = (name || "user").replace(/\s+/g, "_");
    // Ensure we don't duplicate the prefix if not needed
    const finalFilename = filenamePrefix === "certificate" 
        ? `certificate-${safeName}.pdf` 
        : `${filenamePrefix}-certificate-${safeName}.pdf`;

    pdf.save(finalFilename);
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};