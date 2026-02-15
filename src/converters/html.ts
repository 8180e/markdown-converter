import { marked } from "marked";
import { downloadWithData } from "../utils";

export function convertToHTML(md: string) {
  downloadWithData(marked(md) as string, "text/html", "output.html");
}
