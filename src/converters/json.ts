import { remark } from "remark";
import remarkParse from "remark-parse";
import { downloadWithData } from "../utils";

const processor = remark().use(remarkParse);

export function convertToJSON(md: string) {
  const json = JSON.stringify(processor.parse(md), null, 2);
  downloadWithData(json, "application/json", "output.json");
}
