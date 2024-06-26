const electron = require('electron');
const ip = require('ip');


electron.ipcRenderer.on('Connected' , (event,message) => {

    document.getElementById("ConectedNum").innerHTML = message.length;
    let userList = document.getElementById("UserList")
    userList.innerHTML = ""
    for (let i = 0; i <  message.length; i++){
        userList.innerHTML += "<br> <div class='userConected'> <p id='connectDot'>.</p> <p class='notconnectDot'>" + message[i].name + " </p> </div>"
    }   
})


electron.ipcRenderer.on('ChatGeneral' , (event,message) => {

    typeText = 1
    if(message[1] == "server"){typeText = 2}
    showText = "<div class='messageClassDiv"+ typeText +"'> <p class='chatTimeText'> <span class='userName'> " + message[1] + "</span> <span class='messDate'>"+ getDate() +"</span>  </p> <p class='chatText' >"+ message[2] +"</p> </div>"
    document.getElementById("smallChatDivDiv").innerHTML += showText;
    let scroll = document.getElementById('smallChatDivDiv')
    scroll.scrollTop = scroll.scrollHeight;
 
})


electron.ipcRenderer.on('conectionInformation' , (event,message) => {
    message = JSON.parse(message)
    document.getElementById("replaceURL").innerHTML = "http://" +  message[0] + ":" +message[1]
    document.getElementById("nodeText").innerHTML = process.versions.node
    document.getElementById("chromeText").innerHTML = process.versions.chrome
    document.getElementById("electronText").innerHTML = process.versions.electron
    document.getElementById("textPc_arc").innerHTML = process.arch
    document.getElementById("textPc_plt").innerHTML = process.platform
    document.getElementById("textPc_dir").innerHTML = process.cwd();
})



