const socket = io();

button = document.getElementById("send");
ChatSpace = document.getElementById("ChatSpace");
input = document.getElementById("InputWrite");
ListaUsuariosDiv = document.getElementById("ListaUsuariosDiv")

let STATE_BASE = {general:"<div class='invisibleDiv'></div>"}
let STATE = "general"
let ListaUsuarios = []


//Manage Server-client responses
socket.on("connect", () => {
  socket.emit('connect_login', USERNAME);
}); 

//-- Al apretar el botón se envía un mensaje al servidor
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage()
  }
});
button.onclick = () => {
  sendMessage()
}


function TypeChat(id){
  STATE = id
  ChatSpace.innerHTML = STATE_BASE[id]
  ChatSpace.scrollTop = ChatSpace.scrollHeight;
  var usersChats = document.getElementsByClassName("userChat")
  for (var i = 0; i < usersChats.length; i++) {
    usersChats[i].style.backgroundColor = "#90c8ea";
  }

  var fatherDiv = document.getElementById(id);
  fatherDiv.style.backgroundColor = "#e0ffb3";
  let counter = fatherDiv.querySelector("#unread");
  counter.innerHTML =  ""

  if(id == "general"){
    document.getElementById("typeChatTitle").innerHTML = "Estas en el chat General"
  }else{
    for (let i = 0; i < ListaUsuarios.length ; i++) {
      if (id == ListaUsuarios[i].id){
        document.getElementById("typeChatTitle").innerHTML = ListaUsuarios[i].name
      }
    }
  }


}

// --  FUNCION PARA MANDAR MENSAJE AL SERVIDOR ATADO A UN EVENTO CON "emit"
function sendMessage(){

  msg = input.value
  date = FechaHora()
  if(msg != ""){
    input.value = ""
    STATE_BASE[STATE] += "<div class='TypeMessage2'> <p class='TimeText'> <span class='userName'> Tú </span>  <span class='messDate'>" + FechaHora() + "</span>  </p>   <p class='chatText'>" + msg + "</p></div>"
    ChatSpace.innerHTML = STATE_BASE[STATE]
    socket.emit("message" , [ STATE,USERNAME,msg])
    ChatSpace.scrollTop = ChatSpace.scrollHeight;
  }
}

function FechaHora(){
  var date = new Date();
  var hour = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  return hour + ":" + minutes
}



socket.on("message", (msg)=>{
  msg = JSON.parse(msg)
  new_message = ""
  if (msg[1] == "server"){
    STATE_BASE[msg[0]] += "<div class='TypeMessage3'> <p class='userName'>----------- servidor ---------</p>  <p class='chatText' >" + msg[2] + "</p> <p>"+FechaHora()+"</p>  </div>"
    let flag = msg[3]
    if (flag != undefined || flag !=""){
      if(flag == "disconect"){
        let discoUser = msg[4]
        if( STATE == discoUser){
          ChatSpace.innerHTML += "<div class='TypeMessage3'> <p class='userName'>Server</p>  <p class='chatText' >" + msg[2] + " ,cambia de chat para seguir chateando</p> <p>"+FechaHora()+"</p>  </div>"
        }
      }
    }

  }else{
    // AGREGAR SONIDO AQUI
    STATE_BASE[msg[0]] += "<div class='TypeMessage1'> <p class='TimeText'> <span class='userName'>"+ msg[1] +"</span> <span class='messDate'>"+FechaHora()+"</span>  </p> <p class='chatText' >"+ msg[2] +"</p> </div>"
  }


  if (STATE == msg[0]) {
    TypeChat(msg[0])
  }else{
    var fatherDiv = document.getElementById(msg[0]);
    let counter = fatherDiv.getElementById("unread");
    let value = Number((counter.innerHTML).slice(2, -1))
    counter.innerHTML =  " (" + String(value + 1) + ")"
    ChatSpace.scrollTop = ChatSpace.scrollHeight;
  }
  
});


socket.on("chatList", (msg)=>{

  list = JSON.parse(msg)
  ListaUsuarios = list
  ListaUsuariosDiv.innerHTML = "<div class='userChat' id='general' onclick=TypeChat('general') > <p class='userNameUserChat'> General </p>  <p id='unread'></p> </div>"
  for (let i = 0; i < list.length ; i++) {
    if (USERNAME != list[i].name){
      if (STATE_BASE[list[i].id] == undefined){STATE_BASE[list[i].id] = "<div class='invisibleDiv'></div>" }
      ListaUsuariosDiv.innerHTML +=  "<div class='userChat' id='"+list[i].id+"' onclick=TypeChat('" + list[i].id + "') > <p class='userNameUserChat'>" + list[i].name+ "</p> <p id='unread'></p> <p class='connectDot'> · </p> </div>"
    }
  }

});

