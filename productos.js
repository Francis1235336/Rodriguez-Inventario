var productos = JSON.parse(localStorage.getItem("productos")) || [];
var seleccionado = null;
setearDatos();

function registrarProducto(){
    var producto = document.getElementById("producto").value;
    var costo = document.getElementById("costo").value;
    var precio = document.getElementById("precio").value;
    var stock = document.getElementById("stock").value;

    if(producto == "" || costo == "" || precio == "" || stock == ""){
        Swal.fire({   
            title: "Faltan datos!",   
            text: "Por favor, rellena todos los campos!!!",
            icon: "warning",
        });
        return;
    }

    var nuevoProducto = {
        producto: producto,
        costo: parseFloat(costo),
        precio: parseFloat(precio),
        stock: parseInt(stock),
    };

    if(seleccionado != null){
        productos[seleccionado] = nuevoProducto;
        localStorage.removeItem('producto_seleccionado');
    }else{
        productos.push(nuevoProducto);
    }
    localStorage.setItem("productos", JSON.stringify(productos));

    Swal.fire({
        title: "Registro exitoso!",
        text: "El producto ha sido registrado exitosamente!!!",
        icon: "success",
        showConfirmButton: true,
        showCloseButton: true, 
    }).then(() => {
        window.location.href = "productos.html"; 
    });
}

function cargarDatos(){
    var cadena = '';
    for(let i=0; i<productos.length; i++){
        cadena += `<tr>
                                    <td>${i+1}</td>
                                    <td>${productos[i].producto}</td>
                                    <td>${productos[i].costo}</td>
                                    <td>${productos[i].precio}</td>
                                    <td>${productos[i].stock}</td>
                                    <td>
                                        <div class="acciones">
                                        
                                            <button onclick="editarProducto(${i})" class="btn btn-edit m5">
                                                <i class="fa fa-edit"></i>
                                            </button>
                                            <button onclick="eliminarProducto(${i})" class="btn btn-delete m5">
                                                <i class="fa fa-times"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
        `;
    }

    if(productos.length == 0){
        cadena += `<tr>
                        <td colspan="6">
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

function eliminarProducto(posicion){
    Swal.fire({
        title: "Esta seguro?",
        text: "El producto se eliminará!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero eliminar!",
    }).then((result) => {
        if (result.isConfirmed) {            
            productos.splice(posicion, 1);
            localStorage.setItem('productos', JSON.stringify(productos));
            cargarDatos();
 
            Swal.fire({
                title: "Eliminado!",
                text: "Tu producto ha sido eliminado.",
                icon: "success",
            });
        }
    });
}

function editarProducto(posicion){
    localStorage.setItem('producto_seleccionado', posicion);
    window.location.href = "productosForm.html";
}

function setearDatos(){
    seleccionado = localStorage.getItem('producto_seleccionado');

    if(seleccionado != null && seleccionado >= 0 && seleccionado != undefined){
        var elProducto = productos[seleccionado];
        document.getElementById("producto").value = elProducto.producto;
        document.getElementById("costo").value = elProducto.costo;
        document.getElementById("precio").value = elProducto.precio;
        document.getElementById("stock").value = elProducto.stock;
    }
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