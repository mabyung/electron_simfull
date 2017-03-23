let electron = require('electron');
const {app, BrowserWindow} = electron;
let ipc = electron.ipcMain;
let downloadManager = require("./manager/SFDownloadManager");
let uploadManager = require("./manager/SFUploadManager");
let ytHelper = require("./manager/SFImageHelper").ytHelper;

let handleDownloadComplete = ( _title, _category, _results ) =>{
    uploadManager.uploadFTP( _title, _category , _results );
};
// 받기
ipc.on('community-data', (e, arg) => {
    downloadManager.insertFile( arg.img, arg.title, arg.category, handleDownloadComplete );
});

ipc.on("yt-data", (e, arg) =>{
    ytHelper.convertVideoToGif( arg, handleDownloadComplete );
});

