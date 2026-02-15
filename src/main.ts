function onButtonClick(elementId: string, listener: () => unknown) {
  document.getElementById(elementId)?.addEventListener("click", listener);
}

const markdownInput = document.getElementById(
  "markdownInput",
) as HTMLInputElement;

onButtonClick("convertToWordButton", async () => {
  const { convertToDocx } = await import("./converters/docx");
  await convertToDocx(markdownInput.value);
});

onButtonClick("convertToPDFButton", async () => {
  const { convertToPDF } = await import("./converters/pdf");
  convertToPDF(markdownInput.value);
});

onButtonClick("convertToHTMLButton", async () => {
  const { convertToHTML } = await import("./converters/html");
  convertToHTML(markdownInput.value);
});

onButtonClick("convertToPNGButton", async () => {
  const { convertToPNG } = await import("./converters/png");
  await convertToPNG(markdownInput.value);
});

onButtonClick("convertToTXTButton", async () => {
  const { convertToTXT } = await import("./converters/txt");
  convertToTXT(markdownInput.value);
});

onButtonClick("convertToCSVButton", async () => {
  const { convertToCSV } = await import("./converters/csv");
  convertToCSV(markdownInput.value);
});

onButtonClick("convertToJSONButton", async () => {
  const { convertToJSON } = await import("./converters/json");
  convertToJSON(markdownInput.value);
});

onButtonClick("convertToLaTeXButton", async () => {
  const { convertToLaTex } = await import("./converters/latex");
  convertToLaTex(markdownInput.value);
});

onButtonClick("convertToRTFButton", async () => {
  const { convertToRTF } = await import("./converters/rtf");
  convertToRTF(markdownInput.value);
});

onButtonClick("convertToPPTXButton", async () => {
  const { convertToPPTX } = await import("./converters/pptx");
  convertToPPTX(markdownInput.value);
});

onButtonClick("convertToBBCodeButton", async () => {
  const { convertToBBCode } = await import("./converters/bbcode");
  convertToBBCode(markdownInput.value);
});

const markdownFileInput = document.getElementById(
  "markdownFileInput",
) as HTMLInputElement;

markdownFileInput.addEventListener("change", () => {
  if (!markdownFileInput.files) return;

  const reader = new FileReader();
  reader.onload = ({ target }) => {
    if (typeof target?.result === "string") markdownInput.value = target.result;
  };
  reader.readAsText(markdownFileInput.files[0]);
});

const toggleButton = document.getElementById("themeToggle");

if (toggleButton) {
  toggleButton.textContent = document.documentElement.classList.contains(
    "light",
  )
    ? "Switch to Dark Mode"
    : "Switch to Light Mode";

  toggleButton.addEventListener("click", () => {
    if (document.documentElement.classList.contains("light")) {
      document.documentElement.classList.replace("light", "dark");
      localStorage.setItem("theme", "dark");
      toggleButton.textContent = "Switch to Light Mode";
    } else {
      document.documentElement.classList.replace("dark", "light");
      localStorage.setItem("theme", "light");
      toggleButton.textContent = "Switch to Dark Mode";
    }
  });
}
