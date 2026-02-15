import html2pdf from "html2pdf.js";
import { marked } from "marked";

export async function convertToPDF(md: string) {
  const html = marked(md) as string;
  html2pdf().from(html).save("output.pdf");
}
