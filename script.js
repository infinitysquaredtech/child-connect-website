/* =============================================
   CHILD CONNECT — Website JavaScript
   ============================================= */

const AOS_STAGGER_DELAY_MS = 80;
const COUNTER_ANIMATION_DURATION_MS = 1800;

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileNav();
  initFaqAccordionAnimations();
  initScrollTopButton();
  initScrollAnimations();
  initCounterAnimations();
  initSmoothScroll();
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});

/* ---------- Navbar scroll effect ---------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile navigation toggle ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const nav = document.getElementById("navbar");
  if (!toggle || !links || !nav) return;

  links.querySelectorAll("li").forEach((item, index) => {
    item.style.setProperty("--nav-item-delay", `${index * 35}ms`);
  });

  const closeMenu = () => {
    links.classList.remove("active");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("active");
    toggle.classList.toggle("active");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when a link is clicked
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 768) return;
    if (!links.classList.contains("active")) return;
    if (nav.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

/* ---------- FAQ accordion animations ---------- */
function initFaqAccordionAnimations() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");
    if (!summary) return;

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (item.dataset.isClosing === "true" || !item.open) {
        openFaqItem(item);
      } else if (item.dataset.isExpanding === "true" || item.open) {
        closeFaqItem(item);
      }
    });
  });
}

function closeFaqItem(item) {
  const summary = item.querySelector("summary");
  if (!summary) return;

  item.dataset.isClosing = "true";
  item.dataset.isExpanding = "false";

  const startHeight = `${item.scrollHeight}px`;
  const endHeight = `${summary.offsetHeight}px`;

  if (item._faqAnimation) {
    item._faqAnimation.cancel();
  }

  item.style.height = startHeight;
  item.style.overflow = "hidden";

  item._faqAnimation = item.animate(
    { height: [startHeight, endHeight] },
    { duration: 280, easing: "ease" },
  );

  item._faqAnimation.onfinish = () => {
    onFaqAnimationFinish(item, false);
  };

  item._faqAnimation.oncancel = () => {
    item.dataset.isClosing = "false";
  };
}

function openFaqItem(item) {
  const summary = item.querySelector("summary");
  if (!summary) return;

  item.dataset.isClosing = "false";
  item.dataset.isExpanding = "true";

  const startHeight = `${summary.offsetHeight}px`;
  item.style.height = startHeight;
  item.style.overflow = "hidden";

  if (item._faqAnimation) {
    item._faqAnimation.cancel();
  }

  item.open = true;
  const endHeight = `${item.scrollHeight}px`;

  window.requestAnimationFrame(() => {
    item._faqAnimation = item.animate(
      { height: [startHeight, endHeight] },
      { duration: 320, easing: "ease" },
    );

    item._faqAnimation.onfinish = () => {
      onFaqAnimationFinish(item, true);
    };

    item._faqAnimation.oncancel = () => {
      item.dataset.isExpanding = "false";
    };
  });
}

function onFaqAnimationFinish(item, isOpen) {
  item.open = isOpen;
  item._faqAnimation = null;
  item.dataset.isClosing = "false";
  item.dataset.isExpanding = "false";
  item.style.height = "";
  item.style.overflow = "";
}

/* ---------- Scroll to top button ---------- */
function initScrollTopButton() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (!scrollTopBtn) return;

  const toggleVisibility = () => {
    scrollTopBtn.classList.toggle("visible", window.scrollY > 420);
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Scroll-triggered animations ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll("[data-aos]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger animation for sibling elements
          const siblings =
            entry.target.parentElement.querySelectorAll("[data-aos]");
          const i = Array.from(siblings).indexOf(entry.target);
          const delay = i * AOS_STAGGER_DELAY_MS;

          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  elements.forEach((el) => observer.observe(el));
}

/* ---------- Counter animations ---------- */
function initCounterAnimations() {
  const counters = document.querySelectorAll(".stat-number[data-target]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = COUNTER_ANIMATION_DURATION_MS;
  const start = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutExpo(progress) * target);

    el.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      // Add "+" suffix for larger numbers
      el.textContent =
        target >= 10 ? target.toLocaleString() + "+" : target.toLocaleString();
    }
  }

  requestAnimationFrame(tick);
}

/* ---------- Smooth scrolling for anchor links ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById("navbar")?.offsetHeight || 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
}
