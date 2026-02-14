import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";
import { marked } from "marked";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { remark } from "remark";
import remarkParse from "remark-parse";
import MarkdownIt from "markdown-it";

function createFileDownloadURL(data: string, type: string) {
  return URL.createObjectURL(new Blob([data], { type }));
}

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

function markdownTableToCSV(markdown: string) {
  const lines = markdown.trim().split("\n");
  const dataLines = lines.filter((line) => !/^(\s*\|?\s*-+.*)+$/.test(line));
  const csvDataLines = dataLines.map((line) => {
    const cells = line.replace(/^\s*\||\|\s*$/g, "").split("|");
    return cells.map((cell) => cell.trim()).join(",");
  });
  return csvDataLines.join("\n");
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
  download("output.html", createFileDownloadURL(html, "text/html"));
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

  download("output.txt", createFileDownloadURL(text, "text/plain"));
});

const convertToCSVButton = document.getElementById("convertToCSVButton");

convertToCSVButton?.addEventListener("click", () => {
  const csv = markdownTableToCSV(markdownInput.value);
  download("output.csv", createFileDownloadURL(csv, "text/csv"));
});

const convertToJSONButton = document.getElementById("convertToJSONButton");
const processor = remark().use(remarkParse);

convertToJSONButton?.addEventListener("click", () => {
  const json = JSON.stringify(processor.parse(markdownInput.value), null, 2);
  download("output.json", createFileDownloadURL(json, "application/json"));
});

const convertToLaTeXButton = document.getElementById("convertToLaTeXButton");
const md = new MarkdownIt();

md.renderer.rules.paragraph_open = () => "";
md.renderer.rules.paragraph_close = () => "\n\n";
md.renderer.rules.em_open = () => "\\textit{";
md.renderer.rules.em_close = () => "}";
md.renderer.rules.strong_open = () => "\\textbf{";
md.renderer.rules.strong_close = () => "}";
md.renderer.rules.bullet_list_open = () => "\\begin{itemize}\n";
md.renderer.rules.bullet_list_close = () => "\\end{itemize}\n";
md.renderer.rules.list_item_open = () => "\\item ";
md.renderer.rules.list_item_close = () => "\n";

convertToLaTeXButton?.addEventListener("click", () => {
  let latex = "";
  for (const token of md.parse(markdownInput.value, {})) {
    latex += md.renderer.render([token], md.options, {});
  }
  download("output.tex", createFileDownloadURL(latex, "text/plain"));
});
