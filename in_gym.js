// variable global para almacenar los miembros del gimnasio
let miembros = [];

// función para agregar mienbros al arreglo de miembros

function agg_miembro(nombre, apellido, day, month, year, plan) {
  const nuevo_miembro = {
    id: Date.now() + Math.random(),
    nombre: nombre.trim(), // No permitir espacios vacios
    apellido: apellido.trim(), // <<<<<
    fechaNacimiento: { 
      dia: Number(day),
      mes: Number(month),
      anio: Number(year)
    },
    plan: ["Básico", "Premium", "VIP", "Anual" ].includes(plan) ? plan : "Básico", // Validar el plan
    fechaRegistro: new Date().toISOString(), // formato de fecha 0/0/0 0:00

    
  };
  
  let n_id = document.getElementById("nuevo_miembro.id").value;
  if (n_id) {
    n_id = nuevo_miembro.id; // Generar un ID único si no se proporciona
  }
  let n_nombre = document.getElementById("nuevo_miembro.nombre").value;
  if (n_nombre) {
    nuevo_miembro.nombre = n_nombre;
  }
  let n_apellido = document.getElementById("nuevo_miembro.apellido").value;
  if (n_apellido) {
    nuevo_miembro.apellido = n_apellido;
  }
  let n_fechaNacimiento = document.getElementById("nuevo_miembro.fechaNacimiento").value;
  if (n_fechaNacimiento) {
    const [dia, mes, anio] = n_fechaNacimiento.split("-").map(Number);
    nuevo_miembro.fechaNacimiento = { dia, mes, anio };
  }

  miembros.push(nuevo_miembro);
  return nuevo_miembro;
}
 


//funcion para bsucar los miembros que ya alla sido agregados
function buscar_miembros(texto) {
  if (!texto || texto.trim() === "") return [...miembros];

  const termino = texto.toLowerCase().trim();

  return miembros.filter(m => {
    return (
      m.nombre.toLowerCase().includes(termino) ||
      m.apellido.toLowerCase().includes(termino) ||
      m.plan.toLowerCase().includes(termino) ||
      `${m.nombre} ${m.apellido}`.toLowerCase().includes(termino)
    );
  });
}

//Funcion para actuailizar los datos de los miembros
function actualizar_miembro(id, datosNuevos) {
  const index = miembros.findIndex(m => m.id === id);
  if (index === -1) return null;

  miembros[index] = {
    ...miembros[index],
    ...datosNuevos,
    fechaNacimiento: datosNuevos.fechaNacimiento
      ? { ...miembros[index].fechaNacimiento, ...datosNuevos.fechaNacimiento }
      : miembros[index].fechaNacimiento
  };

  return miembros[index];
}

// Para elimar un miembro xd
function eliminar_miembro(id) {
  const index = miembros.findIndex(m => m.id === id);
  if (index === -1) return false;
  miembros.splice(index, 1);
  return true;
}

function agregar_nuevos_miembros() {
  document.getElementById("contenido").innerHTML = `

      <h2>Agregar Nuevo Miembro</h2>
      <form id="form-miembro" onsubmit="return false;">
        <section id="agregar-miembro">
          <div class="panel-agg-miem">

            <div class="form-group">
              <label for="n_nombre">Ingrese su nombre:</label>
              <input type ="text" id="n_nombre" placeholder="Ej: Alvaro" requird>
            </div>

            <div class="form-group">
              <label for="n_apellido">Ingrese su apellido:</label>
              <input type ="text" id="n_apellido" placeholder="Ej: Benavidez" requird>
            </div>

            <div class="form-group">
              <label for="n_fechaNacimiento">Fecha de Nacimiento:</label>
              <input type ="date" id="n_fechaNacimiento" requird>
            </div>

            <div class="form-group">
              <label for="nuevo_miembro.plan">Plan:</label>
              <select id="nuevo_miembro.plan" required>
                <option value="">Selecciona un plan</option>
                <option value="Básico">Básico</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              <option value="Anual">Anual</option>
            </select>

          
            </div>

            <div class="form-actions">
              <button type="button" class="btn-guardar" onclick="guardar_miembro()">Guardar Miembro</button>
              <button type="button" class="btn-cancelar" onclick="limpiarFormulario()">Limpiar</button>
            </div>
      </form>
      `
}

// ======================
// PANEL: AGREGAR MIEMBRO
// ======================
/* function mostrar_nuevos_miembros() {
  const contenedor = document.getElementById("contenido");

  contenedor.innerHTML = `
    <div class="panel-form">
      <h2>Agregar Nuevo Miembro</h2>

      <form id="form-miembro" onsubmit="return false;">
        <div class="form-row">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" placeholder="Ej: Juan" required>
          </div>
          <div class="form-group">
            <label for="apellido">Apellido</label>
            <input type="text" id="apellido" placeholder="Ej: Pérez" required>
          </div>
        </div>

        <div class="form-group">
          <label>Fecha de Nacimiento</label>
          <div class="fecha-inputs">
            <input type="number" id="dia" placeholder="Día" min="1" max="31" required>
            <input type="number" id="mes" placeholder="Mes" min="1" max="12" required>
            <input type="number" id="anio" placeholder="Año" min="1940" max="2015" required>
          </div>
        </div>

        <div class="form-group">
          <label for="plan">Plan</label>
          <select id="plan" required>
            <option value="">Selecciona un plan</option>
            <option value="Básico">Básico</option>
            <option value="Premium">Premium</option>
            <option value="VIP">VIP</option>
            <option value="Anual">Anual</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-guardar" onclick="guardar_miembro()">Guardar Miembro</button>
          <button type="button" class="btn-cancelar" onclick="limpiarFormulario()">Limpiar</button>
        </div>
      </form>

      <div id="mensaje" class="mensaje"></div>
    </div>
  `;
}
 */
// Guardar el miembro
function guardar_miembro() {
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const dia = document.getElementById("dia").value;
  const mes = document.getElementById("mes").value;
  const anio = document.getElementById("anio").value;
  const plan = document.getElementById("plan").value;

  // Validación simple
  if (!nombre || !apellido || !dia || !mes || !anio || !plan) {
    mostrarMensaje("Por favor completa todos los campos", "error");
    return;
  }

  const nuevo = agg_miembro(nombre, apellido, dia, mes, anio, plan);

  mostrarMensaje(`¡Miembro ${nuevo.nombre} ${nuevo.apellido} agregado correctamente!`, "exito");

  // Limpiar el formulario después de 1.5 segundos
  setTimeout(() => {
    limpiarFormulario();
  }, 1500);

  console.log("Miembros actuales:", miembros); // para que veas en consola
}

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById("form-miembro").reset();
  document.getElementById("mensaje").innerHTML = "";
}

// Mostrar mensajes
function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}

// ======================
// OTROS BOTONES (por ahora)
// ======================
function mostrar_stock() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Tienda</h2>
      <p>Sección en construcción...</p>
    </div>
  `;
}

function mostrar_planes() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Planes</h2>
      <p>Sección en construcción...</p>
    </div>
  `;
}

function mostrar_eventos() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Eventos</h2>
      <p>Sección en construcción...</p>
    </div>
  `;
}

function mostrar_lista_miembros() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Lista de Miembros</h2>
      <p>Sección en construcción...</p>
    </div>
  `;
}

function mostrar_settings() {
  document.getElementById("contenido").innerHTML = `
    <div class="panel-form">
      <h2>Ajustes</h2>
      <p>Sección en construcción...</p>
    </div>
  `;
}

