//-- Cargar las dependencias
const socketServer = require('socket.io').Server;
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 9090;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = new socketServer(server);


// FUNCIONES 


//-- Funcion para mostrar mensajes --//
function MostrarConsola(msg , id){
    console.log("**********************************".white)
    console.log("mensaje completo: ", msg)
    console.log("Mensaje recibido: ".magenta)
    console.log("origin id: ".red + id.yellow)
    console.log("**********************************".white)
  
  }

//--- Funcion para comandos especiales ---//
function specialCommand(comand){
    switch(comand){
  
      case "/help":
          console.log('help')
          break;
  
      case "/list":
        console.log('lista??')
          break;
  
      case "/hello":
        console.log('hola')
          break;
  
      case "/date":
        console.log('fecha')
          break;
  
      default:
        console.log('nop')
          break;
  }
  
  }
  

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación Web!!!' + '<p><a href="/userChat.html">join chat</a></p>');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  console.log('** NUEVA CONEXIÓN **'.yellow);
  // nombre usuario AQUI

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    MostrarConsola(msg , socket.id)

    //-- Reenviarlo a todos los clientes conectados
    io.send(msg);
    if (msg[0] == "/"){
        //console.log('socket: ',socket)
        specialCommand(msg)
      
    }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
