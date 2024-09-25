import { Router } from "express";
import { registerHTTP } from "../lib/registerHTTP";
import { db_user_create, db_user_find, db_users_all } from "../db/user";
import { generateUserJWT } from "../lib/jwt";
import { Roles, User } from "../db/types/user";
import requireObjectHasKeys from "../middleware/requireObjectHasKeys";
import requireValidRole from "../middleware/requireValidRole";
import { Gateway } from "../gateway";

export default (router: Router, gateway: Gateway) => {
  registerHTTP(
    "get",
    "/users/all",
    router,
    async (req, res) => {
      const users = await db_users_all();
      res.send(users);
    },
    [requireValidRole(Roles.SUPER)]
  );

  registerHTTP(
    "post",
    "/user/register",
    router,
    async (req, res) => {
      const user = await db_user_create(req.body.user);
      if (user) {
        res.send({
          jwt: generateUserJWT(user as Partial<User>),
        });
      } else {
        res.status(401).send({ error: "User Exists" });
      }
    },
    [requireObjectHasKeys("user", ["username", "email", "password"])]
  );

  registerHTTP(
    "post",
    "/user/login",
    router,
    async (req, res) => {
      const user = await db_user_find(req.body.user);
      if (user) {
        res.send({
          jwt: generateUserJWT(user as Partial<User>),
        });
      } else {
        res.status(401).send("Invalid Login");
      }
    },
    [requireObjectHasKeys("user", ["username", "password"])]
  );

  registerHTTP("post", "/user/update", router, (req, res) => {});

};
