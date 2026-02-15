import { marked } from "marked";
import { downloadWithData } from "../utils";

export function convertToTXT(md: string) {
  const html = marked(md) as string;

  downloadWithData(html.replace(/<[^>]*>?/gm, ""), "text/plain", "output.txt");
}
