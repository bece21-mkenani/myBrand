// ====================== GLOBAL VARIABLES ======================
const menuBtn = document.querySelector("#menu-btn");
const navbar = document.querySelector(".navbar");
const themeToggle = document.querySelector("#theme-toggle");
const overlay = document.getElementById("overlay-content");
const htmlElement = document.documentElement;

// ================== HEADER & NAVIGATION LOGIC ===================
if (menuBtn) {
  menuBtn.onclick = () => {
    menuBtn.classList.toggle("fa-times");
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  };
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (navbar && navbar.classList.contains("active")) {
      if (menuBtn) menuBtn.classList.remove("fa-times");
      navbar.classList.remove("active");
    }
  });
});

// ================== THEME SWITCHER LOGIC (GLOBAL) ================
function setTheme(theme) {
  htmlElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const icon = themeToggle ? themeToggle.querySelector("i") : null;
  if (icon) {
    if (theme === "dark") {
      icon.className = "fa-sharp fa-regular fa-sun";
    } else {
      icon.className = "fas fa-moon";
    }
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });
}

// ====================== UTILITIES & INITIAL LOAD  ======================

function updateCopyrightYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ====================== CONTACT PAGE LOGIC ===============================

function initializeContactPageLogic() {
  const contactForm = document.getElementById("contactForm");
  const statusMessage = document.getElementById("form-status");
  if (contactForm && statusMessage && typeof emailjs !== "undefined") {
    const SERVICE_ID = "service_gxy1e71";
    const TEMPLATE_ID = "template_yabdqmc";
    const PUBLIC_KEY = "nETHO07LmeR5AOe1m";
    emailjs.init(PUBLIC_KEY);

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      statusMessage.textContent = "Sending message...";
      statusMessage.className = "form-status-message info";
      const templateParams = {
        title: contactForm.subject.value,
        name: contactForm.from_name.value,
        message: contactForm.message.value,
        email: contactForm.from_email.value,
      };

      emailjs
        .send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(
          function (response) {
            statusMessage.textContent =
              "Thank you! Your message has been sent successfully.";
            statusMessage.className = "form-status-message success";
            contactForm.reset();

            console.log("SUCCESS!", response.status, response.text);
          },
          function (error) {
            statusMessage.textContent =
              "Error: Failed to send message. Please check the console for details.";
            statusMessage.className = "form-status-message error";
            console.error("EmailJS Error:", error);
          }
        )
        .finally(() => {
          setTimeout(() => {
            statusMessage.textContent = "";
            statusMessage.className = "form-status-message";
          }, 5000);
        });
    });
  } else if (contactForm) {
    console.error(
      "EmailJS SDK is not loaded. Cannot initialize contact logic."
    );
    if (statusMessage) {
      statusMessage.textContent =
        "Warning: Email service not initialized. Check internet connection.";
      statusMessage.className = "form-status-message error";
    }
  }
}

// ====================== SKILLS PAGE LOGIC ======================

const counters = document.querySelectorAll(".counter");
const statsWrapper = document.querySelector(".stats-wrapper");
let countingStarted = false;

const animateCounter = (counter) => {
  const target = +counter.getAttribute("data-target");
  let count = 0;

  const duration = 2000;
  const increment = target / (duration / 16);

  const updateCount = () => {
    count += increment;

    if (count < target) {
      counter.innerText = Math.floor(count);
      requestAnimationFrame(updateCount);
    } else {
      counter.innerText = target;
    }
  };

  requestAnimationFrame(updateCount);
};

const options = {
  root: null,
  threshold: 0.5,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !countingStarted) {
      counters.forEach(animateCounter);
      countingStarted = true;
      observer.unobserve(entry.target);
    }
  });
}, options);

function initializeSkillsPageLogic() {
  if (statsWrapper) {
    observer.observe(statsWrapper);
  }
}

// ====================== PROJECTS PAGE LOGIC ======================

function initializeProjectsPageLogic() {
  console.log("Projects page initialized.");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCopyrightYear();
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
  initializeContactPageLogic();
  initializeSkillsPageLogic();
  initializeProjectsPageLogic(); 
});
