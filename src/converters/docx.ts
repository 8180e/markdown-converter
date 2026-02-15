import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";

export async function convertToDocx(md: string) {
  downloadDocx(await convertMarkdownToDocx(md), "output.docx");
}
