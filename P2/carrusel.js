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

function addToCart(cartValue){

    let url = "/addCart?cart="+ cartValue;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function(){
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('Peticion exitosa')
        }
        else{
            console.log('Error en completar la peticion')
        }
    };
    xhr.onerror = function(){
        console.log('Error en realizar la peticion')
    };
    xhr.send(); // Envío de la petición
}