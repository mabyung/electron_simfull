let electron = require('electron');
const {app} = electron;
let ipc = electron.ipcMain;
const { Browser, run, sleep } = require('automatonic');

class TumblrManager
{
    run()
    {
        run(function*() {
            console.log( "TumblrManager : start" );
            const post = new Browser({show : true, width : 1600, height : 720 });
            post.goto("https://www.tumblr.com/new/video", { contextIsolation : true });
            yield sleep(4000);
            var src = "https://www.youtube.com/watch?v=GeGypUVvZ5c";
            const first = yield post.execute( function( _src ) {
                    document.querySelector(".media-url-button").click();
                    ( ()=> {
                        if( document.queryCommandSupported && document.queryCommandSupported("copy") )
                        {
                            const textarea = document.createElement("textarea");
                            textarea.textContent = _src;
                            textarea.style.position = "fixed";
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand("copy");
                            document.body.removeChild(textarea);
                        }
                    })();
                    document.querySelector(".media-dropzone-cropper .editor-plaintext").click();
                    setTimeout( ()=> document.execCommand('Paste') , 1000 );
                    return document.querySelector(".media-url-button").innerHTML;
            }, [src] );
            console.dir( first );
            // post.close();
        }).then((r)=> console.log( "TumblrManager completed" ), err => console.error('OH NOES!', err) );
    }
}

module.exports = new TumblrManager;