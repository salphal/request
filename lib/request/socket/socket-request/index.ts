type MessageHandler = (data: string) => void;

export class SocketRequest {
  private socket: WebSocket | null = null;

  private messageHandlers: MessageHandler[] = [];

  connect(url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.socket = new WebSocket(url);
      this.socket.onopen = () => {
        resolve();
      };
      this.socket.onerror = (error) => {
        reject(error);
      };
      this.socket.onmessage = (event) => {
        this.messageHandlers.forEach((handler) => handler(event.data));
      };
    });
  }

  onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  send(data: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.socket) {
        this.socket.send(data);
        resolve();
      } else {
        reject(new Error('WebSocket is not connected.'));
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
