import { Participant } from "./participant";

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

        var observers = 0;

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

    });


});