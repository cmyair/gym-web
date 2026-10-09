// ======================
// ATLAS GYM - Lógica principal
// ======================

// Protección básica de sesión
if (!sessionStorage.getItem("atlas_logged")) {
  window.location.href = "index.html";
}

// Array de miembros (se carga desde localStorage)
let miembros = JSON.parse(localStorage.getItem("atlas_miembros")) || [];

// ---------- Persistencia ----------
function guardarEnStorage() {
  localStorage.setItem("atlas_miembros", JSON.stringify(miembros));
}

// ---------- Generar ID único ----------
function generarId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// ---------- Crear miembro ----------
function crearMiembro(nombre, apellido, fechaNacimiento, plan) {
  return {
    id: generarId(),
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    fechaNacimiento: fechaNacimiento, // string "YYYY-MM-DD"
    plan: ["Básico", "Premium", "VIP", "Anual"].includes(plan) ? plan : "Básico",
    fechaRegistro: new Date().toISOString()
  };
}

// ---------- Agregar miembro ----------
function agregarMiembro(nombre, apellido, fechaNacimiento, plan) {
  const nuevo = crearMiembro(nombre, apellido, fechaNacimiento, plan);
  miembros.push(nuevo);
  guardarEnStorage();
  return nuevo;
}

// ---------- Buscar miembros ----------
function buscarMiembros(texto) {
  if (!texto || texto.trim() === "") return [...miembros];

  const termino = texto.toLowerCase().trim();

  return miembros.filter(m => {
    const nombreCompleto = `${m.nombre} ${m.apellido}`.toLowerCase();
    return (
      m.nombre.toLowerCase().includes(termino) ||
      m.apellido.toLowerCase().includes(termino) ||
      m.plan.toLowerCase().includes(termino) ||
      nombreCompleto.includes(termino)
    );
  });
}

// ---------- Actualizar miembro ----------
function actualizarMiembro(id, datosNuevos) {
  const index = miembros.findIndex(m => m.id === id);
  if (index === -1) return null;

  miembros[index] = {
    ...miembros[index],
    ...datosNuevos
  };

  guardarEnStorage();
  return miembros[index];
}

// ---------- Eliminar miembro ----------
function eliminarMiembro(id) {
  const index = miembros.findIndex(m => m.id === id);
  if (index === -1) return false;

  miembros.splice(index, 1);
  guardarEnStorage();
  return true;
}

// ======================
// INTERFAZ - Formularios y vistas
// ======================

// ---------- Limpiar formulario ----------
function limpiarFormulario() {
  const form = document.getElementById("form-miembro");
  if (form) form.reset();

  const mensaje = document.getElementById("mensaje");
  if (mensaje) {
    mensaje.textContent = "";
    mensaje.className = "mensaje";
  }
}

// ---------- Mostrar mensaje visual ----------
function mostrarMensaje(texto, tipo = "exito") {
  const mensaje = document.getElementById("mensaje");
  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;

  // Ocultar después de 3 segundos
  setTimeout(() => {
    mensaje.textContent = "";
    mensaje.className = "mensaje";
  }, 3000);
}

// ---------- Guardar miembro (desde el formulario) ----------
function guardarMiembro() {
  const nombreInput = document.getElementById("n_nombre");
  const apellidoInput = document.getElementById("n_apellido");
  const fechaInput = document.getElementById("n_fechaNacimiento");
  const planInput = document.getElementById("n_plan");

  if (!nombreInput || !apellidoInput || !fechaInput || !planInput) {
    alert("Error: no se encontraron los campos del formulario");
    return;
  }

  const nombre = nombreInput.value.trim();
  const apellido = apellidoInput.value.trim();
  const fechaNacimiento = fechaInput.value;
  const plan = planInput.value;

  // Validación
  if (!nombre || !apellido || !fechaNacimiento || !plan) {
    mostrarMensaje("Por favor completa todos los campos", "error");
    return;
  }

  // Validar que la fecha no sea futura
  const fecha = new Date(fechaNacimiento);
  const hoy = new Date();
  if (fecha > hoy) {
    mostrarMensaje("La fecha de nacimiento no puede ser futura", "error");
    return;
  }

  const nuevo = agregarMiembro(nombre, apellido, fechaNacimiento, plan);

  mostrarMensaje(`¡Miembro ${nuevo.nombre} ${nuevo.apellido} agregado correctamente!`, "exito");

  // Limpiar formulario después de un momento
  setTimeout(() => {
    limpiarFormulario();
  }, 1200);
}

// ---------- Vista: Agregar nuevo miembro ----------
function agregar_nuevos_miembros() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Agregar Nuevo Miembro</h2>

      <div id="mensaje" class="mensaje"></div>

      <form id="form-miembro" onsubmit="return false;">
        <div class="form-group">
          <label for="n_nombre">Nombre:</label>
          <input type="text" id="n_nombre" placeholder="Ej: Álvaro" required>
        </div>

        <div class="form-group">
          <label for="n_apellido">Apellido:</label>
          <input type="text" id="n_apellido" placeholder="Ej: Benavides" required>
        </div>

        <div class="form-group">
          <label for="n_fechaNacimiento">Fecha de Nacimiento:</label>
          <input type="date" id="n_fechaNacimiento" required>
        </div>

        <div class="form-group">
          <label for="n_plan">Plan:</label>
          <select id="n_plan" required>
            <option value="">Selecciona un plan</option>
            <option value="Básico">Básico</option>
            <option value="Premium">Premium</option>
            <option value="VIP">VIP</option>
            <option value="Anual">Anual</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-guardar" onclick="guardarMiembro()">Guardar Miembro</button>
          <button type="button" class="btn-cancelar" onclick="limpiarFormulario()">Limpiar</button>
        </div>
      </form>
    </div>
  `;
}

// ---------- Formatear fecha para mostrar ----------
function formatearFecha(fechaISO) {
  if (!fechaISO) return "—";
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

// ---------- Vista: Lista de miembros ----------
function mostrar_lista_miembros() {
  const lista = [...miembros].sort((a, b) => a.apellido.localeCompare(b.apellido));

  let html = `
    <div class="panel-form" style="max-width: 900px;">
      <h2>Lista de Miembros (${lista.length})</h2>

      <div class="form-group" style="margin-bottom: 20px;">
        <input type="text" id="buscar-miembro" placeholder="Buscar por nombre, apellido o plan..." 
               oninput="filtrarListaMiembros()" style="width:100%;">
      </div>

      <div id="mensaje" class="mensaje"></div>

      <div id="contenedor-lista">
  `;

  if (lista.length === 0) {
    html += `<p style="text-align:center; color:#94a3b8; margin-top:30px;">No hay miembros registrados todavía.</p>`;
  } else {
    html += `
      <div class="tabla-miembros">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Nacimiento</th>
              <th>Plan</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;

    lista.forEach(m => {
      html += `
        <tr data-id="${m.id}">
          <td>${m.nombre}</td>
          <td>${m.apellido}</td>
          <td>${formatearFecha(m.fechaNacimiento)}</td>
          <td><span class="badge plan-${m.plan.toLowerCase()}">${m.plan}</span></td>
          <td class="acciones">
            <button class="btn-editar" onclick="abrirEditarMiembro(${m.id})">Editar</button>
            <button class="btn-eliminar" onclick="confirmarEliminar(${m.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  html += `
      </div>
    </div>
  `;

  document.getElementById("contenido").innerHTML = html;
}

// ---------- Filtrar lista en tiempo real ----------
function filtrarListaMiembros() {
  const texto = document.getElementById("buscar-miembro")?.value || "";
  const resultados = buscarMiembros(texto);

  const contenedor = document.getElementById("contenedor-lista");
  if (!contenedor) return;

  if (resultados.length === 0) {
    contenedor.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:30px;">No se encontraron miembros.</p>`;
    return;
  }

  let html = `
    <div class="tabla-miembros">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Nacimiento</th>
            <th>Plan</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
  `;

  resultados
    .sort((a, b) => a.apellido.localeCompare(b.apellido))
    .forEach(m => {
      html += `
        <tr data-id="${m.id}">
          <td>${m.nombre}</td>
          <td>${m.apellido}</td>
          <td>${formatearFecha(m.fechaNacimiento)}</td>
          <td><span class="badge plan-${m.plan.toLowerCase()}">${m.plan}</span></td>
          <td class="acciones">
            <button class="btn-editar" onclick="abrirEditarMiembro(${m.id})">Editar</button>
            <button class="btn-eliminar" onclick="confirmarEliminar(${m.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });

  html += `
        </tbody>
      </table>
    </div>
  `;

  contenedor.innerHTML = html;
}

// ---------- Confirmar eliminación ----------
function confirmarEliminar(id) {
  const miembro = miembros.find(m => m.id === id);
  if (!miembro) return;

  const confirmar = confirm(`¿Estás seguro de eliminar a ${miembro.nombre} ${miembro.apellido}?`);
  if (confirmar) {
    eliminarMiembro(id);
    mostrarMensaje("Miembro eliminado correctamente", "exito");
    // Refrescar la lista
    setTimeout(() => mostrar_lista_miembros(), 600);
  }
}

// ---------- Abrir formulario de edición ----------
function abrirEditarMiembro(id) {
  const miembro = miembros.find(m => m.id === id);
  if (!miembro) return;

  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Editar Miembro</h2>

      <div id="mensaje" class="mensaje"></div>

      <form id="form-editar" onsubmit="return false;">
        <input type="hidden" id="edit_id" value="${miembro.id}">

        <div class="form-group">
          <label for="edit_nombre">Nombre:</label>
          <input type="text" id="edit_nombre" value="${miembro.nombre}" required>
        </div>

        <div class="form-group">
          <label for="edit_apellido">Apellido:</label>
          <input type="text" id="edit_apellido" value="${miembro.apellido}" required>
        </div>

        <div class="form-group">
          <label for="edit_fecha">Fecha de Nacimiento:</label>
          <input type="date" id="edit_fecha" value="${miembro.fechaNacimiento}" required>
        </div>

        <div class="form-group">
          <label for="edit_plan">Plan:</label>
          <select id="edit_plan" required>
            <option value="Básico" ${miembro.plan === "Básico" ? "selected" : ""}>Básico</option>
            <option value="Premium" ${miembro.plan === "Premium" ? "selected" : ""}>Premium</option>
            <option value="VIP" ${miembro.plan === "VIP" ? "selected" : ""}>VIP</option>
            <option value="Anual" ${miembro.plan === "Anual" ? "selected" : ""}>Anual</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-guardar" onclick="guardarEdicion()">Guardar Cambios</button>
          <button type="button" class="btn-cancelar" onclick="mostrar_lista_miembros()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
}

// ---------- Guardar edición ----------
function guardarEdicion() {
  const id = Number(document.getElementById("edit_id").value);
  const nombre = document.getElementById("edit_nombre").value.trim();
  const apellido = document.getElementById("edit_apellido").value.trim();
  const fechaNacimiento = document.getElementById("edit_fecha").value;
  const plan = document.getElementById("edit_plan").value;

  if (!nombre || !apellido || !fechaNacimiento || !plan) {
    mostrarMensaje("Por favor completa todos los campos", "error");
    return;
  }

  actualizarMiembro(id, { nombre, apellido, fechaNacimiento, plan });
  mostrarMensaje("Miembro actualizado correctamente", "exito");

  setTimeout(() => {
    mostrar_lista_miembros();
  }, 1000);
}

// ======================
// OTRAS SECCIONES (placeholders mejorados)
// ======================

function mostrar_stock() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Tienda</h2>
      <p style="text-align:center; color:#94a3b8; margin-top:40px;">
        Sección en construcción...<br>
        Aquí podrás gestionar productos, suplementos y merchandising.
      </p>
    </div>
  `;
}

function mostrar_planes() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Planes Disponibles</h2>
      <div class="planes-grid">
        <div class="plan-card">
          <h3>Básico</h3>
          <p class="precio">$25 / mes</p>
          <ul>
            <li>Acceso a zona de pesas</li>
            <li>Horario limitado</li>
          </ul>
        </div>
        <div class="plan-card destacado">
          <h3>Premium</h3>
          <p class="precio">$45 / mes</p>
          <ul>
            <li>Acceso completo</li>
            <li>Clases grupales</li>
            <li>1 evaluación al mes</li>
          </ul>
        </div>
        <div class="plan-card">
          <h3>VIP</h3>
          <p class="precio">$70 / mes</p>
          <ul>
            <li>Todo lo de Premium</li>
            <li>Entrenador personal</li>
            <li>Acceso prioritario</li>
          </ul>
        </div>
        <div class="plan-card">
          <h3>Anual</h3>
          <p class="precio">$400 / año</p>
          <ul>
            <li>Equivalente a Premium</li>
            <li>2 meses gratis</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function mostrar_eventos() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Eventos</h2>
      <p style="text-align:center; color:#94a3b8; margin-top:40px;">
        Sección en construcción...<br>
        Aquí podrás crear y gestionar eventos, competencias y clases especiales.
      </p>
    </div>
  `;
}

function mostrar_settings() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Ajustes</h2>
      <p style="text-align:center; color:#94a3b8; margin-top:40px;">
        Sección en construcción...<br>
        Configuración del gimnasio, usuarios y preferencias.
      </p>
    </div>
  `;
}