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

  user: any = { name: 'vijay' + new Date().getTime(), room: 'mroads' };
  submitted: boolean = false;
  participants = {};
  selectedParticipant: String = '';
  localStream: MediaStream;

  constructor(private ws: WebsocketService, private media: MediaService, private _ngZone: NgZone) { }

  ngOnInit() {
    this.ws.addEventListener(this.onMessage.bind(this));
    window.onload = function () {
      this.register();
    }.bind(this);
  }

  register() {
    console.info("user clicked register");
    this.selectedParticipant = this.user.name;
    this.ws.sendMessage({ id: 'joinRoom', name: this.user.name, room: this.user.room });
    this.submitted = true;
  }

  onMessage(message) {
    console.info("response from server", message);
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
      case "sdp":
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
    var participant = new Participant(this.user.name, true);
    this.participants[this.user.name] = participant;
    const that = this;
    this.media.gum('hd', true).then(function (stream) {
      participant.stream = stream;
      that.localStream = stream;
      message.data.forEach(element => {
        that.receiveVideoAndGenerateSdp(element);
      });
    }).catch(function (error) {
      console.error("error", error);
      alert(error.name);
    });
  }

  participantEventCallback(message) {
    console.info("event from participant", message);
    switch (message.id) {
      case "iceCandidate":
        console.info("sending ice candidate to", message.sender);
      case "sdp":
        console.info("sending sdp to", message.sender);
        this.ws.sendMessage(message);
        break;
      case "updateZone":
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
    var participant = new Participant(sender, false);
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
    var participant = this.participants[request.name];
    participant.dispose();
    delete this.participants[request.name];
  }
}
