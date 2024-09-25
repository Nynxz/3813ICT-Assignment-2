import { NextFunction, Request, Response } from "express";
import requireAuthHeader from "./requireAuthHeader";
import { Roles } from "../db/types/user";

export default (role: Roles) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const requireAuth = requireAuthHeader();
    requireAuth(req, res, () => {
      const user = res.locals.user;
      if (user) {
        if (
          user.roles &&
          (user.roles.includes(role) || user.roles.includes(Roles.SUPER))
        ) {
          next();
        } else {
          res.status(401);
          res.send({ error: "Invalid JWT Role: " + Roles[role] });
        }
      } else {
        res.status(400).send({ error: "No given JWT" });
      }
    });
  };
};
