// ==========================================================================
// NOVA Website JavaScript - iOS 26 Theme
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Dynamic Background System (Smooth Opacity Crossfade) ---
    const dynamicBg = document.getElementById('dynamic-bg');
    const sections = document.querySelectorAll('header[data-bg], section[data-bg]');
    const bgLayers = {};
    
    // Create a background layer for each unique image
    sections.forEach((section, index) => {
        const bgUrl = section.getAttribute('data-bg');
        if (bgUrl && !bgLayers[bgUrl]) {
            const layer = document.createElement('div');
            layer.className = 'bg-layer';
            layer.style.backgroundImage = `url('${bgUrl}')`;
            layer.style.zIndex = -index; // Ensure stacking
            dynamicBg.appendChild(layer);
            bgLayers[bgUrl] = layer;
            
            // Preload image
            const img = new Image();
            img.src = bgUrl;
        }
    });

    const bgObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // Trigger when 40% of the section is visible
    };

    let currentBgUrl = null;

    const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bgUrl = entry.target.getAttribute('data-bg');
                const bgColor = entry.target.getAttribute('data-color');
                
                if (bgUrl && bgUrl !== currentBgUrl) {
                    // Fade out all layers
                    Object.values(bgLayers).forEach(layer => {
                        layer.style.opacity = '0';
                    });
                    
                    // Fade in the target layer
                    if (bgLayers[bgUrl]) {
                        bgLayers[bgUrl].style.opacity = '1';
                    }
                    currentBgUrl = bgUrl;
                }
                
                if (bgColor) {
                    // Apply a subtle color tint gradient based on the section's accent color
                    dynamicBg.style.setProperty('--bg-overlay', `linear-gradient(to bottom right, rgba(0,0,0,0.8), ${bgColor}60)`);
                } else {
                    dynamicBg.style.setProperty('--bg-overlay', `rgba(0,0,0,0.6)`);
                }
            }
        });
    }, bgObserverOptions);

    sections.forEach(section => {
        bgObserver.observe(section);
    });

    // --- 2. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // --- 3. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.innerHTML = navLinks.classList.contains('nav-active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // --- 4. Stats Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target + (target > 50 ? '+' : '');
                }
            };
            updateCount();
        });
    };
    
    // Intersection Observer for Counters
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                animateCounters();
                counterObserver.disconnect();
            }
        }, { threshold: 0.5 });
        
        counterObserver.observe(aboutSection);
    }

    // --- 5. Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // --- 6. Pricing Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to current
            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    // --- 7. Testimonial Slider ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    let slideInterval;
    
    const showSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };
    
    const nextSlide = () => {
        let index = currentSlide + 1;
        if (index >= slides.length) index = 0;
        showSlide(index);
    };
    
    // Initialize auto slide
    if(slides.length > 0) {
        slideInterval = setInterval(nextSlide, 5000);
        
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(idx);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }



    // --- 9. Swipe Carousel Logic (Dots + Desktop Drag) ---
    const swipeContainers = document.querySelectorAll('.swipe-container');
    
    swipeContainers.forEach(container => {
        const wrapper = container.parentElement;
        const dotsContainer = wrapper.querySelector('.swipe-dots');
        const slides = container.querySelectorAll('.swipe-slide');
        
        const labelText = wrapper.querySelector('.swipe-label-text');
        const nextArrow = wrapper.querySelector('.swipe-next-arrow');

        if (dotsContainer && slides.length > 0) {
            // Create dots
            slides.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.className = `swipe-dot ${idx === 0 ? 'active' : ''}`;
                dotsContainer.appendChild(dot);
            });
            
            const dots = dotsContainer.querySelectorAll('.swipe-dot');
            
            // Function to update UI (dots & labels)
            const updateUI = (activeIndex) => {
                // Update Dots
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === activeIndex);
                });
                
                // Update Label
                if (labelText && slides[activeIndex]) {
                    const newLabel = slides[activeIndex].getAttribute('data-label');
                    if (newLabel) {
                        labelText.style.opacity = '0';
                        setTimeout(() => {
                            labelText.textContent = newLabel;
                            labelText.style.opacity = '1';
                        }, 150);
                    }
                }
            };

            // Update UI on scroll
            let scrollTimeout;
            container.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const width = container.offsetWidth;
                    const activeIndex = Math.round(container.scrollLeft / width);
                    updateUI(activeIndex);
                }, 50); // Debounce
            });
            
            // Arrow Click Logic
            if (nextArrow) {
                nextArrow.addEventListener('click', () => {
                    const width = container.offsetWidth;
                    const activeIndex = Math.round(container.scrollLeft / width);
                    let nextIndex = activeIndex + 1;
                    
                    if (nextIndex >= slides.length) {
                        nextIndex = 0; // Loop back to start
                    }
                    
                    container.scrollTo({
                        left: width * nextIndex,
                        behavior: 'smooth'
                    });
                });
            }
        }

        // Desktop Drag Support
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
        });
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            container.scrollLeft = scrollLeft - walk;
        });
    });
});

// Global function to set select value from buttons
window.selectContactReason = function(val) {
    const select = document.getElementById('division');
    if(select) {
        select.value = val;
    }
};
