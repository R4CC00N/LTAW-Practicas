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
const DIRECTORY =  fs.readFileSync('searchPage.html','utf-8');

// constantes de ficheros JSON
const FICHERO_JSON = "tienda.json"
const tienda_json = fs.readFileSync(FICHERO_JSON,'utf-8');

const usuarios = JSON.parse(tienda_json).usuarios;
const productos = JSON.parse(tienda_json).productos;
const OBJETOS = JSON.parse(tienda_json).objetos;



//Definición del puerto
const PUERTO = 9090;


////////////////////////////////////////////////////////////////
//// buscar en el GET //////
function searchGET(req){
  let productDir = req.url.split('?')[1];
  console.log('dir: ', productDir)
  return productDir
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

// Para hallar las cookies ojo
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

// para cookies ojo con el carrito
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

// Mensajes de OK 200
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

// CREACION DE LA URL
function info(req){
  //Construir objeto url con la url de la solicitud
  let url = req.url==='/'?'/main.html':req.url;
  const resource = path.join(__dirname,url);
  
  return resource;
}

////////////////////////////////BUSCADOR////////////////////////////////
function searchProducto (nameProduct){
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
  return result;
}

function findProductById(id){

  let element;
  OBJETOS.map(function(elemento) {
    if (elemento['id'] == id) {
      element = elemento
    }
  });
  return element
}
function checkIDExists(search){
  let found = false
  OBJETOS.map(function(elemento) {
    if (elemento.id == search) {
      found = true
    }
  });
  return found
}
// Funcion para mostrar la barra de busqueda
function ShowSearch(){
  let htmlProductos =  `  
  <div class="searchDiv">
  <input class="searchBar" placeholder="Busca un producto" type="text"/>
  <div id="searchElements"></div>
</div>
  `;
  return htmlProductos;
}
////////////////////////////////////////////////////////////////////////

//////////////////////////// CARRITO DE COMPRA ////////////////////////////
function userOK(user,password,usuarios){
  found = false
  card = ""
  for (let i = 0; i <  usuarios.length; i++){
    if(usuarios[i].nombre_usuario == user && usuarios[i].password == password ){
      found = true;
      card = usuarios[i].pedidos.card
      console.log('TARJETA: ',usuarios[i].pedidos.card)
      break;
    }
  }
  return [found,card]
}
async function manageCart(data,cookies , callback){
  data = data.toString()
  if(cookies['userName'] != null){
    if(cookies['cart'] != null && cookies['cart'].length != 0  ){
      fs.readFile("cartProduct.html", (err, component) => { 
        if(!err){
          component = component.toString()
          cartCookie = cookies['cart'].split(":")
          cartCookie = convert2Dic(cartCookie,"_")
          productsComponents = "<p id='cartTittle'>Lista de productos</p> \n <div id='productDiv' >"
          totalPrice = 0
          for (let key in cartCookie) {
            newComponent = component
            let id = key
            let stock = cartCookie[key]
            let componentData = findProductById(id)
            newComponent = newComponent.replace("TITTLE",componentData.name);
            newComponent = newComponent.replace(/REPLACE_ID/g,id);
            newComponent = newComponent.replace(/PRICEUNIT/g, String(componentData.price));
            newComponent = newComponent.replace("value='0'", "value='" + stock+"'");
            newComponent = newComponent.replace("TOTALPRICE", String(Number(stock) * Number(componentData.price)));
            newComponent = newComponent.replace("replaceMAX", componentData.stock);
            totalPrice += Number(stock) * Number(componentData.price)
            productsComponents += newComponent + "\n";
          }
          const inputUI = "<div id=inputDataCart > <p class='textUserCart'>Tarjeta de crédito</p> \
          <input type='number' id='cardClient' class='userDataInput' placeholder='Introduce tu tarjeta de credito para completar el pago'/> \
          <p class='textUserCart' >Dirección de envio</p> <input id='dirClient' type='text' class='userDataInput' placeholder='Introduce tu direccion para completar el pago'/>\
          <p id='feedbackText'></p> </div>"
          productsComponents += " <p id='totalPriceFinal'> Total: " + String(totalPrice) + " € </p>" + inputUI + "</div> " ;
          data = data.replace("<!--REPLACE_PRODUCTS-->",productsComponents);
          data = data.replace("REPLACE_TEXT","Realizar pedido");
          data = data.replace("REPLACE_URL","sendPurchase()");
          callback(null,data)
        }else{console.log("error de lectura")}
      })
      

    }else{
      data = data.replace("<!--REPLACE_PRODUCTS-->", "<p id='cartTittle' style='margin: auto; margin-top: 2%'> No tienes ningun producto en la cesta :( </p>");
      data = data.replace("extraStyle=''","style='margin: auto; margin-top: 2%'");
      data = data.replace("REPLACE_TEXT","Volver a la pagina de inicio");
      data = data.replace("REPLACE_URL","location.href='/';");
      callback(null,data)
    }
    
  }else{
    data = data.replace("<!--REPLACE_PRODUCTS-->"," <p id='cartTittle'  style='margin: auto; margin-top: 2%'> Inicia sesión para poder realizar la compra </p>");
    data = data.replace("extraStyle=''","style='margin: auto; margin-top: 2%'");
    data = data.replace("REPLACE_URL","location.href='login.html';");
    data = data.replace("REPLACE_TEXT","Inicia sesion");
    callback(null,data)
  }
  
}
function manageProductData(data, id ,cookies){

  data = data.toString()
  if(cookies['userName'] != null){
    data = data.replace("Log in",cookies['userName']);
    data = data.replace("login.html", "profile.html");
  }

  for (let i = 0; i < OBJETOS.length; i++){
      if (id ==  OBJETOS[i].id){
        data = data.replace("placeholderTittle",  OBJETOS[i].name);
        data = data.replace("placeholderImage", imagePath + String( OBJETOS[i].img[0]));
        data = data.replace("placeholderIntro",  OBJETOS[i].descripcion);

        data = data.replace("<!--placeholderWholePrice-->",  OBJETOS[i].price);
        data = data.replace("<!--placeholderMonthPrice-->",  (OBJETOS[i].price/12).toFixed(2));

        let reservedStock = 0

        if(cookies['cart'] != null){
          cartCookie = cookies['cart'].split(":")
          cartCookie = convert2Dic(cartCookie,"_")
          for (let key in cartCookie) {
            if (key ==  OBJETOS[i].id){
                reservedStock = Number(cartCookie[key])
            }
          }
        }
        let stock = OBJETOS[i].stock - reservedStock

        data = data.replace("replaceStock",  stock);
        if (stock > 0 ){
          data = data.replace("replaceClass", "'buyButton' onclick='buyButton(REPLACE_ID);'");
          data = data.replace("REPLACE_ID", id);
          data = data.replace("replaceButtonText", "Añadir al carrito");
        }else{
          data = data.replace("replaceClass", "noStock");
          data = data.replace("replaceButtonText", "Sin stock");
        }
        
        for (let j = 0; j <  OBJETOS[i].caracteristics.length; j++){
          data = data.replace("placeholderESP",  OBJETOS[i].caracteristics[j]);
        }
        break;
      }
  }
  return data
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


  // console.log('dirccion: ',direccion);
  // console.log('req: ',recurso);
  // console.log("URL: ",req.url)

if(req.method=='GET'){
  if(recurso=='/ls'){
    //console.log('ENTRO EN LS')
    lsDir=DirectoryLs();
    ok200(res,lsDir,tipo);
  }
  else if(recurso =='/product'){
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
     let result = searchProducto(nameProduct)
     console.log('resultados: ',result);
     content = JSON.stringify(result);
      ok200(res,content,tipo);
    }
  }
  else if (recurso  == '/monitores.html'){
    
    ojo= searchGET(req);
    
    fs.readFile('monitores.html', (err, data) => { 
      if(err){
        console.log("Error!!")
        console.log(err.message);
        
        res.write(pag_404);
        res.end();

    }else{          
      cookies = getCookies(req)
      console.log('dir: ',ojo);
     // data = manageProductData(data,[result,product_id],cookies)
      ok200(res,data,tipo)
  }
  });
}
  else if (recurso == '/ProcesoPedido.html'){
    console.log('Page cart')
    fs.readFile("ProcesoPedido.html", (err, data) => { if(!err){
      cookies = getCookies(req)
       manageCart(data,cookies ,function(error, data) {
        if (error) {
          console.log("Error!!")
          console.log(err.message);
          
          res.write(pag_404);
          res.end();
        } else {
          ok200(res,data,tipo) 
        }
      });
      }else{
        console.log("Error!!")
        console.log(err.message);
        
        res.write(pag_404);
        res.end();
      }
    });
  }else if (recurso == '/addCart'){
    let nameDir = req.url.split('?')[1];
    let product = nameDir.split('=')[0]
    cookies = getCookies(req)
    if (checkIDExists(product)){
      if(cookies['cart']  == null || cookies['cart']  == "" ){
        res.setHeader('Set-Cookie', "cart="+product+"_1" );
        ok200(res,"200 OK",tipo)
      }else{
        cart = cookies['cart'].split(":")
        cart = convert2Dic(cart,"_")
        if(cart[product] != null){
          cart[product] = String(Number(cart[product]) + 1) 
        }else{
          cart[product] = "1";
        }
        let cartCokie = ""
        Object.keys(cart).forEach(function(id) {
          cartCokie += id + "_" + cart[id] +":"
        });
        cartCokie = cartCokie.substring(0, cartCokie.length - 1);
        res.setHeader('Set-Cookie', ["cart="+cartCokie] );
        ok200(res,"200 OK",tipo)
      }

    }else{
      //Si pasa por aqui, es debido a que hay un error y el id que se busca NO existe
        //Lanza error
        console.log("Error!!")
        //console.log(err.message);
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
    
      }else{
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

