import { Injectable } from '@angular/core';
//import {IpcRenderer} from 'electron';
//import * as fs from 'fs';`
//import {readdir} from 'fs';
import {ElectronService} from 'ngx-electron';
import { TreeViewService } from '../services/tree-view.service';
import { EventEmitter } from 'protractor';
import { Subject } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';




@Injectable({
  providedIn: 'root'
})
export class FolderReaderService {

  //private _ipc:IpcRenderer;
  //private _ipc:any=null;
  public folderStructure:String[]=[];
  public folderDirectoryMap:Object={};
  
  public folderUpdateEvent=new Subject<any>();
  public fileReadCompleted=new Subject();
  public fileContent:any = {};

  public lastUpdatedResouceURL:string = null;

  public iframeHistoryArray:Array<String> = [];

  public iframeHistoryMap:Map<String,Location> = new Map();

  constructor(private electronService:ElectronService , private treeService:TreeViewService) {
  //  const electron=(<any>window).require('electron');
   
    // if(electron){
    //   try {
    //     this._ipc=(electron.ipcRenderer);
    //     this._ipc.emit('hello');
    //     this._ipc.emit('ping');
    //   } catch (error) {
    //     throw error;
    //   }
    // }else{
    //   console.log('electron is not loaded');
    // }
    if(this.electronService.isElectronApp){
      this.electronService.ipcRenderer.on('ping',(data:String[])=>{
        
        //this.folderStructure=data;        
      });
      let folderLoc=this.electronService.ipcRenderer.sendSync('ping');
      console.log('++++++++++++++++++++FolderLoc+++++++++++++++++++');
      console.log(folderLoc);
      console.log('++++++++++++++++++++FolderLoc+++++++++++++++++++');
      this.electronService.ipcRenderer.sendSync('updateFolder',{data:'firstLevel'});
      console.log('update folder done');
     }       
    else
    console.log('Ping not sent');
   }

  readFolder():Object{
    let result={};
    if(this.electronService.isElectronApp){
      result=this.electronService.ipcRenderer.sendSync('getFolderStructure');
      this.folderStructure=result['files'];     
      this.folderDirectoryMap=result['directory'];
    }    
    console.log('++++++++++++folderservice+++++++++++++++');
    console.log(result);
    return result;
  }

  
  updateFolder(path:String,dummyChildId:String){
    console.log('callstack---------');
    let regex= new RegExp('/','g');
    let rootId=path.indexOf('/')>0?path.replace(regex,'_'):null;
    let result=this.electronService.ipcRenderer.sendSync('updateChildFolder',path,dummyChildId,rootId);
    console.log(result);
    return result;  
    
  //  this.folderUpdateEvent.next('folderUpdated');
      
  }

  readFile(path:String){
    let content=this.electronService.ipcRenderer.sendSync('readFile',path);
    this.fileContent=content;
    return content;
  }
  
}
