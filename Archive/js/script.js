// js/script.js

// Try to load profile image with fallbacks
document.addEventListener('DOMContentLoaded', function() {
    const profileImg = document.getElementById('profile-photo');
    const imagePaths = [
        'images/profile-photo.jpg',
        'images/profile-photo.jpeg',
        'images/profile-photo.png',
        'images/profile.jpg',
        'images/profile.png',
        'images/avatar.jpg',
        'images/avatar.png'
    ];

    // Try each path until one works
    function tryLoadImage(paths, index) {
        if (index >= paths.length) {
            console.log("Could not load profile image. Using placeholder.");
            return;
        }

        const tempImg = new Image();
        tempImg.onload = function() {
            profileImg.src = paths[index];
            profileImg.classList.add('animate__animated', 'animate__fadeIn');
        };
        tempImg.onerror = function() {
            tryLoadImage(paths, index + 1);
        };
        tempImg.src = paths[index];
    }

    tryLoadImage(imagePaths, 0);

    // Initialize theme
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = localStorage.getItem("theme");
    
    if (currentTheme === "light") {
        document.body.classList.add("light-theme");
        document.getElementById('themeToggler').innerHTML = '<i class="fas fa-moon"></i>';
    } else if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        document.getElementById('themeToggler').innerHTML = '<i class="fas fa-sun"></i>';
    } else if (prefersDarkScheme.matches) {
        document.body.classList.add("dark-theme");
        document.getElementById('themeToggler').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.add("light-theme");
        document.getElementById('themeToggler').innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Visitor count
let counter = localStorage.getItem('visitorCount') ? parseInt(localStorage.getItem('visitorCount')) : 0;
document.getElementById('visitorCount').innerText = "Visitor Count: " + counter;

// Like button functionality
document.getElementById('like').addEventListener('click', function() {
    counter++;
    document.getElementById('visitorCount').innerText = "Visitor Count: " + counter;
    localStorage.setItem('visitorCount', counter);
    
    // Add animation
    this.classList.add('like-animation');
    this.classList.add('liked');
    document.getElementById('likeText').innerText = 'Liked!';
    
    setTimeout(() => {
        this.classList.remove('like-animation');
    }, 500);
});

// Contact modal functionality
function showContactForm() {
    document.getElementById('contactModal').style.display = 'flex';
}

function hideContactForm() {
    document.getElementById('contactModal').style.display = 'none';
    document.getElementById('contactStatus').textContent = '';
    document.getElementById('contactForm').reset();
}

document.getElementById('contactForm').onsubmit = function(e) {
    e.preventDefault();
    // Simulate sending (replace with real backend/email API if needed)
    document.getElementById('contactStatus').innerHTML = '<i class="fas fa-check-circle"></i> Thank you! I\'ll get back to you soon.';
    setTimeout(hideContactForm, 2000);
};

// Resume Download (replace with your actual PDF file)
function downloadResume() {
    // Simulate download delay with feedback
    const btn = document.querySelector('.download-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    
    setTimeout(() => {
        window.open('https://github.com/svageriya-bunnings/mywebsite/raw/main/SahilVageriya_Resume.pdf', '_blank');
        btn.innerHTML = originalText;
    }, 800);
}

// Theme toggler
function toggleTheme() {
    if (document.body.classList.contains("light-theme")) {
        document.body.classList.replace("light-theme", "dark-theme");
        document.getElementById('themeToggler').innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.replace("dark-theme", "light-theme");
        document.getElementById('themeToggler').innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem("theme", "light");
    }
}

// Skills data with icons
const skillsData = [
    { name: "DevOps", icon: "fas fa-server" },
    { name: "Azure", icon: "fab fa-microsoft" },
    { name: "CI/CD", icon: "fas fa-code-branch" },
    { name: "Linux", icon: "fab fa-linux" },
    { name: "Bash", icon: "fas fa-terminal" },
    { name: "Python", icon: "fab fa-python" },
    { name: "Docker", icon: "fab fa-docker" },
    { name: "Kubernetes", icon: "fas fa-dharmachakra" },
    { name: "GitHub Actions", icon: "fab fa-github" },
    { name: "Monitoring", icon: "fas fa-chart-line" },
    { name: "Automation", icon: "fas fa-robot" },
    { name: "GenAI", icon: "fas fa-brain" },
    { name: "Azure AI Studio", icon: "fas fa-microchip" }
];

// Experience data
const experienceData = [
    {
        date: "2022",
        title: "Tech Support Specialist",
        description: "Started my tech career providing technical support and troubleshooting solutions."
    },
    {
        date: "2023",
        title: "Transition to DevOps Team",
        description: "Moved into DevOps focusing on automation, CI/CD pipelines, and infrastructure management."
    },
    {
        date: "2024",
        title: "Trainee (Secondment) – DevOps",
        description: "Currently in a secondment role further developing skills in cloud technologies and automation."
    },
    {
        date: "2024",
        title: "Microsoft Azure AI Studio Training",
        description: "Completed specialized training in GenAI technologies using Microsoft Azure AI Studio."
    }
];

// Populate Skills
const skillsList = document.getElementById('skillsList');
skillsData.forEach(skill => {
    const li = document.createElement('li');
    li.className = 'skill-tag';
    li.innerHTML = `<i class="${skill.icon}"></i> ${skill.name}`;
    skillsList.appendChild(li);
});

// Populate Experience Timeline
const expTimeline = document.getElementById('expTimeline');
const timeline = document.createElement('div');
timeline.className = 'timeline';

experienceData.forEach(exp => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    item.innerHTML = `
        <div class="timeline-date">${exp.date}</div>
        <div class="timeline-title">${exp.title}</div>
        <div class="timeline-description">${exp.description}</div>
    `;
    
    timeline.appendChild(item);
});

expTimeline.appendChild(timeline);

// Add scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__fadeIn');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-card').forEach(card => {
    observer.observe(card);
});