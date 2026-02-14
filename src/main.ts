import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";
import { marked } from "marked";
import html2pdf from "html2pdf.js";

const markdownInput = document.getElementById(
  "markdownInput",
) as HTMLInputElement;

const convertToWordButton = document.getElementById("convertToWordButton");

convertToWordButton?.addEventListener("click", async () => {
  const blob = await convertMarkdownToDocx(markdownInput.value);
  downloadDocx(blob, "output.docx");
});

const convertToPDFButton = document.getElementById("convertToPDFButton");
const element = document.createElement("div");

convertToPDFButton?.addEventListener("click", async () => {
  element.innerHTML = await marked(markdownInput.value);
  html2pdf().from(element).save("output.pdf");
});
