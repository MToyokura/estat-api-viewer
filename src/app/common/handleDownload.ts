export function handleDownload(data: string, fileFormat: string) {
  const blob = new Blob([data], { type: getContentType(fileFormat) });
  const linkElement = document.createElement("a");
  const url = URL.createObjectURL(blob);
  linkElement.setAttribute("href", url);
  linkElement.setAttribute(
    "download",
    `data_${getFormattedDateTime()}.${fileFormat}`,
  );
  linkElement.click();
  URL.revokeObjectURL(url);
}

function getContentType(fileFormat: string) {
  if (fileFormat === "json") {
    return "application/json";
  }
  if (fileFormat === "csv") {
    return "text/csv";
  }
  return "";
}

function getFormattedDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
