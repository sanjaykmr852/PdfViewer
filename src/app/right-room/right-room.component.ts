import { Component, OnInit, ViewChild, ElementRef, SecurityContext } from '@angular/core';
import { FolderReaderService } from '../folder-reader/folder-reader.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-right-room',
  templateUrl: './right-room.component.html',
  styleUrls: ['./right-room.component.css']
})
export class RightRoomComponent implements OnInit {


  fileContent:any = null;
  //rootPath: String = '././assets/PSE-123_fr/';
  //rootPath: String ='../../src/assets/PSE-123_fr/';
  rootPath: String ='../../../../root/';
  cardHeight:number =0;
  filePath:SafeResourceUrl = null;

  constructor(private folderService:FolderReaderService,private sanitizer:DomSanitizer) {}

  ngOnInit() {
    this.calculateResponsiveRightRoomHeight();
    window.addEventListener('resize',()=>{
      this.calculateResponsiveRightRoomHeight();
    });
    if(this.folderService.fileContent!==null && Object.keys(this.folderService.fileContent).length>0){
      this.fileContent= new DOMParser().parseFromString(<string>this.folderService.fileContent,'text/html');
    }
    this.folderService.fileReadCompleted.subscribe(()=>{
      this.fileContent=new DOMParser().parseFromString(this.folderService.fileContent,'text/html');
      let serializer=new XMLSerializer();
      this.fileContent=serializer.serializeToString(this.fileContent);
      this.fileContent=this.folderService.fileContent;
      this.filePath=this.sanitizer.bypassSecurityTrustResourceUrl(this.rootPath+this.folderService.lastUpdatedResouceURL);
    });
  
  }

  calculateResponsiveRightRoomHeight(){
    let rightRoomDiv=document.getElementById('right-room-div');
    this.cardHeight = rightRoomDiv.getBoundingClientRect().height -30;
  }

}
