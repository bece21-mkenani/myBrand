// ====================== GLOBAL VARIABLES ======================
const menuBtn = document.querySelector('#menu-btn');
const navbar = document.querySelector('.navbar');
const themeToggle = document.querySelector('#theme-toggle');
const htmlElement = document.documentElement;

// ====================== 1. HEADER & NAVIGATION LOGIC (GLOBAL) ======================

/**
 * Toggle mobile menu open/close state
 */
if (menuBtn) {
    menuBtn.onclick = () => {
        menuBtn.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    };
}

/**
 * Close mobile menu when a navigation link is clicked
 * Only applies when menu is currently active (mobile view)
 */
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        // Only close the menu if it's currently open (on mobile)
        if (navbar && navbar.classList.contains('active')) {
            if (menuBtn) menuBtn.classList.remove('fa-times');
            navbar.classList.remove('active');
        }
    });
});


// ====================== 2. THEME SWITCHER LOGIC (GLOBAL) ======================

/**
 * Set theme and update icon accordingly
 * @param {string} theme - Theme to set ('dark' or 'light')
 */
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update the icon: Show the opposite icon of the current theme to signal the change option.
    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    if (icon) {
        if (theme === 'dark') {
            // Current theme is dark, show sun icon to switch to light mode
            icon.className = 'fas fa-sun'; 
        } else {
            // Current theme is light, show moon icon to switch to dark mode
            icon.className = 'fas fa-moon'; 
        }
    }
}

/**
 * Theme toggle click event listener
 * Switches between dark and light themes
 */
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}


// ====================== 3. UTILITIES & INITIAL LOAD (GLOBAL) ======================

/**
 * Update copyright year dynamically in the footer
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}


// ====================== 4. CONTACT PAGE LOGIC (EMAILJS IMPLEMENTATION) ======================

/**
 * Initializes form submission handling for the contact page, using EmailJS.
 */
function initializeContactPageLogic() {
    const contactForm = document.getElementById('contactForm');
    const statusMessage = document.getElementById('form-status');

    if (contactForm && statusMessage && typeof emailjs !== 'undefined') {
        
        // --- IMPORTANT: Replace with your actual EmailJS IDs ---
        // You MUST replace these placeholders after setting up EmailJS
    const SERVICE_ID = "service_gxy1e71";
    const TEMPLATE_ID = "template_yabdqmc";
    const PUBLIC_KEY = "nETHO07LmeR5AOe1m"; 
        // --- END IMPORTANT ---

        // Initialize EmailJS (call this once)
        emailjs.init(PUBLIC_KEY);

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 1. Show loading status
            statusMessage.textContent = 'Sending message...';
            statusMessage.className = 'form-status-message info';
            
            // 2. Prepare parameters from the form
            // Ensure these key names match the 'name' attributes in contact.html:
            const templateParams = {
        title: contactForm.subject.value,
        name: contactForm.from_name.value,
        message: contactForm.message.value,
        email: contactForm.from_email.value,
            };
            
            // 3. Send the email using the EmailJS API
            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(function(response) {
                    // Success case
                    statusMessage.textContent = 'Thank you! Your message has been sent successfully.';
                    statusMessage.className = 'form-status-message success';
                    contactForm.reset();
                    
                    console.log('SUCCESS!', response.status, response.text);

                }, function(error) {
                    // Error case
                    statusMessage.textContent = 'Error: Failed to send message. Please check the console for details.';
                    statusMessage.className = 'form-status-message error';
                    console.error('EmailJS Error:', error);
                })
                .finally(() => {
                    // 4. Clear status message after a brief display period
                    setTimeout(() => {
                        statusMessage.textContent = '';
                        statusMessage.className = 'form-status-message';
                    }, 5000);
                });
        });
    } else if (contactForm) {
        // Fallback if EmailJS SDK didn't load (e.g., no internet)
        console.error("EmailJS SDK is not loaded. Cannot initialize contact logic.");
        if (statusMessage) {
             statusMessage.textContent = 'Warning: Email service not initialized. Check internet connection.';
             statusMessage.className = 'form-status-message error';
        }
    }
}


// ====================== 5. SKILLS PAGE LOGIC (COUNTERS) ======================

const counters = document.querySelectorAll('.counter');
const statsWrapper = document.querySelector('.stats-wrapper'); 
let countingStarted = false; 

/**
 * Animate counter from 0 to target value
 * @param {Element} counter - The counter element to animate
 */
const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
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

/**
 * Intersection Observer configuration for stats animation
 */
const options = {
    root: null, 
    threshold: 0.5 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countingStarted) {
            counters.forEach(animateCounter);
            countingStarted = true;
            observer.unobserve(entry.target); 
        }
    });
}, options);

/**
 * Initializes the counter animation logic for the skills page.
 */
function initializeSkillsPageLogic() {
    // Check if the stats wrapper exists before observing (only runs on skills/about page)
    if (statsWrapper) {
        observer.observe(statsWrapper);
    }
}

// ====================== 6. PROJECTS PAGE LOGIC ======================

/**
 * Placeholder for any future project-specific JavaScript (e.g., filtering, carousel buttons).
 * Currently, responsiveness is handled by CSS Scroll Snap.
 */
function initializeProjectsPageLogic() {
    // No dedicated JS needed for CSS-based sliding, but the function exists for future features.
    console.log('Projects page initialized.');
}


// ====================== INITIALIZATION ======================

/**
 * Initialize page on DOM content loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // A. Run Global Utilities
    updateCopyrightYear();
    
    // B. Load saved theme (default to 'dark')
    const savedTheme = localStorage.getItem('theme') || 'dark'; 
    setTheme(savedTheme);

    // C. Initialize Page-Specific Logic
    initializeContactPageLogic();
    initializeSkillsPageLogic();
    initializeProjectsPageLogic(); // <-- New function call
});

