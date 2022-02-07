로코 가이드

1. Node.js 설치하기

2. Node.js 프로젝트 생성(원하는 경로에 폴더 생성 후 Node.js 명령창의 해당 위치에서 npm init을 친다)

3. Node.js 명령창의 프로젝트 폴더 경로에서 npm install node-kakao 명령어로 모듈을 설치한다.

4. 이후 node_modules 폴더와 package.json, package-lock.json 파일이 생성된다. node_modules 폴더와 같은 위치에 index.js를 생성한다. (메인 코드)

5. 디바이스의 uuid값이 필요하다.

1) 컴퓨터 카카오톡 설치 후 인증을 받아 로그인한다.
2) 컴톡에서 로그인 또는 로그아웃 직후 작업관리자에서 덤프파일 생성을 한다.
3) 레지스트리 편집기에서 "컴퓨터\HKEY_CURRENT_USER\Software\Kakao\KakaoTalk\DeviceInfo\날짜" 항목에 들어간 다음 dev_id값을 찾는다.
4) 덤프파일을 헥스에디터로 연 다음 dev_id값을 찾는다.(없으면 다시 생성해야함) dev_id값이 찾아지면 그 뒤에 추가로 텍스트 내용이 있는데 이 값을 ==가 있는 부분까지 쭉 복사를 한다.
5) 복사된 값이 디바이스의 uuid값이다. (dev_id 시작부분 부터 ==까지)

6. index.js 파일을 생성하고 base 코드를 입력한다.
   //const LOCO = require('@storycraft/node-kakao');
   const LOCO = require('node-kakao')
   const fs = require('fs')
   const cp = require('child_process')

//stable(3.1)
let client = new LOCO.TalkClient('DESKTOP_NAME','clientUUID'); //컴퓨터 이름, 봇 계정 컴 톡의 uuid
client.login('clientId','clientPw') //봇 계정 ID, 봇 계정 PW

//stable(3.0.3)
//let client = new LOCO.TalkClient('DESKTOP_NAME'); //컴퓨터 이름
//client.login('clientId','clientPw','clientUUID') //봇 계정 ID, 봇 계정 PW, 봇 계정 컴 톡의 uuid

client.on('message', (chat) => {
let userInfo = chat.Channel.getUserInfo(chat.Sender);
if (!userInfo) return;

    if (chat.Type === LOCO.ChatType.Search) {
        let attachment = chat.AttachmentList[0];

        chat.replyText(`${userInfo.Nickname}님이 샵 검색 전송 ${attachment.Question}. 리다이렉트 경로: ${attachment.RedirectURL}`);
    }

    if (chat.Text === '안녕하세요') {
        chat.replyText('안녕하세요 '); // 일반 채팅
        chat.replyText('안녕하세요 ', new LOCO.ChatMention(userInfo)); // Ex) 안녕하세요 @storycraft
        chat.Channel.sendTemplate(new LOCO.AttachmentTemplate(LOCO.ReplyAttachment.fromChat(chat), '안녕하세요 ')); // 답장형식
    }

/\*  
//Super Eval
//your user id : 관리자 아이디
if((chat.Sender.id==your user id) && chat.Text.indexOf("~")==0){
try{
chat.replyText(String(eval(chat.Text.substr(1))));
}catch(e){
chat.replyText(e+'\n'+String.fromCharCode(8237).repeat(500)+e.stack)
}

    }

\*/
console.log(chat.Sender.id+" "+userInfo.Nickname+":"+chat.Text+"\n"+chat.attachmentList.map(v=>v.$).join("\n") )
blankFunc(chat)

});

//client.on('message_read', (channel, reader, watermark) => {
// console.log(channel.getUserInfo(reader).Nickname + ' 이(가) ' + channel.Id + ' 방의 글을 읽었습니다. 워터마크: ' + watermark);
//});

function blankFunc(chat){}

function cmd(\_cmd){
let cmdResult;
try{
cmdResult = cp.execSync(\_cmd,{shell:"/bin/bash"}).toString()
}catch(e){
cmdResult = e.toString()
}
return cmdResult.replace(/\u001b\[\d\dm/g,"")

}

Object.defineProperty(Object.prototype,"$", {
get:function(){
var self=this;
return Object.getOwnPropertyNames(this).map(v=>{
try{
return v+" : "+self[v]
}catch(e){ }
return v+" : error"

        }).join("\n");
    }

});

Object.defineProperty(Object.prototype,"$$", {
get:function(){
var self=this;
return Object.getOwnPropertyNames(this.**proto**).map(v=>{
try{
return v+" : "+self[v]
}catch(e){ }
return v+" : error"
}).join("\n");
}
});

7. cmd창을 프로젝트 폴더로 경로 이동을 한 다음, node index.js를 쳐준다.

8. cmd창에는 사람들의 id, 닉네임, 채팅 내용이 뜬다. 또한 작성한 코드에 따라서 봇이 반응을 하게 된다.

9. 이제 세부 기능들을 추가해보자!
