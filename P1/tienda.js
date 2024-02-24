
//-- Definir el puerto a utilizar
const PUERTO = 9090;

// constantes que requiere el back
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Fichero a leer
const FICHERO = 'main.html';


// crear path o slices
function info_req(req) {
  // posibles mensajes de consola...
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("URL completa: " + myURL.href);
  console.log("  Ruta: " + myURL.pathname);

  return myURL;
}
  


function error404(res){
  // se puede añadir el codigo 404 y el mensaje error
  // poner enlace a pagina de error
  res.writeHead(404,{'Contente-Type':'text/html'});
  direccion = "error.html";
  data = fs.readFileSync(direccion);
  //-- Mensaje del cuerpo            
  res.write(data);
  //-- Terminar la respuesta y enviarla
  res.end();
  console.log("Error!!")
}

function ok200(res,data,extension){
  res.writeHead(200,{'Contente-Type':extension});
  // se puede añadir el codigo 200 y el mensaje ok
  //-- Mensaje del cuerpo            
  res.write(data);
  //-- Terminar la respuesta y enviarla
  res.end();
}

//-- Crear el servidor
const server = http.createServer((req, res) => {

  // lamada a la funcion que toma la informacion del URL
  let url = info_req(req);
  let extension = "";
  let recurso = "";
  

  if (req.method == 'GET'){

    if (url.pathname != "/ls"){

      if (url.pathname == "/"){
        extension += "main.html";
        recurso += url.pathname.slice(1,);
      }
      fs.readFile(recurso, 'utf8', (err, data) => {
    
        if (err) {  //-- Ha ocurrido algun error
          error404(res)
        } 
        else {  //-- Lectura normal
          ok200(res,data,extension)
        }
      });
    } 
    else{
      ok200(res,data,extension)
    }

  }
});


//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);