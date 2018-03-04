import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class WebsocketService {

  ws: WebSocket;

  ee = new EventEmitter();

  constructor() {
    console.info('initializing websocket');
    this.ws = new WebSocket('wss://ptp.mroads.com:7443/groupcall');
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
  }

  startPingInterval() {
    setInterval(() => {
      this.sendMessage({ id: 'ping' });
    }, 30000);
  }

  addEventListener(listener) {
    this.ee.subscribe(listener);
  }


  onOpen() {
    console.info('web socket is opened');
    this.startPingInterval();
  }

  onClose() {
    console.info('WebSocket is closed', arguments);
  }

  onMessage(event) {
    console.info('message received', event.data);
    const message = JSON.parse(event.data);
    this.ee.emit(message);
  }

  sendMessage(message) {
    const stringMessage = JSON.stringify(message);
    this.waitForConnection(function () {
      this.ws.send(stringMessage);
    }.bind(this), 1000);
  }

  waitForConnection(callback, interval) {
    if (this.ws.readyState === 1) {
      callback();
    } else {
      setTimeout(() => {
        this.waitForConnection(callback, interval);
      }, interval);
    }
  }


}
