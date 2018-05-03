import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

class MediaService {

    constraints = {
        'qvga': {
            video: { width: { exact: 320 }, height: { exact: 240 } }
        },
        'vga': {
            video: { width: { exact: 640 }, height: { exact: 480 } }
        },
        'hd': {
            video: { width: { exact: 1280 }, height: { exact: 720 } }
        },
        'fhd': {
            video: { width: { exact: 1920 }, height: { exact: 1080 } }
        },
        'uhd': {
            video: { width: { exact: 4096 }, height: { exact: 2160 }, mandatory: {}, facingMode: "user" }
        },
        'noVideo': {
            video: false
        }
    };

    constructor() { }

    gum(videoConstraint, audioFlag) {
        const constraints = JSON.parse(JSON.stringify(this.constraints[videoConstraint]));
        constraints.audio = audioFlag;
        // constraints.video = true;
        return getUserMedia(constraints);
    }

}

export default new MediaService();
