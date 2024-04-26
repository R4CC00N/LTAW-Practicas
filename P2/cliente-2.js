console.log("Ejecutando Javascript...");

//-- Elementos HTML para mostrar informacion
const display1 = document.getElementById("display1");
const display2 = document.getElementById("display2");

//-- Botones
const boton_test = document.getElementById("boton_test");
const boton_ajax = document.getElementById("boton_ajax");

//-- Retrollamada del boton de Test-JS
boton_test.onclick = ()=> {
    display1.innerHTML+="<p>Hola desde JS!</p>";
}

//-- Retrollamda del boton de Ver productos
boton_ajax.onclick = () => {



}

