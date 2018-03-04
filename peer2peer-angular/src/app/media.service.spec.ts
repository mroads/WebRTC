import { TestBed, inject } from '@angular/core/testing';

import { MediaService } from './media.service';

describe('MediaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaService]
    });
  });


  it('should be created', inject([MediaService], (service: MediaService) => {
    expect(service).toBeTruthy();
  }));

  describe('constraints', () => {

    it('should be created', inject([MediaService], (service: MediaService) => {
      expect(service.constraints).toBeDefined();
    }));


    it('should have uhd constraints', inject([MediaService], (service: MediaService) => {
      expect(service.constraints.uhd).toBeDefined();
      expect(service.constraints.uhd.video).toBeDefined();
      expect(service.constraints.uhd.video.width).toBeDefined();
      expect(service.constraints.uhd.video.width.exact).toBe(4096);
      expect(service.constraints.uhd.video.height).toBeDefined();
      expect(service.constraints.uhd.video.height.exact).toBe(2160);
    }));


    it('should have fhd constraints', inject([MediaService], (service: MediaService) => {
      expect(service.constraints.fhd).toBeDefined();
      expect(service.constraints.fhd.video).toBeDefined();
      expect(service.constraints.fhd.video.width).toBeDefined();
      expect(service.constraints.fhd.video.width.exact).toBe(1920);
      expect(service.constraints.fhd.video.height).toBeDefined();
      expect(service.constraints.fhd.video.height.exact).toBe(1080);
    }));


    it('should have hd constraints', inject([MediaService], (service: MediaService) => {
      expect(service.constraints.hd).toBeDefined();
      expect(service.constraints.hd.video).toBeDefined();
      expect(service.constraints.hd.video.width).toBeDefined();
      expect(service.constraints.hd.video.width.exact).toBe(1280);
      expect(service.constraints.hd.video.height).toBeDefined();
      expect(service.constraints.hd.video.height.exact).toBe(720);
    }));


    it('should have vga constraints', inject([MediaService], (service: MediaService) => {
      expect(service.constraints.vga).toBeDefined();
      expect(service.constraints.vga.video).toBeDefined();
      expect(service.constraints.vga.video.width).toBeDefined();
      expect(service.constraints.vga.video.width.exact).toBe(640);
      expect(service.constraints.vga.video.height).toBeDefined();
      expect(service.constraints.vga.video.height.exact).toBe(480);
    }));


    it('should have qvga constraints', inject([MediaService], (service: MediaService) => {
      expect(service.constraints.qvga).toBeDefined();
      expect(service.constraints.qvga.video).toBeDefined();
      expect(service.constraints.qvga.video.width).toBeDefined();
      expect(service.constraints.qvga.video.width.exact).toBe(320);
      expect(service.constraints.qvga.video.height).toBeDefined();
      expect(service.constraints.qvga.video.height.exact).toBe(240);
    }));

  })

  describe('GUM', () => {

    beforeEach(() => {
      spyOn(navigator.mediaDevices, 'getUserMedia');
    });

    it('should be have gum method', inject([MediaService], (service: MediaService) => {
      expect(service.gum).toBeDefined();
    }));

    it('should call getusermedia with constraints', inject([MediaService], (service: MediaService) => {
      service.gum('hd', false);
      const constraints = service.constraints.hd;
      constraints['audio'] = false;
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(constraints);
    }));

  })

});
