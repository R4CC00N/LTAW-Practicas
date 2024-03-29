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
const  ProductoDescripcion= fs.readFileSync('main.html','utf-8');

//Definición del puerto
const PUERTO = 9090;

//Funciones para el buscador


////////////////////////////////////////////////////////////////



// funcion para crear mensaje que mostrara la informacion de JSON
function ShowDescription(){
  let htmlProductos = '';
  productos.forEach(producto => {
    htmlProductos += `
    <h1 class="producto">${producto.nombre}</h1>
    <p class="text">${producto.descripcion}</p>
    <a href="${producto.nombre.toLowerCase()}.html">
    <button class="btn" class="obj">Ver ofertas</button>
    </a>,`;
  });
  return htmlProductos;
}

function InfoUser(req) {
  const cookie = req.headers.cookie;
  if (cookie) {
      let pares = cookie.split(";");
      let user;
      let imagenes;
      pares.forEach((element, index) => {
          let [nombre, valor] = element.split('=');
          if (nombre.trim() === 'user') {
              user = valor;
          }
          if (nombre.trim() === 'imagenes') {
            imagenes = valor;
        }
      });
      return user || null;
  }

}

function ok200description(res,tipo,user){
const producto1=ProductoDescripcion.replace('<!-- PRODUCT1_PLACEHOLDER -->', ShowDescription().split(",")[0]);
const producto2=producto1.replace('<!-- PRODUCT2_PLACEHOLDER -->', ShowDescription().split(",")[1]);
const producto3=producto2.replace('<!-- PRODUCT3_PLACEHOLDER -->', ShowDescription().split(",")[2]);

  // cookie vacia
 //res.setHeader('Set-Cookie', 'user=');

 if (user) {
   
  content = producto3.replace('<!--HOLA USUARIO-->', `<h3>Bienvenido: ${user}</h3>`);
  console.log("Peticion Recibida, 200 OK");
  res.writeHead(200, {'Content-Type': tipo});
  res.write(content);
  res.end();
 }  
 else{
  res.writeHead(200, {'Content-Type': tipo});
  console.log("Peticion Recibida, 200 OK");
  res.write(producto3);
  res.end();
 }

};
function ok200(res,data,tipo){

  console.log("Peticion Recibida, 200 OK");
  res.writeHead(200, {'Content-Type': tipo});
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

  const direccion = info(req);
  let user = InfoUser(req);

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
  else {
    //Lectura sincrona
    fs.readFile(direccion, function(err,data) {
      //Fichero no encontrado
      if (err){
        //Lanza error
        console.log("Error!!")
        console.log(err.message);
        
        res.write(pag_404);
        res.end();

      }

      else{

        if(req.url === "/"|| req.url==="/main.html")
        {
          ok200description(res,tipo,user);
          
        }
        else{
          ok200(res,data,tipo);
        }

      }
        
       
    });
  }
});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 
