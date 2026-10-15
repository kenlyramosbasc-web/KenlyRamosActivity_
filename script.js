// My Digital Space interactions
document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {
  // Add icons when the Lucide CDN is available. The page still works without it.
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const backToTop = document.getElementById("back-to-top");
  const year = document.getElementById("current-year");
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const revealItems = document.querySelectorAll(".reveal");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function closeMenu() {
    if (!menuToggle || !siteNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      siteNav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (siteNav.classList.contains("is-open") &&
          !siteNav.contains(event.target) &&
          !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // Reveal sections only when motion is allowed and an observer is supported.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Highlight the navigation link for the section currently in view.
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.id;
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${currentId}`;
          link.classList.toggle("active", isCurrent);
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Show the back-to-top button after the visitor scrolls a little.
  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }
});
