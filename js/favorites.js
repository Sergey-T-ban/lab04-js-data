const FAVORITES_KEY = "catalogFavorites";
const ITEMS_URL = "../data/items.json";

const favoritesCatalog = document.getElementById("favoritesCatalog");
const favoritesEmpty = document.getElementById("favoritesEmpty");

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

function saveFavorites(data) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);

  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites(favorites);
}

async function loadItems() {
  const response = await fetch(ITEMS_URL);

  if (!response.ok) {
    throw new Error("Не вдалося завантажити дані для обраного.");
  }

  return response.json();
}

function renderFavoriteCards(items) {
  if (!favoritesCatalog) return;

  favoritesCatalog.innerHTML = "";

  items.forEach(item => {
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
      <button class="remove-btn" data-id="${item.id}">Видалити з обраного</button>
      <a href="./catalog.html">Повернутись до каталогу</a>
    `;
    favoritesCatalog.append(card);
  });

  initRemoveButtons();
}

function initRemoveButtons() {
  if (!favoritesCatalog) return;

  favoritesCatalog.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      toggleFavorite(id);
      loadFavoritesPage();
    });
  });
}

function showEmptyFavorites() {
  if (favoritesCatalog) {
    favoritesCatalog.innerHTML = "";
  }
  if (favoritesEmpty) {
    favoritesEmpty.classList.remove("hidden");
  }
}

function hideEmptyFavorites() {
  if (favoritesEmpty) {
    favoritesEmpty.classList.add("hidden");
  }
}

async function loadFavoritesPage() {
  if (!favoritesCatalog) return;

  const favoriteIds = getFavorites();

  if (favoriteIds.length === 0) {
    showEmptyFavorites();
    return;
  }

  try {
    const items = await loadItems();
    const favoriteItems = items.filter(item => favoriteIds.includes(item.id));

    if (favoriteItems.length === 0) {
      showEmptyFavorites();
      return;
    }

    hideEmptyFavorites();
    renderFavoriteCards(favoriteItems);
  } catch (err) {
    favoritesCatalog.innerHTML = `<div class="card"><p>${err.message}</p></div>`;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadFavoritesPage);
} else {
  loadFavoritesPage();
}