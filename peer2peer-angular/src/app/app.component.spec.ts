import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from './websocket.service';
import { MediaService } from './media.service';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RoomComponent
      ],
      imports: [
        FormsModule
      ],
      providers: [
        WebsocketService,
        MediaService
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
