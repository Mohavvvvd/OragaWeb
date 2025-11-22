 document.addEventListener('DOMContentLoaded', function() {
            // Handle screenshot image loading
            document.querySelectorAll('.screenshot-card').forEach(card => {
                const img = card.querySelector('.screenshot-img');
                const mockup = card.querySelector('.screenshot-mockup');
                
                if (img) {
                    // When image loads successfully, show it and hide mockup
                    img.addEventListener('load', function() {
                        this.style.display = 'block';
                        if (mockup) mockup.style.display = 'none';
                    });
                    
                    // When image fails to load, keep mockup visible
                    img.addEventListener('error', function() {
                        this.style.display = 'none';
                        if (mockup) mockup.style.display = 'flex';
                    });
                    
                    // Check if image is already loaded (cached)
                    if (img.complete) {
                        if (img.naturalWidth > 0) {
                            img.style.display = 'block';
                            if (mockup) mockup.style.display = 'none';
                        } else {
                            img.style.display = 'none';
                            if (mockup) mockup.style.display = 'flex';
                        }
                    }
                }
            });

            // Download buttons with animation
            document.querySelectorAll('.download-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const platform = this.dataset.platform;
                    const btnText = this.querySelector('.btn-text');
                    const progressBar = this.querySelector('.progress-bar');
                    
                    // Prevent multiple clicks
                    if (this.classList.contains('downloading') || this.classList.contains('success')) {
                        return;
                    }
                    
                    // Start download animation
                    this.classList.add('downloading');
                    btnText.textContent = 'Preparing download...';
                    
                    // Animate progress bar
                    setTimeout(() => {
                        progressBar.style.width = '100%';
                    }, 100);
                    
                    // Simulate download completion
                    setTimeout(() => {
                        this.classList.remove('downloading');
                        this.classList.add('success');
                        btnText.textContent = '✓ Download Started!';
                        
                        // Reset button after 3 seconds
                        setTimeout(() => {
                            this.classList.remove('success');
                            btnText.textContent = `Download for ${platform}`;
                            progressBar.style.width = '0';
                        }, 3000);
                    }, 2000);
                });
            });

            // Smooth scroll
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

            // Add scroll reveal animation
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.feature-card, .screenshot-card, .download-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.observe(el);
            });
        });