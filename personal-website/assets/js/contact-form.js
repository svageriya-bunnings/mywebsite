// filepath: personal-website/assets/js/contact-form.js

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactStatus = document.getElementById('contactStatus');

    contactForm.onsubmit = function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Simulate form submission (replace with actual API call)
        if (validateForm(data)) {
            contactStatus.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent.';
            contactForm.reset();
        } else {
            contactStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all fields correctly.';
        }

        setTimeout(() => {
            contactStatus.innerHTML = '';
        }, 3000);
    };

    function validateForm(data) {
        return data.name && data.email && data.message && validateEmail(data.email);
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});