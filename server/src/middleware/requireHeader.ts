import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export default (header: string) => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.headers[header]) {
      res.locals[header] = req.headers[header];
      try {
        next();
      } catch (error) {
        res.status(400).send({ error: "Invalid Header" });
      }
    } else {
      res.status(400).send({ error: `Missing ${header} Header` });
    }
  };
};
