// DOM Elements
const body = document.body;
const nav = document.querySelector(".site-header");
const menuBtn = document.querySelector(".menu-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const menu = document.querySelector(".menu");
const scrollBtn = document.querySelector(".scroll-button a");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const contactForm = document.getElementById("contactForm");
const formResponse = document.getElementById("formResponse");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectItems = document.querySelectorAll(".project-item");
const statNumbers = document.querySelectorAll(".stat-number");

// Sticky Navigation
window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  // Sticky nav
  if (scrollY > 100) {
    nav.classList.add("scrolled");
    scrollBtn.classList.add("active");
  } else {
    nav.classList.remove("scrolled");
    scrollBtn.classList.remove("active");
  }
});

// Mobile Menu Toggle
menuBtn.addEventListener("click", () => {
  menu.classList.add("active");
  body.style.overflow = "hidden";
});

cancelBtn.addEventListener("click", () => {
  menu.classList.remove("active");
  body.style.overflow = "auto";
});

// Close menu when clicking on links
document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
    body.style.overflow = "auto";
  });
});

// Dark/Light Mode Toggle
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  body.setAttribute("data-theme", "dark");
  themeIcon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
  if (body.getAttribute("data-theme") === "dark") {
    body.setAttribute("data-theme", "light");
    themeIcon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  } else {
    body.setAttribute("data-theme", "dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  }
});

// Project Filtering
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((b) => b.classList.remove("active"));
    // Add active class to clicked button
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    projectItems.forEach((item) => {
      if (
        filter === "all" ||
        item.getAttribute("data-category").includes(filter)
      ) {
        item.style.display = "block";
        setTimeout(() => {
          item.classList.remove("hidden");
        }, 50);
      } else {
        item.classList.add("hidden");
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  });
});

// Animate Statistics
function animateStats() {
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-count"));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(current);
    }, 16);
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("hero-stats")) {
        animateStats();
      }
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

// Form validation and submission
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Reset previous messages
  formResponse.textContent = "";
  formResponse.className = "form-response";

  // Get form values
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");

  // Validate form
  let isValid = true;

  // Name validation
  if (!name.value.trim()) {
    showError(name, "Name is required");
    isValid = false;
  } else {
    clearError(name);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showError(email, "Email is required");
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    showError(email, "Please enter a valid email");
    isValid = false;
  } else {
    clearError(email);
  }

  // Subject validation
  if (!subject.value.trim()) {
    showError(subject, "Subject is required");
    isValid = false;
  } else {
    clearError(subject);
  }

  // Message validation
  if (!message.value.trim()) {
    showError(message, "Message is required");
    isValid = false;
  } else {
    clearError(message);
  }

  // If form is valid, simulate submission
  if (isValid) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      formResponse.textContent =
        "Thank you for your message! I will get back to you soon.";
      formResponse.classList.add("success");
      contactForm.reset();

      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Clear message after 5 seconds
      setTimeout(() => {
        formResponse.textContent = "";
        formResponse.className = "form-response";
      }, 5000);
    }, 2000);
  }
});

// Helper functions for form validation
function showError(input, message) {
  const formGroup = input.parentElement;
  const errorElement = formGroup.querySelector(".error-message");
  errorElement.textContent = message;
  input.style.borderColor = "#e74c3c";
}

function clearError(input) {
  const formGroup = input.parentElement;
  const errorElement = formGroup.querySelector(".error-message");
  errorElement.textContent = "";
  input.style.borderColor = "#ddd";
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navHeight = nav.offsetHeight;
      const targetPosition = targetElement.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Typing effect for hero section
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Observe elements for animations
  const statsSection = document.querySelector(".hero-stats");
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Add loading animation
  document.body.classList.add("loaded");

  console.log("Portfolio website loaded successfully!");
});

// Add some interactive effects
document.addEventListener("mousemove", (e) => {
  const cursor = document.createElement("div");
  cursor.style.position = "fixed";
  cursor.style.width = "20px";
  cursor.style.height = "20px";
  cursor.style.backgroundColor = "rgba(196, 107, 79, 0.5)";
  cursor.style.borderRadius = "50%";
  cursor.style.pointerEvents = "none";
  cursor.style.zIndex = "9999";
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
  cursor.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(cursor);

  setTimeout(() => {
    cursor.remove();
  }, 100);
});
