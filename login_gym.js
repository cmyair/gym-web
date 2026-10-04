 //password predeterminada
let user_admin = {
    username: "admin",
    password: "yair123"
};

//Inicio de sesion
function login() {
            let username = document.getElementById("user_admin").value;
            let password = document.getElementById("password").value;

            if (username === user_admin.username && password === user_admin.password) {
                alert("Inicio de sesión exitoso");
<<<<<<< HEAD
                window.location.href = "/index2.html"; // Redirigir a la página de inicio
=======
                window.location.href = "index2.html"; // Redirigir a la página de inicio
>>>>>>> 5efc2e7 (Actualizacion 1.1)
            } else {
                alert("Usuario o contraseña incorrectos");
            }
}

//funcion para cambiar the password
function resetpassword() {
    let password = prompt("Ingrese su contraseña actual:");
    if (password === user_admin.password) {
        let newPassword = prompt("Ingrese la nueva contraseña:");
        if (newPassword) {
            user_admin.password = newPassword;
            alert("Contraseña restablecida correctamente");
        } else {
            alert("No se ingresó una nueva contraseña");
        }
    } else {
        alert("La contraseña actual es incorrecta");
    }
}
