import {BrowserWindow,app,ipcMain,IpcMessageEvent} from 'electron';
//import * as fs from 'fs';


let win:BrowserWindow;
let folderStructure:any;
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
                nodeIntegration:false,
                webSecurity:true,
                contextIsolation:true
              }
        });

        // fs.readdir('../../',(error,files)=>{
        //     if(error){
        //       console.log('file reading failed');
        //     }else{
        //         folderStructure=files;
        //       console.log(files);
        //     }
        //   });

          
          ipcMain.on('ping', (event: IpcMessageEvent) => {
            event.sender.send('pong');
          });
        
        
        // and load the app.
        win.loadFile('./dist/test3/index.html');

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
        console.log('---inside mac-------');
        this.createWindow();
    }
    console.log('------------------electron-end---------------');
});