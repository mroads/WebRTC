import { EventEmitter } from '@angular/core';


export class Participant {
    name: String;
    isLocal: boolean;
    stream;
    pc: any;
    ee = new EventEmitter();
    states = { audio: true, video: true };
    localStream: MediaStream;


    constructor(name: String, isLocal: boolean) {
        this.name = name;
        this.isLocal = isLocal;
    }

    subscribe(callback) {
        this.ee.subscribe(callback);
    }


    onIceCandidate(event) {
        console.info('new candidate generated for sender', this.name,
            event.candidate);
        if (event.candidate) {
            const message = {
                id: 'iceCandidate',
                candidate: event.candidate,
                sender: this.name
            };
            this.ee.emit(message);
        }
    }

    onIceConnectionStateChange() {
        console.info('ice connection state changed for ', name, this.pc.iceConnectionState);
    }

    onAddStream(event) {
        console.info('remote stream detected', name, event.stream);
        this.stream = event.stream;
        this.ee.emit({ id: 'updateZone' });
    }

    onRemoveStream() {
        console.info('stream removed');
        this.stream = undefined;
    }

    handlePC(stream) {
        this.pc.addStream(stream);
        this.pc.onicecandidate = this.onIceCandidate.bind(this);
        this.pc.onaddstream = this.onAddStream.bind(this);
        this.pc.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
        this.pc.onremovestream = this.onRemoveStream.bind(this);
    }

    createPeers(stream) {
        const configuration = {
            iceServers: [{
                'url': 'stun:s1.xirsys.com'
            }, {
                'username': '81ac8c88-31dd-11e8-9043-1e88bfcb2bb6',
                'urls': ['turn:s2.xirsys.com:80?transport=udp', 'turn:s2.xirsys.com:3478?transport=udp'
                    , 'turn:s2.xirsys.com:80?transport=tcp', 'turn:s2.xirsys.com:3478?transport=tcp',
                    'turns:s2.xirsys.com:443?transport=tcp', 'turns:s2.xirsys.com:5349?transport=tcp'],
                'credential': '81ac8dc8-31dd-11e8-aa9a-c7c00be2f28f'
            }]
        };
        this.pc = new RTCPeerConnection(configuration);
        this.localStream = stream;
        this.handlePC(stream);
    }

    dispose() {
        console.log('Disposing participant ' + this.name);
        if (this.pc) {
            this.pc.close();
        }
    }

    onOffer(sdp) {
        this.pc.setLocalDescription(sdp);
        const msg = {
            id: 'sdp',
            sender: this.name,
            sdp: sdp
        };
        this.ee.emit(msg);
    }

    generateSdp() {
        this.pc.createOffer().then(this.onOffer.bind(this)).catch(console.error);
    }

    setSdp(sdp) {
        sdp.type === 'answer' ? this.pc.setRemoteDescription(sdp) : this
            .createAnswer(sdp);
    }

    createAnswer(desc) {
        this.pc.setRemoteDescription(desc).then(this.onSetDescriptionSuccess.bind(this)).catch(this.onSetDescriptionFailed);
    }

    addIceCandidate(message) {
        this.pc.addIceCandidate(message.candidate);
    }

    removeTrack(track) {
        this.pc.getSenders().forEach(function (sender) {
            if (sender.track === track) {
                this.pc.removeTrack(sender);
            }
        }.bind(this));
    }

    addTrack(track) {
        this.pc.addTrack(track, this.localStream);
    }

    onSetDescriptionSuccess() {
        this.pc.createAnswer().then(this.onOffer.bind(this)).catch(this.onSetDescriptionFailed);
    }


    onSetDescriptionFailed(error) {
        console.error('Setting description failed', error);
    }
}
