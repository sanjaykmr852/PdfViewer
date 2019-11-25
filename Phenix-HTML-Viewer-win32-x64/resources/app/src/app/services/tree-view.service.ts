import { Injectable } from '@angular/core';
import { FolderReaderService } from '../folder-reader/folder-reader.service';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';

@Injectable({
  providedIn: 'root'
})
export class TreeViewService {
 
  public treeData: Object[] = [
    {
        nodeId: '1', nodeText: 'Documents',
        nodeChild: [
            { nodeId: '11', nodeText: 'Team management.docx',nodeChild:[ { nodeId: '26', nodeText: 'Sales folder' }] },
            { nodeId: '12', nodeText: 'Entity Framework Core.pdf' },
        ]
    },
    {
        nodeId: '2', nodeText: 'Downloads',
        nodeChild: [
            { nodeId: '21', nodeText: 'Sales report.ppt' },
            { nodeId: '22', nodeText: 'Introduction to Angular.pdf' },
            { nodeId: '23', nodeText: 'Paint.exe' },
            { nodeId: '24', nodeText: 'TypeScript sample.zip' },
        ]
    },
    {
        nodeId: '3', nodeText: 'Music',
        nodeChild: [
            { nodeId: '31', nodeText: 'Crazy tone.mp3' }
        ]
    },
    {
        nodeId: '4', nodeText: 'Videos',
        nodeChild: [
            { nodeId: '41', nodeText: 'Angular tutorials.mp4' },
            { nodeId: '42', nodeText: 'Basics of Programming.mp4' },
        ]
    }
];
  public treeFields: Object = { 
    dataSource: this.treeData, 
    id: 'nodeId', 
    text: 'nodeText', 
    child: 'nodeChild'
  };


  constructor() {
    this.treeData = [];
  }


  public formNode(folderData:Object):void{
        console.log('-----------formNode--------');
      if(folderData && folderData['directory'] && folderData['directory'] instanceof Object){
        console.log('-----------inside if--------');
        let dir=folderData['directory'];
        for(let key in dir){
            let node:Object={};
            let value=key; 
            node['nodeId']=value;
            node['nodeText'] = value;
            
            if(dir[key] !=='' && dir[key] instanceof Object ){
              let childArray=[];              
              let childFolder=dir[key];
              for(let childKey in childFolder){
                let childNode={};
                childNode['nodeId']=key+'_'+childKey;
                childNode['nodeText']=childKey;
                childArray.push(childNode);
              }
              node['nodeChild']=[{'nodeId':key+'_' , 'nodeText':''}];
              this.treeData.splice(0,0,node);
            }else{
              this.treeData.push(node);
            }          
            
        }
        console.log(this.treeFields);
        this.treeFields['dataSource']=this.treeData;
      }
  }

  updateNode(folderDirectoryMap:Object,node:string,treeView:TreeViewComponent){
      let currentNode=treeView.getNode(node);
      let childArray:Array<any>=[];
      while(currentNode['parentId']){
        childArray.push(currentNode['parentId']);
        currentNode=treeView.getNode(<string>currentNode['parentId']);
      }
      let rootNode=currentNode.nodeId;
      
      if(node in folderDirectoryMap){
        let updatedMap:Object=folderDirectoryMap[node];
        for(let updatedMapkey in updatedMap){
          if(updatedMap[updatedMapkey] instanceof Object){
            var newTreeNode={};
            newTreeNode['nodeId']=newTreeNode['nodeText']=updatedMap[updatedMapkey];
            console.log('-------------inside if--------');
            this.updateTreeview(updatedMap,updatedMapkey,this.treeData,node,childArray,rootNode);
          }
        }
      }else{

      }
  }

  public updateTreeview(updatedMap:Object,updatedMapkey:string,treeData:Object[],
    node:String,childArray:Array<any>,rootNode:Object){    
    let rootKey=rootNode;
    if(rootNode===null || rootNode===undefined){
      rootKey=node;      
    }
    for(let data of treeData){
      if(data['nodeId'] === rootKey){
        let childNodes = data['nodeChild'];
        let index=this.treeData.indexOf(data);
          for(let childNode of childNodes){
            if(childNode['nodeId'] === updatedMapkey){
                childNode['nodeChild'] = updatedMap[updatedMapkey];
            }
          }     
          this.treeData[index]['nodeChild']=childNodes;   
      }
    }
  }
}
