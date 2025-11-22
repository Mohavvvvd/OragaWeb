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

    // Real download functionality
    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.platform;
            const downloadUrl = this.dataset.url;
            const btnText = this.querySelector('.btn-text');
            const progressBar = this.querySelector('.progress-bar');
            
            // Prevent multiple clicks
            if (this.classList.contains('downloading') || this.classList.contains('success')) {
                return;
            }
            
            // Validate download URL
            if (!downloadUrl) {
                console.error('No download URL specified for platform:', platform);
                btnText.textContent = 'Download Error!';
                setTimeout(() => {
                    btnText.textContent = `Download for ${platform}`;
                }, 2000);
                return;
            }
            
            // Start download animation
            this.classList.add('downloading');
            btnText.textContent = 'Starting download...';
            
            // Create hidden iframe for download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Track download start time
            const startTime = Date.now();
            let progressInterval;
            
            // Animate progress bar with realistic timing
            let progress = 0;
            progressInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 90) progress = 90;
                progressBar.style.width = progress + '%';
            }, 200);
            
            // Start actual download
            iframe.src = downloadUrl;
            
            // Listen for iframe load completion
            iframe.onload = function() {
                clearInterval(progressInterval);
                progressBar.style.width = '100%';
                
                setTimeout(() => {
                    button.classList.remove('downloading');
                    button.classList.add('success');
                    btnText.textContent = '✓ Download Complete!';
                    
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 1000);
                    
                    setTimeout(() => {
                        button.classList.remove('success');
                        btnText.textContent = `Download for ${platform}`;
                        progressBar.style.width = '0';
                    }, 3000);
                }, 500);
            };
            
            // Handle download errors
            iframe.onerror = function() {
                clearInterval(progressInterval);
                
                button.classList.remove('downloading');
                btnText.textContent = '✗ Download Failed!';
                progressBar.style.width = '0';
                
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
                
                setTimeout(() => {
                    btnText.textContent = `Download for ${platform}`;
                }, 3000);
            };
            
            // Fallback timeout
            setTimeout(() => {
                if (button.classList.contains('downloading')) {
                    clearInterval(progressInterval);
                    iframe.onload = null;
                    iframe.onerror = null;
                    
                    progressBar.style.width = '100%';
                    
                    setTimeout(() => {
                        button.classList.remove('downloading');
                        button.classList.add('success');
                        btnText.textContent = '✓ Download Complete!';
                        
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                        }, 1000);
                        
                        setTimeout(() => {
                            button.classList.remove('success');
                            btnText.textContent = `Download for ${platform}`;
                            progressBar.style.width = '0';
                        }, 3000);
                    }, 500);
                }
            }, 10000);
        });
    });

    // Alternative download method using fetch (more modern approach)
    function downloadWithFetch(url, filename) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Download failed:', error);
                // Fallback to iframe method
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = url;
                document.body.appendChild(iframe);
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 5000);
            });
    }

    // Handle alternative download links
    document.querySelectorAll('.alt-download-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.href;
            const filename = this.download || url.split('/').pop();
            
            // Create temporary download indicator
            const originalText = this.innerHTML;
            this.innerHTML = '<span>⏳ Downloading...</span>';
            
            downloadWithFetch(url, filename);
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 3000);
        });
    });

    // Smooth scroll for anchor links
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
                
                // Add staggered animation for cards
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('screenshot-card') || 
                    entry.target.classList.contains('download-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.feature-card, .screenshot-card, .download-card, .section-title, .hero-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add scroll-to-top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary, #3b82f6);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll-to-top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(20px)';
        }
    });

    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key to reset any active downloads
        if (e.key === 'Escape') {
            document.querySelectorAll('.download-btn.downloading, .download-btn.success').forEach(btn => {
                btn.classList.remove('downloading', 'success');
                btn.querySelector('.btn-text').textContent = `Download for ${btn.dataset.platform}`;
                btn.querySelector('.progress-bar').style.width = '0';
            });
        }
        
        // Home key to scroll to top
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // End key to scroll to download section
        if (e.key === 'End') {
            e.preventDefault();
            const downloadSection = document.getElementById('download');
            if (downloadSection) {
                downloadSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Performance optimization: Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add analytics for download tracking
    function trackDownload(platform, success = true) {
        // This would typically send data to your analytics service
        console.log(`Download ${success ? 'completed' : 'failed'} for ${platform} at ${new Date().toISOString()}`);
        
        // Example: Send to Google Analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': platform,
                'event_label': success ? 'success' : 'failure',
                'value': 1
            });
        }
    }

    // Enhanced download buttons with analytics
    document.querySelectorAll('.download-btn').forEach(button => {
        const originalClickHandler = button.onclick;
        
        button.addEventListener('click', function(e) {
            const platform = this.dataset.platform;
            
            // Track download attempt
            trackDownload(platform, true);
            
            // Call original handler if it exists
            if (originalClickHandler) {
                originalClickHandler.call(this, e);
            }
        });
    });
});

// Utility function for creating download URLs (useful for dynamic content)
function createDownloadUrl(platform, version = '1.1.0') {
    const baseUrl = 'https://github.com/yourusername/file-organizer/releases/download';
    const files = {
        'Windows': `FileOrganizer-Windows-Setup-${version}.exe`,
        'macOS': `FileOrganizer-macOS-${version}.dmg`,
        'Linux': `FileOrganizer-Linux-${version}.AppImage`
    };
    
    return `${baseUrl}/v${version}/${files[platform]}`;
}

// Initialize download buttons with URLs if not already set
function initializeDownloadButtons() {
    document.querySelectorAll('.download-btn').forEach(button => {
        if (!button.dataset.url) {
            const platform = button.dataset.platform;
            const version = button.closest('.download-card')?.querySelector('.version')?.textContent?.match(/\d+\.\d+\.\d+/)?.[0] || '1.1.0';
            button.dataset.url = createDownloadUrl(platform, version);
        }
    });
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDownloadButtons);
} else {
    initializeDownloadButtons();
}
