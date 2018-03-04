import { Injectable } from '@angular/core';

@Injectable()
export class MediaService {

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
      video: { width: { exact: 4096 }, height: { exact: 2160 } }
    }
  };

  constructor() { }

  gum(videoConstraint, audioFlag) {
    const constraints = this.constraints[videoConstraint];
    constraints.audio = audioFlag;
    return navigator.mediaDevices.getUserMedia(constraints);
  }

}
