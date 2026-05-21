const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const infoGrid = document.getElementById('infoGrid');
const noResults = document.getElementById('noResults');
const pageNavTags = Array.from(document.querySelectorAll('.page-nav a'));

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const storedTheme = localStorage.getItem('work-info-theme');

function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  localStorage.setItem('work-info-theme', theme);
}

if (storedTheme) {
  applyTheme(storedTheme);
} else if (prefersDarkScheme.matches) {
  applyTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  applyTheme(isDark ? 'dark' : 'light');
});

function normalize(text) {
  return String(text).toLowerCase();
}

function filterInfo(query) {
  const normalizedQuery = normalize(query);
  const sections = Array.from(infoGrid.querySelectorAll('.info-section'));
  let anyVisible = false;

  sections.forEach((section) => {
    const sectionText = normalize(section.textContent);
    const matches = !normalizedQuery || sectionText.includes(normalizedQuery);
    section.hidden = !matches;
    if (matches) {
      anyVisible = true;
    }
  });

  noResults.hidden = anyVisible;
}

function clearActiveTags() {
  pageNavTags.forEach((tag) => {
    tag.classList.remove('active');
    tag.setAttribute('aria-pressed', 'false');
  });
}

pageNavTags.forEach((tag) => {
  tag.setAttribute('aria-pressed', 'false');
  tag.addEventListener('click', (event) => {
    event.preventDefault();
    const query = tag.textContent.trim();
    const isActive = tag.classList.contains('active');

    if (isActive) {
      clearActiveTags();
      searchInput.value = '';
      filterInfo('');
      return;
    }

    clearActiveTags();
    tag.classList.add('active');
    tag.setAttribute('aria-pressed', 'true');
    searchInput.value = query;
    filterInfo(query);
  });
});

searchInput.addEventListener('input', (event) => {
  if (event.target.value !== '') {
    clearActiveTags();
  }
  filterInfo(event.target.value);
});

filterInfo('');
