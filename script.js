// // ============================================================================
// // SECURE EMAILJS CONFIGURATION
// // ============================================================================

// // ⚠️ IMPORTANT: Replace these with your actual credentials
// const EMAILJS_CONFIG = {
//     publicKey: '-xBu5ermR631HAYER',        // Replace with your EmailJS public key
//     serviceId: 'service_zvh9tia',        // Replace with your EmailJS service ID  
//     templateId: 'template_u4ari0e'       // Replace with your EmailJS template ID
// };

// // ⚠️ IMPORTANT: Replace with your reCAPTCHA Site Key
// const RECAPTCHA_SITE_KEY = '6LeUFs4rAAAAAJ2VJGrd_-j280dmTeWZWQwMsTTb';

// // Security configuration
// const SECURITY_CONFIG = {
//     maxSubmissions: 3,              // Max submissions per session
//     rateLimitWindow: 60000,         // 1 minute in milliseconds
//     minTimeBetweenSubmissions: 3000 // 3 seconds minimum between submissions
// };

// // Session storage for rate limiting (resets on page refresh)
// let submissionCount = 0;
// let lastSubmissionTime = 0;

// // ============================================================================
// // INITIALIZATION
// // ============================================================================

// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize EmailJS
//     initializeEmailJS();
    
//     // Set timestamp for form load time (anti-bot measure)
//     document.getElementById('timestamp').value = Date.now();
    
//     // Initialize all other functionality
//     initializeMobileMenu();
//     initializeSmoothScrolling();
//     initializeAnimations();
//     initializeHeaderScrollEffect();
//     initializeContactForm();
//     initializeCardAnimations();
//     initializeTypingEffect();
// });

// // ============================================================================
// // EMAILJS INITIALIZATION
// // ============================================================================

// function initializeEmailJS() {
//     try {
//         // Initialize EmailJS with public key
//         emailjs.init(EMAILJS_CONFIG.publicKey);
//         console.log('EmailJS initialized successfully');
//     } catch (error) {
//         console.error('Failed to initialize EmailJS:', error);
//     }
// }

// // ============================================================================
// // SECURE FORM HANDLING
// // ============================================================================

// function initializeContactForm() {
//     const contactForm = document.getElementById('contact-form');
//     const submitBtn = document.getElementById('submit-btn');
//     const formStatus = document.getElementById('form-status');
    
//     if (!contactForm) return;
    
//     contactForm.addEventListener('submit', async function(e) {
//         e.preventDefault();
        
//         // Security checks
//         if (!passSecurityChecks(this)) {
//             return;
//         }
        
//         // Prepare form data
//         const formData = prepareFormData(this);
        
//         // Show loading state
//         showLoadingState(submitBtn, formStatus);
        
//         try {
//             // Send email via EmailJS
//             await sendSecureEmail(formData);
            
//             // Show success state
//             showSuccessState(submitBtn, formStatus);
            
//             // Reset form after delay
//             setTimeout(() => {
//                 resetForm(contactForm, submitBtn, formStatus);
//             }, 3000);
            
//         } catch (error) {
//             console.error('Email send failed:', error);
//             showErrorState(submitBtn, formStatus, error.message);
            
//             // Reset form after delay
//             setTimeout(() => {
//                 resetFormError(submitBtn, formStatus);
//             }, 5000);
//         }
//     });
// }

// // ============================================================================
// // SECURITY CHECKS
// // ============================================================================

// function passSecurityChecks(form) {
//     const currentTime = Date.now();
//     const formLoadTime = parseInt(form.timestamp.value);
//     const honeypot = form.honeypot.value;
    
//     // 1. Honeypot check (bot detection)
//     if (honeypot.trim() !== '') {
//         console.log('Security: Honeypot triggered');
//         return false;
//     }
    
//     // 2. Form fill time check (prevent instant submissions)
//     if (currentTime - formLoadTime < 5000) { // 5 seconds minimum
//         showError('Please take a moment to review your message before sending.');
//         return false;
//     }
    
//     // 3. Rate limiting check
//     if (submissionCount >= SECURITY_CONFIG.maxSubmissions) {
//         showError('Maximum submissions reached. Please refresh the page to continue.');
//         return false;
//     }
    
//     // 4. Time between submissions check
//     if (currentTime - lastSubmissionTime < SECURITY_CONFIG.minTimeBetweenSubmissions) {
//         showError('Please wait a moment before sending another message.');
//         return false;
//     }
    
//     // 5. Input validation
//     if (!validateFormInputs(form)) {
//         return false;
//     }
    
//     // Update submission tracking
//     submissionCount++;
//     lastSubmissionTime = currentTime;
    
//     return true;
// }

// function validateFormInputs(form) {
//     const name = form.from_name.value.trim();
//     const email = form.reply_to.value.trim();
//     const subject = form.subject.value.trim();
//     const message = form.message.value.trim();
    
//     // Basic validation
//     if (!name || !email || !subject || !message) {
//         showError('Please fill in all required fields.');
//         return false;
//     }
    
//     // Email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         showError('Please enter a valid email address.');
//         return false;
//     }
    
//     // Content length validation
//     if (name.length > 100 || email.length > 100 || subject.length > 150 || message.length > 2000) {
//         showError('One or more fields exceed the maximum length limit.');
//         return false;
//     }
    
//     // Basic spam detection
//     const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations'];
//     const fullText = (name + ' ' + subject + ' ' + message).toLowerCase();
    
//     for (const keyword of spamKeywords) {
//         if (fullText.includes(keyword)) {
//             console.log('Security: Spam keywords detected');
//             return false;
//         }
//     }
    
//     return true;
// }

// // ============================================================================
// // EMAIL SENDING
// // ============================================================================

// function prepareFormData(form) {
//     return {
//         from_name: sanitizeInput(form.from_name.value.trim()),
//         reply_to: sanitizeInput(form.reply_to.value.trim()),
//         subject: sanitizeInput(form.subject.value.trim()),
//         message: sanitizeInput(form.message.value.trim()),
//         timestamp: new Date().toISOString(),
//         user_agent: navigator.userAgent.substring(0, 100) // Limited for privacy
//     };
// }

// function sanitizeInput(input) {
//     // Remove potentially dangerous characters
//     return input.replace(/[<>\"']/g, '');
// }

// async function sendSecureEmail(formData) {
//     try {
//         // Get reCAPTCHA token first
//         const recaptchaToken = await getReCaptchaToken();
        
//         // Add reCAPTCHA token to form data
//         formData.recaptcha_token = recaptchaToken;
        
//         const response = await emailjs.send(
//             EMAILJS_CONFIG.serviceId,
//             EMAILJS_CONFIG.templateId,
//             formData
//         );
        
//         if (response.status === 200) {
//             console.log('Email sent successfully:', response);
//             return response;
//         } else {
//             throw new Error('Email service returned error status');
//         }
//     } catch (error) {
//         console.error('EmailJS error:', error);
        
//         // Check if it's a reCAPTCHA error
//         if (error.message.includes('recaptcha')) {
//             throw new Error('Security verification failed. Please try again.');
//         } else {
//             throw new Error('Failed to send email. Please try again later.');
//         }
//     }
// }

// // ============================================================================
// // RECAPTCHA INTEGRATION
// // ============================================================================

// async function getReCaptchaToken() {
//     try {
//         // Wait for reCAPTCHA to be ready
//         await waitForRecaptcha();
        
//         // Execute reCAPTCHA and get token
//         const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
//             action: 'contact_form'
//         });
        
//         console.log('reCAPTCHA token obtained successfully');
//         return token;
        
//     } catch (error) {
//         console.error('reCAPTCHA error:', error);
//         throw new Error('Security verification failed. Please refresh the page and try again.');
//     }
// }

// function waitForRecaptcha() {
//     return new Promise((resolve, reject) => {
//         const maxAttempts = 50; // 5 seconds max wait
//         let attempts = 0;
        
//         const checkRecaptcha = () => {
//             attempts++;
            
//             if (typeof grecaptcha !== 'undefined' && grecaptcha.execute) {
//                 resolve();
//             } else if (attempts >= maxAttempts) {
//                 reject(new Error('reCAPTCHA failed to load'));
//             } else {
//                 setTimeout(checkRecaptcha, 100);
//             }
//         };
        
//         checkRecaptcha();
//     });
// }

// // ============================================================================
// // UI STATE MANAGEMENT
// // ============================================================================

// function showLoadingState(submitBtn, formStatus) {
//     submitBtn.disabled = true;
//     submitBtn.innerHTML = '<div class="loading-spinner"></div> Sending...';
    
//     formStatus.style.display = 'flex';
//     formStatus.innerHTML = `
//         <div class="loading-spinner"></div>
//         <span class="status-text">Sending your message securely...</span>
//     `;
// }

// function showSuccessState(submitBtn, formStatus) {
//     submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
//     submitBtn.style.background = 'var(--gradient-accent)';
    
//     formStatus.innerHTML = `
//         <i class="fas fa-check-circle" style="color: #10b981; font-size: 1.2rem;"></i>
//         <span class="status-text">Your message has been sent successfully!</span>
//     `;
// }

// function showErrorState(submitBtn, formStatus, errorMessage) {
//     submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Send Failed';
//     submitBtn.style.background = '#ef4444';
    
//     formStatus.innerHTML = `
//         <i class="fas fa-exclamation-circle" style="color: #ef4444; font-size: 1.2rem;"></i>
//         <span class="status-text">${errorMessage}</span>
//     `;
// }

// function showError(message) {
//     const formStatus = document.getElementById('form-status');
//     formStatus.style.display = 'flex';
//     formStatus.innerHTML = `
//         <i class="fas fa-exclamation-triangle" style="color: #f59e0b; font-size: 1.2rem;"></i>
//         <span class="status-text">${message}</span>
//     `;
    
//     setTimeout(() => {
//         formStatus.style.display = 'none';
//     }, 4000);
// }

// function resetForm(form, submitBtn, formStatus) {
//     form.reset();
//     document.getElementById('timestamp').value = Date.now(); // Reset timestamp
//     resetFormError(submitBtn, formStatus);
// }

// function resetFormError(submitBtn, formStatus) {
//     submitBtn.disabled = false;
//     submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
//     submitBtn.style.background = 'var(--gradient-primary)';
//     formStatus.style.display = 'none';
// }

// // ============================================================================
// // OTHER PORTFOLIO FUNCTIONALITY (unchanged from previous version)
// // ============================================================================

// function initializeMobileMenu() {
//     const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
//     const navLinks = document.querySelector('.nav-links');

//     mobileMenuBtn.addEventListener('click', function() {
//         navLinks.classList.toggle('active');
//         const icon = this.querySelector('i');
//         icon.classList.toggle('fa-bars');
//         icon.classList.toggle('fa-times');
//     });
// }

// function initializeSmoothScrolling() {
//     const navLinkItems = document.querySelectorAll('.nav-links a, .cta-button');

//     navLinkItems.forEach(link => {
//         link.addEventListener('click', function(e) {
//             if (this.getAttribute('target') === '_blank' || !this.getAttribute('href') || !this.getAttribute('href').startsWith('#')) {
//                 return;
//             }

//             e.preventDefault();
//             const targetId = this.getAttribute('href');
//             const targetSection = document.querySelector(targetId);
            
//             if (targetSection) {
//                 const navLinks = document.querySelector('.nav-links');
//                 const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                
//                 navLinks.classList.remove('active');
//                 const icon = mobileMenuBtn.querySelector('i');
//                 icon.classList.remove('fa-times');
//                 icon.classList.add('fa-bars');

//                 targetSection.scrollIntoView({
//                     behavior: 'smooth',
//                     block: 'start'
//                 });
//             }
//         });
//     });
// }

// function initializeAnimations() {
//     const observerOptions = {
//         threshold: 0.1,
//         rootMargin: '0px 0px -50px 0px'
//     };

//     const observer = new IntersectionObserver(function(entries) {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('visible');
//             }
//         });
//     }, observerOptions);

//     const fadeElements = document.querySelectorAll('.fade-in');
//     fadeElements.forEach(el => observer.observe(el));
// }

// function initializeHeaderScrollEffect() {
//     let lastScrollY = window.scrollY;
//     const header = document.querySelector('header');

//     window.addEventListener('scroll', function() {
//         const currentScrollY = window.scrollY;
        
//         if (currentScrollY > 100) {
//             header.style.transform = currentScrollY > lastScrollY ? 'translateY(-100%)' : 'translateY(0)';
//         } else {
//             header.style.transform = 'translateY(0)';
//         }
        
//         lastScrollY = currentScrollY;
//     });
// }

// function initializeCardAnimations() {
//     const cards = document.querySelectorAll('.skill-category, .achievement-card, .project-card, .post-card');
//     cards.forEach(card => {
//         card.addEventListener('mouseenter', function() {
//             this.style.transform = 'translateY(-5px) scale(1.02)';
//         });
        
//         card.addEventListener('mouseleave', function() {
//             this.style.transform = 'translateY(0) scale(1)';
//         });
//     });
// }

// function initializeTypingEffect() {
//     const subtitle = document.querySelector('.subtitle');
//     if (subtitle) {
//         const originalText = subtitle.textContent;
//         subtitle.textContent = '';
        
//         let i = 0;
//         const typeWriter = () => {
//             if (i < originalText.length) {
//                 subtitle.textContent += originalText.charAt(i);
//                 i++;
//                 setTimeout(typeWriter, 100);
//             }
//         };
        
//         setTimeout(typeWriter, 1000);
//     }
// }




// ===========================
// CONFIGURATION
// ===========================
const EMAILJS_CONFIG = {
  publicKey: "-xBu5ermR631HAYER",        // Replace with your EmailJS public key
  serviceId: "service_zvh9tia",        // Replace with your EmailJS service ID  
  templateId: "template_u4ari0e"       // e.g. "template_def456"
};

const RECAPTCHA_SITE_KEY = "6LeUFs4rAAAAAJ2VJGrd_-j280dmTeWZWQwMsTTb"; // same as in index.html

// ===========================
// INIT EMAILJS
// ===========================
if (window.emailjs && typeof emailjs.init === "function") {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

// ===========================
// MOBILE MENU TOGGLE
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const nav = document.querySelector("nav ul");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuBtn.classList.toggle("active");
    });
  }
});

// ===========================
// SMOOTH SCROLL FOR LINKS
// ===========================
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function (e) {
    const href = (this.getAttribute && this.getAttribute("href")) || "";
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// ===========================
// FADE-IN ON SCROLL
// ===========================
function handleFadeIn() {
  const faders = document.querySelectorAll(".fade-in");
  const triggerBottom = window.innerHeight * 0.85;

  faders.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", handleFadeIn);
window.addEventListener("load", handleFadeIn);

// ===========================
// CONTACT FORM HANDLER
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const statusBox = document.getElementById("form-status");
  const statusText = statusBox ? statusBox.querySelector(".status-text") : null;
  const submitBtn = document.getElementById("submit-btn");

  // set a timestamp (anti-spam)
  const tsInput = document.getElementById("timestamp");
  if (tsInput) tsInput.value = Date.now();

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (statusBox) {
      statusBox.style.display = "flex";
      if (statusText) statusText.textContent = "Verifying...";
    }
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    const templateParams = Object.fromEntries(formData.entries());

    // ensure reCAPTCHA is available
    if (window.grecaptcha && RECAPTCHA_SITE_KEY) {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
          .then(token => {
            templateParams["g-recaptcha-response"] = token;

            // send with EmailJS
            emailjs
              .send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
              )
              .then(() => {
                if (statusText) statusText.textContent = "Message sent — thank you!";
                form.reset();
              })
              .catch(err => {
                console.error("EmailJS error:", err);
                if (statusText)
                  statusText.textContent =
                    "Failed to send email. Please try again later.";
              })
              .finally(() => {
                if (statusBox)
                  setTimeout(() => (statusBox.style.display = "none"), 4000);
                if (submitBtn) submitBtn.disabled = false;
              });
          })
          .catch(err => {
            console.error("reCAPTCHA error:", err);
            if (statusText)
              statusText.textContent =
                "reCAPTCHA error. Please refresh and try again.";
            if (submitBtn) submitBtn.disabled = false;
          });
      });
    } else {
      console.warn("reCAPTCHA not available; cannot verify form submission.");
      if (statusText)
        statusText.textContent = "Security verification not available.";
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
