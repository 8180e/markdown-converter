import htmlToRtf from "html-to-rtf";
import { marked } from "marked";
import { downloadWithData } from "../utils";

export function convertToRTF(md: string) {
  const rtf = htmlToRtf.convertHtmlToRtf(marked(md) as string);
  downloadWithData(rtf, "application/rtf", "output.rtf");
}
