//RACCOON
//NODE TIENDA.JS

//Importando módulos
const path = require('path');
const http = require('http');
const fs = require('fs');
const pag_error = "error.html"
const pag_404 = fs.readFileSync(pag_error);
const FICHERO_JSON = "tienda.json"
const tienda_json = fs.readFileSync(FICHERO_JSON);
const usuarios = JSON.parse(tienda_json).usuarios;
const productos = JSON.parse(tienda_json).productos;

//Definición del puerto
const PUERTO = 9090;


function InfoUser(req) {
  const cookie = req.headers.cookie;
  if (cookie) {
      console.log("cookie: ",cookie)
      let pares = cookie.split(";");
      let user;
      pares.forEach((element, index) => {
          let [nombre, valor] = element.split('=');
          if (nombre.trim() === 'user') {
              user = valor;
          }
      });
      return user || null;
  }

}


function ok200(res,data,tipo,user){
   // cookie vacia
  //res.setHeader('Set-Cookie', 'user=');
  res.writeHead(200, {'Content-Type': tipo});
  console.log("Peticion Recibida, 200 OK");
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

  const RESPUESTA = fs.readFileSync('main.html', 'utf-8');

  if (req.url == '/procesar') {
    
    // AQUI VA LA ACCION DE VER EL USUARIO Y LA CONTRASEÑA

    let body="";
    content_type = "text/html";
    content = RESPUESTA;
        //-- Si hay datos en el cuerpo, se imprimen
    req.on('data', (cuerpo) => {
      body += cuerpo.toString();
      //-- Los datos del cuerpo son caracteres
      req.setEncoding('utf8');
      console.log(`Cuerpo (${cuerpo.length} bytes)`)
      console.log(` ${cuerpo}`);

    });
    // Manejar el final de la solicitud
    req.on('end', () => {
        // Generar la respuesta
        const formData= new URLSearchParams(body);
        const username = formData.get('username')
        const password = formData.get('password')

        console.log("Nombre usuario:", username);
        console.log("Contraseña:", password);
        const userExists = usuarios.find(user => user.nombre_usuario === username && user.password === password);
        if (userExists) {
          res.setHeader('Set-Cookie', `user=${username}`);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          // PODEMOS CAMBIARLO POR UN HTML CREADO 

          res.write('<h1>Bienvenido ' + username + '</h1>');
          res.write('<a href="/">Pagina Principal</a>'); 
          res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h1>Error 404: Usuario no encontrado</h1>');
        res.write('<a href="/login.html">Volver a intentarlo</a>'); // Agregar enlace de regreso
        res.end();
      }

    });

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
        let user = InfoUser(req);
        if (user) {
          res.writeHead(200, {'Content-Type': tipo});
          console.log("Peticion Recibida, 200 OK");
          res.write('<h3 style="font-family: verdana; color: #b4b4b4;"> Bienvenido ' + user + '</h3>');
          res.write(data);
          res.end();
        }  
        else{
          ok200(res,data,tipo,user)
        }
        
      }     
    });
  }
});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 
