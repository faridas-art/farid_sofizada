document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a, .cta-button');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if the link is for an external site
            if (this.getAttribute('target') === '_blank') {
                return;
            }

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevents the page from reloading
            
            // Show an alert to the user
            alert("Thank you for your message! Please note this is a demo form and your message has not been sent.");

            // Optionally, you can clear the form
            this.reset();
        });
    }

});