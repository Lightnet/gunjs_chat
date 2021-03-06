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

        let msg = ($('#inputpublicchat').val() || '').trim();
        if(!msg) return;//check if not id empty
        let who = userid+"test";

        let rng = Gun.text.random(10);
        gun.get('chat').get(rng).put({
            alias:who,
            message:msg //enc
        });
        console.log("send message...");
    }
});

//https://gun.eco/docs/RAD
async function InitChat(){
    console.log("Init Chat...")
    $('#publicchatlist').empty();
    async function qcallback(data,key){
        console.log('incoming messages...')
        //console.log("key",key);
        console.log("data",data);
        if(data == null)return;
        if(data.message != null){
            let dec = data.message;
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
    //gunchat.get({'.': {'*': timestring},'%': 50000}).map().once(qcallback);
    gunchat.map().once(qcallback);

    //gunchat.map().on((data,key)=>{
        //console.log(data);
    //});
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