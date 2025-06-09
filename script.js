const languageSelect = document.getElementById("languageSelect");
const repoDisplay = document.getElementById("repoDisplay");
const refreshBtn = document.getElementById("refreshBtn");

let currentLanguage = "";

languageSelect.addEventListener("change", () => {
  const selected = languageSelect.value;
  currentLanguage = selected;
  if (selected === "") {
    repoDisplay.textContent = "Por favor selecciona un lenguaje";
    refreshBtn.classList.add("hidden");
    return;
  }
  fetchRepo(selected);
});

refreshBtn.addEventListener("click", () => {
  if (currentLanguage) {
    fetchRepo(currentLanguage);
  }
});

function fetchRepo(language) {
  repoDisplay.textContent = "Cargando repositorio...";
  refreshBtn.classList.add("hidden");

  fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars`)
    .then((res) => {
      if (!res.ok) throw new Error("Error al obtener los datos");
      return res.json();
    })
    .then((data) => {
      if (data.items.length === 0) {
        repoDisplay.textContent = "No se encontraron repositorios.";
        return;
      }

      const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];
      repoDisplay.innerHTML = `
        <h3><a href="${randomRepo.html_url}" target="_blank" style="color: #00bcd4;">${randomRepo.name}</a></h3>
        <p>${randomRepo.description || "Sin descripción"}</p>
        <p>🌟 Estrellas: ${randomRepo.stargazers_count}</p>
        <p>🍴 Forks: ${randomRepo.forks_count}</p>
        <p>🐞 Issues abiertas: ${randomRepo.open_issues_count}</p>
      `;
      refreshBtn.classList.remove("hidden");
    })
    .catch(() => {
      repoDisplay.innerHTML = `<p style="color: #ff6b6b;">Error al obtener repositorios.</p>`;
      refreshBtn.classList.remove("hidden");
    });
}
