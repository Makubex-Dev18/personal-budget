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

function calcularTotalSaldo() {
  let saldo = 0;
  for (let movimiento of movimientos) {
    if (movimiento.tipo === "ingreso") {
      saldo += movimiento.monto;
    } else {
      saldo -= movimiento.monto;
    }
  }
  return saldo;
}

function mostrarResumen() {
  console.log("----- Resumen General -----");
  console.log("Cantidad de movimientos:", movimientos.length);
  console.log("Saldo total:$", calcularTotalSaldo());

  let resumenPorTipo = {};
  for (let movimiento of movimientos) {
    if (!resumenPorTipo[movimiento.tipo]) {
      resumenPorTipo[movimiento.tipo] = 0;
    }
    resumenPorTipo[movimiento.tipo] += movimiento.monto;
  }

  console.log("----- Resumen por tipo -----");
  for (let tipo in resumenPorTipo) {
    console.log(`${tipo}: $${resumenPorTipo[tipo]}`);
  }
}

// Ejecutar el sistema
registrarMovimiento();
mostrarResumen();
