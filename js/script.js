// DOM Elements
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
const menuBackdrop = document.querySelector(".menu-backdrop");
const scrollBtn = document.querySelector(".scroll-button a");
const contactForm = document.getElementById("contactForm");
const currentYearSpan = document.getElementById("currentYear");

// Initialize everything
document.addEventListener("DOMContentLoaded", function () {
  console.log("Portfolio website loaded successfully!");

  // Set current year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Mobile Menu Toggle
  if (menuBtn) {
    menuBtn.addEventListener("click", toggleMobileMenu);
  }

  // Close menu on backdrop click
  if (menuBackdrop) {
    menuBackdrop.addEventListener("click", closeMobileMenu);
  }

  // Close menu on link click
  document.querySelectorAll(".menu a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Scroll to top button visibility
  window.addEventListener("scroll", handleScroll);

  // Smooth scrolling
  setupSmoothScrolling();

  // Form handling
  if (contactForm) {
    setupFormValidation();
  }

  // Initialize animations on scroll
  setupScrollAnimations();
});

// Mobile Menu Functions
function toggleMobileMenu() {
  menu.classList.toggle("active");
  menuBtn.classList.toggle("active");
  document.body.style.overflow = menu.classList.contains("active")
    ? "hidden"
    : "auto";

  if (menu.classList.contains("active")) {
    menuBackdrop.style.display = "block";
  } else {
    menuBackdrop.style.display = "none";
  }
}

function closeMobileMenu() {
  menu.classList.remove("active");
  menuBtn.classList.remove("active");
  document.body.style.overflow = "auto";
  menuBackdrop.style.display = "none";
}

// Scroll Functions
function handleScroll() {
  // Show/hide scroll to top button
  if (scrollBtn) {
    scrollBtn.classList.toggle("visible", window.pageYOffset > 300);
  }
}

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (targetId === "#" || targetId === "#home") {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      if (targetId.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const navHeight = document.querySelector(".site-header").offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          closeMobileMenu();
        }
      }
    });
  });
}

// Form Handling
function setupFormValidation() {
  const submitBtn = contactForm.querySelector("#submitBtn");

  // Input validation on blur
  contactForm.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("blur", () => validateInput(input));
    input.addEventListener("input", () => clearInputError(input));
  });

  // Form submission
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    contactForm.querySelectorAll("input, textarea").forEach((input) => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showMessage("Please fill in all required fields correctly.", "error");
      return;
    }

    // Disable submit button and show loading
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.classList.add("sending");
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      // Prepare form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        access_key: "e3d24b5f-b54e-4797-86af-97dcf57ccd3e", // Replace with your key
        botcheck: "", // Honeypot field
      };

      // Submit to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showMessage(
          "Thank you for your message! I'll get back to you soon.",
          "success"
        );
        this.reset();
      } else {
        showMessage("Failed to send message. Please try again.", "error");
        console.error("Form submission error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      showMessage(
        "Network error. Please check your connection and try again.",
        "error"
      );
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.classList.remove("sending");
      submitBtn.innerHTML = originalText;
    }
  });
}

function validateInput(input) {
  const errorElement = document.getElementById(`${input.id}Error`);

  if (!errorElement) return true;

  // Clear previous error
  errorElement.textContent = "";
  input.classList.remove("error");

  // Check required fields
  if (input.hasAttribute("required") && !input.value.trim()) {
    errorElement.textContent = "This field is required";
    input.classList.add("error");
    return false;
  }

  // Email validation
  if (input.type === "email" && input.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      errorElement.textContent = "Please enter a valid email address";
      input.classList.add("error");
      return false;
    }
  }

  return true;
}

function clearInputError(input) {
  const errorElement = document.getElementById(`${input.id}Error`);
  if (errorElement) {
    errorElement.textContent = "";
    input.classList.remove("error");
  }
}

function showMessage(text, type) {
  const messageEl = document.getElementById("formMessage");
  if (!messageEl) return;

  // Clear previous messages
  messageEl.innerHTML = "";

  // Create message content
  const messageContent = document.createElement("div");
  messageContent.className = `message-content ${type}`;
  messageContent.innerHTML = `
        <div class="message-icon">
            <i class="fas ${
              type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }"></i>
        </div>
        <div class="message-text">
            <strong>${type === "success" ? "Success!" : "Error!"}</strong>
            <p>${text}</p>
        </div>
        <button class="message-close" onclick="hideMessage()">
            <i class="fas fa-times"></i>
        </button>
    `;

  messageEl.appendChild(messageContent);
  messageEl.className = `form-message ${type}`;
  messageEl.style.display = "block";

  // Scroll to message
  messageEl.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      hideMessage();
    }, 5000);
  }
}

// Global function to hide messages
window.hideMessage = function () {
  const messageEl = document.getElementById("formMessage");
  if (messageEl) {
    messageEl.style.display = "none";
  }
};

// Scroll Animations
function setupScrollAnimations() {
  // Create Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(".project-item, .detail-item, .contact-item")
    .forEach((el) => {
      observer.observe(el);
    });
}

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  // Close menu on Escape key
  if (e.key === "Escape" && menu.classList.contains("active")) {
    closeMobileMenu();
  }

  // Focus trap for mobile menu
  if (menu.classList.contains("active") && e.key === "Tab") {
    const focusableElements = menu.querySelectorAll(
      "a, button, input, textarea"
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
});

// Performance optimization: Lazy load images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    imageObserver.observe(img);
  });
}

// Add loading state for page
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
