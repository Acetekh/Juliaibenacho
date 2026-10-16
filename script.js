// main.js - Portfolio Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set dynamic copyright year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Additional interactive features (modal handlers, smooth filters, video players) 
    // will be added here as we build each section!
});


// Sticky Floating Navbar Transition on Scroll
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('navbar-container');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            // Floating pill state when scrolling past Hero top
            navContainer.classList.add('bg-cream-200/90', 'backdrop-blur-md', 'rounded-full', 'shadow-md', 'border', 'border-neutral-900/10', 'py-2.5');
            navContainer.classList.remove('py-3');
        } else {
            // Unframed natural state at the very top of Hero
            navContainer.classList.remove('bg-cream-200/90', 'backdrop-blur-md', 'rounded-full', 'shadow-md', 'border', 'border-neutral-900/10', 'py-2.5');
            navContainer.classList.add('py-3');
        }
    });

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Accordion JavaScript 

    document.addEventListener('DOMContentLoaded', () => {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const button = item.querySelector('.faq-button');
            
            button.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                // Close all other open items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('is-open', 'bg-gray-100');
                    otherItem.classList.add('bg-transparent');
                    
                    const otherContent = otherItem.querySelector('.faq-content');
                    otherContent.classList.remove('grid-rows-[1fr]', 'opacity-100');
                    otherContent.classList.add('grid-rows-[0fr]', 'opacity-0');
                    
                    const otherIcon = otherItem.querySelector('.icon-wrap');
                    otherIcon.classList.remove('rotate-45');
                });

                // Open the clicked item if it wasn't already open
                if (!isOpen) {
                    item.classList.add('is-open', 'bg-gray-100');
                    item.classList.remove('bg-transparent');
                    
                    const content = item.querySelector('.faq-content');
                    content.classList.remove('grid-rows-[0fr]', 'opacity-0');
                    content.classList.add('grid-rows-[1fr]', 'opacity-100');
                    
                    const icon = item.querySelector('.icon-wrap');
                    icon.classList.add('rotate-45');
                }
            });
        });
    });



   // Carousel JavaScript

    document.addEventListener('DOMContentLoaded', () => {
        // --- Carousel Navigation Logic ---
        const carousel = document.getElementById('video-carousel');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        const getScrollAmount = () => {
            const card = carousel.querySelector('.flex-none');
            return card.offsetWidth + 24; // Width + gap
        };

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        carousel.addEventListener('scroll', () => {
            if (carousel.scrollLeft <= 0) {
                prevBtn.classList.add('opacity-0', 'pointer-events-none');
                prevBtn.classList.remove('opacity-100', 'pointer-events-auto');
            } else {
                prevBtn.classList.remove('opacity-0', 'pointer-events-none');
                prevBtn.classList.add('opacity-100', 'pointer-events-auto');
            }

            if (Math.ceil(carousel.scrollLeft + carousel.clientWidth) >= carousel.scrollWidth - 5) {
                nextBtn.classList.add('opacity-0', 'pointer-events-none');
                nextBtn.classList.remove('opacity-100', 'pointer-events-auto');
            } else {
                nextBtn.classList.remove('opacity-0', 'pointer-events-none');
                nextBtn.classList.add('opacity-100', 'pointer-events-auto');
            }
        });

        // --- Video Interaction & Autoplay Observer ---
        const videoCards = document.querySelectorAll('.video-card');
        
        // Auto-play when the card is in the center of the screen
        const observerOptions = {
            root: carousel,
            threshold: 0.6 // Card must be 60% visible to trigger
        };

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                const video = card.querySelector('video');
                const playIcon = card.querySelector('.play-icon');
                const pauseIcon = card.querySelector('.pause-icon');

                if (entry.isIntersecting) {
                    video.play().then(() => {
                        playIcon.classList.add('hidden');
                        pauseIcon.classList.remove('hidden');
                    }).catch((e) => {
                        // Browsers may block autoplay without interaction; handle gracefully
                        playIcon.classList.remove('hidden');
                        pauseIcon.classList.add('hidden');
                    });
                } else {
                    video.pause();
                    playIcon.classList.remove('hidden');
                    pauseIcon.classList.add('hidden');
                }
            });
        }, observerOptions);

        videoCards.forEach(card => {
            const video = card.querySelector('video');
            const toggleBtn = card.querySelector('.video-toggle');
            const playIcon = card.querySelector('.play-icon');
            const pauseIcon = card.querySelector('.pause-icon');
            
            const muteBtn = card.querySelector('.mute-toggle');
            const muteIcon = card.querySelector('.mute-icon');
            const volumeIcon = card.querySelector('.volume-icon');
            const volumeSlider = card.querySelector('.volume-slider');

            // Initialize default video volume
            video.volume = 0.2;
            videoObserver.observe(card);

            // Play/Pause Click Handler
            toggleBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                } else {
                    video.pause();
                    playIcon.classList.remove('hidden');
                    pauseIcon.classList.add('hidden');
                }
            });

            // Mute/Unmute Click Handler
            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                if (video.muted) {
                    muteIcon.classList.remove('hidden');
                    volumeIcon.classList.add('hidden');
                    volumeSlider.value = 0;
                } else {
                    muteIcon.classList.add('hidden');
                    volumeIcon.classList.remove('hidden');
                    volumeSlider.value = video.volume;
                }
            });

            // Volume Slider Handler
            volumeSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                video.volume = val;
                if (val === 0) {
                    video.muted = true;
                    muteIcon.classList.remove('hidden');
                    volumeIcon.classList.add('hidden');
                } else {
                    video.muted = false;
                    muteIcon.classList.add('hidden');
                    volumeIcon.classList.remove('hidden');
                }
            });
        });
    });

    //  Web3Forms Submission Script 

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const formStatus = document.getElementById('formStatus');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Set loading state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span>`;
            formStatus.className = 'hidden text-center text-sm font-medium py-3 rounded-xl';

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const result = await response.json();

                if (response.status === 200) {
                    formStatus.textContent = 'Message sent successfully. I will get back to you shortly.';
                    formStatus.className = 'text-center text-sm font-medium py-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200';
                    form.reset();
                } else {
                    formStatus.textContent = result.message || 'Something went wrong. Please try again.';
                    formStatus.className = 'text-center text-sm font-medium py-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200';
                }
            } catch (error) {
                formStatus.textContent = 'Network error. Please check your connection.';
                formStatus.className = 'text-center text-sm font-medium py-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                formStatus.classList.remove('hidden');
            }
        });
    });


    // count up 
    document.addEventListener('DOMContentLoaded', () => {
        const counters = document.querySelectorAll('.counter');
        const animationDuration = 2000; // 2 seconds for the animation to complete
        const frameRate = 1000 / 60; // 60 frames per second
        const totalFrames = Math.round(animationDuration / frameRate);

        const observerOptions = {
            root: null,
            threshold: 0.5 // Trigger when the metric card is 50% visible
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    let frame = 0;

                    const counterInterval = setInterval(() => {
                        frame++;
                        // Easing function for smoother deceleration at the end
                        const progress = frame / totalFrames;
                        const currentCount = Math.round(target * progress);

                        if (frame === totalFrames) {
                            counter.innerText = target;
                            clearInterval(counterInterval);
                        } else {
                            counter.innerText = currentCount;
                        }
                    }, frameRate);

                    // Stop observing once the animation has started so it doesn't replay
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    });