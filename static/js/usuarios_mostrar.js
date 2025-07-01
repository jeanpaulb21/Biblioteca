document.addEventListener("DOMContentLoaded", function () {
  const modalElement = document.getElementById("modalLibro");
  const modalBody = document.getElementById("modal-libro-body");
  const modalTitle = document.getElementById("modalLibroLabel");
  const modalInstance = modalElement ? new bootstrap.Modal(modalElement) : null;

  const aplicarAnimacion = (elemento) => {
    elemento.style.opacity = 0;
    elemento.style.transform = "translateY(40px)";
    elemento.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    setTimeout(() => {
      elemento.style.opacity = 1;
      elemento.style.transform = "translateY(0)";
    }, 10);
  };

  const mostrarCargando = (contenedor) => {
    contenedor.innerHTML = `
      <div class="d-flex justify-content-center align-items-center p-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
    `;
  };

  // ➜ Mostrar lista de usuarios
  document.getElementById("btn-mostrar-usuarios")?.addEventListener("click", () => {
    if (!modalInstance) return;
    modalTitle.textContent = "Lista de Usuarios";
    mostrarCargando(modalBody);

    fetch('/admin/usuarios/mostrar')
      .then(response => response.text())
      .then(html => {
        modalBody.innerHTML = html;
        aplicarAnimacion(modalBody);
        modalInstance.show();
      });
  });

  // ➜ Mostrar formulario para agregar usuario
  document.getElementById("btn-agregar")?.addEventListener("click", () => {
    if (!modalInstance) return;
    modalTitle.textContent = "Agregar Usuario";
    mostrarCargando(modalBody);

    fetch("/admin/usuarios/agregar")
      .then(response => response.text())
      .then(html => {
        modalBody.innerHTML = html;
        aplicarAnimacion(modalBody);
        modalInstance.show();

        // ⚡ Enganchar listener AJAX al formulario recién cargado
        const form = modalBody.querySelector('form');
        if (form) {
          form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(form);

            fetch(form.action, {
              method: 'POST',
              body: formData
            })
              .then(resp => resp.json())
              .then(data => {
                if (data.success) {
                  alert(data.mensaje || 'Usuario registrado.');
                  modalInstance.hide();
                  document.getElementById("btn-mostrar-usuarios").click(); // recargar lista
                } else {
                  alert(data.mensaje || 'Error al registrar.');
                  console.log(data.errores || '');
                }
              })
              .catch(err => {
                console.error('Error al registrar:', err);
                alert('Error inesperado.');
              });
          });
        }
      });
  });

  // ➜ Delegación: Editar usuario
  document.addEventListener("click", function (e) {
    const editarBtn = e.target.closest(".btn-editar-usuario");
    if (editarBtn && modalInstance) {
      const userId = editarBtn.getAttribute("data-id");

      fetch(`/admin/usuarios/editar_formulario/${userId}`)
        .then(res => res.text())
        .then(html => {
          modalTitle.textContent = "Editar Usuario";
          modalBody.innerHTML = html;
          aplicarAnimacion(modalBody);
          modalInstance.show();
        });
    }
  });

  // ➜ Delegación: Eliminar usuario
  document.addEventListener("click", function (e) {
    const eliminarBtn = e.target.closest(".btn-eliminar-usuario");
    if (eliminarBtn) {
      const id = eliminarBtn.dataset.id;
      if (confirm(`¿Estás seguro de eliminar al usuario ID: ${id}?`)) {
        fetch(`/admin/usuarios/eliminar/${id}`, {
          method: "POST"
        })
          .then(resp => resp.json())
          .then(data => {
            alert(data.mensaje || "Usuario eliminado");
            eliminarBtn.closest("tr").remove();
          })
          .catch(err => {
            console.error("Error al eliminar usuario:", err);
            alert("Error al eliminar usuario.");
          });
      }
    }
  });

  // ➜ Botón cancelar: solo en modal
  document.addEventListener("click", function (e) {
    const cancelarBtn = e.target.closest(".btn-cancelar-usuario");
    if (cancelarBtn && modalInstance) {
      modalInstance.hide();
    }
  });

  // ➜ Filtro en vivo por nombre, correo y rol
  document.addEventListener("keyup", function (e) {
    if (e.target && e.target.id === "busqueda-usuario") {
      const filtro = e.target.value.toLowerCase();
      const filas = document.querySelectorAll("#tabla-usuarios tbody tr");

      filas.forEach(fila => {
        const nombre = fila.dataset.nombre.toLowerCase();
        const email = fila.dataset.email.toLowerCase();
        const rol = fila.dataset.rol.toLowerCase();
        const coincide = nombre.includes(filtro) || email.includes(filtro) || rol.includes(filtro);
        fila.style.display = coincide ? "" : "none";
      });
    }
  });

});
