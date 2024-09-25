import { NextFunction, Request, Response } from "express";
import { Logger } from "../lib/logger";

export default (object: string, keys: string[]) => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!(req.body as Object).hasOwnProperty(object)) {
      Logger.logRed("ObjectHasKeys: Error");
      res.status(400).send({ error: "Cannot find " + object });
    } else {
      let allKeysFound = true;

      keys.forEach((key) => {
        if (!(req.body[object] as Object).hasOwnProperty(key) && allKeysFound) {
          allKeysFound = false;
          res
            .status(400)
            .send({
              error:
                "Cannot find " + key + " in Request Body Object: " + object,
            });
        }
      });

      if (allKeysFound) {
        next();
      }
    }
  };
};
