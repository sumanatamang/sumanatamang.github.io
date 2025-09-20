// DOM Elements
const body = document.body;
const nav = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const menu = document.querySelector('.menu');
const scrollBtn = document.querySelector('.scroll-button a');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');

// Sticky Navigation
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Sticky nav
    if (scrollY > 100) {
        nav.classList.add('scrolled');
        scrollBtn.classList.add('active');
    } else {
        nav.classList.remove('scrolled');
        scrollBtn.classList.remove('active');
    }
});

// Mobile Menu Toggle
menuBtn.addEventListener('click', () => {
    menu.classList.add('active');
    body.style.overflow = 'hidden';
});

cancelBtn.addEventListener('click', () => {
    menu.classList.remove('active');
    body.style.overflow = 'auto';
});

// Close menu when clicking on links
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
        body.style.overflow = 'auto';
    });
});

// Dark/Light Mode Toggle
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    }
});

// Form validation and submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset previous messages
    formResponse.textContent = '';
    formResponse.className = 'form-response';

    // Get form values
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    // Validate form
    let isValid = true;

    // Name validation
    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    } else {
        clearError(name);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
    } else {
        clearError(email);
    }

    // Subject validation
    if (!subject.value.trim()) {
        showError(subject, 'Subject is required');
        isValid = false;
    } else {
        clearError(subject);
    }

    // Message validation
    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    } else {
        clearError(message);
    }

    // If form is valid, simulate submission
    if (isValid) {
        // In a real application, you would send this data to a server
        formResponse.textContent = 'Thank you for your message! I will get back to you soon.';
        formResponse.classList.add('success');

        // Reset form
        contactForm.reset();

        // Clear message after 5 seconds
        setTimeout(() => {
            formResponse.textContent = '';
            formResponse.className = 'form-response';
        }, 5000);
    }
});

// Helper functions for form validation
function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    errorElement.textContent = message;
    input.style.borderColor = '#e74c3c';
}

function clearError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    errorElement.textContent = '';
    input.style.borderColor = '#ddd';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = nav.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
    console.log('Portfolio website loaded successfully!');
});

// python -m http.server 5500