import { Router } from 'express';
import { registerHTTP } from '../lib/registerHTTP';
import {
  db_user_create,
  db_user_find,
  db_user_update_profile_image,
  db_users_all,
} from '../db/user';
import { generateUserJWT } from '../lib/jwt';
import { Roles, User, UserModel } from '../db/types/user';
import requireObjectHasKeys from '../middleware/requireObjectHasKeys';
import requireValidRole from '../middleware/requireValidRole';
import { Gateway } from '../gateway';
import requireAuthHeader from '../middleware/requireAuthHeader';

export default (router: Router, gateway: Gateway) => {
  registerHTTP(
    'get',
    '/users/all',
    router,
    async (req, res) => {
      const users = await db_users_all();
      res.send(users);
    },
    [requireValidRole(Roles.SUPER)],
  );

  registerHTTP(
    'post',
    '/user/register',
    router,
    async (req, res) => {
      const user = await db_user_create(req.body.user);
      if (user) {
        res.send({
          jwt: generateUserJWT(user as Partial<User>),
        });
      } else {
        res.status(401).send({ error: 'User Exists' });
      }
    },
    [requireObjectHasKeys('user', ['username', 'email', 'password'])],
  );

  registerHTTP(
    'post',
    '/user/login',
    router,
    async (req, res) => {
      const user = await db_user_find(req.body.user);
      if (user) {
        res.send({
          jwt: generateUserJWT(user as Partial<User>),
        });
      } else {
        res.status(401).send('Invalid Login');
      }
    },
    [requireObjectHasKeys('user', ['username', 'password'])],
  );

  registerHTTP(
    'post',
    '/user/refresh',
    router,
    async (req, res) => {
      let user = await UserModel.findById(res.locals.user);
      const user2 = await db_user_find({
        username: user!.username,
        password: user!.password,
      } as Partial<User>);

      if (user) {
        res.send({
          jwt: generateUserJWT(user2 as Partial<User>),
        });
      } else {
        res.status(401).send('Invalid Login');
      }
    },
    [requireAuthHeader()],
  );

  registerHTTP('post', '/user/update', router, (req, res) => {});

  registerHTTP(
    'post',
    '/user/updateprofilepicture',
    router,
    async (req, res) => {
      console.log('GOT IMAGE YAY');
      console.log('maybe');
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      await db_user_update_profile_image(res.locals.user, req.file.filename);
      console.log(res.locals.user);
      console.log('File uploaded:', req.file); // Log the uploaded file info
      res.send('File uploaded successfully.');
    },
    [requireAuthHeader(), gateway.upload.single('image')],
  );
};
