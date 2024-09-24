import { Response } from "express";
import { Logger } from "./logger";

export const debugCurrentDate = (text: string) => {
  const date = new Date();
  return `${text} \t@ ${date.toDateString()} ${date.toLocaleTimeString()}`;
};

export const logResponseStatus = (
  res: Response,
  method: string,
  endpoint: string
) => {
  const s = `${res.statusCode} ${method.toUpperCase()} ${endpoint}`;
  switch (Math.floor(res.statusCode / 100)) {
    case 2:
      Logger.logDebugGreen(s);
      break;
    case 3:
      Logger.logDebugOrange(s);
      break;
    default:
      Logger.logDebugRed(s);
  }
  // res.statusCode !== 200 ? Logger.logDebugRed(s) : Logger.logDebugGreen(s);
};
