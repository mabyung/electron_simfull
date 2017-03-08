const path = require("path");
const electron = require("electron");
const ipc = electron.ipcMain;
const url = require("url");
const glob = require("glob");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const electronLocalshortcut = require('electron-localshortcut');
const tumblrManager = require("./mainProcess/manager/TumblrManager");

require('electron-debug')({showDevTools: true});
let mainWindow;
loadMainProcess();
function createWindow () {
    mainWindow = new BrowserWindow({
        width : 1900,
        height : 1060,
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
        contextIsolation : true
    }));



    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null
    });

    electronLocalshortcut.register(mainWindow, 'Ctrl+1', () => {
        mainWindow.webContents.executeJavaScript( `
        UI.ins.$postbtn.eq(0).trigger("click");
        `)
    });

    electronLocalshortcut.register(mainWindow, 'Ctrl+2', () => {
        mainWindow.webContents.executeJavaScript( `
            UI.ins.$postbtn.eq(1).trigger("click");
        `)
    });

    electronLocalshortcut.register(mainWindow, 'Ctrl+3', () => {
        mainWindow.webContents.executeJavaScript( `
            UI.ins.$postbtn.eq(2).trigger("click");
        `)
    });

    electronLocalshortcut.register(mainWindow, 'Ctrl+4', () => {
        mainWindow.webContents.executeJavaScript( `
            UI.ins.$postbtn.eq(3).trigger("click");
        `)
    });

    electronLocalshortcut.register(mainWindow, 'Ctrl+5', () => {
        mainWindow.webContents.executeJavaScript( `
            UI.ins.$postbtn.eq(4).trigger("click");
        `)
    });


}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    imainWindow === nul && createWindow()
});

function loadMainProcess () {
    var files = glob.sync(path.join(__dirname, "mainProcess/*.js"));
    files.forEach( file => require(file));
}
