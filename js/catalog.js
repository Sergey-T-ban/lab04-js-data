const catalog = document.getElementById("catalog");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const empty = document.getElementById("empty");

const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");
const loadMoreBtn = document.getElementById("loadMore");

const FAVORITES_KEY = "catalogFavorites";
const ITEMS_URL = "../data/items.json";
const PAGE_SIZE = 4;

let allItems = [];
let visibleItems = PAGE_SIZE;

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

function saveFavorites(data) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
}

async function loadItems() {
  const response = await fetch(ITEMS_URL);

  if (!response.ok) {
    throw new Error("Не вдалося завантажити дані каталогу.");
  }

  return response.json();
}

function showLoadingState() {
  loading.classList.remove("hidden");
  error.classList.add("hidden");
  empty.classList.add("hidden");
}

function hideLoadingState() {
  loading.classList.add("hidden");
}

function showErrorState(message) {
  error.textContent = message;
  error.classList.remove("hidden");
  empty.classList.add("hidden");
}

function updateLoadMoreButton(totalItems) {
  if (!loadMoreBtn) return;

  if (totalItems > visibleItems) {
    loadMoreBtn.classList.remove("hidden");
  } else {
    loadMoreBtn.classList.add("hidden");
  }
}

function renderCards(items) {
  if (!catalog) return;

  catalog.innerHTML = "";

  const favorites = getFavorites();

  const visibleItemsList = items.slice(0, visibleItems);

  visibleItemsList.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p>Категорія: ${item.category}</p>
      <p>Рівень: ${item.level}</p>
      <p>Рейтинг: ${item.rating}</p>
      <p>Ціна: ${item.price}$</p>
      <button class="favorite-btn ${favorites.includes(item.id) ? "favorite" : ""}" data-id="${item.id}">
        ❤ Обране
      </button>
      <a href="details.html?id=${item.id}">Детальніше</a>
    `;

    catalog.append(card);
  });

  initFavoriteButtons();
}

function initFavoriteButtons() {
  document.querySelectorAll(".favorite-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      let favorites = getFavorites();

      if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
      } else {
        favorites.push(id);
      }

      saveFavorites(favorites);
      applyFilters();
    });
  });
}

function filterItems() {
  const query = searchInput?.value.toLowerCase() || "";
  const category = categorySelect?.value || "all";

  return allItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    const matchesCategory =
      category === "all" ||
      item.category === category;

    return matchesSearch && matchesCategory;
  });
}

function sortItems(items) {
  const sorted = [...items];

  switch (sortSelect?.value) {
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "price":
      sorted.sort((a, b) => a.price - b.price);
      break;
    default:
      break;
  }

  return sorted;
}

function resetPagination() {
  visibleItems = PAGE_SIZE;
}

function applyFilters() {
  if (!catalog) return;

  let result = filterItems();
  result = sortItems(result);

  if (result.length === 0) {
    catalog.innerHTML = "";
    empty.classList.remove("hidden");
    updateLoadMoreButton(0);
    return;
  }

  empty.classList.add("hidden");
  renderCards(result);
  updateLoadMoreButton(result.length);
}

async function init() {
  if (!catalog) return;

  showLoadingState();

  try {
    allItems = await loadItems();
    hideLoadingState();
    applyFilters();
  } catch (err) {
    hideLoadingState();
    showErrorState(err.message);
  }
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    resetPagination();
    applyFilters();
  });
}

if (categorySelect) {
  categorySelect.addEventListener("change", () => {
    resetPagination();
    applyFilters();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    resetPagination();
    applyFilters();
  });
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    visibleItems += PAGE_SIZE;
    applyFilters();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}