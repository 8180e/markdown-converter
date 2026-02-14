import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";
import { marked } from "marked";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

const a = document.createElement("a");

function download(filename: string, url: string) {
  a.download = filename;
  a.href = url;
  a.click();
}

const markdownInput = document.getElementById(
  "markdownInput",
) as HTMLInputElement;

function getHTMLMarkdown() {
  return marked(markdownInput.value);
}

const convertToWordButton = document.getElementById("convertToWordButton");

convertToWordButton?.addEventListener("click", async () => {
  const blob = await convertMarkdownToDocx(markdownInput.value);
  downloadDocx(blob, "output.docx");
});

const convertToPDFButton = document.getElementById("convertToPDFButton");
const element = document.createElement("div");

convertToPDFButton?.addEventListener("click", async () => {
  element.innerHTML = await getHTMLMarkdown();
  html2pdf().from(element).save("output.pdf");
});

const convertToHTMLButton = document.getElementById("convertToHTMLButton");

convertToHTMLButton?.addEventListener("click", async () => {
  const html = await getHTMLMarkdown();

  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));

  download("output.html", url);

  URL.revokeObjectURL(url);
});

const hiddenDiv = document.getElementById("hiddenRender");

if (hiddenDiv) {
  const convertToImageButton = document.getElementById("convertToImageButton");

  convertToImageButton?.addEventListener("click", async () => {
    hiddenDiv.innerHTML = await getHTMLMarkdown();
    hiddenDiv.style.display = "block";

    const canvas = await html2canvas(hiddenDiv, { backgroundColor: "#ffffff" });
    hiddenDiv.style.display = "none";

    download("output.png", canvas.toDataURL("image/png"));
  });
}

const convertToTextButton = document.getElementById("convertToTextButton");

convertToTextButton?.addEventListener("click", async () => {
  const html = await getHTMLMarkdown();
  const text = html.replace(/<[^>]*>?/gm, "");

  const blob = new Blob([text], { type: "text/plain" });

  download("output.txt", URL.createObjectURL(blob));
});
