//===============================================
// CLEAR GUN DATABASE
localStorage.clear();

// INIT GUN DATABASE
let gunurl = window.location.origin+'/gun';
//console.log(gunurl);
var gun = Gun(gunurl);
gun.on('hi', peer => {//peer connect
  console.log('connect peer to',peer);
  //console.log('peer connect!');
});
gun.on('bye', (peer)=>{// peer disconnect
  console.log('disconnected from', peer);
  //console.log('disconnected from peer!');
});

//===============================================
// PUBLIC CHAT
//===============================================
var gunchat;
function timestamp(){
    let currentDate = new Date();
    //console.log(currentDate);
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
    let date = ("0" +currentDate.getDate()).slice(-2);
    let hour = ("0" +currentDate.getHours()).slice(-2);
    let minute = ("0" +currentDate.getMinutes()).slice(-2);
    let second = ("0" +currentDate.getSeconds()).slice(-2);
    let millisecond = currentDate.getMilliseconds();
    return year + "/" + (month) + "/" + date + ":" + hour+ ":" + minute+ ":" + second+ ":" + millisecond;        
}

function scrollPublicMessage(){
    let element = document.getElementById("publicchatlist");
    element.scrollTop = element.scrollHeight;
}

var userid = Gun.text.random(10);


$("#inputpublicchat").keyup(async function(e) {
    if(e.key == "Enter"){
        console.log("Enter");
        //let user = gun.user();
        //if(!user.is){ return }//check if user exist
        let msg = ($('#inputpublicchat').val() || '').trim();
        if(!msg) return;//check if not id empty
        
        let encmsg = await SEA.work("public","chat");//encrypttion key default?
        //console.log(encmsg);
        let enc = await SEA.encrypt(msg,encmsg);
        //console.log(enc);
        //let who = await user.get('alias').then();
        let who = userid+"test";
        //console.log(who);
        //console.log(typeof enc)
        enc = window.btoa(enc);
        gun.get('chat').get(timestamp()).put({
            alias:who,
            message:enc
        });
        console.log("send message...");
    }
});

//https://gun.eco/docs/RAD
async function InitChat(){
    console.log("Init Chat...")
    $('#publicchatlist').empty();
    let encmsg = await SEA.work("public","chat"); //encrypttion key default?
    async function qcallback(data,key){
        console.log('incoming messages...')
        //console.log("key",key);
        console.log("data",data);
        if(data == null)return;
        if(data.message != null){
            let message = window.atob(data.message);
            //console.log(message);
            let dec = await SEA.decrypt(message,encmsg);
            //console.log(dec)
            if(dec!=null){
                $('#publicchatlist').append($('<div/>', { 
                    id: key,
                    text : data.alias + ": " + dec
                }));
                scrollPublicMessage();
            }
        }
    }
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1 ) ).slice(-2);
    let date = ("0" +currentDate.getDate()).slice(-2);
    let timestring = year + "/" + month + "/" + date + ":";
    console.log(timestring);
    if(gunchat !=null){
        gunchat.off()
    }
    gunchat = gun.get('chat');
    //gunchat.get({'.': {'*': '2019/08/'}}).map().once(qcallback);
    //gunchat.get({'.': {'*': timestring}}).map().once(qcallback);
    gunchat.get({'.': {'*': timestring},'%': 50000}).map().once(qcallback);
}

function PublicChatResize(){
    let height = $(window).height(); - $('#publicchat').offset().top;
    $('#publicchat').css('height', height - 50);
    height = $('#publicchat').height();
    $('#publicchatlist').css('height', height - 44);
}

$(window).resize(function() {
    PublicChatResize();
});

InitChat();
PublicChatResize();



