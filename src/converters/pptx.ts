import PptxGenJS from "pptxgenjs";

const SLIDE_TEXT_OPTIONS = { x: 0.5, y: 0.5, w: 9, h: 5, fontSize: 24 };

function normalizeHeadings(slide: string) {
  return slide.replace(/^#\s+/gm, "").trim();
}

export function convertToPPTX(md: string) {
  const pptx = new PptxGenJS();

  const slideContents = md.split(/\n---\n/).map(normalizeHeadings);
  slideContents.forEach((content) => {
    pptx.addSlide().addText(content, SLIDE_TEXT_OPTIONS);
  });

  pptx.writeFile({ fileName: "output.pptx" });
}
