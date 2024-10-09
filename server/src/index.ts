import { Gateway } from './gateway';
import { Server } from 'socket.io';

(async () => {
  const gateway = new Gateway();
  await gateway.connectToMongoDB();
  await gateway.start();

  const http = require('http');
  const server = http.createServer(gateway.app);

  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: any) => {
    console.log('Connected');
    io.emit('message', { type: 'notification', data: socket.id });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    socket.on('message', (message: any) => {
      console.log(message);
      switch (message.type) {
        case 'user-joined':
          console.log(message.data);
          break;
        case 'new-message':
          console.log(JSON.parse(message.data));
          io.emit('message', {
            type: 'new-message',
            data: message.data,
          });
          break;
      }
    });
  });

  server.listen(3011, () => {
    console.log('SocketIO Listening On: 3011');
  });
})();
