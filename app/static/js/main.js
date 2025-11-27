// Main Application JavaScript
class HTLuxeScents {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.setupBanner();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupModals();
        this.setupEventListeners();
        this.setupPageChangeListener();
        this.setupActiveNavigation();
        this.updateCartCount();
        this.updateWishlistCount();
    }

    refreshAppState() {
        this.checkAuth();
        this.updateCartCount();
        this.updateWishlistCount();
    }

    setupPageChangeListener() {
        // Refresh app state when navigating back to main pages
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                this.refreshAppState();
            }, 100);
        });
        
        // Also refresh when page becomes visible again
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshAppState();
            }
        });
        
        // Refresh when clicking on navigation links (optional enhancement)
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href*="/"]') || e.target.closest('a[href*="/"]')) {
                setTimeout(() => {
                    this.refreshAppState();
                }, 500);
            }
        });
    }


    // Authentication Methods
    async checkAuth() {
        const sessionToken = localStorage.getItem('sessionToken');
            if (sessionToken) {
                try {
                    // Make actual API call to verify the session
                const response = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': sessionToken
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user; // Use the user object from backend
                    this.updateAuthUI();
                } else {
                    // Token is invalid, clear it
                    localStorage.removeItem('sessionToken');
                    localStorage.removeItem('userData');
                    this.updateAuthUI();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('sessionToken');
                localStorage.removeItem('userData');
                this.updateAuthUI();
            }
        } else {
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const accountText = document.getElementById('account-text');
        const accountMenu = document.querySelector('.account-menu');
        
        if (this.currentUser) {
            if (accountText) {
                accountText.textContent = `Hi, ${this.currentUser.fullName.split(' ')[0]}`;
            }
            
            if (accountMenu) {
                accountMenu.innerHTML = `
                    <div class="account-menu-header" style="padding: 12px 20px; border-bottom: 1px solid var(--light-gray); margin-bottom: 8px;">
                        <div style="font-weight: 600; color: var(--navy);">${this.currentUser.fullName}</div>
                        <div style="font-size: 0.8rem; color: var(--charcoal);">${this.currentUser.email}</div>
                    </div>
                    <a href="/user-interface.html" class="account-menu-item">
                        <i class="fas fa-user"></i>
                        My Account
                    </a>
                    <a href="/user-interface.html#orders" class="account-menu-item">
                        <i class="fas fa-box"></i>
                        Orders
                    </a>
                    <a href="/user-interface.html#wishlist" class="account-menu-item">
                        <i class="fas fa-heart"></i>
                        Wishlist
                    </a>
                    <div class="account-menu-divider"></div>
                    <a href="#" class="account-menu-item" id="logout-menu-item">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                `;
                
                // Add logout event listener
                const logoutItem = document.getElementById('logout-menu-item');
                if (logoutItem) {
                    logoutItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.logout();
                    });
                }
            }
        } else {
            if (accountText) {
                accountText.textContent = 'Account';
            }
            
            if (accountMenu) {
                accountMenu.innerHTML = `
                    <a href="#" class="account-menu-item" id="login-menu-item">
                        <i class="fas fa-sign-in-alt"></i>
                        Sign In
                    </a>
                    <a href="#" class="account-menu-item" id="signup-menu-item">
                        <i class="fas fa-user-plus"></i>
                        Create Account
                    </a>
                    <div class="account-menu-divider"></div>
                    <a href="/user-interface.html#orders" class="account-menu-item">
                        <i class="fas fa-box"></i>
                        Orders
                    </a>
                    <a href="/user-interface.html#wishlist" class="account-menu-item">
                        <i class="fas fa-heart"></i>
                        Wishlist
                    </a>
                `;
                
                // Add event listeners for login/signup
                const loginItem = document.getElementById('login-menu-item');
                const signupItem = document.getElementById('signup-menu-item');
                
                if (loginItem) {
                    loginItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showModal('login-modal');
                    });
                }
                
                if (signupItem) {
                    signupItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showModal('signup-modal');
                    });
                }
            }
        }
    }

    // Banner Setup
    setupBanner() {
        const callBtn = document.querySelector('.call-now-btn');
        if (callBtn) {
            callBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // This will trigger the phone call on mobile devices
                window.location.href = 'tel:+233591373371';
            });
        }
    }

    // Mobile Menu Setup
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    // Navigation Setup
    setupNavigation() {
        // Account dropdown
        const accountToggle = document.querySelector('.account-toggle');
        const accountMenu = document.querySelector('.account-menu');

        if (accountToggle && accountMenu) {
            let menuTimeout;
            
            accountToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                accountMenu.classList.toggle('active');
            });

            // Keep menu open when hovering
            accountToggle.addEventListener('mouseenter', () => {
                clearTimeout(menuTimeout);
                accountMenu.classList.add('active');
            });

            accountMenu.addEventListener('mouseenter', () => {
                clearTimeout(menuTimeout);
                accountMenu.classList.add('active');
            });

            accountToggle.addEventListener('mouseleave', () => {
                menuTimeout = setTimeout(() => {
                    if (!accountMenu.matches(':hover')) {
                        accountMenu.classList.remove('active');
                    }
                }, 300);
            });

            accountMenu.addEventListener('mouseleave', () => {
                menuTimeout = setTimeout(() => {
                    accountMenu.classList.remove('active');
                }, 300);
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.account-dropdown')) {
                    accountMenu.classList.remove('active');
                }
            });
        }

        // Search functionality
        this.setupSearch();
    }

    // Active Navigation Management
    setupActiveNavigation() {
        this.updateActiveNavLink();
        
        // Update on URL changes
        window.addEventListener('popstate', () => {
            this.updateActiveNavLink();
        });
        
        // Update on hash changes (for home page sections)
        window.addEventListener('hashchange', () => {
            this.updateActiveNavLink();
        });
        
        // Update on scroll for home page sections
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            this.setupScrollSpy();
        }
    }

    updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Determine which link should be active
        if (currentPath.includes('shop.html') || currentPath === '/shop') {
            // Shop page
            const shopLink = document.querySelector('a[href="/shop"]');
            if (shopLink) shopLink.classList.add('active');
        } else if (currentPath.includes('user-interface.html')) {
            // User dashboard
            const dashboardLink = document.querySelector('a[href="/user-interface.html"]');
            if (dashboardLink) dashboardLink.classList.add('active');
        } else if (currentHash) {
            // Home page with hash (sections)
            const sectionLink = document.querySelector(`a[href="${currentHash}"]`);
            if (sectionLink) sectionLink.classList.add('active');
        } else {
            // Home page (default)
            const homeLink = document.querySelector('a[href="/"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active to corresponding link
                    const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');

        if (searchInput && searchBtn) {
            const performSearch = () => {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    // Store search term for the shop page to use
                    sessionStorage.setItem('searchTerm', searchTerm);

                    if (window.location.pathname.includes('/shop') || window.location.pathname.endsWith('/shop')) {
                    // If already on shop page, trigger search immediately
                        if (window.shopManager) {
                            window.shopManager.searchProducts(searchTerm);
                    } else {
                        // Redirect to shop with search term
                        window.location.href = `/shop?search=${encodeURIComponent(searchTerm)}`;
                    }
                } else {
                    // Redirect to shop with search term
                    window.location.href = `/shop?search=${encodeURIComponent(searchTerm)}`;
                }
                    searchInput.value = '';
                }
            };

            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            // Clear search when input is cleared
            searchInput.addEventListener('input', (e) => {
                if (e.target.value === '' && window.location.pathname.includes('/shop')) {
                    // If on shop page and search is cleared, show all products
                    if (window.shopManager) {
                        window.shopManager.clearSearch();
                    }
                }
            });
        }
    }

    // Modal Methods
    setupModals() {
        // Close modals
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => {
                this.hideAllModals();
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAllModals();
                }
            });
        });

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                await this.login(email, password);
            });
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fullName = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const confirmPassword = document.getElementById('signup-confirm-password').value;

                if (password !== confirmPassword) {
                    this.showAlert('Passwords do not match', 'error');
                    return;
                }

                await this.signup(fullName, email, password);
            });
        }

        // Modal switching
        const switchToSignup = document.querySelector('[onclick="switchToSignup()"]');
        const switchToLogin = document.querySelector('[onclick="switchToLogin()"]');

        if (switchToSignup) {
            switchToSignup.addEventListener('click', () => {
                this.hideModal('login-modal');
                this.showModal('signup-modal');
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', () => {
                this.hideModal('signup-modal');
                this.showModal('login-modal');
            });
        }
    }

    showModal(modalId) {
        this.hideAllModals();
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
        this.checkBodyOverflow();
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        this.checkBodyOverflow();
    }

    checkBodyOverflow() {
        const hasOpenModal = Array.from(document.querySelectorAll('.modal')).some(modal => 
            modal.style.display === 'block'
        );
        document.body.style.overflow = hasOpenModal ? 'hidden' : '';
    }

    // Authentication Methods
   async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('sessionToken', data.sessionToken);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                this.currentUser = data.user;
                this.updateAuthUI();
                this.hideModal('login-modal');
                this.showAlert('Login successful!', 'success');
                
                this.updateCartCount();
                this.updateWishlistCount();
                return true;
            } else {
                const errorData = await response.json();
                this.showAlert(errorData.error || 'Login failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Login failed. Please try again.', 'error');
            return false;
        }
    }

    async signup(fullName, email, password) {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    fullName: fullName, 
                    email: email, 
                    password: password 
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Use the actual session token and user data from the backend
                localStorage.setItem('sessionToken', data.sessionToken);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                this.currentUser = data.user; // Use the user object from backend
                this.updateAuthUI();
                this.hideModal('signup-modal');
                this.showAlert('Account created successfully!', 'success');
                
                this.updateCartCount();
                this.updateWishlistCount();
                return true;
            } else {
                const errorData = await response.json();
                this.showAlert(errorData.error || 'Signup failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showAlert('Signup failed. Please try again.', 'error');
            return false;
        }
    }

    // Current User Getter
    getCurrentUser() {
        return this.currentUser;
    }

    // Logout Method
    async logout() {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': sessionToken
                    }
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        localStorage.removeItem('sessionToken');
        this.currentUser = null;
        this.updateAuthUI();
        this.showAlert('Logged out successfully', 'success');
        
        if (window.location.pathname.includes('user-interface.html')) {
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        }
    }

    // Wishlist Methods
    async addToWishlist(productId) {
        if (!this.currentUser) {
            this.showModal('login-modal');
            return false;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionToken
                },
                body: JSON.stringify({ product_id: productId })
            });

            if (response.ok) {
                this.updateWishlistCount();
                this.showAlert('Product added to wishlist!', 'success');
                return true;
            } else {
                const data = await response.json();
                this.showAlert(data.error || 'Failed to add product to wishlist', 'error');
                return false;
            }
        } catch (error) {
            console.error('Add to wishlist error:', error);
            this.showAlert('Error adding to wishlist', 'error');
            return false;
        }
    }

    // Cart Methods
    async addToCart(productId, quantity = 1) {
        if (!this.currentUser) {
            this.showModal('login-modal');
            return false;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionToken
                },
                body: JSON.stringify({ product_id: productId, quantity })
            });

            if (response.ok) {
                this.updateCartCount();
                this.showAlert('Product added to cart!', 'success');
                
                // Update user dashboard if it's open
                if (window.userDashboard) {
                    window.userDashboard.loadCart();
                }
                return true;
            } else {
                this.showAlert('Failed to add product to cart', 'error');
                return false;
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showAlert('Error adding to cart', 'error');
            return false;
        }
    }

    async updateCartCount() {
        if (!this.currentUser) {
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = '0';
            });
            return;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const data = await response.json();
                document.querySelectorAll('.cart-count').forEach(el => {
                    el.textContent = data.item_count || '0';
                });
            }
        } catch (error) {
            console.error('Update cart count error:', error);
        }
    }

    async updateWishlistCount() {
        if (!this.currentUser) {
            document.querySelectorAll('.wishlist-count').forEach(el => {
                el.textContent = '0';
            });
            return;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/wishlist', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const data = await response.json();
                document.querySelectorAll('.wishlist-count').forEach(el => {
                    el.textContent = data.length || '0';
                });
            }
        } catch (error) {
            console.error('Update wishlist count error:', error);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Password toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.toggle-password')) {
                const button = e.target.closest('.toggle-password');
                const targetId = button.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = button.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Contact form
        const contactForm = document.getElementById('message-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(contactForm);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                };

                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        this.showAlert('Message sent successfully!', 'success');
                        contactForm.reset();
                    } else {
                        this.showAlert('Failed to send message', 'error');
                    }
                } catch (error) {
                    console.error('Contact form error:', error);
                    this.showAlert('Error sending message', 'error');
                }
            });
        }
    }

    // Utility Methods
    showAlert(message, type = 'info') {
        // Remove existing alerts
        document.querySelectorAll('.alert').forEach(alert => alert.remove());

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${this.getAlertIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    getAlertIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS'
        }).format(price);
    }
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    
    console.log('=== SCROLL DEBUG ===');
    console.log('Scroll Y:', window.scrollY);
    console.log('Navbar top:', navbar.offsetTop);
    console.log('Hero height:', hero.offsetHeight);
    console.log('Hero bottom:', hero.offsetTop + hero.offsetHeight);
    
    if (!hero || !navbar) {
        console.log('Missing elements!');
        return;
    }
    
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    const scrollPosition = window.scrollY;
    const triggerPoint = heroBottom - 200;
    
    console.log('Trigger point:', triggerPoint);
    console.log('Should add scrolled class:', scrollPosition > triggerPoint);
    
    if (scrollPosition > triggerPoint) {
        navbar.classList.add('scrolled');
        console.log('✅ Added scrolled class');
    } else {
        navbar.classList.remove('scrolled');
        console.log('❌ Removed scrolled class');
    }
    console.log('====================');
}


function initNavbarScroll() {
    console.log('🔄 Initializing navbar scroll detection');
    
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    
    if (!navbar || !hero) {
        console.error('❌ Navbar or hero not found');
        return;
    }
    
    function checkScroll() {
        const scrollY = window.scrollY;
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        
        console.log(`📜 Scroll: ${scrollY}px, Hero bottom: ${heroBottom}px`);
        
        // Add scrolled class when we've scrolled past the hero section
        // Using a small offset to trigger slightly before hero completely disappears
        if (scrollY > heroBottom - 150) {
            navbar.classList.add('scrolled');
            console.log('🎯 Navbar now has solid background');
        } else {
            navbar.classList.remove('scrolled');
            console.log('↩️ Navbar is transparent over hero');
        }
    }
    
    // Check immediately on load
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    console.log('✅ Navbar scroll detection active');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM ready - starting navbar scroll');
    initNavbarScroll();
});

// Also initialize on window load as backup
window.addEventListener('load', initNavbarScroll);


// Global functions for HTML onclick attributes
function switchToSignup() {
    if (window.app) {
        window.app.hideModal('login-modal');
        window.app.showModal('signup-modal');
    }
}

function switchToLogin() {
    if (window.app) {
        window.app.hideModal('signup-modal');
        window.app.showModal('login-modal');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HTLuxeScents();
});