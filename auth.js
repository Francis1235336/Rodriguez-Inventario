

function login(){
    var usuario = document.getElementById('usuario').value;
    var contrasena = document.getElementById('contrasena').value;

    if(usuario == 'Francis' && contrasena == '352637'){
        localStorage.setItem('sesion', 'si');
        Swal.fire({
            title: 'Bienvenido',
            text: 'Has accedido al panel de administración',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = "index.html";
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Usuario o contraseña incorrectos!!!',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            localStorage.removeItem('sesion');
            window.location.href = 'login.html';
        })
        return;
    }
}

function verificar(){
    if(localStorage.getItem('sesion') != 'si'){
        window.location.href = 'login.html';
    } 
}

function logout(){
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás seguro que deseas cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('sesion');
            window.location.href = "login.html";
        }
    });
    
}
    