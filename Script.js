const languageSelect = document.getElementById("languageSelect");
const statusMessage = document.getElementById("statusMessage");
const repoCard = document.getElementById("repoCard");
const refreshBtn = document.getElementById("refreshBtn");
const repoName = document.getElementById("repoName");
const repoDesc = document.getElementById("repoDesc");
const stars = document.getElementById("stars");
const forks = document.getElementById("forks");
const issues = document.getElementById("issues");
const repoLink = document.getElementById("repoLink");

let currentLanguage = "";

languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  if (currentLanguage) {
    fetchRepo(currentLanguage);
  } else {
    clearUI();
    statusMessage.textContent = "Por favor, selecciona un lenguaje.";
  }
});

refreshBtn.addEventListener("click", () => {
  if (currentLanguage) fetchRepo(currentLanguage);
});

function clearUI() {
  repoCard.classList.add("hidden");
  refreshBtn.classList.add("hidden");
  statusMessage.textContent = "";
}

async function fetchRepo(language) {
  clearUI();
  statusMessage.textContent = "Cargando repositorio...";

  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=30`);
    if (!response.ok) throw new Error("No se pudo obtener datos");

    const data = await response.json();
    if (data.items.length === 0) {
      statusMessage.textContent = "No se encontraron repositorios.";
      return;
    }

    const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];
    displayRepo(randomRepo);
  } catch (error) {
    statusMessage.textContent = "Hubo un error al obtener los repositorios.";
    refreshBtn.classList.remove("hidden");
  }
}

function displayRepo(repo) {
  repoName.textContent = repo.name;
  repoDesc.textContent = repo.description || "Sin descripción.";
  stars.textContent = `⭐ ${repo.stargazers_count}`;
  forks.textContent = `🍴 ${repo.forks_count}`;
  issues.textContent = `🐞 ${repo.open_issues_count}`;
  repoLink.href = repo.html_url;

  statusMessage.textContent = "";
  repoCard.classList.remove("hidden");
  refreshBtn.classList.remove("hidden");
}
