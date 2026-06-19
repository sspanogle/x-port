export function notImplementedMessage(commandName: string): string {
  return `${commandName} is not implemented yet.\n`;
}

export function invalidExportFormatMessage(format: string): string {
  return [
    `Unsupported export format: ${format}`,
    "Supported formats: md, json, csv",
    "",
  ].join("\n");
}
