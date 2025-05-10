let movimientos = [];

function registrarMovimiento() {
  while (true) {
    let nombre = prompt("Ingrese el nombre del movimiento (o escriba 'salir' para terminar):");
    if (nombre === null || nombre.toLowerCase() === "salir") break;
    if (nombre.trim() === "") {
      alert("El nombre no puede estar vacío.");
      continue;
    }

    let tipo = prompt("Ingrese el tipo: Ingreso o Egreso").toLowerCase();
    if (tipo !== "ingreso" && tipo !== "egreso") {
      alert("El tipo debe ser 'Ingreso' o 'Egreso'.");
      continue;
    }

    let monto = parseFloat(prompt("Ingrese el monto:"));
    if (isNaN(monto) || monto <= 0) {
      alert("El monto debe ser un número mayor a 0.");
      continue;
    }

    movimientos.push({
      nombre: nombre.trim(),
      tipo: tipo,
      monto: monto
    });

    alert("Movimiento registrado exitosamente.");
  }
}

// Función pura que calcula el saldo total
function calcularTotalSaldo(listaMovimientos) {
  return listaMovimientos.reduce((total, mov) =>
    mov.tipo === "ingreso" ? total + mov.monto : total - mov.monto, 0);
}

// Función pura que genera un resumen general
function mostrarResumen(listaMovimientos) {
  console.log("----- Resumen General -----");
  console.log("Cantidad de movimientos:", listaMovimientos.length);
  console.log("Saldo total:", calcularTotalSaldo(listaMovimientos));

  let resumen = listaMovimientos.reduce((acc, mov) => {
    acc[mov.tipo] = (acc[mov.tipo] || 0) + mov.monto;
    return acc;
  }, {});

  console.log("----- Resumen por tipo -----");
  Object.entries(resumen).forEach(([tipo, total]) => {
    console.log(`${tipo}: ${total}`);
  });
}

// HU1: Listar nombres de movimientos (map)
function listarNombres(listaMovimientos) {
  const nombres = listaMovimientos.map(mov => mov.nombre);
  console.log("----- Nombres de movimientos -----");
  console.log(nombres);
}

// HU2: Filtrar egresos > $100 (filter)
function filtrarEgresosMayoresA100(listaMovimientos) {
  const resultado = listaMovimientos
    .filter(mov => mov.tipo === "egreso" && mov.monto > 100);
  console.log("----- Egresos mayores a $100 -----");
  //console.log(resultado);
  resultado.forEach(mov => {
  console.log(`Nombre: ${mov.nombre} | Monto: $${mov.monto}`);
});
}

// HU3: Buscar movimiento por nombre (find)
function buscarMovimientoPorNombre(listaMovimientos, nombreBuscado) {
  const resultado = listaMovimientos.find(mov =>
    mov.nombre.toLowerCase() === nombreBuscado.toLowerCase());
  if (resultado) {
    console.log("Movimiento encontrado:", resultado);
  } else {
    console.log(`No se encontró un movimiento con el nombre "${nombreBuscado}".`);
  }
}

// 🚀 Ejecutar todo el sistema
registrarMovimiento();
mostrarResumen(movimientos);
listarNombres(movimientos);
filtrarEgresosMayoresA100(movimientos);

// Buscar movimiento por nombre (pedimos al usuario)
const nombreParaBuscar = prompt("¿Desea buscar un movimiento por nombre? Ingréselo o presione cancelar:");
if (nombreParaBuscar) {
  buscarMovimientoPorNombre(movimientos, nombreParaBuscar);
}
