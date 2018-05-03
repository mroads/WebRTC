import EventEmitter from "../models/EventEmitter";



class Socket {

    ee = new EventEmitter();

    constructor() {
        const ws = new WebSocket('wss://ptp.mroads.com:7443/groupcall');

        ws.onopen = () => {
            console.info('websocket openned');
        }

        ws.onclose = () => {
            console.error('websocket closed');
        }


        waitForConnection = (callback) => {
            console.info(ws.readyState);
            if (ws.readyState === 1) {
                callback();
            }
            else {
                setTimeout(function () {
                    waitForConnection(callback);
                }, 1000);
            }
        }

        sendMessage = (message) => {
            waitForConnection(() => {
                console.info('sending message', message);
                ws.send(JSON.stringify(message));
            });
        }

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.info('received message', message);
            this.ee.emit(message.id, message);
        }
    }

    removeListeners = () => {
        this.ee.removeListeners();
    }
}

// const socket = new Socket();

export default new Socket();