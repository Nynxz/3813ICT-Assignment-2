import { Router } from "express";
import { db_user_delete, db_user_update } from "../db/user";
import requireValidRole from "../middleware/requireValidRole";
import requireObjectHasKeys from "../middleware/requireObjectHasKeys";
import { registerHTTP } from "../lib/registerHTTP";
import { Roles } from "../db/types/user";
import { Gateway } from "../gateway";

export default (router: Router, gateway: Gateway) => {
  registerHTTP(
    "post",
    "/super/updateuser",
    router,
    async (req, res) => {
      let updatedUser = await db_user_update(req.body.user);
      res.send(updatedUser);
    },
    [requireValidRole(Roles.SUPER), requireObjectHasKeys("user", ["_id"])]
  );

  registerHTTP(
    "post",
    "/super/deleteuser",
    router,
    async (req, res) => {
      res.send(await db_user_delete(req.body.user));
    },
    [requireValidRole(Roles.SUPER)]
  );
};
