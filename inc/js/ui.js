var pubApp = pubApp || {};
var ipcRenderer = require('electron').ipcRenderer;

var SITE = [
    { name : "남성부닷컴", url : "http://nsbu.co.kr/" },
    { name : "이슈인", url : "http://www.issuein.com/" },
    { name : "오늘의유머", url : "http://www.todayhumor.co.kr/" },
    { name : "디젤매니아", url : "http://cafe.naver.com/dieselmania/" },
    { name : "유투브", url : "http://youtube.com"},
    { name : "텀블러인증", url : "https://www.tumblr.com/oauth/apps" }
];

const singleton = "slngleton";
class Singleton {
    static get ins()
    {
        return this[singleton] = this[singleton] || new this;
    }
    constructor()
    {
        let Class = Object.create(Singleton);
        return Class[singleton] = Class[singleton] || this;
    }
}

class ModuleDef extends Singleton{
    constructor(){
        super();
        this._all = [];
        this._hashMap = [];
    }

    createClass( cls ){
        this.add( new cls(), cls );
    }

    add( _Class, cls ){
        this._hashMap[ cls ] =  _Class;
        this._all.push( _Class );
    }

    find( _cls ){
        return this._hashMap[ _cls ];
    }
}

class SFScrapper {

    static findExecuteScript(matchURL )
    {
        let result = null;
        switch( true )
        {
            case  /nsbu/g.test(matchURL) :
                result = `document.getElementById("as-view").innerHTML`;
            break;
            case  /issuein/g.test(matchURL) :
                result = `document.getElementsByClassName("rd_nav_style2")[0].innerHTML`;
            break;
            case  /todayhumor/g.test(matchURL) :
                result= `document.getElementById("containerInner").innerHTML`;
            break;
            case  /naver/g.test(matchURL) :
                result = `[ document.getElementById("cafe_main").contentWindow.document.querySelector(".b.m-tcol-c").innerHTML,
                                document.getElementById("cafe_main").contentWindow.document.getElementById('tbody').innerHTML ]`;
            break;
            case  /youtube/g.test(matchURL) :
                result = `document.getElementById("watch-headline-title").innerHTML`;
            break;
        }
        return result;
    }

    addWebView( _view )
    {
        this.view = _view;
    }

    scrapping( _category )
    {
        console.log( "scrapping : start" );
        const currentURL = this.view.getURL();
        const executeJavaScript = (script) => new Promise((resolve) => { this.view.executeJavaScript(script, resolve); });
        const result = executeJavaScript( SFScrapper.findExecuteScript( currentURL ) );
        result.then( (val) =>{
            console.log( "scrapping : end" );
            UI.ins.addScrappedDom( typeof val !== "string" ? val[1] : val  );
            this.sendScrappedData( currentURL, _category, val, typeof val !== "string" ? val[0] : null  );
        });
    }

    sendScrappedData( _url, _category, _value , _title )
    {
        let dataObj = {};
        let imgArr = [];
        const $scrapingWrap = UI.ins.$body.find(".scrapingWrap");
        switch( true )
        {
            case  /nsbu/g.test(_url) :
                dataObj = { tit : "#bo_v_title", img : ".aimg" }
            break;
            case  /issuein/g.test(_url) :
                dataObj = { tit : ".top_area h1 a", img : ".xe_content img" }
            break;
            case  /todayhumor/g.test(_url) :
                dataObj = { tit : ".viewSubjectDiv", img : ".viewContent img" }
            break;
            case  /naver/g.test(_url) :
                dataObj = { tit : _title, img : "img" }
            break;
            case  /youtube/g.test(_url) :
                let tit = UI.ins.$imageTit.val();
                let startDuration = UI.ins.$startMinute.val()+":"+UI.ins.$startSecond.val();
                let endDuration = UI.ins.$endMinute.val()+":"+UI.ins.$endSecond.val();
                dataObj = { url : _url, title : tit, startDuration : startDuration, endDuration :endDuration, category : _category }
                console.log("_url:",_url, "tit:", tit, "startDuration:", startDuration, "endDuration", endDuration)
                UI.ins.handleInputValueReset();
            break;
        }

        if(/youtube/g.test(_url)){
            this.sendToIpcRender( "yt-data", dataObj )
        } else{
            $scrapingWrap.find(dataObj.img).each(function(){ imgArr.push($(this).attr("src")); });
            let obj = { title : ( /naver/g.test(_url) ) ? dataObj.tit.trim() : $scrapingWrap.find(dataObj.tit).html().trim(), img : imgArr, category : _category };
            this.sendToIpcRender( "community-data", obj )
        }
    }

    sendToIpcRender( _type, _value )
    {
        ipcRenderer.send( _type , _value );
    }

}



class UI extends Singleton{

    static get setNav(){
        return `<br/><ul>${SITE.map( (value )=> `<li><button type='button' class='btnLink ${value.url.indexOf("nsbu") >-1 ? "on" : "off" }' data-url='${value.url}'>${value.name}</button></li>` ).join("")}</ul><br/>`;
    }

    constructor(){
        super();
    }
    startup()
    {
        this.$body = $("body");
        this.getSelector();
        this.addEvents();
        this.addModule();
    }

    getSelector()
    {
        this.$sideMenu = this.$body.find(".sideMenu");
        this.$sideMenu.prepend( UI.setNav );
        this.$btnLink = this.$sideMenu.find(".btnLink");
        this.$postbtn = this.$sideMenu.find(".item");

        // 재훈 추가
        this.$setContents = this.$body.find(".setContents");
        this.$imageTit = this.$setContents.find(".imageTit");
        this.$addText = this.$setContents.find(".addText");

        this.$youtubeMenu = this.$body.find(".youtubeMenu");
        this.$startMinute = this.$youtubeMenu.find(".startTime .minute");
        this.$startSecond = this.$youtubeMenu.find(".startTime .second");
        this.$endMinute = this.$youtubeMenu.find(".endTime .minute");
        this.$endSecond = this.$youtubeMenu.find(".endTime .second");

        this.$log =  this.$body.find(".log");
    }

    addEvents()
    {
        this.$btnLink.on("click", this.handleNavCtrlClick.bind(this) );
        this.$postbtn.on("click", this.handlePostBtnClick );
    }

    addModule()
    {
        ModuleDef.ins.createClass( SFScrapper );
        ModuleDef.ins.find( SFScrapper ).addWebView( this.$body.find("#view")[0] );
    }

    addScrappedDom( _result  ){
        this.$body.find(".scrapingWrap").html("");
        this.$body.find(".scrapingWrap").append( _result );
    }

    handleNavCtrlClick(e){
        let $location = this.$body.find("#location");
        let $view = this.$body.find("#view");
        let getUrl = $(e.target).attr("data-url");
        $location.val(getUrl);
        $view.attr("src", getUrl);

        // 재훈 추가
        this.$btnLink.not($(e.taget)).removeClass("on");
        $(e.target).addClass("on");
        if(/youtube/g.test(getUrl)) this.$youtubeMenu.show();
        else this.$youtubeMenu.hide();
        return false;
    }

    handlePostBtnClick(e)
    {
        const category = this.className.replace("item", "").trim();
        ModuleDef.ins.find( SFScrapper ).scrapping( category );
        return false;
    }

    handleInputValueReset()
    {
        this.$imageTit.val("");
        this.$addText.val("");
        this.$startMinute.val("");
        this.$startSecond.val("");
        this.$endMinute.val("");
        this.$endSecond.val("");
    }

    setLog()
    {
        ipcRenderer.on('upload-post', (e, arg) => {
            console.log(e, arg);
        });
    }
}

$(function(){
    UI.ins.startup();

    UI.ins.setLog();
});

