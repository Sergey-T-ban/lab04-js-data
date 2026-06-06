const DETAILS_URL = "../data/items.json";
const detailsContainer = document.getElementById("details");

async function loadItems() {
  const response = await fetch(DETAILS_URL);

  if (!response.ok) {
    throw new Error("Не вдалося завантажити дані для детальної сторінки.");
  }

  return response.json();
}

function showError(message) {
  if (!detailsContainer) return;

  detailsContainer.innerHTML = `
    <div class="card">
      <h2>Сталася помилка</h2>
      <p>${message}</p>
      <a href="./catalog.html">Повернутись до каталогу</a>
    </div>
  `;
}

async function init() {
  if (!detailsContainer) return;

  try {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get("id"));

    if (!id) {
      throw new Error("Невірний ідентифікатор курсу.");
    }

    const items = await loadItems();
    const item = items.find(i => i.id === id);

    if (!item) {
      throw new Error("Курс не знайдено.");
    }

    document.title = item.title;

    detailsContainer.innerHTML = `
      <div class="card">
        <h1>${item.title}</h1>
        <img src="${item.image}" alt="${item.title}">
        <p>${item.description}</p>
        <p>Категорія: ${item.category}</p>
        <p>Рівень: ${item.level}</p>
        <p>Рейтинг: ${item.rating}</p>
        <p>Ціна: ${item.price}$</p>
        <a href="./catalog.html">Повернутись до каталогу</a>
      </div>
    `;
  } catch (err) {
    showError(err.message);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
