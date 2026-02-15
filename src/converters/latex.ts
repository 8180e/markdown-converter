import MarkdownIt from "markdown-it";
import { downloadWithData } from "../utils";

const parser = new MarkdownIt();

parser.renderer.rules.paragraph_open = () => "";
parser.renderer.rules.paragraph_close = () => "\n\n";
parser.renderer.rules.em_open = () => "\\textit{";
parser.renderer.rules.em_close = () => "}";
parser.renderer.rules.strong_open = () => "\\textbf{";
parser.renderer.rules.strong_close = () => "}";
parser.renderer.rules.bullet_list_open = () => "\\begin{itemize}\n";
parser.renderer.rules.bullet_list_close = () => "\\end{itemize}\n";
parser.renderer.rules.list_item_open = () => "\\item ";
parser.renderer.rules.list_item_close = () => "\n";

export function convertToLaTex(md: string) {
  let latex = "";
  for (const token of parser.parse(md, {})) {
    latex += parser.renderer.render([token], parser.options, {});
  }
  downloadWithData(latex, "text/plain", "output.tex");
}
