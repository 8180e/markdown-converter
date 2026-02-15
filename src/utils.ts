const a = document.createElement("a");

export function download(url: string, filename: string) {
  a.href = url;
  a.download = filename;
  a.click();
}

export function downloadWithData(data: string, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  download(url, filename);
  URL.revokeObjectURL(url);
}
