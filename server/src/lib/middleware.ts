import { NextFunction, Request, Response } from "express";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// EXAMPLE

// export const requireNothing: Middleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (true) {
//     next();
//   } else {
//     res.send("Request Failed");
//   }
// };

// export const requireBodyHasKey: Middleware = (key: string) => {
//   return function (req: Request, res: Response, next: NextFunction) {
//     if ((req.body as Object).hasOwnProperty(key)) {
//       next();
//     } else {
//       res.send("Cannot find " + key);
//     }
//   };
// };
