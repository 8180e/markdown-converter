import "./load-theme";
import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";
import { marked } from "marked";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { remark } from "remark";
import remarkParse from "remark-parse";
import MarkdownIt from "markdown-it";
import htmlToRtf from "html-to-rtf";
import PptxGenJS from "pptxgenjs";

function onButtonClick(elementId: string, listener: () => unknown) {
  document.getElementById(elementId)?.addEventListener("click", listener);
}

function createFileDownloadURL(data: string, type: string) {
  return URL.createObjectURL(new Blob([data], { type }));
}

function parseMarkdownToSlides(md: string) {
  const slides = md.split(/\n---\n/);
  return slides.map((slide) => slide.replace(/^#\s+/gm, "").trim());
}

function markdownToBBCode(md: string) {
  const tokens = marked.lexer(md);
  let bbcode = "";

  tokens.forEach((token) => {
    switch (token.type) {
      case "heading":
        const size = 4 - token.depth;
        bbcode += `[size=${size}]${token.text}[/size]\n\n`;
        break;
      case "paragraph":
        bbcode += `${token.text}\n\n`;
        break;
      case "strong":
        bbcode += `[b]${token.text}[/b]`;
        break;
      case "em":
        bbcode += `[i]${token.text}[/i]`;
        break;
      case "list":
        bbcode += "[list]\n";
        token.items.forEach(({ text }: { text: string }) => {
          bbcode += `[*]${text}\n`;
        });
        bbcode += "[/list]\n\n";
        break;
      case "code":
        bbcode += `[code]${token.text}[/code]\n\n`;
        break;
      case "blockquote":
        bbcode += `[quote]${token.text}[/quote]\n\n`;
        break;
      case "link":
        bbcode += `[url=${token.href}]${token.text}[/url]`;
        break;
      case "image":
        bbcode += `[img]${token.href}[/img]`;
        break;
      default:
        bbcode += token.raw;
    }
  });

  return bbcode;
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

onButtonClick("convertToWordButton", async () => {
  const blob = await convertMarkdownToDocx(markdownInput.value);
  downloadDocx(blob, "output.docx");
});

const element = document.createElement("div");

onButtonClick("convertToPDFButton", async () => {
  element.innerHTML = await getHTMLMarkdown();
  html2pdf().from(element).save("output.pdf");
});

onButtonClick("convertToHTMLButton", async () => {
  const html = await getHTMLMarkdown();
  download("output.html", createFileDownloadURL(html, "text/html"));
});

const hiddenDiv = document.getElementById("hiddenRender");

if (hiddenDiv) {
  onButtonClick("convertToImageButton", async () => {
    hiddenDiv.innerHTML = await getHTMLMarkdown();
    hiddenDiv.style.display = "block";

    const canvas = await html2canvas(hiddenDiv, { backgroundColor: "#ffffff" });
    hiddenDiv.style.display = "none";

    download("output.png", canvas.toDataURL("image/png"));
  });
}

onButtonClick("convertToTextButton", async () => {
  const html = await getHTMLMarkdown();
  const text = html.replace(/<[^>]*>?/gm, "");

  download("output.txt", createFileDownloadURL(text, "text/plain"));
});

onButtonClick("convertToCSVButton", () => {
  const csv = markdownTableToCSV(markdownInput.value);
  download("output.csv", createFileDownloadURL(csv, "text/csv"));
});

const processor = remark().use(remarkParse);

onButtonClick("convertToJSONButton", () => {
  const json = JSON.stringify(processor.parse(markdownInput.value), null, 2);
  download("output.json", createFileDownloadURL(json, "application/json"));
});

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

onButtonClick("convertToLaTeXButton", () => {
  let latex = "";
  for (const token of md.parse(markdownInput.value, {})) {
    latex += md.renderer.render([token], md.options, {});
  }
  download("output.tex", createFileDownloadURL(latex, "text/plain"));
});

onButtonClick("convertToRTFButton", async () => {
  const rtf = htmlToRtf.convertHtmlToRtf(await getHTMLMarkdown());
  download("output.rtf", createFileDownloadURL(rtf, "application/rtf"));
});

onButtonClick("convertToPPTXButton", () => {
  const pptx = new PptxGenJS();
  parseMarkdownToSlides(markdownInput.value).forEach((content) => {
    const slide = pptx.addSlide();
    slide.addText(content, { x: 0.5, y: 0.5, w: 9, h: 5, fontSize: 24 });
  });

  pptx.writeFile({ fileName: "output.pptx" });
});

onButtonClick("convertToBBCodeButton", () => {
  const bbcode = markdownToBBCode(markdownInput.value);
  download("output.bbcode", createFileDownloadURL(bbcode, "text/plain"));
});

const markdownFileInput = document.getElementById(
  "markdownFileInput",
) as HTMLInputElement;

markdownFileInput.addEventListener("change", () => {
  if (!markdownFileInput.files) return;

  const reader = new FileReader();
  reader.onload = ({ target }) => {
    if (typeof target?.result === "string") markdownInput.value = target.result;
  };
  reader.readAsText(markdownFileInput.files[0]);
});
