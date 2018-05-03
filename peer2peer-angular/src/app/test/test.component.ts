import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  interviews = [];
  email: String = 'panel1@yopmail.com';
  constructor(private http: Http) { }

  ngOnInit() {
    const { desktopCapturer } = (<any>window).require('electron');
    console.info(desktopCapturer);
    desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
      if (error) {
        return console.error("Error", error);
      }
      for (let i = 0; i < sources.length; ++i) {
        if (sources[i].name === 'Electron') {
          navigator.mediaDevices.getUserMedia(<any>{
            audio: false,
            video: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[i].id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720

            }
          })
            .then((stream) => handleStream(stream))
            .catch((e) => handleError(e));
          return;
        }
      }
    })
    function handleStream(stream) {
      const video = document.querySelector('video');
      video.srcObject = stream;
      video.onloadedmetadata = () => video.play();
    }

    function handleError(e) {
      console.log(e)
    }
  }

  getAllInterviews() {
    console.info('getting all interviews');
    this.http.post('https://vijay.mroads.com:6060/getAllInterviews', this.email).subscribe(this.onResponse.bind(this));
  }

  onResponse(res) {
    this.interviews = JSON.parse(res.text());
    console.info(this.interviews);
  }

  joinInterview(token) {
    window.open('https://icims.mroads.com/a/live/#/' + token, '_blank');
  }

}
