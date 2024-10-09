import express from 'express';
import { readdirSync } from 'fs';
import cors from 'cors';
import { Logger } from './lib/logger';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import * as fs from 'node:fs';
import { Server } from 'socket.io';
import http from 'http';
import { onMessage } from './socket/message';

config(); //Load .env file

export class Gateway {
  app;
  router;
  upload = multer({ dest: 'uploads/' });
  static debug = false;

  server;
  io;

  constructor() {
    Logger.logOrangeUnderline('----Gateway----');
    this.app = express();
    this.router = express.Router();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());

    const http = require('http');
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: '*',
      },
    });

    this.checkDebug();
    this.initSocket();
  }

  initSocket() {
    this.io.on('connection', (socket: any) => {
      console.log('Connected');
      this.io.emit('message', { type: 'notification', data: socket.id });
      onMessage(socket, this.io);

      socket.on('disconnect', () => {
        console.log('Disconnected');
      });

      // socket.on('message', (message: any) => {
      //   console.log(message);
      //   switch (message.type) {
      //     case 'user-joined':
      //       console.log(message.data);
      //       break;
      //     case 'new-message':
      //       console.log(JSON.parse(message.data));
      //       this.io.emit('message', {
      //         type: 'new-message',
      //         data: message.data,
      //       });
      //       break;
      //   }
      // });
    });
  }

  checkDebug() {
    if (process.env['DEBUG'] == 'true') {
      Gateway.debug = true;
      Logger.logDebugRed('DEBUG ENABLED');
    }
  }

  async connectToMongoDB() {
    try {
      Logger.logGreen('Connecting to MongoDB...');
      const uri = process.env['MONGODB_URI'] as string;
      await mongoose.connect(uri);
      Logger.logGreen('Connected');
    } catch (error) {
      Logger.logRed('MongoDB Connection Error');
    }
  }

  async loadRoutes() {
    Logger.logOrange('Loading Routes:');
    await this._loadRoutesFolder();
    this.app.use('/api/v1', this.router);
  }

  async start() {
    await this.loadRoutes();
    this.app.use('/uploads/:filename', (req, res, next) => {
      const filePath = path.join(process.cwd(), 'uploads', req.params.filename);

      fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
          res.sendFile(path.join(__dirname, 'uploads', 'default-image.png'));
        } else {
          res.sendFile(filePath);
        }
      });
    });

    this.app.listen(process.env['PORT'], () => {
      Logger.logOrange(`API Listening On: ${process.env['PORT']}`);
    });

    this.server.listen(process.env['SOCKET_PORT'], () => {
      Logger.logOrange(`SocketIO Listening On: ${process.env['SOCKET_PORT']}`);
    });
  }

  // Load /src/routes/*.ts files
  private async _loadRoutesFolder() {
    const routesDir = './src/routes';
    const routeFiles = readdirSync(routesDir).filter((file) =>
      file.endsWith('.ts'),
    );
    for (const file of routeFiles) {
      Logger.logGreenUnderline(`----${file}----`);
      const registerRoutes = await import('./routes/' + file);
      const registerFunc = registerRoutes.default;
      if (typeof registerFunc === 'function') {
        registerFunc(this.router, this);
      }
    }
  }
}
