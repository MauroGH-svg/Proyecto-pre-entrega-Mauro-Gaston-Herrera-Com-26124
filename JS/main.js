
// URL de la API --------------------------------------------------
const URL = "https://api.jsonbin.io/v3/b/6a42024cda38895dfe0e27cc/latest";


// Contenedor donde aparecerán los servicios
// ---------------------------------------------------
const listaServicios = document.getElementById("lista-servicios");


// ----- Aqui obtenemos los servicios en el carrito y tambien lo vaciamos
const listaCarrito = document.getElementById("lista-carrito");
const total = document.getElementById("total");

const btnVaciar = document.getElementById("vaciar-carrito");
const btnPagar = document.getElementById("btn-pagar");



// Array donde se guardarán los servicios elegidos
let carrito = [];


// Busca si existe algo llamado "carrito", Si existe, devuelve un texto y lo transforma nuevamente en un array
const carritoGuardado = localStorage.getItem("carrito");

if (carritoGuardado) {

    carrito = JSON.parse(carritoGuardado);

    mostrarCarrito();

}





function mostrarCarrito() {

    // Limpiar el carrito antes de volver a dibujarlo
    listaCarrito.innerHTML = "";

    let totalCompra = 0;

    carrito.forEach(servicio => {

        listaCarrito.innerHTML += `
            <li>
                ${servicio.nombre} - $${servicio.precio}
            </li>
        `;

        totalCompra += servicio.precio;

    });

        total.textContent = totalCompra;

}




// Consumimos la API
// ---------------------------------------------------

fetch(URL)
    .then(response => response.json())

    .then(data => {

        // Guardamos el array de servicios
        const servicios = data.record;

        // Recorremos cada servicio
        servicios.forEach(servicio => {

            listaServicios.innerHTML += `
            
                <div class="card-servicio">

                    <h3>${servicio.nombre}</h3>

                    <p>$${servicio.precio}</p>

                   <button
                    class="btn-agregar"
                    data-id="${servicio.id}">
                    <i class="fa-solid fa-cart-plus"></i> Agregar
                </button>

            `;

        });

    //--------------------------
    // -------Eventos de los botones -----------------------------------------------
    
    const botonesAgregar = document.querySelectorAll(".btn-agregar");

    botonesAgregar.forEach((boton, index) => {

        boton.addEventListener("click", () => {

        carrito.push(servicios[index]); //-----Con esto, (push) guardamos los productos en el array

        localStorage.setItem("carrito", JSON.stringify(carrito)); // --Utilizamos localStorage para que lo guarde en el navegador

        mostrarCarrito();

          //---Aqui haremos uso de sweetAlert
          Swal.fire({
             icon: "success",
             title: "¡Servicio agregado!",
             text: `${servicios[index].nombre} fue agregado al carrito.`,
             timer: 1500,
             showConfirmButton: false
          });
        //------------------------------

        console.log(carrito);

        });

    });

})

    .catch(error => console.log(error));


//----------------------------boton vaciar--------------------------
btnVaciar.addEventListener("click", () => {


//---usamos sweetalert para confirmarnos que vaciamos el carrito
    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Se eliminarán todos los servicios agregados.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"

    }).then((result) => {

        if (result.isConfirmed) {

            carrito = [];

            localStorage.setItem("carrito", JSON.stringify(carrito));

            mostrarCarrito();

            Swal.fire({
                icon: "success",
                title: "Carrito vaciado",
                timer: 1500,
                showConfirmButton: false
            });

        }

    });

});



//-------------------Boton pagar------------------------------
btnPagar.addEventListener("click", () => {

    if (carrito.length === 0) {

        Swal.fire({
            icon: "error",
            title: "Carrito vacío",
            text: "Agregue al menos un servicio antes de pagar."
        });

        return;
    }

    Swal.fire({
        icon: "success",
        title: "¡Compra realizada!",
        html: `
            <p>Gracias por contratar nuestros servicios.</p>
            <h3>Total a abonar: $${total.textContent}</h3>
        `,
        confirmButtonText: "Aceptar"
    }).then(() => {

    Swal.fire({
        icon: "success",
        title: "¡Compra realizada correctamente!",
        html: `
            <p>Su solicitud fue enviada con éxito.</p>
            <p>En las próximas horas nos pondremos en contacto para coordinar su evento.</p>
        `,
        confirmButtonText: "Excelente"
    }).then(() => {

        carrito = [];

        localStorage.setItem("carrito", JSON.stringify(carrito));

        mostrarCarrito();

            });

        });
        
     });


