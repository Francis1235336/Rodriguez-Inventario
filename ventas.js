var productos = JSON.parse(localStorage.getItem("productos")) || [];
var clientes = JSON.parse(localStorage.getItem("clientes")) || [];
var ventas = JSON.parse(localStorage.getItem("ventas")) || [];
var carrito = [];

function cargarProductos() {
    var cadena = '';
    for (let i = 0; i < productos.length; i++) {
        cadena += `<tr>
                       <td>${productos[i].producto}</td>
                       <td>${productos[i].precio}</td>
                       <td>${productos[i].stock}</td>
                       <td>
                           <div class="acciones">
                               <button onclick="agregarCarrito(${i})" class="btn btn-show m5">
                                   <i class="fa fa-plus"></i>
                               </button>
                           </div>
                       </td>
                   </tr>`;
    }

    if (productos.length == 0) {
        cadena += `<tr>
                       <td colspan="5">
                           <div class="no-data">
                               <i class="fa fa-info-circle"></i>
                               <span>No hay productos registrados</span>
                           </div>
                       </td>
                   </tr>`;
    }

    document.getElementById("listaProductos").innerHTML = cadena;
}

function buscarProducto() {
    var buscador = document.getElementById('buscar').value;
    var nuevoArray = [];

    if (buscador.trim() == '' || buscador.trim() == null) {
        nuevoArray = JSON.parse(localStorage.getItem('productos')) || [];
    } else {
        for (let i = 0; i < productos.length; i++) {
            var texto = productos[i].producto.toLowerCase();
            if (texto.search(buscador.toLowerCase()) >= 0) {
                nuevoArray.push(productos[i]);
            }
        }
    }

    productos = nuevoArray;
    cargarDatos();
}
function cargarClientes(){
    var cadena = '';
    for(let i=0; i<clientes.length; i++){
        cadena += `<option value="${clientes[i].nombre}">${clientes[i].nombre}</option>`;
    }
    document.getElementById('cliente').innerHTML = cadena;
}
function agregarCarrito(parametro) {
    var elemento = {
        producto: productos[parametro].producto,
        precio: productos[parametro].precio,
        stock: productos[parametro].stock,
        cantidad: 1,
        subtotal: function () {
            return this.cantidad * this.precio;
        }
    };
    carrito.push(elemento);
    cargarCarrito();
}

function cargarCarrito() {
    var cadena = '';
    for (let i = 0; i < carrito.length; i++) {
        cadena += `<tr>
                       <td>${carrito[i].producto}</td>
                       <td>${carrito[i].precio}</td>
                       <td>
                           <input type="number" onchange="cambiarCantidad(${i}, this)" value="${carrito[i].cantidad}" class="form" placeholder="Cantidad">
                       </td>
                       <td>${carrito[i].subtotal()}</td>
                       <td>
                           <button onclick="quitarCarrito(${i})" class="btn btn-show m5">
                               <i class="fa fa-times"></i>
                           </button>
                       </td>
                   </tr>`;
    }
    document.getElementById('listaCarrito').innerHTML = cadena;
    calcularTotal();
}

function calcularTotal() {
    var total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].subtotal();
    }
    document.getElementById('total').innerText = total;
    document.getElementById('totalNeto').innerText = total - document.getElementById('descuento').value;
}

function cambiarCantidad(posicion, elemento) {
    if (elemento.value <= 0) {
        Swal.fire({
            title: 'Error',
            text: 'La cantidad no puede ser menor o igual a cero!!!',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    carrito[posicion].cantidad = (elemento.value != null || elemento.value != undefined || elemento.value != '') ? elemento.value : 1;
    cargarCarrito();
}

function registrarVenta() {
    var cliente = document.getElementById('cliente').value;
    var fecha = document.getElementById('fecha').value;
    var comprobante = document.getElementById('numComprobante').value;
    var descuento = document.getElementById('descuento').value;

    var total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].subtotal();
       
    }

    // Verifica si los campos están vacíos
    if (cliente == '' || fecha == '' || comprobante == '' || total == 0 ) {
        Swal.fire({
            title: 'Faltan Datos',
            text: 'Por favor, rellene todos los campos!!!',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    var venta = {
        cliente: cliente,
        fecha: fecha,
        comprobante: comprobante,
        total: total,
        descuento:(descuento =="") ? 0 : descuento,
        usuario: 'Johan Orellana',
        detalle: carrito
    }
    ventas.push(venta);
    localStorage.setItem('ventas', JSON.stringify(ventas));

    var losProductos = JSON.parse(localStorage.getItem("productos")) || [];
    // actualizamos el stock de los productos
    for(let i=0; i<carrito.length; i++){
        for(let j=0; j<losProductos.length; j++){
            if(losProductos[j].producto == carrito[i].producto){
                losProductos[j].stock = (parseInt(losProductos[j].stock) - parseInt(carrito[i].cantidad));
            }
        }
    }

    localStorage.setItem('productos', JSON.stringify(losProductos));

    // Redirigir a la página de ventas
    window.location.href = 'ventas.html';
}

function cargarDatos() {
    var cadena = '';
    for (let i = 0; i < ventas.length; i++) {
        cadena += `<tr>
                       <td>${i + 1}</td>
                       <td>${ventas[i].cliente}</td>
                       <td>${ventas[i].fecha}</td>
                       <td>${ventas[i].comprobante}</td>
                       <td>${ventas[i].total}</td>
                       <td>${ventas[i].descuento}</td>
                       <td>${parseFloat(ventas[i].total) - parseFloat(ventas[i].descuento)}</td>
                       <td>${ventas[i].usuario}</td>
                       <td>
                           <div class="acciones">
                               <button onclick="verVenta(${i})" class="btn btn-show m5">
                                   <i class="fa fa-eye"></i>
                               </button>
                               <button onclick="eliminarVenta(${i})" class="btn btn-delete m5">
                                   <i class="fa fa-times"></i>
                               </button>
                           </div>
                       </td>
                   </tr>`;
    }
    if (ventas.length == 0) {
        cadena += `<tr>
                       <td colspan="9">
                           <div class="no-data">
                               <i class="fa fa-info-circle"></i>
                               <span>No hay ventas registradas</span>
                           </div>
                       </td>
                   </tr>`;
    }
    document.getElementById('listaVentas').innerHTML = cadena;

    cargarTotales();
}

function buscarVenta() {
    var buscador = document.getElementById('buscar').value;
    var nuevoArray = [];

    if (buscador.trim() == '' || buscador.trim() == null) {
        nuevoArray = JSON.parse(localStorage.getItem('ventas')) || [];
    } else {
        for (let i = 0; i < ventas.length; i++) {
            var texto = ventas[i].cliente.toLowerCase();
            if (texto.search(buscador.toLowerCase()) >= 0) {
                nuevoArray.push(ventas[i]);
            }
        }
    }

    ventas = nuevoArray;
    cargarDatos();
}

function eliminarVenta(posicion) {
    var laVenta = ventas[posicion];

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'La venta se eliminará!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, quiero eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            ventas.splice(posicion, 1);
            localStorage.setItem('ventas', JSON.stringify(ventas));
            cargarDatos();
            Swal.fire({
                title: 'Venta Eliminada',
                text: 'La venta se eliminó exitosamente!',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function verVenta(posicion) {
    localStorage.setItem('posicionVenta', posicion);
    window.location.href = 'ventasVer.html';
}

function mostrarVenta() {
    var posicion = JSON.parse(localStorage.getItem('posicionVenta')) || 0;
    var laVenta = ventas[posicion];

    if (laVenta == undefined || laVenta == null) {
        Swal.fire({
            title: 'No existe la venta',
            text: 'La venta no existe o ha sido eliminada!!!',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            window.location.href = 'ventas.html';
        });
    }
    document.getElementById('proveedor').innerText = laVenta.cliente;
    document.getElementById('fecha').innerText = laVenta.fecha;
    document.getElementById('comprobante').innerText = laVenta.comprobante;
    document.getElementById('total').innerText = laVenta.total;
    document.getElementById('usuario').innerText = laVenta.usuario;
    document.getElementById('ltotal').innerText = laVenta.total;

    var cadena = '';
    for (let i = 0; i < laVenta.detalle.length; i++) {
        var subtotal = parseFloat(laVenta.detalle[i].precio) * parseFloat(laVenta.detalle[i].cantidad);
        cadena += `<tr>
                       <td>${laVenta.detalle[i].producto}</td>
                       <td>${laVenta.detalle[i].precio}</td>
                       <td>${laVenta.detalle[i].cantidad}</td>
                       <td>${subtotal}</td>
                   </tr>`;
    }
    document.getElementById('listaVer').innerHTML = cadena;
}

function cargarTotales() {
    var cantidadVentas = 0;
    var ventasMes = 0;
    var totalVentas = 0;

    for (let i = 0; i < ventas.length; i++) {
        var laFecha = ventas[i].fecha;
        var laFecha = new Date(laFecha);
        var fechaActual = new Date();

        if (laFecha.getFullYear() == fechaActual.getFullYear()) {
            totalVentas += parseFloat(ventas[i].total);

            if (laFecha.getMonth() == fechaActual.getMonth()) {
                ventasMes += parseFloat(ventas[i].total);
            }
            cantidadVentas++;
        }
    }

    document.getElementById('cantidadVentas').innerText = cantidadVentas;
    document.getElementById('ventasMes').innerText = ventasMes;
    document.getElementById('totalVentas').innerText = totalVentas;
}