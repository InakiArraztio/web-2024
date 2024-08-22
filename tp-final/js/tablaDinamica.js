"use strict";

//inicializo las variables
let tabla = document.querySelector('#tabla');
let usuarios = [];
let editado = false;
//inicializo en -1 para saber que no hay ningun usuario en modo edicion
let editIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();
    document.querySelector('#btnAgregar').addEventListener('click', agregarOEditarUsuario);
    document.querySelector('#btnLimpiar').addEventListener('click', limpiarTabla);
    document.querySelector('#filtroBusqueda').addEventListener('input', filtrarUsuarios);

    //Event listener para botones de editar y borrar
    tabla.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-editar')) {
/*El método closest lo uso para encontrar el "ancestro" más cercano del elemento actual
que coincide con un selector CSS. Subo por la cadena DOM hasta encontrar un elemento que coincida 
con el selector proporcionado. */
            editarUsuario(e.target.closest('tr').getAttribute('data-id'));
        }//getAttribute se usa para obtener el valor de un atributo específico de un elemento.
        if (e.target.classList.contains('btn-borrar')) {
            borrarUsuario(e.target.closest('tr').getAttribute('data-id'));
        }
    });
});

/*hago un GET para obtener los datos de la mockapi con data = await response */
async function cargarDatosIniciales() {
    try {
        let response = await fetch('https://66744bc875872d0e0a95eb94.mockapi.io/wines/usuarios');
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        let data = await response.json();//convierto la rta a un obj JSON para luego almacenarlo en usuarios
        usuarios = data;
        mostrar();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function agregarOEditarUsuario(e) {
    e.preventDefault();
    //obtengo los valores del nombre y del email
    let nombreCompleto = document.querySelector('#nombreCompleto').value;
    let email = document.querySelector('#email').value;

    //verifico si alguno de los campos está vacío
    if (!nombreCompleto || !email) {
        alert("Complete todos los campos");
        return; //salgo de la función si los campos no están completos
    }
    //creo el objeto usario con los valores obtenidos
    let usuario = {
        nombreCompleto: nombreCompleto,
        email: email
    };
    if (!editado) {
        try {//si no se esta editando el usuario hago un post con los datos que ya tengo del usuario
            let response = await fetch('https://66744bc875872d0e0a95eb94.mockapi.io/wines/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });
            if (!response.ok) {
                throw new Error('Error al agregar el usuario');
            }
            let data = await response.json();
            usuarios.push(data);
            mostrar();
        } catch (error) {
            console.error('Error:', error);
        }
    } else {//el else se va ejecutar si el usuario se esta editando
        try {
            /*obtengo el "id" del objeto usuario en la pos editIndex del array usuarios y lo "meto" en la url,
            uso el id del usuario en editIndex para identificar el recurso a actualizar */
            let response = await fetch(`https://66744bc875872d0e0a95eb94.mockapi.io/wines/usuarios/${usuarios[editIndex].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });
            if (!response.ok) {
                throw new Error('Error al editar el usuario');
            }
            //convierto la respuesta en un objeto JSON
            let data = await response.json();
            usuarios[editIndex] = data;//actualizo un user en especifico en el array con los datos recibidos
            //vuelvo a poner las variables de estado de edición
            editado = false;
            editIndex = -1;
            mostrar();
        } catch (error) {
            console.error('Error:', error);
        }
    }
    limpiarInputs();
}

function mostrar() {
    let filtro = document.querySelector('#filtroBusqueda').value.toLowerCase();
    tabla.innerHTML = "";
    for (let i = 0; i < usuarios.length; i++) {
        let usuario = usuarios[i];
        if (usuario && usuario.nombreCompleto && usuario.email) {
            let nombreCompleto = usuario.nombreCompleto.toLowerCase();
            let email = usuario.email.toLowerCase();
            /*uso el .includes para saber si lo ingresado coincide con algun usuario de la tabla existente,
            si esxiste se va a mostrar en la tabla*/
            if (nombreCompleto.includes(filtro) || email.includes(filtro)) {
                tabla.innerHTML += `
                    <tr data-id="${usuario.id}">
                        <td>${usuario.nombreCompleto}</td>
                        <td>${usuario.email}</td>
                        <td>
                            <button type="button" class="btn-editar">Editar</button>
                            <button type="button" class="btn-borrar">Borrar</button>
                        </td>
                    </tr>`;
            }
        }
    }
}

function limpiarTabla() {
    usuarios = [];
    mostrar();
}

function limpiarInputs() {
    document.querySelector('#nombreCompleto').value = '';
    document.querySelector('#email').value = '';
}

function filtrarUsuarios() {
    mostrar();
}

async function editarUsuario(id) {
//si se clickea en editar se llama a esta funcion que obtiene el atributo data-id
    try {
        // busco el índice del usuario a editar, si el usuario es encontrado
        editIndex = usuarios.findIndex(usuario => usuario.id === id);
        if (editIndex === -1) {
            throw new Error('Usuario no encontrado para editar.');
        }
        // lleno los campos del formulario con los datos del usuario a editar
        const usuario = usuarios[editIndex];
        document.querySelector('#nombreCompleto').value = usuario.nombreCompleto;
        document.querySelector('#email').value = usuario.email;

        // Cambiar el estado para indicar que se está editando
        editado = true;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function borrarUsuario(id) {
    //si se clickea en borrar se llama a esta funcion, que funciona parecido a la otra
    try {//envio solicitud al servidor
        let response = await fetch(`https://66744bc875872d0e0a95eb94.mockapi.io/wines/usuarios/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al borrar el usuario');
        }
        /*Si la solicitud es exitosa, se elimina el usuario del array usuarios usando filter 
        (dejo solo los usuarios cuyo id no coincide con el id proporcionado). */
        // Filtro el usuario eliminado del array usuarios
        usuarios = usuarios.filter(usuario => usuario.id !== id);
        mostrar();
    } catch (error) {
        console.error('Error:', error);
    }
}




