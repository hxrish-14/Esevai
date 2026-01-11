/* ==========================================================
   GLOBAL UI, ANIMATIONS, THEME, LANGUAGE, SECURITY
========================================================== */

// Disable right click
document.addEventListener("contextmenu", e => e.preventDefault());

// Basic DevTools key blocking
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

  /* ==============================
     LOADER
  ============================== */
  const loader = document.getElementById("loader");
  setTimeout(() => {
    if (loader) loader.style.opacity = "0";
    setTimeout(() => {
      if (loader) loader.style.display = "none";
    }, 400);
  }, 900);

  /* ==============================
     PAGE FADE IN + MOTION BLUR
  ============================== */
  const page = document.querySelector(".page");
  if (page) {
    page.style.opacity = "0";
    page.style.transform = "translateY(12px) scale(0.98)";
    page.style.filter = "blur(8px)";
    setTimeout(() => {
      page.style.transition = "all 0.9s ease";
      page.style.opacity = "1";
      page.style.transform = "translateY(0) scale(1)";
      page.style.filter = "blur(0)";
    }, 120);
  }

  /* ==============================
     SMOOTH SCROLL
  ============================== */
  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ==============================
     THEME TOGGLE (GLITCH-FREE)
  ============================== */
  const toggle = document.getElementById("themeToggle");
  let isToggling = false;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (toggle) toggle.checked = true;
  }

  toggle?.addEventListener("change", () => {
    if (isToggling) return;
    isToggling = true;

    if (toggle.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }

    setTimeout(() => { isToggling = false; }, 300);
  });

  /* ==============================
     LANGUAGE DROPDOWN
  ============================== */
  const langSelect = document.getElementById("langSelect");
  langSelect?.addEventListener("change", () => {
    document.documentElement.setAttribute("lang", langSelect.value);
  });

});
