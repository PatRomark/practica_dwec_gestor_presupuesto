// TODO: Crear las funciones, objetos y variables indicadas en el enunciado

// TODO: Variable global
let presupuesto = 0;
let gastos = [];
let idGasto = 0;

function actualizarPresupuesto(nuevoPresupuesto) {
    // TODO

    if (nuevoPresupuesto >= 0) {
        presupuesto = nuevoPresupuesto;
        return nuevoPresupuesto;
    } else {
        console.log("error");
        return -1;
    }
}

function mostrarPresupuesto() {
    // TODO
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

function listarGastos() {
    return gastos;
}

function anyadirGasto(nuevoGasto) {
    //añado al objeto gasto la propiedad id
    nuevoGasto.id = idGasto;
    idGasto++;
    //añado el objeto gasto a la variable global gasto
    gastos.push(nuevoGasto);
}

function borrarGasto(id) {
    //busco el gasto con el id que me dan
    console.log(gastos.length);
    for (const gasto of gastos) {
        if (gasto.id == id) {
            // encuentro el i del gasto
            const i = gastos.indexOf(gasto);
            //elimino el gasto del array gastos
            gastos.splice(i, 1);
            
        }

    }
    console.log(gastos.length);
}

function calcularTotalGastos() {
 
   return gastos.reduce((total, gasto) => total + gasto.valor, 0);
}

function calcularBalance() {
    
    let gastosTotal = calcularTotalGastos();
    return presupuesto - gastosTotal;
}

function filtrarGastos(opciones) {
    
    return gastos.filter(function(gasto) {
        let resultado = true;

        if (opciones.fechaDesde) //compruebo fecha minima
        {
            if (gasto.fecha < Date.parse(opciones.fechaDesde))
            {
                resultado = false;
            }
            
        }
    
        if (opciones.fechaHasta)

        {
            if(gasto.fecha > Date.parse(opciones.fechaHasta))
            {
                resultado = false;
            }
        }

        if (opciones.valorMinimo) 
        {
            if (gasto.valor < opciones.valorMinimo) 
            {
                resultado = false;
            }
        }
        
        if (opciones.valorMaximo)
        {
            if (gasto.valor > opciones.valorMaximo)
            {
                resultado = false;
            }
        }

        if (opciones.descripcionContiene)
        {
            if (!gasto.descripcion.includes(opciones.descripcionContiene))
            {
                resultado = false;
            }
        }

        if (opciones.etiquetasTiene)
        {           
            let diferenteEtiqueta = true;
            for (let i in opciones.etiquetasTiene)
            {
                for (let j in gasto.etiquetas)
                {
                    if (opciones.etiquetasTiene[i] == gasto.etiquetas[j])
                    {                        
                        diferenteEtiqueta = false;
                    }
                }
            }

            if (diferenteEtiqueta)
            {
                resultado = false;
            }
        }
        
        return resultado;
        });
    }
     


function agruparGastos(periodo,etiquetas,fechaDesde,fechaHasta) {
    
    //utilizo la funcion filtrarGastos
    let gastosFiltrados = filtrarGastos({
        etiquetasTiene: etiquetas, 
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta
    })
        //reduce: itera sobre los gastos y realiza la agrupacion
    let gastosAgrupacion = gastosFiltrados.reduce(function(acc, gasto){
        
        //obtengo el periodoDeAgrupacion para cada gasto utilizando la f(x) obtenerPeriodoAgrup.
        let periodoAgrupacio = gasto.obtenerPeriodoAgrupacion(periodo)

        if(!acc[periodoAgrupacio]){
            acc[periodoAgrupacio] = 0
        }
        
        acc[periodoAgrupacio] += gasto.valor

        return acc //devuelve el acc para la ss iteracion de reduce

    }, {}) //inicio objeto vacio, acc para almacenar los resultados agrupados

    //devuelvo obj. con los resultados agrupados
    return gastosAgrupacion
}


function CrearGasto(descripcion, valor, fecha, ...etiquetas ) {
    // TODO

    //propiedades
    this.descripcion = descripcion;
    
    if (valor >= 0) {
        this.valor = valor;
    } else{
        this.valor = 0;
    }

    this.fecha = Date.parse(fecha);

    //compruebo la fecha si no tiene formato adecuado le asigno la actual
    if (isNaN(this.fecha)) {
        this.fecha = Date.now();
    }

    this.etiquetas = etiquetas;

    //metodos
    this.mostrarGasto = function () {
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
    }

    this.actualizarDescripcion = function (nuevaDescripcion) {
        this.descripcion = nuevaDescripcion;
    }

    this.actualizarValor = function (nuevaValor) {
        if (nuevaValor >= 0) {
            this.valor = nuevaValor;
            return nuevaValor;
        } else {
            return this.valor;
        }
    }

    this.mostrarGastoCompleto = function () {
        let mensaje = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\n` 
        mensaje = mensaje + `Fecha: ${new Date(this.fecha).toLocaleString("")}\n`
        mensaje = mensaje + `Etiquetas:\n`
        for (let e of this.etiquetas) {
            mensaje = mensaje + `- ${e}\n`
        }
         return mensaje;
    }

    this.actualizarFecha = function (nuevaFechaString) {
        let ts = Date.parse(nuevaFechaString); //creo un timestamp
        //compruebo si es NaN para ver si es fecha valida
        if (!isNaN(ts) ) {
            this.fecha = ts;
        }
    }

    this.anyadirEtiquetas = function (...nuevasEtiquetas) {
        
        for(let etiqueta of nuevasEtiquetas){
            if (!this.etiquetas.includes(etiqueta)) {
                this.etiquetas.push(etiqueta);
            }
        }
    }

    this.borrarEtiquetas = function (...etiquetasBorrar) {
       this.etiquetas = this.etiquetas.filter ( function (e) {
           return !etiquetasBorrar.includes(e) 
        })   
    }

    this.obtenerPeriodoAgrupacion = function (periodo) {
        let fechaPer;

        if (periodo == "dia"){
            fechaPer = new Date(fecha).toISOString(); //obtengo fecha en formato ISO utilizando clase Date
            fechaPer = fechaPer.substring(0,10); //se extraen los 10 primeros caracteres
            return fechaPer;
        }
        if (periodo == "mes"){
            fechaPer = new Date(fecha).toISOString();
            fechaPer = fechaPer.substring(0,7);
            return fechaPer;
        }
        if (periodo == "anyo"){
            fechaPer = new Date(fecha).toISOString();
            fechaPer = fechaPer.substring(0,4);
            return fechaPer;
        }
    }
}

//f(x) transformarListadoEtiquetas

function transformarListadoEtiquetas(etiquetasTiene)
{
    let regexp = /\w+/g;

    let resultado = etiquetasTiene.match(regexp);

    return resultado;
}



// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos,
    transformarListadoEtiquetas
}
