
//-- FUNCION DE LOGIN PARA CADA USUARIO
function login() {
    // CREAMOS PETICION AJAX
    USERNAME = document.getElementById("userName").value;
    var m = new XMLHttpRequest();
    m.open("POST", "/login", true);
    m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    m.onreadystatechange = function() {
        // SI LA RESPUESTA ESTA TERMINADA = 4 
        if (m.status == 200) {

            var scriptElement = document.createElement("script");
            scriptElement.setAttribute("type", "text/javascript");
            scriptElement.setAttribute("src", "cliente.js");
            document.head.appendChild(scriptElement);

            document.body.innerHTML = m.responseText;
            document.body.innerHTML = document.body.innerHTML.replace("<!--REPLACENAME-->", USERNAME)

            // AQUI SE PUEDE AGREGAR COSAS PARA EL CSS
        } else if (m.status == 404) {
            console.log("Error")
            document.getElementById("TextoRespuesta").innerHTML =  ""
            document.getElementById("TextoRespuesta").innerHTML =  "<p id='TextoRespuesta' >" + m.responseText + "</p>"
        }
    };
    m.send(`userName=${USERNAME}`);
}