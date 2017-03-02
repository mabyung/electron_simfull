const { Browser, run, sleep } = require('automatonic');
const { mainWindow } = require("./../../index");

class SFNaverCafeTransfer
{
    static get( url )
    {
        run(function*() {
            console.log( "SFNaverCafeTransfer : start" );
            const post = new Browser({show : true , allowRunningInsecureContent : true });
            post.goto(url);
            const _contents = yield post.execute(()=> {
                return {
                    title : String( document.getElementById("cafe_main").contentWindow.document.querySelector(".b.m-tcol-c").innerHTML ),
                    "contents" : String( document.getElementById("cafe_main").contentWindow.document.getElementById('tbody').innerHTML )
                }
            });
            mainWindow.webContents.send("cafe-send", _contents );
            post.close();
        }).then((r)=> console.log( "SFNaverCafeTransfer completed" ), err => console.error('OH NOES!', err) );
    }
}


module.exports = SFNaverCafeTransfer;