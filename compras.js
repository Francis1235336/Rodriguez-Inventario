var productos = JSON.parse(localStorage.getItem("productos")) || [];
var proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
var compras = JSON.parse(localStorage.getItem("compras")) || [];
var carrito = [];

function cargarProductos(){
    var cadena = '';
    for(let i=0; i<productos.length; i++){
        cadena += `<tr>
                                    
                                    <td>${productos[i].producto}</td>
                                    <td>${productos[i].costo}</td>
                                    <td>${productos[i].stock}</td>
                                    <td>
                                        <div class="acciones">
                                        
                                            <button onclick="agregarCarrito(${i})" class="btn btn-show m5">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                            
                                        </div>
                                    </td>
                                </tr>
        `;
    }

    if(productos.length == 0){
        cadena += `<tr>
                        <td colspan="4">
                            <div class="no-data">
                                <i class="fa fa-info-circle"></i>
                                <span>No hay productos registrados</span>
                            </div>
                        </td>
                    </tr>
        `;
    }

    document.getElementById("listaProductos").innerHTML = cadena;
}

function buscarProducto(){
    var buscador = document.getElementById('buscar').value;

    var nuevoArray = [];
    
    if(buscador.trim() == '' || buscador.trim() == null){
        nuevoArray = JSON.parse(localStorage.getItem('productos')) || [];
    } else {
        for(let i = 0; i < productos.length; i++){
            var texto = productos[i].producto.toLowerCase();
            if(texto.search(buscador.toLowerCase()) >= 0){
                nuevoArray.push(productos[i]);
            }
        }
    }

    productos = nuevoArray;
    cargarDatos();
}

function cargarProveedores(){
    var cadena = '';
    for(let i=0; i<proveedores.length; i++){
        cadena += `<option value="${proveedores[i].empresa}">${proveedores[i].empresa}</option>`;
    }
    document.getElementById('proveedor').innerHTML = cadena;
}

function agregarCarrito(parametro){
    
    var elemento ={
        producto: productos[parametro].producto,
        costo: productos[parametro].costo,
        stock: productos[parametro].stock,
        cantidad: 1,
        
        subtotal: function(){
            return this.cantidad * this.costo;
        }
        
    };
    carrito.push(elemento);
    cargarCarrito();
    
}

function cargarCarrito(){
    var cadena = '';
    for(let i=0; i<carrito.length; i++){
        cadena += `<tr>
                        <td>${carrito[i].producto}</td>
                        <td>${carrito[i].costo}</td>
                        <td>
                            <input type="number" onchange="cambiarCantidad(${i}, this)" value="${carrito[i].cantidad}" class="form" placeholder="Cantidad">
                        </td>
                        <td>${carrito[i].subtotal()}</td>
                        <td>
                                <button onclick="quitarCarrito(${i})" class="btn btn-show m5">
                                    <i class="fa fa-times"></i>
                                </button>
                        </td>
                    </tr>
        `;
    }
    document.getElementById('listaCarrito').innerHTML = cadena;
    calcularTotal();
}

function quitarCarrito(posicion){
    carrito.splice(posicion, 1);
    cargarCarrito();
}

function calcularTotal(){
    var total = 0;
    for(let i=0; i<carrito.length; i++){
        total += carrito[i].subtotal();
    }
    document.getElementById('total').innerText = total;
}

function cambiarCantidad(posicion, elemento){
    if(elemento.value <= 0){
        Swal.fire({
            title: 'Error',
            text: 'La cantindad no puede ser menor o igual a cero!!!',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        
    }
    carrito[posicion].cantidad = (elemento.value != null || elemento.value != undefined || elemento.value != '') ? elemento.value : 1;
    cargarCarrito();
}

function registrarCompra(){
    var proveedor = document.getElementById('proveedor').value;
    var fecha = document.getElementById('fecha').value;
    var comprobante = document.getElementById('numComprobante').value;

    var total = 0;
    for(let i=0; i<carrito.length; i++){
        total += carrito[i].subtotal();
    }

    // Verifica si los campos están vacíos
    if(proveedor == '' || fecha == '' || comprobante == '' || total == 0){
        Swal.fire({
            title: 'Faltan Datos',
            text: 'Por favor, rellene todos los campos!!!',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    
    var compra ={
        proveedor:proveedor,
        fecha: fecha,
        comprobante: comprobante,
        total:total,
        usuario: 'Johan Orellana',
        detalle: carrito
    }
    compras.push(compra);
    localStorage.setItem('compras', JSON.stringify(compras));

    var losProductos = JSON.parse(localStorage.getItem("productos")) || [];
    // actualizamos el stock de los productos
    for(let i=0; i<carrito.length; i++){
        for(let j=0; j<losProductos.length; j++){
            if(losProductos[j].producto == carrito[i].producto){
                losProductos[j].stock = (parseInt(losProductos[j].stock) + parseInt(carrito[i].cantidad));
            }
        }
    }

    localStorage.setItem('productos', JSON.stringify(losProductos));

    window.location.href = 'compras.html';
}

function cargarDatos(){
     var cadena = '';
     for(let i=0; i<compras.length; i++){
         cadena += `<tr>
                        <td>${i+1}</td>
                        <td>${compras[i].proveedor}</td>
                        <td>${compras[i].fecha}</td>
                        <td>${compras[i].comprobante}</td>
                        <td>${compras[i].total}</td>
                        <td>${compras[i].usuario}</td>
                        <td>
                            <div class="acciones">
                                <button onclick="verCompra(${i})" class="btn btn-show m5">
                                    <i class="fa fa-eye"></i>
                                </button>
                                <button onclick="eliminarCompra(${i})" class="btn btn-delete m5">
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
        `;
    }
    if(compras.length == 0){
        cadena += `<tr>
                        <td colspan="7">
                            <div class="no-data">
                                <i class="fa fa-info-circle"></i>
                                <span>No hay compras registradas</span>
                            </div>
                        </td>
                    </tr>
                    `;  
    }
    document.getElementById('listaCompras').innerHTML = cadena;

    cargarTotales();
}

function buscarCompra(){
    var buscador = document.getElementById('buscar').value;

    var nuevoArray = [];
    
    if(buscador.trim() == '' || buscador.trim() == null){
        nuevoArray = JSON.parse(localStorage.getItem('compras')) || [];
    } else {
        for(let i = 0; i < compras.length; i++){
            var texto = compras[i].proveedor.toLowerCase();
            if(texto.search(buscador.toLowerCase()) >= 0){
                nuevoArray.push(compras[i]);
            }
        }
    }

    compras = nuevoArray;
    cargarDatos();
}

function eliminarCompra(posicion){
    var laCompra = compras[posicion];

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'La compra se eliminara, y se descontaran del stock!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, quiero eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            var losProductos = JSON.parse(localStorage.getItem("productos")) || [];
            for(let i=0; i<laCompra.detalle.length; i++){
                for(let j=0; j<losProductos.length; j++){
                    if(losProductos[j].producto == laCompra.detalle[i].producto){
                        if(parseInt(losProductos[j].stock) >= parseInt(laCompra.detalle[i].cantidad)){
                            losProductos[j].stock = (parseInt(losProductos[j].stock) - parseInt(laCompra.detalle[i].cantidad));
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'No hay suficiente productos!!!',
                                icon: 'error',
                                confirmButtonText: 'Aceptar'
                            });
                            return;
                        }
                    }
                }
            }
            localStorage.setItem('productos', JSON.stringify(losProductos));
            compras.splice(posicion, 1);
            localStorage.setItem('compras', JSON.stringify(compras));
            cargarDatos();
            Swal.fire({
                title: 'Compra Eliminada',
                text: 'La compra se elimino exitosamente!',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        }
    });

    
}

function verCompra(posicion){
    localStorage.setItem('posicionCompra', posicion);
    window.location.href = 'comprasVer.html';
}

function mostrarCompra(){
    var posicion = JSON.parse(localStorage.getItem('posicionCompra')) || 0;
    var laCompra = compras[posicion];

    if(laCompra == undefined|| laCompra == null){
        Swal.fire({
            title: 'No exsite la compra',
            text: 'La compra no existe o ha sido elimincada!!!',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            window.location.href = 'compras.html';
        });
    }
    document.getElementById('proveedor').innerText = laCompra.proveedor;
    document.getElementById('fecha').innerText = laCompra.fecha;
    document.getElementById('comprobante').innerText = laCompra.comprobante;
    document.getElementById('total').innerText = laCompra.total;
    document.getElementById('usuario').innerText = laCompra.usuario;
    document.getElementById('ltotal').innerText = laCompra.total;

    var cadena = '';
    for(let i=0; i<laCompra.detalle.length; i++){
        var subtotal = parseFloat(laCompra.detalle[i].costo) * parseFloat(laCompra.detalle[i].cantidad);
        cadena += `<tr>
                        <td>${laCompra.detalle[i].producto}</td>
                        <td>${laCompra.detalle[i].costo}</td>
                        <td>${laCompra.detalle[i].cantidad}</td>
                        <td>${subtotal}</td>
                    </tr>
                    `;
    }
    document.getElementById('listaVer').innerHTML = cadena;
   
}

function cargarTotales(){
   var cantidadCompras = 0;
   var comprasMes = 0;
   var totalCompras = 0;

   for(let i=0; i<compras.length; i++){
     var laFecha = compras[i].fecha;
     var laFecha = new Date(laFecha);
     var fechaActual = new Date();
     
     if(laFecha.getFullYear() == fechaActual.getFullYear()){
        totalCompras += parseFloat(compras[i].total);

        if(laFecha.getMonth() == fechaActual.getMonth()){
            comprasMes += parseFloat(compras[i].total);
        }
        cantidadCompras++;
     }
   }

    document.getElementById('cantidadCompras').innerText = cantidadCompras;
    document.getElementById('comprasMes').innerText = comprasMes;
    document.getElementById('totalCompras').innerText = totalCompras;
}