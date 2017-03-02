const YT = require("youtube.com");

let YtHelper = class YtHelper{
    constructor()
    {
        this.youtube = null;
    }

    convertVideoToGif( opt, completeFunc )
    {
        const _fName = `${new Date().getTime()}.gif`;
        const fileName = `download/${opt.category}/${_fName}`;
        this.youtube = YT(opt.url);
        this.youtube
            .gif( opt.startDuration, opt.endDuration, fileName, "640x360", 30 )
            .then( ()=> completeFunc( opt.title, opt.category, [ _fName ] )  )
            .catch( (err)=> console.log("err : ", err) )
    }
}


exports.ytHelper = new YtHelper;