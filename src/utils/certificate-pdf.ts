import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Converts an image URL to a base64 data URL by drawing it onto an
 * off-screen canvas. This guarantees html2canvas can render the image
 * without needing to re-fetch it in its cloned DOM.
 */
function toDataURL(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));
      ctx.drawImage(img, 0, 0);
      resolve(c.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export const handleDownloadPDF = async (
  name: string,
  elementId = "certificate",
  filenamePrefix = "certificate"
) => {
  const node = document.getElementById(elementId);
  if (!node) return;

  try {
    // Pre-convert every <img> inside the certificate to an inline base64 data
    // URL. This guarantees html2canvas can render them in the cloned DOM
    // without re-fetching (which silently fails on macOS Safari / some Chrome).
    const origImages = Array.from(node.querySelectorAll("img"));
    const dataUrls: (string | null)[] = await Promise.all(
      origImages.map(async (img) => {
        const src = img.currentSrc || img.src;
        if (!src || src.startsWith("data:")) return null;
        try {
          return await toDataURL(src);
        } catch {
          return null;
        }
      })
    );

    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      removeContainer: true,
      logging: false,
      imageTimeout: 30000,
      onclone: (doc) => {
        const cert = doc.getElementById(elementId);
        if (!cert) return;

        cert.style.borderRadius = "0";

        const clonedImages = Array.from(cert.querySelectorAll("img"));
        clonedImages.forEach((img, i) => {
          img.removeAttribute("srcset");
          img.removeAttribute("sizes");
          img.removeAttribute("loading");
          if (dataUrls[i]) {
            img.src = dataUrls[i]!;
          }
        });

        doc
          .querySelectorAll("[data-pdf-hide]")
          .forEach((el) => ((el as HTMLElement).style.display = "none"));

        const title = doc.querySelector(
          `#${elementId} h1`
        ) as HTMLElement | null;
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

    const pageWidth = 297;
    const pageHeight = 210;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

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
    const finalFilename =
      filenamePrefix === "certificate"
        ? `certificate-${safeName}.pdf`
        : `${filenamePrefix}-certificate-${safeName}.pdf`;

    pdf.save(finalFilename);
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};