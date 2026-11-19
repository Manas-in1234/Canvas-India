/** Builds a CSV that opens correctly in Excel (UTF-8 with a BOM, quotes and line breaks escaped). */
function cell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  // A leading = + - @ can be run as a formula when the file is opened in a spreadsheet; neutralise it.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  return "﻿" + [headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
}

export function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
  const blob = new Blob([toCsv(headers, rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
