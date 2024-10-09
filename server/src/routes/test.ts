import { Request, Response, Router } from 'express';
import { Gateway } from '../gateway';
import { registerHTTP } from '../lib/registerHTTP';
import requireBodyKey from '../middleware/requireBodyKey';
import requireValidRole from '../middleware/requireValidRole';
import { Roles } from '../db/types/user';

export default (router: Router, gateway: Gateway) => {
  registerHTTP('get', '/', router, (req, res) => {
    res.send('Connected to Backend');
  });

  //TODO: table tennis kinda bad, to remove
  registerHTTP(
    'post',
    '/ping',
    router,
    async (req, res) => {
      console.log('GOT PING');
      res.send('pong');
    },
    [requireBodyKey('hello')],
  );

  registerHTTP(
    'get',
    '/hello',
    router,
    async (req: Request, res: Response) => {
      res.send(`Hello World`);
    },
    [],
  );
};
