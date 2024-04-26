//step 1: get DOM
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 1000;

nextDom.onclick = function(){
    showSlider('next');    
}
prevDom.onclick = function(){
    showSlider('prev');    
}
let runTimeOut;

function showSlider(type){
    let  SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');
    
    if(type === 'next'){
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
    }else{
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
    }
    
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    }, timeRunning);

}

////////////////////////////////////////////////////////////////////////

productButton =  document.getElementById("productButton");
productButton.onclick = () => {


    //-- Crear objeto para hacer peticiones AJAX
    const m = new XMLHttpRequest();

    //-- Función de callback que se invoca cuando
    //-- hay cambios de estado en la petición
    m.onreadystatechange = () => {

        //-- Petición enviada y recibida. Todo OK!
        if (m.readyState==4) {

            console.log("Peticion completada");
            console.log("status: " + m.status);

            //-- Solo la procesamos si la respuesta es correcta
            if (m.status==200) {

                //-- La respuesta es un objeto JSON
                let productos = JSON.parse(m.responseText)

                //-- Meter el resultado en un párrafo html
                display2.innerHTML += "<p>";

                //--Recorrer los productos del objeto JSON
                for (let i=0; i < productos.length; i++) {

                    //-- Añadir cada producto al párrafo de visualización
                    display2.innerHTML += productos[i];

                    //-- Separamos los productos por ',''
                    if (i < productos.length-1) {
                    display2.innerHTML += ', ';
                    }
                }

                //-- Cerrar el párrafo
                display2.innerHTML += "</p>"

            } else {
                //-- Hay un error en la petición
                //-- Lo notificamos en la consola y en la propia web
                console.log("Error en la petición: " + m.status + " " + m.statusText);
                display2.innerHTML += '<p>ERROR</p>'
            }
        }
    }

    //-- Configurar la petición
    m.open("GET","/addCart?cart="+ search, true);

    //-- Enviar la petición!
    m.send();
}