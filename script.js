const select = document.getElementById("language-select");
const status = document.getElementById("status");
const repoCard = document.getElementById("repo-card");
const refreshBtn = document.getElementById("refresh-btn");

let currentLanguage = "";

select.addEventListener("change", () => {
  const lang = select.value;
  if (!lang) {
    status.textContent = "Please select a language";
    repoCard.classList.add("hidden");
    refreshBtn.classList.add("hidden");
    return;
  }

  currentLanguage = lang;
  fetchRepository(lang);
});

refreshBtn.addEventListener("click", () => {
  fetchRepository(currentLanguage);
});

function fetchRepository(language) {
  status.textContent = "Loading, please wait..";
  status.style.backgroundColor = "#e0e0e0";
  repoCard.classList.add("hidden");
  refreshBtn.classList.add("hidden");

  fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars`)
    .then(res => {
      if (!res.ok) throw new Error("Network error");
      return res.json();
    })
    .then(data => {
      if (data.items.length === 0) {
        status.textContent = "No repositories found";
        return;
      }

      const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];
      showRepository(randomRepo);
    })
    .catch(err => {
      status.textContent = "Error fetching repositories";
      status.style.backgroundColor = "#f8d7da";
      refreshBtn.textContent = "Click to retry";
      refreshBtn.classList.remove("hidden");
    });
}

function showRepository(repo) {
  status.textContent = "";
  status.style.backgroundColor = "#e0e0e0";

  repoCard.innerHTML = `
    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
    <p>${repo.description || "No description provided."}</p>
    <p>
      <strong>🌐 ${repo.language || "N/A"}</strong> | 
      ⭐ ${repo.stargazers_count} | 
      🍴 ${repo.forks_count} | 
      🐛 ${repo.open_issues_count}
    </p>
  `;
  repoCard.classList.remove("hidden");
  refreshBtn.textContent = "Refresh";
  refreshBtn.classList.remove("hidden");
}
