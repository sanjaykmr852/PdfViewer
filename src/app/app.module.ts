import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LeftRoomComponent } from './left-room/left-room.component';
import { RightRoomComponent } from './right-room/right-room.component';
import { FolderReaderService } from './folder-reader/folder-reader.service';
import {NgxElectronModule} from 'ngx-electron';
import { TreeViewComponent, TreeViewModule } from '@syncfusion/ej2-angular-navigations';


@NgModule({
  declarations: [
    AppComponent,
    LeftRoomComponent,
    RightRoomComponent    
  ],
  imports: [
    BrowserModule,
    NgxElectronModule,
    TreeViewModule        
  ],
  providers: [FolderReaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
