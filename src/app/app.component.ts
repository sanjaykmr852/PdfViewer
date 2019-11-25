import { Component,OnInit,HostListener, ViewChild, ElementRef } from '@angular/core';
import { FolderReaderService } from './folder-reader/folder-reader.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PhenixHTMLViewer';

  deviceHeight:Number = 0;

  showButton:boolean = false;

  constructor(private folderService:FolderReaderService){}

  
    ngOnInit(){
      this.setResponsiveHeight();
      window.addEventListener('resize',()=>{
        this.setResponsiveHeight();
      });
      this.folderService.fileReadCompleted.subscribe(()=>{
        this.folderService.iframeHistoryArray=[];
        this.folderService.iframeHistoryMap.clear();
        this.showButton = false;
        this.pushIframeState();
      });
  }

  setResponsiveHeight(){
    let height=window.innerHeight;
    let navigationBar=document.getElementById('navigation-bar');
    let contentDiv=document.getElementById('content-div');
    this.deviceHeight=Math.round(height-navigationBar.getBoundingClientRect().height); 
  }

  pushIframeState(){
    setTimeout(() => {
      let iframe=document.getElementById('iframe-id');
      let innerFrame=(<any>iframe).contentDocument;
      let innerFrameDocument = innerFrame.documentElement;
      this.folderService.iframeHistoryArray.push(innerFrame.location.href);
      this.folderService.iframeHistoryMap.set(innerFrame.location.href,innerFrame.location);
      innerFrame.addEventListener('click',this.pushState.bind(this));
    }, 100);
  }

  pushState(){
    setTimeout(()=>{
      console.log('------iframe-click--------');
      let iframe=document.getElementById('iframe-id');
      let innerFrame=(<any>iframe).contentDocument;
      if(!this.folderService.iframeHistoryMap.has(innerFrame.location.href)){
        this.folderService.iframeHistoryMap.set(innerFrame.location.href,innerFrame.location);
        this.folderService.iframeHistoryArray.push(innerFrame.location.href);
        this.showButton = this.folderService.iframeHistoryArray.length>1;
      }
    },100);
  }

 
}
