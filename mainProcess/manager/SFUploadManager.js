let electron = require('electron');
const {app} = electron;
let ipc = electron.ipcMain;
const { Browser, run, sleep } = require('automatonic');


class SFUploadManager
{
    get POST_TYPE(){
        return{
            HUMOR : { category : "humor", url : "http://simfull.dothome.co.kr/wp-admin/admin.php?page=kboard_admin_view_1&mod=editor&kboard_id=1&pageid=1" },
            ADULT : { category : "adult", url : "http://simfull.dothome.co.kr/wp-admin/admin.php?page=kboard_admin_view_2&mod=editor&kboard_id=2&pageid=1"},
            GIRLS : { category : "girls" , url : "http://simfull.dothome.co.kr/wp-admin/admin.php?page=kboard_admin_view_3&mod=editor&kboard_id=3&pageid=1" },
            ANIMAL : { category : "animal", url : "http://simfull.dothome.co.kr/wp-admin/admin.php?page=kboard_admin_view_4&mod=editor&kboard_id=4&pageid=1"}
        }
    }
    constructor()
    {
        this.FtpDeploy = require('ftp-deploy');
    }

    uploadFTP( title, category, files, sender )
    {
        let results = files.map( (val)=>{
            return `<p><img src="/images/${category}/${val}" /></p>`;
        });
        let ftpDeploy = new this.FtpDeploy();
        let options = { host:'223.26.138.3', username:'simfull', password : "simfull!1", port : 21, localRoot: './download/', remoteRoot: '/html/images/', }
        ftpDeploy.deploy(options, (err)=> {
            if (err) console.log(err);
            this.uploadPost( this.POST_TYPE[category.toUpperCase()].url, title, results );
        });
    }

    uploadPost( url, title, results )
    {
        run(function*() {
            console.log( "uploadPost : start" );
            const post = new Browser({show : true });
            post.goto(url);
            const isLogin = yield post.execute(function() {
                return document.querySelector('#user_login');
            });
            if( isLogin !== null )
            {
                post.type("#user_login", " admin")
                post.type("#user_pass", " simfull!1")
                post.click("#wp-submit")
                post.waitFor("#wpbody")
            }
            post.type('#kboard-input-title', title )
            post.type('.wp-editor-area', results.join("<br/>")  )
            post.click("button.kboard-default-button-small")
            post.close();
        }).then((r)=> console.log( "uploadPost completed" ), err => console.error('OH NOES!', err) );
    }

}

module.exports = new SFUploadManager;