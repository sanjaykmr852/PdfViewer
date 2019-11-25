import { Component, OnInit, ViewChild } from '@angular/core';
import { FolderReaderService } from '../folder-reader/folder-reader.service';
import { TreeData } from '../modal/tree-data.model';
import { TreeViewService } from '../services/tree-view.service';
import { TreeViewComponent, NodeExpandEventArgs } from '@syncfusion/ej2-angular-navigations';


@Component({
  selector: 'app-left-room',
  templateUrl: './left-room.component.html',
  styleUrls: ['./left-room.component.css']
})
export class LeftRoomComponent implements OnInit {

  data:Object={};
  dataSource: Object[]=[];
  dataMap:any={}; 
  expandedMap:Object={};
  dividerPosition:number = 0;

  
  @ViewChild('treeView')
  treeView:TreeViewComponent;

  constructor(private folderReader:FolderReaderService, private treeService:TreeViewService) {
      this.data=this.folderReader.readFolder();  
      this.treeService.formNode(this.data);
      this.dataMap = this.treeService.treeFields;
      console.log('-----------------------------left-room compoent-----------');
      console.log(this.dataMap);
      this.folderReader.folderUpdateEvent.subscribe((data)=>{
        this.dataMap=this.treeService.treeFields;
      })
   }

  ngOnInit() {
    console.log('----treeview---');
    console.log(this.treeView);
    //this.dataSource = [new TreeData('node1',null,'value1'),new TreeData('node2',new TreeData('node3',null,'value3'),'value2')];
    //this.dataMap['dataSource']=this.dataSource;
    
  }

  onNodeExpanding(event:NodeExpandEventArgs){
    console.log('-----node clicked');
    let childData=[];
    let currentNode=event.nodeData;
    let isRoot:boolean = currentNode.parentID===null;
    let id:string=currentNode['id'].toString();
    if(!this.expandedMap[id]){
      let path:String=<String>currentNode['text'];
      let dummyChildId:String=path+'_';
      this.expandedMap[id]=path;
      while(currentNode.parentID!==null){
        let nextNode=this.treeView.getNode(<string>(currentNode.parentID));
        path = nextNode.text + '/' + path;
        dummyChildId = <string>dummyChildId + nextNode.text +'_';
        currentNode = this.treeView.getNode(<string>(currentNode.parentID));
      }
      childData=this.folderReader.updateFolder(path,dummyChildId);
      // this.folderReader.folderUpdateEvent.next();
      this.treeView.addNodes(childData,id,null,true);
      //isRoot?this.treeView.removeNodes(['']):this.treeView.removeNodes([<string>dummyChildId]);
      this.treeView.removeNodes([<string>dummyChildId]);
    }
    console.log(event);
  }

  onNodeClicked(event){
    let clickedNode:Object=this.treeView.getNode(event.node);
    let readStatus:boolean=(<String>clickedNode['id']).indexOf('.html')>0 || (<String>clickedNode['id']).indexOf('.htm')>0;
    if(!this.expandedMap[clickedNode['id']] || !clickedNode['hasChildren']){
      console.log('file must be read');
      let path:String = clickedNode['text'];
      while(clickedNode['parentID']){
        clickedNode=this.treeView.getNode(clickedNode['parentID']);
        path= clickedNode['text'] + '/'+ path;
      }
      if(readStatus){
      let fileContent=this.folderReader.readFile(path);
      this.folderReader.lastUpdatedResouceURL = path.toString();
      this.folderReader.fileReadCompleted.next('fileReadCompleted');
      }

      
      
      //console.log(fileContent);
    }
  }

  onNodeExpanded(event:NodeExpandEventArgs){
    console.log('----------onNodeExpanded------');
    let expandedNode = this.treeView.getNode(event.node);
    
    if(event.nodeData.parentID === null){ 
      let treeElement=document.getElementById('tree');
      let firstLevelNodes:NodeListOf<any>=treeElement.querySelectorAll('.e-level-1');
      firstLevelNodes.forEach((data)=>{
        let element = <HTMLElement>data;
        element.classList.contains('e-node-collapsed')? element.classList.add('hide-tree-view'):null;
      });
    }
  }

  onNodeCollapsed(event:NodeExpandEventArgs){
    console.log('----------onNodeCollapsed------')
    if(event.nodeData.parentID===null){
      let treeElement=document.getElementById('tree');
      let firstLevelNodes:NodeListOf<any>=treeElement.querySelectorAll('.e-level-1');
      firstLevelNodes.forEach((data)=>{
        let element = <HTMLElement>data;
        element.classList.contains('hide-tree-view')? element.classList.remove('hide-tree-view'):null;
      });
    }
  }

  onDraggingRightRoom(event:MouseEvent){
    let leftRoomDiv=document.getElementById('left-room-parent-div');
    let rightRoomDiv=document.getElementById('right-room-parent-div');
    let val=((event.screenX / window.outerWidth)*100);
    console.log(val);
    leftRoomDiv.style.flexBasis = ((event.screenX / window.outerWidth)*100) + '%';
    leftRoomDiv.style.maxWidth =val + '%';
    rightRoomDiv.style.flexBasis =(100-val) + '%';
    leftRoomDiv.style.maxWidth =(100-val) + '%';
    
  }

  onDragStartRightRoom(event:DragEvent){
    this.dividerPosition=(<HTMLElement>event.target).getBoundingClientRect().left;
    console.log(this.dividerPosition);
  }

  onDragEndRightRoom(event:DragEvent){
    console.log('--------drag-end----');
    console.log(event);
    let leftRoomDiv=document.getElementById('left-room-parent-div');
    let rightRoomDiv=document.getElementById('right-room-parent-div');
    let val=((event.screenX / window.outerWidth)*100);
    console.log(val);
    leftRoomDiv.style.flexBasis = ((event.screenX / window.outerWidth)*100) + '%';
    leftRoomDiv.style.maxWidth =val + '%';
    rightRoomDiv.style.flexBasis =(100-val) + '%';
    leftRoomDiv.style.maxWidth =(100-val) + '%';
  }
}
