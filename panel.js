var compras = JSON.parse(localStorage.getItem("compras")) || [];
var ventas = JSON.parse(localStorage.getItem("ventas")) || [];

cargarTotales();

var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


graficoVentas();
graficoProductos();

function cargarTotales(){
   var comprasMes = 0;
   var totalCompras = 0;
   var ventasMes = 0;
   var totalVentas = 0;

   for(let i=0; i<compras.length; i++){
     var laFecha = compras[i].fecha;
     var laFecha = new Date(laFecha);
     var fechaActual = new Date();
     
     if(laFecha.getFullYear() == fechaActual.getFullYear()){
        totalCompras += parseFloat(compras[i].total);

        if(laFecha.getMonth() == fechaActual.getMonth()){
            comprasMes += parseFloat(compras[i].total);
        }
     }
   }

    for(let i=0; i<ventas.length; i++){
        totalVentas += parseFloat(ventas[i].total);
        var laFecha = ventas[i].fecha;
        var laFecha = new Date(laFecha);
        var fechaActual = new Date();

        if(laFecha.getFullYear() == fechaActual.getFullYear()){
            ventasMes += parseFloat(ventas[i].total);
        }
    }


    document.getElementById('comprasMes').innerText = comprasMes;
    document.getElementById('totalCompras').innerText = totalCompras;
    document.getElementById('ventasMes').innerText = ventasMes;
    document.getElementById('totalVentas').innerText = totalVentas;
}

function graficoVentas(){

    var ventasArray = [];
    var comprasArray=[];

    for(let i=0; i<meses.length; i++){
        ventasArray[i] = 0;
        for(let j=0; j<ventas.length; j++){
            var fecha = new Date(ventas[j].fecha);
            if(fecha.getMonth() == i){
                ventasArray[i] += parseFloat(ventas[j].total) - parseFloat(ventas[j].descuento);
            }
        }
    }
    for(let i=0; i<meses.length; i++){
        comprasArray[i] = 0;
        for(let j=0; j<compras.length; j++){
            var fecha = new Date(compras[j].fecha);
            if(fecha.getMonth() == i){
                comprasArray[i] += parseFloat(compras[j].total);
            }
        }
    }

    var options = {
        chart: {
            type: 'area'
        },
        series: [
            {
                name: 'Ventas',
                data: ventasArray
            },
            {
                name: 'Compras',
                data: comprasArray
            }
    ],
        xaxis: {
            categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
                        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        }
    }

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
}

function graficoProductos(){
    var arrayProductos = [];
    var arrayCantidades = [];

    var productos = JSON.parse(localStorage.getItem("productos")) || [];
    for(let i=0; i < productos.length; i++){
        arrayProductos[i] = productos[i].producto;
        arrayCantidades[i] = 0;
        
        for(let v = 0; v < ventas.length; v++){
            //recorrer los detalles de las ventas
            var detalle = ventas[v].detalle;
            for(let vd=0; vd<detalle.length; vd++){
                if(productos[i].producto == detalle[vd].producto){
                    arrayCantidades[i] += parseFloat(detalle[vd].cantidad);
                }
            }
        }
    }
    // PARA GRAFICO DE DONAS
    var opciones = {
        series: arrayCantidades,
        labels: arrayProductos,
        chart: {
            type: 'donut'
        }
    }

    var grafico = new ApexCharts(document.querySelector("#chart-productos"), opciones);
    grafico.render();
}

