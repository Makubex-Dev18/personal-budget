// Array global de movimientos
const movimientos = [];

// 🟨 HU1: Función constructora con validación
function Movimiento(tipo, monto, descripcion) {
  if (tipo !== "ingreso" && tipo !== "egreso") {
    throw new Error("Tipo inválido. Debe ser 'ingreso' o 'egreso'.");
  }
  if (isNaN(monto) || monto <= 0) {
    throw new Error("El monto debe ser un número mayor que 0.");
  }
  if (!descripcion || descripcion.trim() === "") {
    throw new Error("La descripción no puede estar vacía.");
  }

  this.tipo = tipo;
  this.monto = monto;
  this.descripcion = descripcion.trim();
}

// 🟦 HU3: Método de renderizado en el prototipo
Movimiento.prototype.render = function () {
  const contenedor = document.getElementById("movimientos");
  const div = document.createElement("div");
  div.innerHTML = `<strong>${this.tipo.toUpperCase()}</strong>: ${this.descripcion} - $${this.monto}`;
  div.style.color = this.tipo === "ingreso" ? "green" : "red";
  contenedor.appendChild(div);
};

// 🟩 HU2: Registro usando objetos Movimiento
function registrarMovimiento() {
  while (true) {
    let descripcion = prompt("Ingrese el nombre del movimiento (o escriba 'salir'):");
    if (descripcion === null || descripcion.toLowerCase() === "salir") break;

    let tipo = prompt("Ingrese el tipo (ingreso o egreso):").toLowerCase();
    let monto = parseFloat(prompt("Ingrese el monto:"));

    try {
      const mov = new Movimiento(tipo, monto, descripcion);
      movimientos.push(mov);
      mov.render(); // HU3: mostrar en DOM
      alert("Movimiento registrado correctamente.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
}

// Función para calcular saldo total
function calcularTotalSaldo(lista) {
  return lista.reduce((acc, m) =>
    m.tipo === "ingreso" ? acc + m.monto : acc - m.monto, 0);
}

// Función para mostrar resumen
function mostrarResumen(lista) {
  console.log("----- Resumen General -----");
  console.log("Cantidad de movimientos:", lista.length);
  console.log("Saldo total:", calcularTotalSaldo(lista));

  const resumen = lista.reduce((acc, mov) => {
    acc[mov.tipo] = (acc[mov.tipo] || 0) + mov.monto;
    return acc;
  }, {});

  console.log("----- Resumen por tipo -----");
  Object.entries(resumen).forEach(([tipo, total]) => {
    console.log(`${tipo}: ${total}`);
  });
}

// Extra: Map, Filter, Find (HU anteriores)
function listarNombres(lista) {
  const nombres = lista.map(m => m.descripcion);
  console.log("Nombres de movimientos:", nombres);
}

function filtrarEgresosMayoresA100(lista) {
  const filtrados = lista.filter(m => m.tipo === "egreso" && m.monto > 100);
  console.table(filtrados);
}

function buscarMovimientoPorNombre(lista, nombre) {
  const encontrado = lista.find(m => m.descripcion.toLowerCase() === nombre.toLowerCase());
  if (encontrado) {
    console.log("Movimiento encontrado:", encontrado);
  } else {
    console.log("No se encontró el movimiento.");
  }
}

// 🧪 Ejecutar flujo
registrarMovimiento();
mostrarResumen(movimientos);
listarNombres(movimientos);
filtrarEgresosMayoresA100(movimientos);
const buscar = prompt("¿Deseas buscar un movimiento por nombre?");
if (buscar) {
  buscarMovimientoPorNombre(movimientos, buscar);
}

