import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { WebsocketService } from './websocket.service';
import { MediaService } from './media.service';
import { NgPipesModule } from 'ngx-pipes';
import { TestComponent } from './test/test.component';
import { HttpModule } from '@angular/http';




@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgPipesModule,
    HttpModule
  ],
  providers: [WebsocketService, MediaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
