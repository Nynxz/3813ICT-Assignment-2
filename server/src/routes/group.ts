import { Router } from 'express';
import { Gateway } from '../gateway';
import { registerHTTP } from '../lib/registerHTTP';
import {
  db_all_groups,
  db_group_add_user,
  db_group_cancel_request_to_join,
  db_group_channels,
  db_group_create,
  db_group_delete,
  db_group_populate,
  db_group_promote_user_to_group_admin,
  db_group_remove_user,
  db_group_request_to_join,
  db_group_update,
  db_group_users,
  db_respond_group_request_to_join,
  db_user_groups,
} from '../db/group';
import requireValidRole from '../middleware/requireValidRole';
import { Roles, UserModel } from '../db/types/user';
import requireHeader from '../middleware/requireHeader';
import requireAuthHeader from '../middleware/requireAuthHeader';
import requireBodyKey from '../middleware/requireBodyKey';
import requireObjectHasKeys from '../middleware/requireObjectHasKeys';
import {
  check_userIsAdminOfChannel,
  check_userIsAdminOfGroup,
} from '../db/channel';

export default (router: Router, gateway: Gateway) => {
  // OLD
  registerHTTP(
    'get',
    '/groups',
    router,
    async (req, res) => {
      res.send(await db_user_groups(res.locals.user));
    },
    [requireValidRole(Roles.USER)],
  );

  registerHTTP(
    'get',
    '/groups/all',
    router,
    async (req, res) => {
      res.send(await db_all_groups());
    },
    [],
  );

  registerHTTP(
    'get',
    '/groups/channels',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      res.send(await db_group_channels(res.locals.user, res.locals.group));
    },
    [requireHeader('group'), requireAuthHeader()],
  );

  registerHTTP(
    'get',
    '/groups/info',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      res.send(await db_group_populate(res.locals.group));
    },
    [requireHeader('group'), requireAuthHeader()],
  );

  registerHTTP(
    'get',
    '/groups/users',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      const users = await db_group_users(res.locals.group);
      res.send(users);
    },
    [requireHeader('group')],
  );

  registerHTTP(
    'post',
    '/groups/create',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      if (req.body.group.name == '') {
        return res.status(400).send({ error: 'Empty group name' });
      }
      const server = await db_group_create(res.locals.user._id, req.body.group);
      res.send(JSON.stringify(server));
    },
    [requireValidRole(Roles.ADMIN), requireObjectHasKeys('group', ['name'])],
  );

  registerHTTP(
    'post',
    '/groups/request',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      console.log(req.body.group);
      console.log(req.body.user);
      if (req.body.group._id == '') {
        return res.status(400).send({ error: 'Empty group ID' });
      }
      const server = await db_group_request_to_join(
        res.locals.user._id,
        req.body.group._id,
      );
      res.send(JSON.stringify(server));
    },
    [
      requireValidRole(Roles.USER),
      requireObjectHasKeys('group', ['_id']),
      requireObjectHasKeys('user', ['_id']),
    ],
  );

  registerHTTP(
    'post',
    '/groups/request/respond',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      console.log(req.body.group);
      console.log(req.body.user);
      if (req.body.group._id == '') {
        return res.status(400).send({ error: 'Empty group ID' });
      }
      const server = await db_respond_group_request_to_join(
        req.body.user._id,
        req.body.group._id,
        req.body.allow,
      );
      res.send(JSON.stringify(server));
    },
    [
      requireValidRole(Roles.USER),
      requireObjectHasKeys('group', ['_id']),
      requireObjectHasKeys('user', ['_id']),
      requireBodyKey('allow'),
    ],
  );

  registerHTTP(
    'post',
    '/groups/request/cancel',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      if (req.body.group._id == '') {
        return res.status(400).send({ error: 'Empty group ID' });
      }
      const server = await db_group_cancel_request_to_join(
        res.locals.user._id,
        req.body.group._id,
      );
      res.send(JSON.stringify(server));
    },
    [
      requireValidRole(Roles.USER),
      requireObjectHasKeys('group', ['_id']),
      requireObjectHasKeys('user', ['_id']),
    ],
  );

  registerHTTP(
    'post',
    '/groups/delete',
    router,
    async (req, res) => {
      //get the groups of the user who requested

      let user = await UserModel.findOne({
        username: res.locals.user.username,
      });
      if (
        (user &&
          (await check_userIsAdminOfGroup(user.id, req.body.group._id))) ||
        res.locals.user.roles.includes(Roles.SUPER)
      ) {
        const server = await db_group_delete(req.body.group);
        res.send(JSON.stringify(server));
      }
    },
    [requireValidRole(Roles.ADMIN)],
  );

  registerHTTP(
    'post',
    '/groups/update',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      if (req.body.group.groupName == '') {
        return res.status(400).send({ error: 'Empty group name' });
      }
      const server = await db_group_update(req.body.group);
      res.send(JSON.stringify(server));
    },
    [requireValidRole(Roles.ADMIN)],
  );

  registerHTTP(
    'post',
    '/groups/adduser',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      let user = await UserModel.findOne({
        username: res.locals.user.username,
      });
      if (
        (user &&
          (await check_userIsAdminOfGroup(user.id, req.body.group._id))) ||
        res.locals.user.roles.includes(Roles.SUPER)
      ) {
        res.send(
          await db_group_add_user(req.body.user.username, req.body.group._id),
        );
      } else {
        res.status(401).send({ error: 'Insufficent Permissions!' });
      }
    },
    [
      requireObjectHasKeys('group', ['_id']),
      requireObjectHasKeys('user', ['username']),
      requireValidRole(Roles.ADMIN),
    ],
  );

  registerHTTP(
    'post',
    '/groups/removeuser',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      let user = await UserModel.findOne({
        username: res.locals.user.username,
      });
      if (
        (user &&
          (await check_userIsAdminOfGroup(user.id, req.body.group._id))) ||
        res.locals.user.roles.includes(Roles.SUPER)
      ) {
        res.send(
          await db_group_remove_user(
            req.body.user.username,
            req.body.group._id,
          ),
        );
      } else {
        res.status(401).send({ error: 'Insufficent Permissions!' });
      }
    },
    [
      requireObjectHasKeys('group', ['_id']),
      requireObjectHasKeys('user', ['username']),
      requireValidRole(Roles.ADMIN),
    ],
  );

  registerHTTP(
    'post',
    '/groups/promoteuser',
    router,
    async (req, res) => {
      //get the groups of the user who requested
      res.send(
        await db_group_promote_user_to_group_admin(
          req.body.user,
          req.body.group,
          res.locals.user._id,
        ),
      );
    },
    [requireAuthHeader(), requireBodyKey('user'), requireBodyKey('group')],
  );
};
