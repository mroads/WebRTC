import { Component, OnInit, NgZone } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Participant } from '../participant';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  user = { name: 'vijay' + new Date().getTime(), room: 'mroads' };
  submitted = false;
  participants = {};
  selectedParticipant: String = '';
  localStream: MediaStream;
  localParticipant: Participant;

  constructor(private ws: WebsocketService, private media: MediaService, private _ngZone: NgZone) { }

  ngOnInit() {
    this.ws.addEventListener(this.onMessage.bind(this));
    window.onload = function () {
      this.register();
    }.bind(this);
  }

  register() {
    console.info('user clicked register');
    this.selectedParticipant = this.user.name;
    this.ws.sendMessage({ id: 'joinRoom', name: this.user.name, room: this.user.room });
    this.submitted = true;
  }

  onMessage(message) {
    console.info('response from server', message);
    switch (message.id) {
      case 'existingParticipants':
        this.onExistingParticipants(message);
        break;
      case 'newParticipantArrived':
        this.onNewParticipant(message);
        break;
      case 'participantLeft':
        this.onParticipantLeft(message);
        break;
      case 'sdp':
        this.handleSdp(message);
        break;
      case 'iceCandidate':
        this.participants[message.sender].addIceCandidate(message);
        break;
      default:
        console.error('Unrecognized message', message);
    }
  }

  onExistingParticipants(message) {
    console.info(this);
    const participant = new Participant(this.user.name, true);
    this.participants[this.user.name] = participant;
    this.localParticipant = participant;
    const that = this;
    this.media.gum('hd', true).then(function (stream) {
      participant.stream = stream;
      that.localStream = stream;
      message.data.forEach(element => {
        that.receiveVideoAndGenerateSdp(element);
      });
    }).catch(function (error) {
      console.error('error', error);
      alert(error.name);
    });
  }

  participantEventCallback(message) {
    console.info('event from participant', message);
    switch (message.id) {
      case 'iceCandidate':
        console.info('sending ice candidate to', message.sender);
        this.ws.sendMessage(message);
        break;
      case 'sdp':
        console.info('sending sdp to', message.sender);
        this.ws.sendMessage(message);
        break;
      case 'updateZone':
        this._ngZone.run(() => { console.log('Outside Done!'); });
        break;
    }
  }

  objectkeys(map) {
    return Object.keys(map);
  }

  onNewParticipant(message) {
    this.receiveVideo(message.name);
  }

  receiveVideo(sender) {
    const participant = new Participant(sender, false);
    participant.subscribe(this.participantEventCallback.bind(this));
    this.participants[sender] = participant;
    participant.createPeers(this.localStream);
    this.selectedParticipant = sender;
  }

  receiveVideoAndGenerateSdp(sender) {
    this.receiveVideo(sender.name);
    this.participants[sender.name].generateSdp();
  }

  handleSdp(result) {
    console.info(this.participants);
    this.participants[result.sender].setSdp(result.sdp);
  }

  onParticipantLeft(request) {
    console.log('Participant ' + request.name + ' left');
    const participant = this.participants[request.name];
    participant.dispose();
    delete this.participants[request.name];
    const keys = this.objectkeys(this.participants);
    this.selectedParticipant = keys.pop();
  }

  toggleVideo() {
    console.info('toggle video method called');

    if (this.localParticipant.states.video) {
      console.log('disabling the video');
      this.localStream.getVideoTracks().forEach(this.removeTracksAndUpdateSdp.bind(this));
    } else {
      console.log('enabling the video');
      this.media.gum('hd', false).then(function (stream) {
        stream.getVideoTracks().forEach(this.addTrackAndUpdateSdp.bind(this));
      }.bind(this));
    }
    this.localParticipant.states.video = !this.localParticipant.states.video;
    this.refreshVideoElements();
  }

  toggleAudio() {
    console.info('toggle audio method called');
    this.localParticipant.states.audio = !this.localParticipant.states.audio;
    this.localStream.getAudioTracks()[0].enabled = this.localParticipant.states.audio;
  }

  removeTracksAndUpdateSdp(track) {
    this.localStream.removeTrack(track);
    const name = this.user.name;
    for (const key in this.participants) {
      if (key !== name) {
        this.participants[key].removeTrack(track);
        this.participants[key].generateSdp();
        track.stop();
      }
    }
  }

  addTrackAndUpdateSdp(track) {
    this.localStream.addTrack(track);
    const name = this.user.name;
    for (const key in this.participants) {
      if (key !== name) {
        this.participants[key].addTrack(track);
        this.participants[key].generateSdp();
      }
    }
  }


  refreshVideoElements() {
    const elements = document.getElementsByTagName('video');
    for (let i = 0; i < elements.length; i++) {
      elements[i].srcObject = elements[i].srcObject;
    }
  }
}
