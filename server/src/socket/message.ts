import { Server, Socket } from 'socket.io';

export const onMessage = (socket: Socket, io: Server) => {
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
};
