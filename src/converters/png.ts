import html2canvas from "html2canvas";
import { marked } from "marked";
import { download } from "../utils";

const hiddenDiv = document.getElementById("hiddenRender");

export async function convertToPNG(md: string) {
  if (!hiddenDiv) return;

  hiddenDiv.innerHTML = marked(md) as string;
  hiddenDiv.style.display = "block";

  const canvas = await html2canvas(hiddenDiv, { backgroundColor: "#ffffff" });
  hiddenDiv.style.display = "none";

  download(canvas.toDataURL("image/png"), "output.png");
}
