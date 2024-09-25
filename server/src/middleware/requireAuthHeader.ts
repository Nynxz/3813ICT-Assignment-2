import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export default () => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      let auth = req.headers.authorization?.split(" ")[1];
      try {
        res.locals.user = verify(auth, process.env.JWTSECRET as string );
        next();
      } catch (error) {
        res.status(400).send({ error: "Invalid Auth Header" });
      }
    } else {
      res.status(400).send({ error: "Missing Auth Header" });
    }
  };
};
