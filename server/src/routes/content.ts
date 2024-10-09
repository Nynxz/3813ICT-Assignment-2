import { Router } from 'express';
import { Gateway } from '../gateway';
import { registerHTTP } from '../lib/registerHTTP';
import { db_channel_getMessages } from '../db/channel';
import requireHeader from '../middleware/requireHeader';

export default (router: Router, gateway: Gateway) => {
  registerHTTP(
    'get',
    '/content/images',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      res.send(await db_channel_getMessages(res.locals.channel));
    },
    [requireHeader('image')],
  );
};
