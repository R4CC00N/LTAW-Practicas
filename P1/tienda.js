// PRÁCTICA 1. TIENDA.

//-- Importamos los módulos necesarios
const http = require('http');

//-- Crear el servidor
const server = http.createServer();

//-- Definimos las constantes
const port = 9090;
const tienda = "main.html";

//-- Función de retrollamada de petición recibida
//-- Cada vez que un cliente realiza una petición
//-- Se llama a esta función
function atender(req, res) {
    //-- req: http.IncomingMessage: Mensaje de solicitud
    //-- res: http.SercerResponse: Mensaje de respuesta (vacío)

    //-- Indicamos que se ha recibido una petición
    console.log("Petición recibida!");

    //-- Cabecera que indica el tipo de datos del
    //-- cuerpo de la respuesta: Texto plano
    res.setHeader('Content-Type', 'text/plain');

    //-- Mensaje del cuerpo
    res.write(tienda);

    //-- Terminar la respuesta y enviarla
    res.end();
}

//-- Activar la función de retrollamada del servidor
server.on('request', atender);

//-- Activar el servidor. A la escucha de peitciones
//-- en el puerto definido
server.listen(port);