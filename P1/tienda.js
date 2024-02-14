const http = require('http');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

function leerhtml(url)
{
    fetch(url)
    .then(Response=> {
        if(!Response.ok)
        {
            throw new Error('ERROR 404');
        }
        return Response.text();
    })
    .then(data=> {
        document.getElementsByTagName('html').innerHTML=data;
    })
    .catch(error=>{
        console.error('ERROR',error);
    });
}


//-- Crear el servidor
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  //-- Cabecera que indica el tipo de datos del
  //-- cuerpo de la respuesta: Texto plano
  res.setHeader('Content-Type', 'text/html');

  //-- Mensaje del cuerpo
  res.write('HOLA');

  //-- Terminar la respuesta y enviarla
  res.end();
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);