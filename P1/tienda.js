//RACCOON
//NODE TIENDA.JS

//Importando módulos
const path = require('path');
const http = require('http');
const fs = require('fs');
const { sourceMapsEnabled } = require('process');
const pag_error = "error.html"
const pag_404 = fs.readFileSync(pag_error);


//Definición del puerto
const PUERTO = 9090;

function ok200(res,data,tipo){

  res.writeHead(200, {'Content-Type': tipo});
  console.log("Peticion Recibida, 200 OK");
  res.write(data);
  res.end();

};

//Construir objeto url con la url de la solicitud
function info(req){
  
  let url = req.url==='/'?'/main.html':req.url;
  const resource = path.join(__dirname,url);
  
  return resource;
}

// FUNCION PARA LS
function DirectoryLs(){
    // para LS
    const files = fs.readdirSync('./');
    ordFiles = '<p> DIRECTORIO </p>';
    for (var i=0; i<files.length;i++){
      ordFiles+='<p> * '+files[i]+'</p>'
    }
    return ordFiles
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

  let recurso = req.url.split('?')[0];



  if(req.method=='GET'){
    if(recurso=='/ls'){
      //console.log('ENTRO EN LS')
      lsDir=DirectoryLs();
      ok200(res,lsDir,tipo);
    }
    else{
      //Lectura sincrona
      fs.readFile(direccion, function(err,data) {
        //Fichero no encontrado
        if (err){
          //Lanza error
          console.log("Error!!")
          console.log(err.message);
          
          res.write(pag_404);
          res.end();
  
        }else{
  
          ok200(res,data,tipo);
        }     
      });
    }
  }


});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 
