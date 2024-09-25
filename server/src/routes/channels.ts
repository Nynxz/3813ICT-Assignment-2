import { Router } from "express";
import { registerHTTP } from "../lib/registerHTTP";
import {
  check_userIsAdminOfChannel,
  check_userIsAdminOfGroup,
  db_channel_add_user,
  db_channel_create,
  db_channel_delete,
  db_channel_getMessages,
  db_channel_remove_user,
  db_channel_update,
  db_channel_users,
} from "../db/channel";
import requireHeader from "../middleware/requireHeader";
import requireValidRole from "../middleware/requireValidRole";
import { Roles } from "../db/types/user";
import { Gateway } from "../gateway";
import requireBodyKey from "../middleware/requireBodyKey";

export default (router: Router, gateway: Gateway) => {
  registerHTTP(
    "get",
    "/channel/messages",
    router,
    async (req, res) => {
      //get the groups of the user who requested
      res.send(await db_channel_getMessages(res.locals.channel));
    },
    [requireHeader("channel")]
  );

  registerHTTP(
    "get",
    "/channel/users",
    router,
    async (req, res) => {
      //get the groups of the user who requested
      res.send(await db_channel_users(res.locals.channel));
    },
    [requireHeader("channel")]
  );

  registerHTTP(
    "post",
    "/channel/adduser",
    router,
    async (req, res) => {
      console.log(res.locals.user._id, req.body.channel);
      if (
        (await check_userIsAdminOfChannel(
          res.locals.user._id,
          req.body.channel
        )) ||
        res.locals.user.roles.includes(Roles.SUPER)
      ) {
        res.send(
          await db_channel_add_user(req.body.channel, req.body.username)
        );
      } else {
        res.status(401).send({ error: "Insufficent Permissions!" });
      }
      //require user is admin of channel
    },
    [
      requireBodyKey("channel"),
      requireBodyKey("username"),
      requireValidRole(Roles.ADMIN),
    ]
  );

  registerHTTP(
    "post",
    "/channel/removeuser",
    router,
    async (req, res) => {
      if (
        (await check_userIsAdminOfChannel(
          res.locals.user._id,
          req.body.channel
        )) ||
        res.locals.user.roles.includes(Roles.SUPER)
      ) {
        res.send(
          await db_channel_remove_user(req.body.channel, req.body.username)
        );
      } else {
        res.status(401).send({ error: "Insufficent Permissions!" });
      }
    },
    [
      requireBodyKey("channel"),
      requireBodyKey("username"),
      requireValidRole(Roles.ADMIN),
    ]
  );

  //OLD
  registerHTTP(
    "post",
    "/channel/create",
    router,
    async (req, res) => {
      //get the groups of the user who requested
      res.send(await db_channel_create(req.body.channel));
    },
    [requireValidRole(Roles.ADMIN)]
  );

  registerHTTP(
    "post",
    "/channel/delete",
    router,
    async (req, res) => {
      //get the groups of the user who requested
      res.send(await db_channel_delete(req.body.channel));
    },
    [requireValidRole(Roles.ADMIN)]
  );

  registerHTTP(
    "post",
    "/channel/update",
    router,
    async (req, res) => {
      //get the groups of the user who requested
      if (
        (await check_userIsAdminOfChannel(
          res.locals.user._id,
          req.body.channel
        )) ||
        res.locals.user.roles.includes(Roles.SUPER)
      ) {
        res.send(await db_channel_update(req.body.channel));
      } else {
        res.status(401).send({ error: "Insufficent Permissions!" });
      }
    },
    [requireValidRole(Roles.ADMIN)]
  );
};
