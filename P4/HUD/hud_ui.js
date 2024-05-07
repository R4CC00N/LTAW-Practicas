
function getDate(){
    var fecha = new Date();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    return hora + ":" + minutos
}

function sendMessage(message){
    
    showText = "<div class='messageClassDiv2'> <p class='chatTimeText'> <span class='userName'>server</span> <span class='messDate'>"+ getDate() +"</span>  </p> <p class='chatText' >"+ message +"</p> </div>"

    
    document.getElementById("smallChatDivDiv").innerHTML += showText;
    electron.ipcRenderer.invoke('serverMess' , message )

    let scroll = document.getElementById('smallChatDivDiv')
    scroll.scrollTop = scroll.scrollHeight;
}

function sendComplexMessage(){
    const input = document.getElementById('inputWrite');
    if (input.value != ""){
        sendMessage(input.value)
        input.value = ""
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendComplexMessage()
    }
});


let testButton= document.getElementById('testButton');
testButton.onclick = () => {
    sendMessage("Este es un mensaje de prueba.")
};


let sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', () => {
    sendComplexMessage()
});



