//-- Crear una variable con la estructura definida
//-- en un fichero JSON

const fs = require('fs');

//-- Nombre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Leer el fichero JSON
const tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Listado con los usuarios de la tienda
tienda.objetos.forEach((element,index)=>{
    console.log("objeto " + (index + 1) + ": " + element["name"]);
    console.log("cosas: " + element["caracteristics"]);
    console.log(" ")
});
