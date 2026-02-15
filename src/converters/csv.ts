import { downloadWithData } from "../utils";

export function convertToCSV(md: string) {
  const lines = md.trim().split("\n");
  const dataLines = lines.filter((line) => !/^(\s*\|?\s*-+.*)+$/.test(line));
  const csvDataLines = dataLines.map((line) => {
    const cells = line.replace(/^\s*\||\|\s*$/g, "").split("|");
    return cells.map((cell) => cell.trim()).join(",");
  });
  downloadWithData(csvDataLines.join("\n"), "text/csv", "output.csv");
}
