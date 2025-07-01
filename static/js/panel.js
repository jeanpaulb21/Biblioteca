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

  // Gráfico: Libros más prestados
  fetch('/api/libros_populares')
    .then(res => res.json())
    .then(data => {
      const ctx = document.getElementById('graficoLibrosPopulares').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(d => d.titulo),
          datasets: [{
            label: 'Veces prestado',
            data: data.map(d => d.total),
            backgroundColor: '#1cc88a'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    });

  // Gráfico: Libros con más retraso
  fetch('/api/libros_atrasados')
    .then(res => res.json())
    .then(data => {
      const ctx = document.getElementById('graficoLibrosAtrasados').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(d => d.titulo),
          datasets: [{
            label: 'Veces atrasado',
            data: data.map(d => d.total),
            backgroundColor: '#e74a3b'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    });
});
