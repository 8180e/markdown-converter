import { marked } from "marked";
import { downloadWithData } from "../utils";

export function convertToBBCode(md: string) {
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

  downloadWithData(bbcode, "text/plain", "output.bbcode");
}
