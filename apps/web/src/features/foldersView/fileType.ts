const fileTypeLabels: Record<string, string> = {
  "application/pdf": "PDF",
  "text/plain": "Text",
  "text/markdown": "Markdown",
  "image/png": "PNG",
  "image/jpeg": "JPEG",
  "application/json": "JSON",
  "text/csv": "CSV",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xsl",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Word",
};

export function getFileTypeLabel(contentType: string): string {
  const normalizedContentType = contentType
    .split(";", 1)[0]
    .trim()
    .toLowerCase();

  return fileTypeLabels[normalizedContentType] ?? "Other";
}
