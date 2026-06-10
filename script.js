document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       THEME MANAGEMENT (LIGHT / DARK)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
            // Update title
            const activeLang = localStorage.getItem('lang') || 'en';
            themeToggleBtn.title = activeLang === 'en' ? 'Switch to Light Mode' : 'Passer au mode clair';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            const activeLang = localStorage.getItem('lang') || 'en';
            themeToggleBtn.title = activeLang === 'en' ? 'Switch to Dark Mode' : 'Passer au mode sombre';
        }
    }

    /* ==========================================================================
       BILINGUAL TRANSLATION ENGINE (EN / FR)
       ========================================================================== */
    const langSwitchBtn = document.getElementById('lang-switch');
    const langText = langSwitchBtn.querySelector('.lang-text');
    
    // Load persisted language or default to 'fr' (since user asked in Darija/French context, FR/EN is ideal)
    let currentLang = localStorage.getItem('lang') || 'en';
    
    setLanguage(currentLang);
    
    langSwitchBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'fr' : 'en';
        setLanguage(nextLang);
    });
    
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        
        // Update language attribute on HTML tag
        htmlElement.setAttribute('lang', lang);
        
        // Toggle active language text on the button
        langText.textContent = lang === 'en' ? 'FR' : 'EN';
        
        // Translate HTML Elements
        const elementsToTranslate = document.querySelectorAll('[data-en], [data-fr]');
        elementsToTranslate.forEach(elem => {
            const translation = elem.getAttribute(`data-${lang}`);
            if (translation) {
                // If it's a child structure with HTML elements, we might want to preserve structure,
                // but since these are text fragments, textContent is safer.
                // However, we support rich HTML inside some paragraphs, let's check.
                if (elem.children.length === 0) {
                    elem.textContent = translation;
                } else {
                    // Save children, update text, but in our case, elements are either pure text or structural.
                    // If structural, we put text translations in spans. Let's write textContent safely.
                    elem.textContent = translation;
                }
            }
        });
        
        // Translate placeholders
        const inputsToTranslate = document.querySelectorAll('[data-en-placeholder], [data-fr-placeholder]');
        inputsToTranslate.forEach(input => {
            const placeholder = input.getAttribute(`data-${lang}-placeholder`);
            if (placeholder) {
                input.placeholder = placeholder;
            }
        });
        
        // Translate custom titles
        const titlesToTranslate = document.querySelectorAll('[data-en-title], [data-fr-title]');
        titlesToTranslate.forEach(elem => {
            const title = elem.getAttribute(`data-${lang}-title`);
            if (title) {
                elem.title = title;
            }
        });
        
        // Update typing text array to match language
        resetTypingAnimation();
        
        // Update theme toggle tooltip based on theme and language
        const currentTheme = htmlElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            themeToggleBtn.title = lang === 'en' ? 'Switch to Light Mode' : 'Passer au mode clair';
        } else {
            themeToggleBtn.title = lang === 'en' ? 'Switch to Dark Mode' : 'Passer au mode sombre';
        }
    }

    /* ==========================================================================
       DYNAMIC TYPEWRITER EFFECT
       ========================================================================== */
    const typingElement = document.getElementById('typing-element');
    
    const wordsEN = ['Web Developer', 'Digital Development Graduate', 'Python & Java Enthusiast', 'Creative Builder'];
    const wordsFR = ['Développeur Web', 'Lauréat en Développement Digital', 'Passionné Python & Java', 'Concepteur Créatif'];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimer = null;
    
    function resetTypingAnimation() {
        if (typingTimer) clearTimeout(typingTimer);
        wordIndex = 0;
        charIndex = 0;
        isDeleting = false;
        typeEffect();
    }
    
    function typeEffect() {
        const words = currentLang === 'en' ? wordsEN : wordsFR;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add character
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 40 : 80;
        
        if (!isDeleting && charIndex === currentWord.length) {
            // Word completed, pause before deleting
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Word deleted, move to next
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        
        typingTimer = setTimeout(typeEffect, typeSpeed);
    }

    /* ==========================================================================
       STICKY NAVBAR & SCROLL SPY
       ========================================================================== */
    const header = document.querySelector('.navbar-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
        
        // Scroll Spy (Active nav link highlight)
        let scrollPosition = window.scrollY + 120; // Offset for navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const hamburgerIcon = mobileToggle.querySelector('i');
    
    mobileToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        
        // Switch menu icons
        if (isOpen) {
            hamburgerIcon.className = 'fa-solid fa-xmark';
        } else {
            hamburgerIcon.className = 'fa-solid fa-bars';
        }
    });
    
    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            hamburgerIcon.className = 'fa-solid fa-bars';
        });
    });

    /* ==========================================================================
       CONTACT FORM SUBMISSION (MOCK DB + NOTIFICATION)
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const successToast = document.getElementById('success-toast');
    
    // Set current year in footer automatically
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Create message object
        const newMessage = {
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        };
        
        // Save to LocalStorage mock database
        let messages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];
        messages.push(newMessage);
        localStorage.setItem('portfolio_messages', JSON.stringify(messages));
        
        // Reset the form inputs
        contactForm.reset();
        
        // Show success notification
        showNotification();
    });
    
    function showNotification() {
        successToast.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 5000);
    }
});
