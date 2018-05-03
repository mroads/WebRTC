import EventEmitter from "../EventEmitter";
import RTCPeerConnection from "react-native-webrtc/RTCPeerConnection";

export default class Participant {
    name;
    isLocal;
    stream;
    pc;
    ee = new EventEmitter();
    states = { audio: true, video: true };
    localStream;


    constructor(name, isLocal) {
        this.name = name;
        this.isLocal = isLocal;
    }

    subscribe(callback) {
        this.ee.addListener('message', callback);
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
            this.ee.emit('message', message);
        }
    }

    onIceConnectionStateChange() {
        console.info('ice connection state changed for ', this.name, this.pc.iceConnectionState);
    }

    onAddStream(event) {
        console.info('remote stream detected', this.name, event.stream);
        this.stream = event.stream;
        this.ee.emit('message', { id: 'updateZone' });
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

    prioritizeCodec(desc, codec) {
        var h264 = this.findCodecId(desc, codec);
        if (h264 !== null && desc && desc.sdp) {
            var sdp = desc.sdp;
            var m = sdp.match(/m=video\s(\d+)\s[A-Z\/]+\s([0-9\ ]+)/);
            if (m && m.length == 3) {
                var candidates = m[2].split(" ");
                var prioritized = [];
                Object.keys(candidates).forEach(function (id) {
                    if (candidates[id] == h264) {
                        prioritized.unshift(candidates[id]);
                    } else {
                        prioritized.push(candidates[id]);
                    }
                });
                var mPrioritized = m[0].replace(m[2], prioritized.join(" "));
                console.info("Setting " + codec + " as preferred video codec. \"%s\"", mPrioritized);
                desc.sdp = sdp.replace(m[0], mPrioritized);
            }
        }
        return desc;
    }

    findCodecId(desc, codec) {
        if (desc && desc.sdp && codec) {
            var m
            if (codec === 'H264') {
                m = desc.sdp.match(/a=rtpmap\:(\d+)\sH264\/\d+/);
            }
            else if (codec === 'VP9') {
                m = desc.sdp.match(/a=rtpmap\:(\d+)\sVP9\/\d+/);
            }
            else if (codec === 'VP8') {
                m = desc.sdp.match(/a=rtpmap\:(\d+)\sVP8\/\d+/);
            }
            if (m && m.length > 0) {
                return m[1];
            }
        }
        return null;
    }

    onOffer(sdp) {
        console.info("sdp generated", this.name);
        this.pc.setLocalDescription(sdp);
        if (sdp && sdp.type === 'offer') {
            try {
                this.prioritizeCodec(sdp, 'VP9');
            }
            catch (e) {
                console.error("Error", e);
            }
        }
        const msg = {
            id: 'sdp',
            sender: this.name,
            sdp: sdp
        };
        this.ee.emit('message', msg);
    }

    generateSdp() {
        console.info('generating sdp');
        this.pc.createOffer().then(this.onOffer.bind(this)).catch(console.error);
    }

    setSdp(sdp) {
        if (sdp && sdp.type === 'offer') {
            try {
                this.prioritizeCodec(sdp, 'VP9');
            }
            catch (e) {
                console.error("Error", e);
            }
        }
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

    removeAllListeners() {
        this.ee.removeListeners();
    }
}