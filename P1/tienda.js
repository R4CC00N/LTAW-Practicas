const http = require('http');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

const fs = require('fs');
const { url } = require('inspector');

//-- Fichero a leer
const FICHERO = 'mouses.html';


// crear path o slices
function info_req(req) {

  // console.log("");
  // console.log("Mensaje de solicitud");
  // console.log("====================");
  // console.log("Método: " + req.method);
  // console.log("Recurso: " + req.url);
  // console.log("Version: " + req.httpVersion)
  // console.log("Cabeceras: ");

  //for (hostname in req.headers)
    //console.log(`  * ${hostname}: ${req.headers[hostname]}`);
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  //console.log("URL completa: " + myURL.href);
  //console.log("  Ruta: " + myURL.pathname);

  return myURL
}
  


function error404(res){
  console.log("Error!!")
  console.log(error.message);
}
function ok200(res,data){
              //-- Mensaje del cuerpo
              res.write(data);
              //-- Terminar la respuesta y enviarla
            res.end();
}

//-- Crear el servidor
const server = http.createServer((req, res) => {

  let url = info_req(req)
  console.log(url)
  console.log('PATH',url.pathname)
  console.log("Esta es la URL solicitada:" + url.href);
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

    fs.readFile(FICHERO, 'utf8', (error, data) => {

        if (error) {  //-- Ha ocurrido algun error
          error404(res)
        } 
        else {  //-- Lectura normal
          ok200(res,data)
        }
    })

});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);