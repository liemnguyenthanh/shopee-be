import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserSocket, UserSocketList } from './gatewat.entries';
import { Server } from 'socket.io';
import { roomList } from 'src/rooms/dataRoom';
@WebSocketGateway(1612, { cors: '*' })
export class AppGateway {
  @WebSocketServer()
  server: Server;
  private users: UserSocketList = {};
  private rooms: any = roomList;
  /* === function get user from token === */
  async getDataUserFromToken(client: any): Promise<any> {
    // const authToken: any = client.handshake?.query?.token;
    // try {
    //   const decoded = this.jwtService.verify(authToken);
    //   return await this.userService.getUserByEmail(decoded.email); // response to function
    // } catch (ex) {
    //   throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    // }
  }

  async handleConnection(client: any) {
    // const user: UserEntity = await this.getDataUserFromToken(client);
    const user: UserSocket = {
      user_id: client.handshake.query.user_id,
      client_id: client.id,
    };
    console.log('connection:::', user);
    this.users[user.user_id] = user;
    const response = {
      key: 'usersOnline',
      data: this.users,
    };
    this.server.emit('ON_CONNECT', response);
  }

  async handleDisconnect(client: any) {
    const user_id = client.handshake.query.user_id;
    console.log('client disconnect:::', this.users[user_id]);
    if (client.id in this.users) delete this.users[user_id];
  }

  @SubscribeMessage('SEND_MESSAGE')
  async messages(client: any, payload: any) {
    // lấy list users in room
    const room_main = this.rooms.find((d) => d.id === payload.room_id);
    if (!room_main) return;
    const response = {
      key: 'newMessage',
      data: payload,
    };
    console.log('users', this.users);

    /// kiểm tra socket có ai online có trong room thì gửi tin nhắn đến người đó
    room_main.users.forEach((item: string) => {
      const socket = this.users[item].client_id;
      if (socket) this.server.to(socket).emit('RECEIVE_MESSAGE', response);
    });

    // client.emit('RECEIVE_MESSAGE', response);
  }
}
