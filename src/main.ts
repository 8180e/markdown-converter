import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";

const markdownInput = document.getElementById(
  "markdownInput",
) as HTMLInputElement;

const convertToWordButton = document.getElementById("convertToWordButton");

convertToWordButton?.addEventListener("click", async () => {
  const blob = await convertMarkdownToDocx(markdownInput.value);
  downloadDocx(blob, "output.docx");
});
