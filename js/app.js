// Array global de movimientos
const movimientos = [];

// Constructor base
function Movimiento(tipo, monto, descripcion) {
  if (!["ingreso", "egreso"].includes(tipo)) throw new Error("Tipo inválido");
  if (monto <= 0) throw new Error("Monto debe ser mayor a 0");
  if (!descripcion.trim()) throw new Error("Descripción vacía");

  this.tipo = tipo;
  this.monto = monto;
  this.descripcion = descripcion;
}

Movimiento.prototype.render = function () {
  const div = document.createElement("div");
  div.className = `movimiento ${this.tipo}`;
  div.textContent = `${this.descripcion} - ${this.tipo} - $${this.monto}`;
  return div;
};

Movimiento.prototype.esIngreso = function () {
  return this.tipo === "ingreso";
};

Movimiento.prototype.esEgreso = function () {
  return this.tipo === "egreso";
};

// Subclases
function Ingreso(monto, descripcion) {
  Movimiento.call(this, "ingreso", monto, descripcion);
}
Ingreso.prototype = Object.create(Movimiento.prototype);
Ingreso.prototype.constructor = Ingreso;

function Egreso(monto, descripcion) {
  Movimiento.call(this, "egreso", monto, descripcion);
}
Egreso.prototype = Object.create(Movimiento.prototype);
Egreso.prototype.constructor = Egreso;

// Registro de movimiento
document.getElementById("formMovimiento").addEventListener("submit", function (e) {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const descripcion = document.getElementById("descripcion").value;
  const mensaje = document.getElementById("mensajeConfirmacion");

  try {
    let movimiento;
    if (tipo === "ingreso") {
      movimiento = new Ingreso(monto, descripcion);
    } else if (tipo === "egreso") {
      movimiento = new Egreso(monto, descripcion);
    }

    movimientos.push(movimiento);
    console.log("📌 Nuevo movimiento registrado:", movimiento);

    // Mostrar en el DOM
    const lista = document.getElementById("listaMovimientos");
    lista.appendChild(movimiento.render());

    // Mostrar mensaje y resetear formulario
    mensaje.textContent = "✅ Movimiento agregado correctamente";
    this.reset();

    recalcularTotales();
    mostrarResumenConsola();

  } catch (err) {
    alert("❌ Error: " + err.message);
  }
});

// Recalcula y actualiza totales en pantalla
function recalcularTotales() {
  const ingresos = movimientos.filter(m => m.esIngreso()).reduce((acc, m) => acc + m.monto, 0);
  const egresos = movimientos.filter(m => m.esEgreso()).reduce((acc, m) => acc + m.monto, 0);

  document.getElementById("totalIngresos").textContent = `Total Ingresos: $${ingresos}`;
  document.getElementById("totalEgresos").textContent = `Total Egresos: $${egresos}`;
  document.getElementById("saldo").textContent = `Saldo Final: $${ingresos - egresos}`;
}

// Buscar por descripción desde el DOM
function buscarMovimiento() {
  const inputBusqueda = document.getElementById("buscarDescripcion");
  const resultado = document.getElementById("resultadoBusqueda");

  const termino = inputBusqueda.value.trim().toLowerCase();
  const encontrado = movimientos.find(m => m.descripcion.toLowerCase() === termino);

  console.log("----- Buscar por descripción: '" + termino + "' -----");
  console.log(encontrado || "No se encontró el movimiento");

  if (encontrado) {
    resultado.textContent = `✅ Movimiento encontrado: ${encontrado.descripcion} | ${encontrado.tipo} | $${encontrado.monto}`;
  } else {
    resultado.textContent = "❌ No se encontró el movimiento";
  }
}

// Mostrar resumen adicional en consola
function mostrarResumenConsola() {
  console.log("----- Resumen General -----");
  console.log("Cantidad de movimientos:", movimientos.length);

  const saldo = movimientos.reduce((acc, m) => m.tipo === "ingreso" ? acc + m.monto : acc - m.monto, 0);
  console.log("Saldo total:", saldo);

  console.log("----- Resumen por tipo -----");
  const resumen = movimientos.reduce((acc, m) => {
    acc[m.tipo] = (acc[m.tipo] || 0) + m.monto;
    return acc;
  }, {});
  for (const tipo in resumen) {
    console.log(`${tipo}: $${resumen[tipo]}`);
  }

  console.log("----- Nombres de movimientos -----");
  console.log(movimientos.map(m => m.descripcion));

  console.log("----- Egresos mayores a $100 -----");
  console.log(movimientos.filter(m => m.tipo === "egreso" && m.monto > 100));
}




