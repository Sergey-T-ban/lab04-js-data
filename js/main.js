// Глобальні констан­ти
const THEME_KEY = "app-theme";
const THEMES = {
  light: "light",
  dark: "dark"
};

/**
 * Ініціалізація статичного UI
 * Запускається на кожній сторінці
 */
function initStaticUI() {
  setupThemeSwitcher();
  setupMobileMenu();
  setupHeaderNavigation();
}

/**
 * Керування темою (light/dark)
 */
function setupThemeSwitcher() {
  const themeBtns = document.querySelectorAll("[data-theme-toggle]");

  if (themeBtns.length === 0) return;

  // Відновити збережену тему
  const savedTheme = localStorage.getItem(THEME_KEY) || THEMES.light;
  applyTheme(savedTheme);

  // Слухачі для кнопок перемикання теми
  themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || THEMES.light;
      const newTheme = currentTheme === THEMES.light ? THEMES.dark : THEMES.light;

      applyTheme(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.classList.remove(THEMES.light, THEMES.dark);
  document.body.classList.add(theme);
}

/**
 * Мобільне меню (бургер-меню)
 */
function setupMobileMenu() {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (!menuToggle || !mobileNav) return;

  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  // Закрити меню при кліку на посилання
  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
      menuToggle.classList.remove("active");
    });
  });
}

/**
 * Активація посилань навігації
 * Позначає поточну сторінку в меню
 */
function setupHeaderNavigation() {
  const navLinks = document.querySelectorAll("nav a, [data-mobile-nav] a");

  if (navLinks.length === 0) return;

  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    // Видалити старий клас активності
    link.classList.remove("active");

    // Додати клас активності поточній сторінці
    if (currentPath.includes(href) || (currentPath === "/" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/**
 * Модальне вікно (якщо є на сторінці)
 */
function setupModals() {
  const modalTriggers = document.querySelectorAll("[data-modal-trigger]");
  const modals = document.querySelectorAll("[data-modal]");
  const closeButtons = document.querySelectorAll("[data-modal-close]");

  if (modalTriggers.length === 0) return;

  // Відкрити модаль
  modalTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.getAttribute("data-modal-trigger");
      const modal = document.querySelector(`[data-modal="${modalId}"]`);

      if (modal) {
        modal.classList.add("active");
      }
    });
  });

  // Закрити модаль через кнопку
  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest("[data-modal]");

      if (modal) {
        modal.classList.remove("active");
      }
    });
  });

  // Закрити модаль при кліку поза містом
  modals.forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
}

/**
 * Основна функція ініціалізації
 */
function init() {
  // Статичний UI на всіх сторінках
  initStaticUI();

  // Модалі (якщо є)
  setupModals();

  // Логування ініціалізації
  console.log("✓ Додаток ініціалізовано");
}

// Запуск при завантаженні DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Експорт для використання в інших модулях
window.appUtils = {
  applyTheme,
  setupModals,
  initStaticUI
};
