import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomComponent } from './room.component';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../websocket.service';
import { MediaService } from '../media.service';

describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoomComponent],
      imports: [FormsModule],
      providers: [WebsocketService, MediaService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
