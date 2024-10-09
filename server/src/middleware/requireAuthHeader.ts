import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export default () => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      console.log('Authorizing User...');
      let auth = req.headers.authorization?.split(' ')[1];
      try {
        res.locals.user = verify(auth, process.env.JWTSECRET as string);
        console.log('Authorized');
        next();
      } catch (error) {
        console.log('Failed');
        res.status(400).send({ error: 'Invalid Auth Header' });
      }
    } else {
      console.log('Failed');
      res.status(400).send({ error: 'Missing Auth Header' });
    }
  };
};
