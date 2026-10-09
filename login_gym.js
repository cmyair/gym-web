// ======================
// ATLAS GYM - Login
// ======================

// Credenciales (en un proyecto real esto iría en un backend)
const ADMIN = {
  username: "admin",
  password: "yair123"
};

// ---------- Inicio de sesión ----------
function login() {
  const username = document.getElementById("user_admin").value.trim();
  const password = document.getElementById("password").value;

  if (username === ADMIN.username && password === ADMIN.password) {
    // Guardar sesión simple
    sessionStorage.setItem("atlas_logged", "true");
    sessionStorage.setItem("atlas_user", username);

    alert("Inicio de sesión exitoso");
    window.location.href = "index2.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

// ---------- Restablecer contraseña (solo en memoria de la sesión) ----------
function resetpassword() {
  const passwordActual = prompt("Ingrese su contraseña actual:");

  if (passwordActual === ADMIN.password) {
    const nueva = prompt("Ingrese la nueva contraseña:");

    if (nueva && nueva.trim().length >= 4) {
      ADMIN.password = nueva.trim();
      alert("Contraseña restablecida correctamente.\nNota: este cambio solo dura mientras no recargues la página (es solo un prototipo).");
    } else {
      alert("La nueva contraseña debe tener al menos 4 caracteres.");
    }
  } else if (passwordActual !== null) {
    alert("La contraseña actual es incorrecta");
  }
}

// Permitir Enter para iniciar sesión
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") login();
    });
  }
});
