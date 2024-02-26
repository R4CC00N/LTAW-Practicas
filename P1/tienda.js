//RACCOON
//NODE TIENDA.JS

//Importando módulos
const path = require('path');
const http = require('http');
const fs = require('fs');

//Definición del puerto
const PUERTO = 9090;

function ok200(res,data,tipo){

  res.writeHead(200, {'Content-Type': tipo});
  console.log("Peticion Recibida, 200 OK");
  res.write(data);
  res.end();

};
function error404(res,data,tipo){

  res.writeHead(404,{'Content-Type': tipo})
  console.log("Petición rechazada: 404 Not Found");
  resource = "html/error.html";
  data = fs.readFileSync(resource);
  res.write(data);
  res.end();

};

function info(req){
  //Construir objeto url con la url de la solicitud
  let url = req.url==='/'?'/main.html':req.url;
  const resource = path.join(__dirname,url);
  
  return resource;
}


//Creación del servidor
const server = http.createServer(function(req, res) {

  //console.log("Petición recibida");

  direccion = info(req);

  //Tipos de archivo
  const tipo = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpg",
    "png" : "image/png",
    "PNG" : "image/PNG",
    "ico" : "image/ico",
    "css" : "text/css",
  };

  //Lectura sincrona
  fs.readFile(direccion, function(err,data) {
    //Fichero no encontrado
    if (err){
      //Lanza error
      error404(res,data,tipo);

    }else{

      ok200(res,data,tipo);
    }     
  });
});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 
