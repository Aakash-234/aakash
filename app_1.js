// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize animations only if reduced motion is not preferred
    if (!prefersReducedMotion) {
        initializeAnimations();
    } else {
        // Simple fallback for reduced motion
        initializeReducedMotionFallback();
    }
    
    // Initialize non-animation features
    initializeMinimap();
    initializeCounters();
    initializeTypewriter();
    initializeContactAnimations();
});

function initializeAnimations() {
    // Set initial states
    gsap.set(".hero-content", { opacity: 0, y: 50 });
    gsap.set(".education-card", { opacity: 0, y: 50 });
    gsap.set(".startup-card", { opacity: 0, scale: 0.8 });
    gsap.set(".experience-card", { opacity: 0, y: 30 });
    gsap.set(".achievement-badge", { opacity: 0, rotationY: 45 });
    gsap.set(".skill-pill", { opacity: 0, scale: 0.8 });
    gsap.set(".contact-content", { opacity: 0, y: 30 });
    
    // Hero section animation
    gsap.timeline({ delay: 0.5 })
        .to(".hero-content", { 
            duration: 1, 
            opacity: 1, 
            y: 0, 
            ease: "power3.out" 
        })
        .to(".profile-photo", { 
            duration: 0.8, 
            scale: 1.05, 
            ease: "back.out(1.7)" 
        }, "-=0.5");
    
    // Education section animation
    ScrollTrigger.create({
        trigger: ".education-section",
        start: "top 80%",
        end: "bottom 20%",
        animation: gsap.timeline()
            .to(".education-card", { 
                duration: 1, 
                opacity: 1, 
                y: 0, 
                ease: "power3.out" 
            })
            .to(".bits-image", { 
                duration: 1.2, 
                scale: 1, 
                ease: "power2.out" 
            }, "-=0.5"),
        toggleActions: "play none none reverse"
    });
    
    // Startup section animation
    ScrollTrigger.create({
        trigger: ".startup-section",
        start: "top 80%",
        end: "bottom 20%",
        animation: gsap.timeline()
            .to(".startup-card", { 
                duration: 1, 
                opacity: 1, 
                scale: 1, 
                ease: "back.out(1.7)" 
            })
            .to(".stat-item", { 
                duration: 0.6, 
                y: 0, 
                opacity: 1, 
                stagger: 0.2, 
                ease: "power2.out" 
            }, "-=0.5"),
        toggleActions: "play none none reverse",
        onEnter: () => animateCounters()
    });
    
    // Experience section animation
    ScrollTrigger.create({
        trigger: ".experience-section",
        start: "top 80%",
        end: "bottom 20%",
        animation: gsap.to(".experience-card", { 
            duration: 0.8, 
            opacity: 1, 
            y: 0, 
            stagger: 0.15, 
            ease: "power3.out" 
        }),
        toggleActions: "play none none reverse"
    });
    
    // Achievements section animation
    ScrollTrigger.create({
        trigger: ".achievements-section",
        start: "top 80%",
        end: "bottom 20%",
        animation: gsap.to(".achievement-badge", { 
            duration: 0.8, 
            opacity: 1, 
            rotationY: 0, 
            stagger: 0.2, 
            ease: "power3.out" 
        }),
        toggleActions: "play none none reverse"
    });
    
    // Skills section animation
    ScrollTrigger.create({
        trigger: ".skills-section",
        start: "top 80%",
        end: "bottom 20%",
        animation: gsap.to(".skill-pill", { 
            duration: 0.6, 
            opacity: 1, 
            scale: 1, 
            stagger: 0.1, 
            ease: "back.out(1.7)" 
        }),
        toggleActions: "play none none reverse"
    });
    
    // Contact section animation
    ScrollTrigger.create({
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom 20%",
        animation: gsap.timeline()
            .to(".contact-content", { 
                duration: 1, 
                opacity: 1, 
                y: 0, 
                ease: "power3.out" 
            })
            .to(".checkered-flag", { 
                duration: 0.8, 
                opacity: 1, 
                ease: "power2.out" 
            }, "-=0.5"),
        toggleActions: "play none none reverse",
        onEnter: () => triggerConfetti()
    });
    
    // F1 Car animation along path - improved version
    initializeCarAnimation();
    
    // Add hover animations
    initializeHoverAnimations();
}

function initializeReducedMotionFallback() {
    // Show all elements immediately for reduced motion
    gsap.set([
        ".hero-content", 
        ".education-card", 
        ".startup-card", 
        ".experience-card", 
        ".achievement-badge", 
        ".skill-pill", 
        ".contact-content"
    ], { opacity: 1, y: 0, scale: 1, rotationY: 0 });
    
    // Still initialize counters and other non-motion features
    ScrollTrigger.create({
        trigger: ".startup-section",
        start: "top 80%",
        onEnter: () => animateCounters()
    });
}

function initializeCarAnimation() {
    const car = document.getElementById('f1-car');
    if (!car) return;
    
    // Improved car animation with better performance and consistency
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5, // Reduced scrub value for smoother animation
            invalidateOnRefresh: true,
            refreshPriority: -1,
            onUpdate: self => {
                const progress = self.progress;
                
                // More sophisticated path calculation
                const viewportHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const scrollProgress = window.pageYOffset / (documentHeight - viewportHeight);
                
                // Calculate position based on scroll progress
                const baseX = 50;
                const baseY = 100;
                
                // Create a more dynamic path that follows the sections
                const sections = document.querySelectorAll('section');
                let currentSectionIndex = Math.floor(scrollProgress * sections.length);
                currentSectionIndex = Math.min(currentSectionIndex, sections.length - 1);
                
                // Smooth interpolation between section positions
                const sectionProgress = (scrollProgress * sections.length) % 1;
                const x = baseX + (Math.sin(progress * Math.PI * 2) * 30);
                const y = baseY + (progress * (viewportHeight * 0.8)) + (Math.cos(progress * Math.PI * 6) * 40);
                
                // Apply transform with better performance
                gsap.set(car, { 
                    x: x, 
                    y: y,
                    rotation: Math.sin(progress * Math.PI * 4) * 10,
                    force3D: true // Enable hardware acceleration
                });
            }
        }
    });
    
    // Fallback animation if scroll trigger fails
    let fallbackAnimation;
    const startFallback = () => {
        if (fallbackAnimation) fallbackAnimation.kill();
        fallbackAnimation = gsap.to(car, {
            duration: 0.1,
            x: "+=5",
            y: "+=2",
            rotation: "+=5",
            ease: "none",
            repeat: -1,
            yoyo: true
        });
    };
    
    // Monitor for animation issues
    let lastUpdate = Date.now();
    const checkAnimation = () => {
        const now = Date.now();
        if (now - lastUpdate > 1000) { // If no update for 1 second
            startFallback();
        }
        requestAnimationFrame(checkAnimation);
    };
    
    // Update last update time when scroll trigger fires
    tl.scrollTrigger.addEventListener('update', () => {
        lastUpdate = Date.now();
        if (fallbackAnimation) {
            fallbackAnimation.kill();
            fallbackAnimation = null;
        }
    });
    
    checkAnimation();
}

function initializeMinimap() {
    const minimapItems = document.querySelectorAll('.minimap-item');
    const sections = document.querySelectorAll('section');
    
    // Create scroll triggers for each section to update minimap
    sections.forEach((section, index) => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => updateMinimap(index),
            onEnterBack: () => updateMinimap(index)
        });
    });
    
    // Add click handlers for minimap navigation
    minimapItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (sections[index]) {
                sections[index].scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function updateMinimap(activeIndex) {
    const minimapItems = document.querySelectorAll('.minimap-item');
    minimapItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function initializeCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.counter);
        counter.textContent = formatCounterValue(0, target);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.counter);
        const obj = { value: 0 };
        
        gsap.to(obj, {
            duration: 2.5,
            value: target,
            ease: "power2.out",
            onUpdate: function() {
                counter.textContent = formatCounterValue(Math.round(obj.value), target);
            }
        });
    });
}

function formatCounterValue(value, target) {
    if (target >= 1000000) {
        return '$' + (value / 1000000).toFixed(1) + 'M';
    } else if (target >= 1000) {
        return '$' + (value / 1000).toFixed(0) + 'K';
    } else if (target >= 100) {
        return value + '%';
    } else {
        return value.toString();
    }
}

function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;
    
    const text = "Entrepreneur | Engineer | Innovator";
    const speed = 80;
    const pause = 2000;
    
    function typeWriter() {
        let i = 0;
        typewriterElement.textContent = '';
        
        function type() {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                setTimeout(() => {
                    let j = text.length;
                    function erase() {
                        if (j > 0) {
                            typewriterElement.textContent = text.substring(0, j - 1);
                            j--;
                            setTimeout(erase, 30);
                        } else {
                            setTimeout(typeWriter, 500);
                        }
                    }
                    setTimeout(erase, pause);
                }, 1000);
            }
        }
        
        type();
    }
    
    // Start typewriter effect
    setTimeout(typeWriter, 1500);
}

function initializeHoverAnimations() {
    // Experience cards 3D hover effect
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { 
                duration: 0.4, 
                rotationX: 8, 
                rotationY: 8, 
                scale: 1.03,
                z: 50,
                ease: "power2.out" 
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { 
                duration: 0.4, 
                rotationX: 0, 
                rotationY: 0, 
                scale: 1,
                z: 0,
                ease: "power2.out" 
            });
        });
        
        // Add mouse move effect for more dynamic 3D
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, { 
                duration: 0.2, 
                rotationX: rotateX, 
                rotationY: rotateY,
                ease: "power2.out" 
            });
        });
    });
    
    // Achievement badges flip effect
    const achievementBadges = document.querySelectorAll('.achievement-badge');
    achievementBadges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            gsap.to(badge, { 
                duration: 0.5, 
                rotationY: 20, 
                scale: 1.08,
                z: 30,
                ease: "back.out(1.7)" 
            });
        });
        
        badge.addEventListener('mouseleave', () => {
            gsap.to(badge, { 
                duration: 0.5, 
                rotationY: 0, 
                scale: 1,
                z: 0,
                ease: "power2.out" 
            });
        });
    });
    
    // Skill pills enhanced pulse effect
    const skillPills = document.querySelectorAll('.skill-pill');
    skillPills.forEach(pill => {
        pill.addEventListener('mouseenter', () => {
            gsap.to(pill, { 
                duration: 0.3, 
                scale: 1.15,
                y: -8,
                rotationZ: 5,
                ease: "back.out(2)" 
            });
        });
        
        pill.addEventListener('mouseleave', () => {
            gsap.to(pill, { 
                duration: 0.3, 
                scale: 1,
                y: 0,
                rotationZ: 0,
                ease: "power2.out" 
            });
        });
    });
}

function initializeContactAnimations() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, { 
                duration: 0.3, 
                scale: 1.08,
                y: -6,
                ease: "back.out(1.7)" 
            });
            
            // Enhanced racing flag effect
            const icon = link.querySelector('.contact-icon');
            gsap.to(icon, { 
                duration: 0.3, 
                rotation: 15,
                scale: 1.2,
                ease: "power2.out" 
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { 
                duration: 0.3, 
                scale: 1,
                y: 0,
                ease: "power2.out" 
            });
            
            const icon = link.querySelector('.contact-icon');
            gsap.to(icon, { 
                duration: 0.3, 
                rotation: 0,
                scale: 1,
                ease: "power2.out" 
            });
        });
    });
}

function triggerConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;
    
    // Clear existing confetti
    confettiContainer.innerHTML = '';
    
    // Create more dynamic confetti pieces
    const colors = ['#FF4D4D', '#FFFFFF', '#222222', '#FF6B6B', '#E63946'];
    const confettiCount = 80;
    
    for (let i = 0; i < confettiCount; i++) {
        const confettiPiece = document.createElement('div');
        const size = Math.random() * 8 + 4;
        confettiPiece.style.position = 'absolute';
        confettiPiece.style.width = size + 'px';
        confettiPiece.style.height = size + 'px';
        confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.top = '-20px';
        confettiPiece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confettiPiece.style.pointerEvents = 'none';
        confettiPiece.style.zIndex = '1000';
        
        confettiContainer.appendChild(confettiPiece);
        
        // Enhanced confetti animation
        gsap.to(confettiPiece, {
            duration: 2 + Math.random() * 3,
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 300,
            rotation: Math.random() * 720,
            opacity: 0,
            ease: "power2.out",
            delay: Math.random() * 0.5,
            onComplete: () => {
                confettiPiece.remove();
            }
        });
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${rate}px)`;
    }
}, { passive: true });

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    gsap.from('body', { 
        duration: 0.8, 
        opacity: 0, 
        ease: "power2.out" 
    });
});

// Intersection Observer for performance
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Handle resize events with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Enhanced performance monitoring
let lastScrollTop = 0;
let ticking = false;

function updateOnScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Only update if scroll difference is significant
    if (Math.abs(scrollTop - lastScrollTop) > 3) {
        lastScrollTop = scrollTop;
        updateScrollProgress();
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}, { passive: true });

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
    
    // Update any progress indicators
    document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
}

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.warn('Animation error:', e.error);
    // Fallback to basic functionality if GSAP fails
    if (e.error && e.error.message && e.error.message.includes('gsap')) {
        console.log('Falling back to reduced motion');
        initializeReducedMotionFallback();
    }
});

// Preload critical assets with better error handling
function preloadAssets() {
    const criticalImages = [
        'https://pplx-res.cloudinary.com/image/upload/v1749533436/pplx_project_search_images/51a8e6153fbe532a97bdaf74ceb702968f9dd83c.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.onload = () => console.log('Preloaded:', src);
        img.onerror = () => console.warn('Failed to preload:', src);
        img.src = src;
    });
}

// Initialize preloading
preloadAssets();