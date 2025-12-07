// DOM Elements
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
const scrollBtn = document.querySelector(".scroll-button a");

// Mobile Menu Toggle
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    menu.classList.add("active");
    document.body.style.overflow = "hidden";
  });
}

// Close menu when clicking on links
document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
    document.body.style.overflow = "auto";
  });
});

// Scroll to top button
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollBtn.classList.add("visible");
  } else {
    scrollBtn.classList.remove("visible");
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navHeight = document.querySelector(".site-header").offsetHeight;
      const targetPosition = targetElement.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Close mobile menu if open
      menu.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio website loaded successfully!");
});
