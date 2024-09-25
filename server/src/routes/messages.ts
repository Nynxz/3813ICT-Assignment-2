import { Router } from "express";
import { Gateway } from "../gateway";
import { registerHTTP } from "../lib/registerHTTP";
import { db_message_send } from "../db/message";
import requireValidRole from "../middleware/requireValidRole";
import requireObjectHasKeys from "../middleware/requireObjectHasKeys";
import { Roles } from "../db/types/user";

export default (router: Router, gateway: Gateway) => {
  registerHTTP(
    "post",
    "/message/send",
    router,
    async (req, res) => {
      //get the groups of the user who requested
      res.send(
        await db_message_send(
          req.body.message.content,
          req.body.message.channel,
          res.locals.user._id
        )
      );
    },
    [
      requireValidRole(Roles.USER),
      requireObjectHasKeys("message", ["content", "channel"]),
    ]
  );
};
