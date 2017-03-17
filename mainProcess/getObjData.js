let electron = require('electron');
const {app, BrowserWindow} = electron;
let ipc = electron.ipcMain;
let fs = require('fs');
let downloadManager = require("./manager/SFDownloadManager");
let uploadManager = require("./manager/SFUploadManager");
let ytHelper = require("./manager/SFImageHelper").ytHelper;
let tumblrManager = require("./manager/TumblrManager");

let handleDownloadComplete = ( _title, _category, _results ) =>{
    uploadManager.uploadFTP( _title, _category , _results );
};
// 받기
ipc.on('community-data', (e, arg) => {
    console.log(arg)
    downloadManager.insertFile( arg.img, arg.title, arg.category, handleDownloadComplete );
});

ipc.on("yt-data", (e, arg) =>{
    ytHelper.convertVideoToGif( arg/*, handleDownloadComplete */ );
});

ipc.on("upload-click", (e, arg) =>{
    let daysData = JSON.parse(fs.readFileSync('postDays.json', 'utf-8'));
    ytHelper.uploadGif( arg, daysData[arg].title, daysData[arg].category, daysData[arg].fileName, handleDownloadComplete );
    //for(var i = 0; i < arg.length; i++){
    //    console.log(daysData[arg[i]]);
    //    ytHelper.uploadGif( daysData[arg[i]].title, daysData[arg[i]].category, [daysData[arg[i]].fileName], handleDownloadComplete );
    //}
});

