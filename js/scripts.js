document.addEventListener("DOMContentLoaded", function () {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Highlight active nav link on scroll
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav_links a");

    window.addEventListener("scroll", () => {
        let current = "";
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 130; // offset for fixed header
            if (scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            link.removeAttribute("aria-current");

            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
    });

    // AJAX Contact Form Handling
    const contactForm = document.getElementById("contactForm");
    const responseMessage = document.getElementById("formResponse");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);

            fetch("contact.php", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.text())
                .then((data) => {
                    responseMessage.textContent = data;
                    responseMessage.style.color = "green";
                    contactForm.reset();
                })
                .catch((error) => {
                    responseMessage.textContent = "Something went wrong. Please try again.";
                    responseMessage.style.color = "red";
                });
        });
    }
});
