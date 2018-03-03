import { EventEmitter } from '@angular/core';


export class Participant {
    name: String;
    isLocal: boolean;
    stream;
    pc: RTCPeerConnection;
    ee = new EventEmitter();


    constructor(name: String, isLocal: boolean) {
        this.name = name;
        this.isLocal = isLocal;
    }

    subscribe(callback) {
        this.ee.subscribe(callback);
    }

    createPeers(stream) {
        this.pc = new RTCPeerConnection(null);
        this.pc.addStream(stream);

        const that = this;

        this.pc.onicecandidate = function (event) {
            console.info("new candidate generated for sender", that.name,
                event.candidate);
            if (event.candidate) {
                var message = {
                    id: 'iceCandidate',
                    candidate: event.candidate,
                    sender: that.name
                };
                that.ee.emit(message);
            }
        }

        this.pc.onaddstream = function (event) {
            console.info("remote stream detected", name, event.stream);
            that.stream = event.stream;
            that.ee.emit({ id: "updateZone" });
        }

        this.pc.oniceconnectionstatechange = function () {
            console.info("ice connection state changed for ", name, this.iceConnectionState);
        }

        this.pc.onremovestream = function (event) {
            console.info("stream removed");
            that.stream = undefined;
        }
    }

    dispose = function () {
        console.log('Disposing participant ' + this.name);
        if (this.pc)
            this.pc.close();
    };

    generateSdp() {
        const that = this;
        this.pc.createOffer().then(function (sdp) {
            that.pc.setLocalDescription(sdp);
            var msg = {
                id: "sdp",
                sender: that.name,
                sdp: sdp
            };
            that.ee.emit(msg);
        }).catch(console.error);
    }

    setSdp(sdp) {
        sdp.type === 'answer' ? this.pc.setRemoteDescription(sdp) : this
            .createAnswer(sdp);
    }

    createAnswer(sdp) {
        const that = this;
        this.pc.setRemoteDescription(sdp).then(function () {
            that.pc.createAnswer(function (sdp) {
                that.pc.setLocalDescription(sdp);
                var msg = {
                    id: "sdp",
                    sender: that.name,
                    sdp: sdp
                };
                that.ee.emit(msg);
            }, console.error);
        }, console.error);
    }

    addIceCandidate(message) {
        this.pc.addIceCandidate(message.candidate);
    }
}
