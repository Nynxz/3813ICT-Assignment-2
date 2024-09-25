import { NextFunction, Request, Response } from "express";

export default (key: string) => {
  return function (req: Request, res: Response, next: NextFunction) {
    if ((req.body as Object).hasOwnProperty(key)) {
      next();
    } else {
      res.status(400).send({ error: "Cannot find " + key });
    }
  };
};
