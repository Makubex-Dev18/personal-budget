const movimientos = [];

function Movimiento(tipo, monto, descripcion) {
  if (!["ingreso", "egreso"].includes(tipo)) throw new Error("Tipo inválido");
  if (monto <= 0) throw new Error("Monto debe ser mayor a 0");
  if (!descripcion.trim()) throw new Error("Descripción vacía");

  this.tipo = tipo;
  this.monto = monto;
  this.descripcion = descripcion;
  this.id = crypto.randomUUID(); // ID único para editar/eliminar
}

Movimiento.prototype.render = function () {
  const div = document.createElement("div");
  div.className = `movimiento ${this.tipo}`;
  div.innerHTML = `
    ${this.descripcion} - ${this.tipo} - $${this.monto}
    <button onclick="editarMovimiento('${this.id}')">✏️</button>
    <button onclick="eliminarMovimiento('${this.id}')">🗑️</button>
  `;
  div.dataset.id = this.id;
  return div;
};

Movimiento.prototype.esIngreso = function () {
  return this.tipo === "ingreso";
};
Movimiento.prototype.esEgreso = function () {
  return this.tipo === "egreso";
};

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

document.getElementById("formMovimiento").addEventListener("submit", function (e) {
  e.preventDefault();
  const tipo = document.getElementById("tipo").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const descripcion = document.getElementById("descripcion").value;
  const mensaje = document.getElementById("mensajeConfirmacion");

  try {
    let movimiento = tipo === "ingreso"
      ? new Ingreso(monto, descripcion)
      : new Egreso(monto, descripcion);

    movimientos.push(movimiento);
    console.log("📌 Nuevo movimiento registrado:", movimiento);

    document.getElementById("listaMovimientos").appendChild(movimiento.render());
    mensaje.textContent = "✅ Movimiento agregado correctamente";
    this.reset();

    recalcularTotales();
    mostrarResumenConsola();
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
});

function recalcularTotales() {
  const ingresos = movimientos.filter(m => m.esIngreso()).reduce((acc, m) => acc + m.monto, 0);
  const egresos = movimientos.filter(m => m.esEgreso()).reduce((acc, m) => acc + m.monto, 0);

  document.getElementById("totalIngresos").textContent = `Total Ingresos: $${ingresos}`;
  document.getElementById("totalEgresos").textContent = `Total Egresos: $${egresos}`;
  document.getElementById("saldo").textContent = `Saldo Final: $${ingresos - egresos}`;
}

function buscarMovimiento() {
  const termino = document.getElementById("buscarDescripcion").value.trim().toLowerCase();
  const resultado = document.getElementById("resultadoBusqueda");
  const encontrado = movimientos.find(m => m.descripcion.toLowerCase() === termino);

  console.log("----- Buscar por descripción: '" + termino + "' -----");
  console.log(encontrado || "No se encontró el movimiento");

  resultado.textContent = encontrado
    ? `✅ Movimiento encontrado: ${encontrado.descripcion} | ${encontrado.tipo} | $${encontrado.monto}`
    : "❌ No se encontró el movimiento";
}

function mostrarResumenConsola() {
  console.log("----- Resumen General -----");
  console.log("Cantidad de movimientos:", movimientos.length);

  const saldo = movimientos.reduce((acc, m) => m.tipo === "ingreso" ? acc + m.monto : acc - m.monto, 0);
  console.log("Saldo total:", saldo);

  const resumen = movimientos.reduce((acc, m) => {
    acc[m.tipo] = (acc[m.tipo] || 0) + m.monto;
    return acc;
  }, {});
  console.log("----- Resumen por tipo -----");
  for (const tipo in resumen) console.log(`${tipo}: $${resumen[tipo]}`);

  console.log("----- Nombres de movimientos -----");
  console.log(movimientos.map(m => m.descripcion));

  console.log("----- Egresos mayores a $100 -----");
  console.log(movimientos.filter(m => m.tipo === "egreso" && m.monto > 100));
}

function editarMovimiento(id) {
  const movimiento = movimientos.find(m => m.id === id);
  if (!movimiento) return;

  const nuevoMonto = parseFloat(prompt("Nuevo monto:", movimiento.monto));
  const nuevaDescripcion = prompt("Nueva descripción:", movimiento.descripcion);

  if (!isNaN(nuevoMonto) && nuevaDescripcion?.trim()) {
    movimiento.monto = nuevoMonto;
    movimiento.descripcion = nuevaDescripcion;
    actualizarListaMovimientos();
    recalcularTotales();
    mostrarResumenConsola();
  } else {
    alert("❌ Datos inválidos. Edición cancelada.");
  }
}

function eliminarMovimiento(id) {
  const index = movimientos.findIndex(m => m.id === id);
  if (index >= 0) {
    movimientos.splice(index, 1);
    actualizarListaMovimientos();
    recalcularTotales();
    mostrarResumenConsola();
  }
}

function actualizarListaMovimientos() {
  const contenedor = document.getElementById("listaMovimientos");
  contenedor.innerHTML = "";
  movimientos.forEach(m => contenedor.appendChild(m.render()));
}





