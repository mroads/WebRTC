import { Participant } from './participant';

describe('Participant', () => {
    let participant: Participant;

    beforeEach(() => {
        participant = new Participant('vijay', true);
    });

    it('should have name and isLocal boolean values', () => {
        expect(participant.name).toBe('vijay');
        expect(participant.isLocal).toBeTruthy();
    });


    it('should create media states', () => {
        expect(participant.states).toBeDefined();
        expect(participant.states.audio).toBeTruthy();
        expect(participant.states.video).toBeTruthy();
    });

    it('should create event emitter ', () => {
        expect(participant.ee).toBeDefined();
    });

    describe('subscribe:method', () => {

        let observers = 0;

        function callback(arg) {
            console.info('this is a mock callback', arg);
        }

        beforeEach(() => {
            observers = participant.ee.observers.length;
            participant.subscribe(callback);
        });

        it('should increase number of observers by one', () => {
            expect(participant.ee.observers.length).toBe(observers + 1);
        });

    });

    describe('createPeers:method', () => {
        const stream = new MediaStream();
        beforeEach(() => {
            spyOn(participant, 'handlePC');
            participant.createPeers(stream);
        });

        it('should create RTCPeerConnection object', () => {
            expect(participant.pc).toBeDefined();
        });

        it('should store stream in localStream', () => {
            expect(participant.localStream).toBe(stream);
        });

        it('should call handlePC with stream', () => {
            expect(participant.handlePC).toHaveBeenCalledWith(stream);
        });

        afterEach(() => {
            if (participant.pc) {
                participant.pc.close();
            }
        });

    });


    describe('handlePC:method', () => {
        const stream = new MediaStream();

        beforeEach(() => {
            participant.pc = new RTCPeerConnection(null);
            spyOn(participant.pc, 'addStream');
            participant.handlePC(stream);
        });

        it('should call addStream on peer connection with stream', () => {
            expect(participant.pc.addStream).toHaveBeenCalledWith(stream);
        });

        it('should call addStream on peer connection with stream', () => {
            expect(participant.pc.addStream).toHaveBeenCalledWith(stream);
        });

        it('should define onicecandidate on pc', () => {
            expect(participant.pc.onicecandidate).toBeDefined(participant.onIceCandidate);
        });


        it('should define onaddstream on pc', () => {
            expect(participant.pc.onaddstream).toBeDefined(participant.onAddStream);
        });

        it('should define oniceconnectionstatechange on pc', () => {
            expect(participant.pc.oniceconnectionstatechange).toBeDefined(participant.onIceConnectionStateChange);
        });

        it('should define onremovestream on pc', () => {
            expect(participant.pc.onremovestream).toBeDefined(participant.onRemoveStream);
        });

        afterEach(() => {
            if (participant.pc) {
                participant.pc.close();
            }
        });

    });

    describe('onIceCandidate:method', () => {
        const event = {
            candidate: 'hello'
        };
        beforeEach(() => {
            spyOn(participant.ee, 'emit');
            participant.onIceCandidate(event);
        });

        it('should emit message if candidate is defined', () => {
            const message = {
                id: 'iceCandidate',
                candidate: 'hello',
                sender: 'vijay'
            };
            expect(participant.ee.emit).toHaveBeenCalledWith(message);
            event.candidate = undefined;
        });

        it('should not emit message if candidate is defined', () => {
            expect(participant.ee.emit).not.toHaveBeenCalled();
        });

        afterEach(() => {
            if (participant.pc) {
                participant.pc.close();
            }
        });

    });


    describe('onIceConnectionStateChange:method', () => {
        beforeEach(() => {
            participant.pc = new RTCPeerConnection(null);
            spyOn(console, 'info');
            participant.onIceConnectionStateChange();
        });

        it('should call console.info with name and iceconnectionstate', () => {
            expect(console.info).toHaveBeenCalled();
        });

        afterEach(() => {
            if (participant.pc) {
                participant.pc.close();
            }
        });

    });


    describe('onAddStream:method', () => {
        const event = {
            stream: new MediaStream()
        };

        beforeEach(() => {
            spyOn(console, 'info');
            participant.onAddStream(event);
        });

        it('should call console.info with name and iceconnectionstate', () => {
            expect(console.info).toHaveBeenCalled();
        });

        it('should set event.stream to participant.stream', () => {
            expect(participant.stream).toBe(event.stream);
        });

    });


    describe('onRemoveStream:method', () => {

        beforeEach(() => {
            spyOn(console, 'info');
            participant.onRemoveStream();
        });

        it('should call console.info with name and iceconnectionstate', () => {
            expect(console.info).toHaveBeenCalled();
        });

        it('should participant.stream to undefined', () => {
            expect(participant.stream).toBe(undefined);
        });

    });


    describe('dispose:method', () => {
        let i = 0;
        beforeEach(() => {
            participant.pc = new RTCPeerConnection(undefined);
            if (i % 2 === 0) {
                spyOn(participant.pc, 'close');
            } else {
                participant.pc = undefined;
            }
            participant.dispose();
            i++;
        });

        it('should call close when pc is defined', () => {
            expect(participant.pc.close).toHaveBeenCalled();
            participant.pc = undefined;
        });

        it('should not call close when pc is undefined', () => {
        });

        afterEach(() => {
            if (participant.pc) {
                participant.pc.close();
            }
        });
    });

    describe('setSdp:method', () => {
        const sdp = {
            type: 'answer',
        };
        let i = 0;
        beforeEach(() => {
            participant.pc = new RTCPeerConnection(undefined);
            if (i % 2 === 0) {
                spyOn(participant.pc, 'setRemoteDescription');
            } else {
                sdp.type = 'offer';
                spyOn(participant, 'createAnswer');
            }
            participant.setSdp(sdp);
            i++;
        });

        it('should call setRemoteDescription when sdp type is answer', () => {
            expect(participant.pc.setRemoteDescription).toHaveBeenCalledWith(sdp);
        });

        it('should call createAnswer when sdp type is offer', () => {
            expect(participant.createAnswer).toHaveBeenCalledWith(sdp);
        });

        afterEach(() => {
            if (participant.pc) {
                participant.pc.close();
            }
        });
    });

});
