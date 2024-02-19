const http = require('http');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

const fs = require('fs');

//-- Fichero a leer
const FICHERO = 'main.html';



//-- Crear el servidor
const server = http.createServer((req, res) => {
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  //-- Cabecera que indica el tipo de datos del
  //-- cuerpo de la respuesta: Texto plano
  res.setHeader('Content-Type', 'text/html');

    fs.readFile(FICHERO, 'utf8', (error, data) => {

        if (error) {  //-- Ha ocurrido algun error
          console.log("Error!!")
          console.log(error.message);
        } 
        else {  //-- Lectura normal
              //-- Mensaje del cuerpo
            res.write(data);
              //-- Terminar la respuesta y enviarla
            res.end();
        }
    })

});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);