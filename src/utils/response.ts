import { ServerResponse } from "http";

export function send<T>(
  res: ServerResponse,
  status: number,
  data: T
): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}