//RACCOON
//NODE TIENDA.JS

//Importando módulos
const path = require('path');
const http = require('http');
const fs = require('fs');

// contantes de ficheros html
const pag_error = "error.html"
const pag_404 = fs.readFileSync(pag_error);
const  ProductoDescripcion= fs.readFileSync('main.html','utf-8');

// constantes de ficheros JSON
const FICHERO_JSON = "tienda.json"
const tienda_json = fs.readFileSync(FICHERO_JSON,'utf-8');
const usuarios = JSON.parse(tienda_json).usuarios;
const productos = JSON.parse(tienda_json).productos;
const OBJETOS = JSON.parse(tienda_json).objetos;



//Definición del puerto
const PUERTO = 9090;


////////////////////////////////////////////////////////////////
function convert2Dic(params , split){

  const dict = {};
  for (let i = 0; i < params.length; i++){
    param = params[i].split(split)
    dict[param[0]] = param[1];
  }
  return dict
}
function getCookies(req){
  let cookie = req.headers.cookie
  if (cookie) {
    cookie = cookie.replace(/\s/g, "");
    cookie = cookie.split(";")
    cookie = convert2Dic(cookie,"=")
    return cookie
  }else{
    return {}
  }
}

//BUSCAR LA PALABRA EN EL JSON

function ShowSearch(){
  let htmlProductos =  `  
  <div class="searchDiv">
  <input class="searchBar" placeholder="Busca un producto" type="text"/>
  <div id="searchElements"></div>
</div>
<button class="logButtonSearch" onclick="productSearch()">🔎</button>
  `;
  return htmlProductos;
}

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


function InfoPost(req) {
  const cookie = req.headers.cookie;
  if (cookie) {
      let pares = cookie.split(";");
      let obj;
      pares.forEach((element, index) => {
          let [nombre, valor] = element.split('=');
          if (nombre.trim() === 'user') {
              obj = valor;
          }
          else if (nombre.trim() === 'buy') { // para carrito de compra
            obj = valor;
        }
      });
      return obj || null;
  }

}


function ok200description(res,tipo,obj){
  const Showsearch = ProductoDescripcion.replace('<!--SEARCH-CONTEINER-->', ShowSearch());
  const producto1=Showsearch.replace('<!-- PRODUCT1_PLACEHOLDER -->', ShowDescription().split(",")[0]);
  const producto2=producto1.replace('<!-- PRODUCT2_PLACEHOLDER -->', ShowDescription().split(",")[1]);
  const data=producto2.replace('<!-- PRODUCT3_PLACEHOLDER -->', ShowDescription().split(",")[2]);
  //data = manageMain(producto3, objetos ,cookies) 
  // cookie vacia
 //res.setHeader('Set-Cookie', 'user=');
 if (obj) {
  content = data.replace('<!--HOLA USUARIO-->', `<h3>Bienvenido: ${obj}</h3>`);
  
  console.log("Peticion Recibida, 200 OK");
  res.writeHead(200, {'Content-Type': tipo});
  res.write(content);
  res.end();
 }  
 else{
  res.writeHead(200, {'Content-Type': tipo});
  console.log("Peticion Recibida, 200 OK");
  res.write(data);
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

/////////////////////// MAIN //////////////////////////////


const server = http.createServer(function(req, res) {

  //console.log("Petición recibida");
  const direccion = info(req);
  let obj = InfoPost(req);

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
  
  recurso = req.url.split('?')[0];

  console.log('dirccion: ',direccion);
  console.log('req: ',recurso);
  console.log("URL: ",req.url)

if(req.method=='GET'){
  if(recurso =='/product'){
    console.log("Peticion de Productos!")
    content_type = "application/json";
    console.log("  url: " +  direccion);

//-- Leer los parámetros
    let nameDir = req.url.split('?')[1];
    let nameOp = nameDir.split('=')[0]
    let nameProduct = nameDir.split('=')[1];

    if(nameOp == 'names'){
      nameProduct = nameProduct.toUpperCase();

     //console.log("  Nombre Producto: " +  nameProduct);

      let result = [];

      for (let prod of OBJETOS) {
          //console.log('nombres: ',prod.name)
          //-- Pasar a mayúsculas
          prodU = prod.name.toUpperCase();
          console.log('nombres: ',prodU)
          //-- Si el producto comienza por lo indicado en el parametro
          //-- meter este producto en el array de resultados
          if (prodU.startsWith(nameProduct)) {
              result.push([prod.name,prod.category]);
          }
          
      }
      console.log('resultados: ',result);
      content = JSON.stringify(result);
      ok200(res,content,tipo);
    }
  }
  else {
    // Lectura sincrona
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
        // si es main me hace la deteccion del json PAGINA DINAMICA
        
        if(req.url === "/"|| req.url==="/main.html")
        {
          cookies = getCookies(req)
          ok200description(res,tipo,obj);
          //console.log('cookies: ',cookies)
          //console.log('OBJETOS: ',OBJETOS)
          
        }
        else{
          ok200(res,data,tipo);
        }

      }
    });
  }

}
else{
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
        const userExists = usuarios.find(obj => obj.nombre_usuario === username && obj.password === password);
        
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
    // Lectura sincrona
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
        // si es main me hace la deteccion del json PAGINA DINAMICA
        
        if(req.url === "/"|| req.url==="/main.html")
        {
          cookies = getCookies(req)
          ok200description(res,tipo,obj);
          // console.log('cookies: ',cookies)
          // console.log('OBJETOS: ',OBJETOS)
          
        }
        else{
          ok200(res,data,tipo);
        }

      }
    });
  }
}
});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 

