let download = require("download");
let fs = require("fs");
let imageType = require('image-type');
let methodQueue = require("./../methodQueue");
let base64Img = require('base64-img');
let Tumblr = require('tumblrwks');
let tumblr = new Tumblr(
    {
        consumerKey: 'dPLpONXIxaiNAOpwjsj1mdVoCQBX2NGqBxpWGL2JYX2gz5zDdw',
        consumerSecret: 'zvQNuwGNra8LVI8J633GzqOVfdudefXPG6fzNf1oYDO3uHubBt',
        accessToken: 'IcKY9zJmu4rol3FmeREd2R98e5WUYawMoKFUlARV91MNeE6hb3',
        accessSecret: 'WLNtWI2wh8p5QnOe58hebV1Gp6iZQq8K9KhdkSh9ju28wkA4XO'
    }, "yoobyungsoo.tumblr.com"
);


class SFDownloadManager
{
    constructor()
    {

    }

    insertFile( urls, title, cate, onComplete )
    {
        this.queue = new methodQueue();
        this.results = [];
        this.dataList = [];
        urls.forEach( (elem, i ) =>{
            this.queue.addItem( this.insertImage, true , [ urls[i], cate, this ] );
        });
        this.queue.addItem( this.handleDownloadComplete , false, [this]  );
        // this.queue.addItem( onComplete , false,  [ title, cate, this.results ]);
        this.queue.next();
    }

    insertImage(url, cate, _this)
    {
        download( url ).then(data => {
            const _type = "."+imageType( data ).ext;
            const _name = new Date().getTime()+_type;
            const _fileName = `download/${cate}/${_name}`;
            fs.writeFile(_fileName, data, ()=>{
                try{
                    _this.results.push( _name );
                    _this.dataList.push( _fileName );
                    console.log( _fileName +" : queue completed. ");
                    _this.queue.next();
                }catch(e){
                    console.log( "error : ", e );
                }
            });

        });
    }

    postTumblr()
    {
        // tumblr.post('/post', {type: 'video', caption : "심풀", tags : "심풀!!", data : [fs.readFileSync("download/suzy.webm")] }, function(err, json){
        //     console.log("postTumblr : ", json );
        // });
        // let stream = fs.readFile('./download/vs.mp4', (data,err)=>{
        //     err && console.log("postTumblr err : ", err );
        //     console.log( "postTumblr readFile : ", data );
        // });

        // let mp4 = require('mp4-stream')
        // var decoder = mp4.decode();
        // fs.createReadStream('./download/vs.mp4').pipe(decoder);
        tumblr.post("/post", { type : "video", embed : "https://www.youtube.com/watch?v=MfYPKZl7W1w" }, (err, json )=>{
            console.log("postTumblr : ", json );
        });

    }

    handleDownloadComplete(_this)
    {
        _this.postTumblr();
        _this.queue.next();
    }

}

module.exports = new SFDownloadManager;