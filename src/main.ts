import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";
import { marked } from "marked";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

const a = document.createElement("a");

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

const convertToHTMLButton = document.getElementById("convertToHTMLButton");

convertToHTMLButton?.addEventListener("click", async () => {
  const html = await marked(markdownInput.value);

  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));

  a.download = "output.html";
  a.href = url;
  a.click();

  URL.revokeObjectURL(url);
});

const hiddenDiv = document.getElementById("hiddenRender");

if (hiddenDiv) {
  const convertToImageButton = document.getElementById("convertToImageButton");

  convertToImageButton?.addEventListener("click", async () => {
    hiddenDiv.innerHTML = await marked(markdownInput.value);
    hiddenDiv.style.display = "block";

    const canvas = await html2canvas(hiddenDiv, { backgroundColor: "#ffffff" });
    hiddenDiv.style.display = "none";

    a.download = "output.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  });
}
