export default class EventEmitter {
    constructor() {
        this.listeners = {};
        this.idToEventMap = {};
    }

    addListener = (event, callback) => {
        if (!this.listeners[event]) {
            this.listeners[event] = {};
        }
        const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
        this.listeners[event][id] = callback;
        this.idToEventMap[id] = event;
        return id;
    }

    emit = (event, params) => {
        if (this.listeners[event]) {
            for (const key in this.listeners[event]) {
                const callback = this.listeners[event][key];
                callback(params);
            }
        }
    }

    removeListenerForEvent = (event, id) => {
        if (this.listeners[event]) {
            delete this.listeners[event][id];
        }
    }

    removeListener = (id) => {
        if (this.idToEventMap[id]) {
            const event = this.idToEventMap[id];
            this.removeListenerForEvent(event, id);
        }
    }

    removeListeners = () => {
        for (var id in this.idToEventMap) {
            this.removeListener(id);
        }
    }
}