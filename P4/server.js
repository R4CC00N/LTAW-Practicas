//-- Cargar las dependencias
const socketServer = require('socket.io').Server;
const http = require('http');
const express = require('express');
const colors = require('colors');
const fs = require('fs');

const PUERTO = 9090;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = new socketServer(server);


const CHAT_HTML =  fs.readFileSync('userChat.html', 'utf-8')
let clients = []

// MENSAJES PARA CASOS
//-- MENSAJES PARA CASOS
const ayuda = `Comandos Disponibles: 
<br> ➤ /list: Muestra la lista con los usuarios conectados
<br> ➤ /hello: Muestra mensaje de saludo
<br> ➤ /date: Muestra la fecha acrual`

let respuesta_ayuda = "Lista de usuarios conectados:"

const saludo = "Hola Usuario!, veo que te llamas: "

// FUNCIONES 
//-- Funcion para obtener la fecha --//
function getDate(){

    const fecha = new Date();
    
    const dd = fecha.getDate()
    const mm = fecha.getMonth() + 1
    const yy = fecha.getFullYear().toString().slice(-2);
  
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
  
    const fecha_hora = `La feha acutal es: ${dd}/${mm}/${yy}, y la hora es: ${hora}:${minutos} y ${segundos} segundos`;
    return fecha_hora
  }

//-- Funcion para mostrar mensajes --//
function MostrarConsola(msg , id){
    console.log("**********************************".white)
    console.log("mensaje completo: ", msg)
    console.log("Mensaje recibido: ".magenta)
    console.log("origin id: ".red + id.yellow)
    console.log("origin name: ".red + msg[1].yellow)
    console.log("Destination id: ".green + msg[0].yellow)
    console.log("Destination name: ".green + msg[1].yellow)
    if (msg[0] == "general"){
        console.log("Message content: ".blue + msg[2].yellow)
    }else{
        console.log("Message content: ".blue + "CHAT PRIVADO".red)
    }
    console.log("**********************************".white)
  
  }

//-- Trabajar mensaje --//
function trocearMensaje(msg){

    let id=msg[0];

    let name=msg[1];

    let msgtext=msg[2];

    let msgCmd=msg[2][0];

    return [id,name,msgtext,msgCmd]
}

//--- Funcion para comandos especiales ---//
function specialCommand(comand, socket , nameClient ,idClient){
    switch(comand){
  
      case "/help":
          socket.emit("message" ,JSON.stringify([idClient ,"server",ayuda]))
          break;
  
      case "/list":
          if (clients.length <=1){
              respuesta_ayuda = "Ningun Usuario Conectado, ademas de ti ➤" + nameClient
          }else{
              for (let i = 0; i <  clients.length; i++){
                  if (socket.id != clients[i].id){
                      respuesta_ayuda += "<br> ➤ " + clients[i].name
                  }
              }
          }
          socket.emit("message" ,JSON.stringify([idClient ,"server",respuesta_ayuda]))
          break;
  
      case "/hello":
          socket.emit("message" , JSON.stringify([idClient ,"server", saludo + nameClient ]))
          break;
  
      case "/date":
          socket.emit("message" , JSON.stringify([idClient ,"server", getDate()]))
          break;
  
      default:
          socket.emit("message" , JSON.stringify([idClient ,"server","Comando invalido, escribe /help para conocer todas las opciones"]))
          break;
  }
  
  }
  
  

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación Web!!!' + '<p><a href="/index.html">join chat</a></p>');
});

//-- Peticion Login --//
app.post('/login', (req, res) => {
    let userName = ""
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        const datos = new URLSearchParams(data);
        userName = datos.get('userName');
        const clientsName = clients.map(objeto => objeto.name);
        if (clientsName.includes(userName)){
            res.status(404).send("Nombre de usuario ya utilizado por otro usuario");
        }else if(userName.toLowerCase() == "server" ){
            res.status(404).send("Nombre de usuario no disponible");
  
        }else if(userName == "" ){
            res.status(404).send("Necesitas un nombre de usuario, este campo no puede estar vacio");
  
        }else{
            res.send(CHAT_HTML);
        }
    });
  
  });
  

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
    
  // para login
socket.on("connect_login", (msg)=> {
    console.log('Nueva conexión: '.green)
    console.log(" Nombre del Usuario: " + msg.yellow + "id: "+ socket.id.blue )
    
    // para conocer los nombres de los clientes y su ID
    clients.push({name: msg , id: socket.id})
  
    socket.broadcast.emit("message",JSON.stringify(["general","server", "Se ha conectado: " + msg]));
    
    // enviamos el evento chatlist que le llegara al usuario
    io.emit("chatList", JSON.stringify(clients));
    
    
    socket.emit("message", JSON.stringify(["general", "server" ,saludo + msg+ ", bienvenido!!" ]) );
  });
  
  console.log('** NUEVA CONEXIÓN **'.yellow);
  // nombre usuario AQUI

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('CONEXIÓN TERMINADA CON: '.red  + socket.id.yellow);
    filtered_clients = []
    for (let i = 0; i <  clients.length; i++){
        if (clients[i].id == socket.id){
            io.emit("message", JSON.stringify([ "general", "server" ,"Se ha desconectado  " + clients[i].name ,"disconect" ,socket.id]));
        }else{
            filtered_clients.push(clients[i])
        }

    }
    clients = filtered_clients
    io.emit("chatList", JSON.stringify(clients));
});  


  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    //console.log("Mensaje Recibido!: " + msg.blue);
    MostrarConsola(msg , socket.id)

    let trozos = trocearMensaje(msg)
    //id,name,msgtext,msgCmd
    
        if (trozos[3] == "/"){
            //console.log('trozos: ',trozos)
            console.log('socket: ',socket)
          specialCommand(trozos[2], socket , trozos[1] , trozos[0])
          
        }else{
            if (trozos[0] == "general"){
                socket.broadcast.emit("message",JSON.stringify(msg));

            }else{

                destinatary = trozos[0]
                trozos[0] = socket.id
                io.to(destinatary).emit('message', JSON.stringify(msg));
            }
            
        }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
