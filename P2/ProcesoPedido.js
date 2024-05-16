

function loadDOMdata(){
    let inputs = document.getElementsByClassName('cartProductInput');
    let outputs = document.getElementsByClassName('cartProductPrice3');

    for (let i = 0; i < inputs.length; i++) {
        if(inputs[i] != undefined){
            inputs[i].addEventListener('change', () => {
                outputs[i].textContent = String( Number(inputs[i].getAttribute('unit'))  * Number(inputs[i].value))
                updateTotal()
              });
        }
    }
}


document.addEventListener("DOMContentLoaded", function(event) { 
    loadDOMdata()
})


function sendPurchase(){
    alert('COMPRA REALIZADA');
    window.location.href="main.html";
}
