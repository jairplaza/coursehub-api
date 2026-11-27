import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket): void {
    this.logger.log(`Cliente conectado a /notifications: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Cliente desconectado de /notifications: ${client.id}`);
  }

  notifyCourseCreated(payload: { id?: string; title?: string }): void {
    this.server.emit('course.created', {
      event: 'course.created',
      data: payload,
      timestamp: new Date().toISOString(),
    });
  }
}

