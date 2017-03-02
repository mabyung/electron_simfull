let download = require("download");
let fs = require("fs");
let imageType = require('image-type');
let methodQueue = require("./../methodQueue");
let base64Img = require('base64-img');

class SFDownloadManager
{
    constructor()
    {

    }

    insertFile( urls, title, cate, onComplete )
    {
        this.queue = new methodQueue();
        this.results = [];
        urls.forEach( (elem, i ) =>{
            this.queue.addItem( this.insertImage, true , [ urls[i], cate, this ] );
        });
        this.queue.addItem( onComplete , false,  [ title, cate, this.results ]);
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
                    console.log( _fileName +" : queue completed. ");
                    _this.queue.next();
                }catch(e){
                    console.log( "error : ", e );
                }
            });

        });
    }
}

module.exports = new SFDownloadManager;