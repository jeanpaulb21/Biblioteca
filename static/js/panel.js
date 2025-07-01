function loadContent(pagina) {
  document.getElementById('main-content').src = `/admin/${pagina}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".menu-link");
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const toggleIcon = toggleBtn.querySelector(".toggle-icon");

  // Cambiar enlace activo
  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Botón toggle sidebar
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    // Añadir animación de rotación
    if (sidebar.classList.contains("collapsed")) {
      toggleIcon.style.transform = "rotate(180deg)";
    } else {
      toggleIcon.style.transform = "rotate(0deg)";
    }
  });

  });
