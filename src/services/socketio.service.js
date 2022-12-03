import { io } from 'socket.io-client';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io("http://localhost:3000");
  }
  disconnect(){
    this.socket.disconnect()
  }
}

export default new SocketioService();