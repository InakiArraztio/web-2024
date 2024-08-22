"use strict"

/*****************MENU DESPLEGABLE*****************/ 

/*selecciono el elemento HTML con ID menu-mobile y le agrego un listener que cuando se hace click en el
ejecuta la funcion toggle*/
document.getElementById("menu-mobile").addEventListener("click", toggleBtn);

/*Selecciona el primer elemento con la clase botonera y alterna "show" */
function toggleBtn() {
    console.log("estoy adentro de la funcion");
    document.querySelector(".botonera").classList.toggle("show");
}



/*****************CAPTCHA PARA contacto.html*****************/


// Función para generar un número aleatorio 
function generarCaptcha() {
    let captcha = '';//inicializo como cadena vacia
    for (let i = 0; i < 4; i++) {
    //ejecuto el bucle 4 veces generando un nro del 0 al 9 añadiendo el resultado a la cadena CAPTCHA
        captcha += Math.floor(Math.random() * 10);
    }
    document.getElementById('valorCaptcha').innerText = captcha;
}

// Función para verificar el captcha ingresado
function verificarCaptcha(e) {
    e.preventDefault();
    //uso innerText para obtner el contenido del texto del elemento con id(valorCaptcha) y lo comparo con el valor ingresado
    const valorCaptcha = document.getElementById('valorCaptcha').innerText;
    const inputCaptcha = document.getElementById('captchaTexto').value;
    if (valorCaptcha === inputCaptcha) {
        alert('Captcha verificado correctamente');
    } else {
        alert('Captcha incorrecto, intente de nuevo');
    }
}


/*****************VERIFICAR SI LOS CAMPOS DEL FORM ESTAN COMPLETOS*****************/
let formulario = document.getElementById("formularioCaptcha");
formulario.addEventListener('submit', verificarForm);

function verificarForm(e){
    e.preventDefault();
    //para agarrar todos los datos del form
    let form = new FormData(formulario);
    //objeto FormData
    let nombre = form.get('nombre');
    let appelido = form.get('appelido');
    let mail = form.get('mail');
    let telefono = form.get('telefono');
    console.log(nombre,appelido,mail,telefono);
    console.log("estoy en la funcion");
    
}


//cuando la pag se termina de cargarse se ejectua la funcion generarCaptcha()
window.onload = function() {
    generarCaptcha();
    
    // Agregar evento de clic al botón de verificar captcha
    document.getElementById('captchaButton').addEventListener('click', verificarCaptcha);
};