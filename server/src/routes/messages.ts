import { Router } from 'express';
import { Gateway } from '../gateway';
import { registerHTTP } from '../lib/registerHTTP';
import { db_message_send } from '../db/message';
import requireValidRole from '../middleware/requireValidRole';
import requireObjectHasKeys from '../middleware/requireObjectHasKeys';
import { Roles } from '../db/types/user';

export default (router: Router, gateway: Gateway) => {
  registerHTTP(
    'post',
    '/message/send',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      console.log('GOT NEW MESSAGE!');
      console.log(req.body);
      let fileNames = [];

      if (req.files) {
        console.log('GOT FILES!');
        console.log(req.files);
        fileNames = (req.files as any[]).map((file: any) => file.filename); // or use file.originalname if you want the original names
      }
      if (!req.body.message && !req.body.fileNames) return;
      const m = await db_message_send(
        req.body.message,
        req.body.channel,
        res.locals.user._id,
        fileNames,
      );
      const objToSend = {
        images: fileNames,
        channel: req.body.channel,
        sender: res.locals.user,
        content: req.body.message,
      };
      console.log('Emitting');
      console.log(objToSend);
      gateway.io.emit('message', {
        type: 'new-message',
        data: JSON.stringify(objToSend),
      });
      res.send(m);
    },
    [
      requireValidRole(Roles.USER),
      // requireObjectHasKeys('message', ['content', 'channel']),
      gateway.upload.array('images'),
    ],
  );
};
