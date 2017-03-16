const YT = require("youtube.com");
let fs = require('fs');
let daysData = JSON.parse(fs.readFileSync('postDays.json', 'utf-8'));

let YtHelper = class YtHelper{
    constructor()
    {
        this.youtube = null;
    }

    convertVideoToGif( opt/*, completeFunc*/ )
    {
        const _fName = `${new Date().getTime()}.gif`;
        const fileName = `download/${opt.category}/${_fName}`;
        this.youtube = YT(opt.url);
        this.youtube
        .gif( opt.startDuration, opt.endDuration, fileName, "640x360", 30 )
        // .then( ()=> completeFunc( opt.title, opt.category, [ _fName ] )  )
        .catch( (err)=> console.log("err : ", err) )

        let postData = { category:opt.category, title:opt.title, fileName:_fName };
        daysData.push(postData);
        let string = JSON.stringify(daysData);
        fs.writeFile('postDays.json', string, 'utf8', function(error){
            if(error) return console.log(error);
            console.log('Write Complete');
        });
    }
}

exports.ytHelper = new YtHelper;