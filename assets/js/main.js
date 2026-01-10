/* =========================================
   GLOBAL UI & PAGE ANIMATIONS
========================================= */

// Disable right click
document.addEventListener("contextmenu", e => e.preventDefault());

// Basic dev-tools key blocking
document.addEventListener("keydown", e => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();
  }
});

document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     LOADER
  ============================ */
  const loader = document.getElementById("loader");
  setTimeout(() => {
    if (loader) loader.style.display = "none";
  }, 1000);

  /* ============================
     PAGE FADE + BOUNCE
  ============================ */
  const page = document.querySelector(".page");
  if (page) {
    page.style.opacity = "0";
    page.style.transform = "scale(0.97)";
    setTimeout(() => {
      page.style.transition = "all 0.9s ease";
      page.style.opacity = "1";
      page.style.transform = "scale(1)";
    }, 150);
  }

  /* ============================
     SMOOTH SCROLL
  ============================ */
  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ============================
     THEME TOGGLE
  ============================ */
  const toggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (toggle) toggle.checked = true;
  }

  toggle?.addEventListener("change", () => {
    if (toggle.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  });

  /* ============================
     LANGUAGE DROPDOWN
     (Browser / Google Translate)
  ============================ */
  const langSelect = document.getElementById("langSelect");
  langSelect?.addEventListener("change", () => {
    // Allow browser / Google Translate to translate page
    document.documentElement.setAttribute("lang", langSelect.value);
  });

});
