const { app, BrowserWindow,ipcMain, IpcMessageEvent } = require('electron');
const fs=require('fs');
const path=require('path');
const subdirs=require('subdirs');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let folderStructure=[];
let folderMap={};
//const rootPath='../../#Y2J/#/HTML_PHENIX/HTML_PHENIX';

//const rootPath='./dist/test3/assets/PSE-123_fr';
//const rootPath='resources/app/src/assets/PSE-123_fr';
const rootPath='root';

const createWindow = () => {
    // set timeout to render the window not until the Angular 
    // compiler is ready to show the project
    console.log('------------------createwindow---------------');
    setTimeout(() => {
        // Create the browser window.
        console.log('------------------electron-start---------------');
        win = new BrowserWindow({
            width: 800,
            height: 600,
            icon: './src/favicon.ico',
            webPreferences: {
                nodeIntegration:true,
                backgroundThrottling: false
              }
        });

        subdirs(rootPath+'/css').then((dirs)=>{
            console.log(dirs);
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++');
        });
        var fileArray =[];

        readFile= (file)=>fs.stat(file,(e,val)=>{
            if(e) {
                console.log('errrrrrrrr');
                throw e;
            } 
            else{
                var result={};
                if(val.isDirectory()){
                    let ans=recursion(path.join(file));   
                    console.log(ans);
                    // result[val]=ans;
                    // fileArray.push(result);
                    // result={};
                }else{
                    if(Object.keys(result).length>0){
                        return val;
                    }else{
                        fileArray.push(val);
                    }
                }
            }
        });

        
        recursion=(path)=>fs.readdir(path,(error,files)=>{
            if(error) throw(error);
            else{
                for(let file of files){
                    let z=readFile(path +'/'+file);
                }
            }
        });

        // recursion(rootPath);

     
        
       let readPath = (path,keyword)=> fs.readdir(path,(error,files)=>{
            if(error){
                console.log(error);  
              console.log('file reading failed');
            }else{
                folderStructure=files;
                if(keyword==null && folderStructure instanceof Array){
                    folderStructure.filter((data)=> data.search('images')<0).forEach((data)=>{
                        folderMap[data]='';                        
                    });
                    console.log('folderMap loads properly'); 
                if(keyword!==null && data in folderMap){
                    console.log('child loaded'); 
                    var valueMap={};
                    folderStructure.forEach((file)=>{
                        valueMap[file]='';                        
                    });                    
                    folderMap[data]=valueMap;
                    console.log(folderMap);
                }                                        
                }                         
            }
          });
          
          readPath(rootPath,null);

          
          ipcMain.addListener('readFile',(event,arg)=>{
            let filePath=path.join(rootPath,arg);
            fs.readFile(filePath, (error,fileData)=>{
                if(error) throw error;
                else{
                    event.returnValue=fileData.toString('utf-8');
                }
            });
          });
         

          win.loadFile('./dist/test3/index.html');
          //win.loadFile('./dist/test3/index.html');

          ipcMain.addListener('ping',(event)=>{
            console.log('-------------------------curent folder path------------');
            subdirs('./').then((dirs)=>{
                console.log(dirs);
                console.log('+++++++++++++++++++++++++++++++++++++++++++++++');
                event.returnValue=dirs;
            });              
        });

          ipcMain.addListener('getFolderStructure',(event)=>{
              console.log('-------------------------getFolderStructure------------');
              var resultMap={};
              resultMap['files'] = folderStructure;
              resultMap['directory']=folderMap;              
              event.returnValue=resultMap;
          });


          ipcMain.addListener('updateChildFolder',(event,arg,dummyChildId,rootId)=>{
            console.log('-------------------------updateChildFolder------------');
            var childPath=path.join(rootPath,arg);
            console.log(childPath);
            return fs.readdir(childPath,(error,files)=>{
                if(error) {
                    throw error;
                }else{
                    let resultArray=[];
                    for(let file of files){
                        console.log(file);   
                        if(file.indexOf('.html')>0 || file.indexOf('.MRDesc')>0 || file.indexOf('.MRProc')>0 ){
                            let resultMap={};
                        resultMap['nodeId']=rootId===null?dummyChildId+file:rootId+'_'+file;
                        resultMap['nodeText']=file;
                        resultArray.push(resultMap);
                        }
                        else if((file.indexOf('.')>0 && file.indexOf('MRDesc')<0) || (file.indexOf('.')>0 && file.indexOf('MRProc')<0) 
                        || file.indexOf('.xml')>0 || file.indexOf('.gif')>0 || file.indexOf('.tif')>0 || file.indexOf('images')>0){
                            console.log('-----skipped---');                               
                        }
                        else{
                        let resultMap={};
                        resultMap['nodeId']=rootId===null?dummyChildId+file:rootId+'_'+file;
                        resultMap['nodeText']=file;
                        resultArray.push(resultMap);
                        }
                        
                    }
                    subdirs(childPath).then((dirs)=>{
                        for(let dir of dirs){
                            var pathName = dir.substring(dir.lastIndexOf('\\') + 1,dir.length);
                            console.log(rootId);   
                            let nodeId = rootId===null?dummyChildId+pathName: rootId+'_'+pathName;
                            console.log('------sub-dir--------');
                            console.log(nodeId);
                            resultArray.filter((data)=>data['nodeId']===nodeId).map((data)=>{
                                console.log('---------------------');
                                console.log(dummyChildId);
                                data['nodeChild']=[{'nodeId':data['nodeText']+'_'+dummyChildId, 'nodeChild':''}];
                                console.log('---------------------');
                            });
                        }
                        console.log(resultArray);
                        event.returnValue=resultArray;
                    });
                    
                }
            });
        });

          
          ipcMain.addListener('updateFolder',(event,args)=>{
            console.log('-------------------------updateFolder------------');                             
            console.log(args); 
            let root=null;
            if( typeof args==='string' && args in folderMap){
                folderStructure=folderMap[args];
                root=args;
                console.log(args); 
            }
            if(folderStructure instanceof Array){                
                folderStructure.forEach((data)=>{                    
                   if(typeof data ==='string'  && String(data).indexOf('.')<0){   
                       console.log(rootPath+'/'+data);                
                    fs.readdir(rootPath+'/'+data,(error,files)=>{
                        if(error){
                          console.log('file reading failed');
                        }else{
                           let  subFolders=files;                                                
                            if(data in folderMap){
                                console.log('child loaded'); 
                                var valueMap={};
                                subFolders.forEach((file)=>{
                                    valueMap[file]='';                        
                                });                    
                                console.log('child loads properly'); 
                                folderMap[data]=valueMap;                                
                                return folderMap;  
                            }                                        
                        }                           
                                                                       
                        });                  
                                              
                   }
                });               
                event.returnValue='success';
            } else if(folderStructure instanceof Object){
                console.log('-------------else if-------');
                for(let key in folderStructure){
                    let data = root+'/'+key;
                    if(typeof data ==='string'  && String(data).indexOf('.')<0){                   
                        fs.readdir(rootPath+'/'+data,(error,files)=>{
                            if(error){
                              console.log('file reading failed');
                            }else{
                               let subFolders=files;                                         
                               console.log('2nd child loaded'); 
                                var valueMap={};
                                subFolders.forEach((file)=>{
                                        valueMap[file]='';                        
                                 });                    
                                console.log('2nd child loads properly'); 
                                folderStructure[key]=valueMap;          
                            } 
                            });                  
                       }
                } 
                folderMap[root]=folderStructure;
                event.returnValue=folderMap;              
            }        
           
        });
        
        // and load the app.
    

        //win.loadURL('http://localhost:4200/',Loadu)
        //win.webContents.openDevTools();

        // Emitted when the window is closed.
        win.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            win = null;
        });
    }, 10000);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
    console.log('------------------electron-end---------------');
});