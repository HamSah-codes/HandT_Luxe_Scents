// User Interface JavaScript

// User Authentication State
let currentUser = null;


// User data
//let userCart = [];
//let userWishlist = [];
let userReviews = [];


// All Products Data
const allProducts = [
        {
            id: 1,
            name: "Oud Nior",
            brand: "Khadlaj",
            price: 240.00,
            originalPrice: 300.00,
            image: "/static/assets/img/OUD_NIOR.jpeg",
            category: "unisex",
            scent: "woody",
            brandType: "Khadlaj",
            mood: "confident",
            season: "winter",
            description: "A rich and intense fragrance with oud wood notes",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 2,
            name: "Black Leather",
            brand: "Fragrance World",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Black_Leather.jpeg",
            category: "men",
            scent: "floral",
            brandType: "Fragrance World",
            mood: "romantic",
            season: "spring",
            description: "Elegant floral scent with rose and jasmine notes",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 3,
            name: "Matelot",
            brand: "Fragrance World",
            price: 150.00,
            originalPrice: 160.00,
            image: "/static/assets/img/Matelot.jpeg",
            category: "men",
            scent: "citrus",
            brandType: "Fragrance World",
            mood: "energetic",
            season: "summer",
            description: "Fresh and invigorating citrus aquatic fragrance",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 4,
            name: "Suave Intense",
            brand: "Fragrance World",
            price: 149.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Suave_Intense.jpeg",
            category: "unisex",
            scent: "woody",
            brandType: "ht-luxe",
            mood: "calm",
            season: "autumn",
            description: "Warm and comforting sandalwood fragrance",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 5,
            name: "Mr. England Touch",
            brand: "Premium",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Mr_England.jpeg",
            category: "men",
            scent: "citrus",
            brandType: "premium",
            mood: "energetic",
            season: "summer",
            description: "Bright citrus notes with floral undertones",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 6,
            name: "Instant Love",
            brand: "Montera",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Instant_Love.jpeg",
            category: "unisex",
            scent: "oriental",
            brandType: "exclusive",
            mood: "romantic",
            season: "winter",
            description: "Exotic oriental fragrance with spice notes",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 7,
            name: "Explore The One",
            brand: "H&T Luxe",
            price: 155.00,
            originalPrice: 170.00,
            image: "/static/assets/img/Explore_The_One.jpeg",
            category: "unisex",
            scent: "fresh",
            brandType: "ht-luxe",
            mood: "calm",
            season: "spring",
            description: "Clean and crisp fresh linen scent",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 8,
            name: "Night Club",
            brand: "Fragrance World",
            price: 185.00,
            originalPrice: 200.00,
            image: "/static/assets/img/Night_Club.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "Fragrance World",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 9,
            name: "Tobacco Rouge",
            brand: "Pendora Scents",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Tobacco_Rouge.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "premium",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: true,
            isBestSeller: false
        },
        {
            id: 10,
            name: "Ameer Al-Oudh",
            brand: "Lattafa",
            price: 220.00,
            originalPrice: 250.00,
            image: "/static/assets/img/Ameer_Al-Oudh.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "Lattafa",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 11,
            name: "Exchange",
            brand: "Premium",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Exchange.jpeg",
            category: "unisex",
            scent: "spicy",
            brandType: "premium",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 12,
            name: "Ramz Lattafa(Gold)",
            brand: "Lattafa",
            price: 200.00,
            originalPrice: 250.00,
            image: "/static/assets/img/Ramz_Lattafa(Gold).jpeg",
            category: "unisex",
            scent: "spicy",
            brandType: "Lattafa",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 13,
            name: "Ramz Lattafa(Silver)",
            brand: "Lattafa",
            price: 2000.00,
            originalPrice: 250.00,
            image: "/static/assets/img/Ramz_Lattafa(Silver).jpeg",
            category: "men",
            scent: "spicy",
            brandType: "Lattafa",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 14,
            name: "Barakkat satin oud",
            brand: "Premium",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Barakkat_Satin_Oud.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "premium",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 15,
            name: "Brown Orchid(Blanc)",
            brand: "Fragrance World",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Brown_Orchid(Blanc).jpeg",
            category: "men",
            scent: "spicy",
            brandType: "Fragrance World",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 16,
            name: "Lomani Code",
            brand: "Premium",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Lomani_Code.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "premium",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: true,
            isBestSeller: false
        },
        {
            id: 17,
            name: "Barakkat Rouge 549",
            brand: "Premium",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Barakkat_Rouge.jpeg",
            category: "unisex",
            scent: "spicy",
            brandType: "premium",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 18,
            name: "After !2",
            brand: "Efolia",
            price: 160.00,
            originalPrice: 180.00,
            image: "/static/assets/img/After_12.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "Efolia",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 19,
            name: "Carbon Black",
            brand: "Fragrace World",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Carbon_Black.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "Fragrance World",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 20,
            name: "Proud Of You(Amber)",
            brand: "Fragrance World",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Proud_Of_You.jpeg",
            category: "women",
            scent: "spicy",
            brandType: "Fragrance World",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 21,
            name: "Lail Malaki",
            brand: "Lattafa",
            price: 190.00,
            originalPrice: 220.00,
            image: "/static/assets/img/Lail_Malaki.jpeg",
            category: "women",
            scent: "spicy",
            brandType: "Lattafa",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 22,
            name: "Emperor",
            brand: "Premium",
            price: 160.00,
            originalPrice: 180.00,
            image: "/static/assets/img/Emperor.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "premium",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 23,
            name: "Oniro",
            brand: "Fragrance World",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Oniro.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "Lattafa",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 24,
            name: "Queen Of Red",
            brand: "Fragrance World",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Queen_Of_Red.webp",
            category: "women",
            scent: "spicy",
            brandType: "Fragrance World",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: true
        },
        {
            id: 25,
            name: "Ely Sia",
            brand: "Fragrance World",
            price: 140.00,
            originalPrice: 155.00,
            image: "/static/assets/img/Ely_Sia.jpeg",
            category: "women",
            scent: "spicy",
            brandType: "Fragrance World",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: false,
            isBestSeller: false
        },
        {
            id: 26,
            name: "Intensio",
            brand: "L'Affair",
            price: 175.00,
            originalPrice: 210.00,
            image: "/static/assets/img/Intensio.jpeg",
            category: "men",
            scent: "spicy",
            brandType: "L'Affair",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: true,
            isBestSeller: false
        },
        {
            id: 27,
            name: "Hayaati Rose",
            brand: "Fragrance World",
            price: 160.00,
            originalPrice: 180.00,
            image: "/static/assets/img/Hayaati_Rose.jpeg",
            category: "women",
            scent: "spicy",
            brandType: "Fragrance World",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: true,
            isBestSeller: false
        },
        {
            id: 28,
            name: "Malaki Secret",
            brand: "Sahari",
            price: 160.00,
            originalPrice: 180.00,
            image: "/static/assets/img/Malaki_Secret.jpeg",
            category: "women",
            scent: "spicy",
            brandType: "Sahari",
            mood: "confident",
            season: "autumn",
            description: "Warm spicy notes with exotic undertones",
            isNew: true,
            isBestSeller: false
        }
];


// ==================== AUTHENTICATION FUNCTIONS ====================

// Protect dashboard access
function protectDashboard() {
    if (window.location.pathname.includes('user-interface.html')) {
        if (!currentUser) {
            showAlert('Please log in to access your dashboard', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return false;
        }
    }
    return true;
}

// Authentication Functions
function setupAuthModals() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const myAccountBtn = document.querySelector('.icon-link[title="My Account"]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-modal').style.display = 'block';
        });
    }

    // Signup modal
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signup-modal').style.display = 'block';
        });
    }

    // My Account icon - check authentication
    if (myAccountBtn) {
        myAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                // User is logged in, redirect to dashboard
                window.location.href = 'user-interface.html';
            } else {
                // User is not logged in, show login modal
                document.getElementById('login-modal').style.display = 'block';
            }
        });
    }

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Real-time password confirmation validation
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Real-time password match validation
function validatePasswordMatch() {
    const password = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('signup-confirm-password');
    const errorElement = document.getElementById('password-match-error') || createPasswordErrorElement();

    if (password && confirmPassword) {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            errorElement.textContent = 'Passwords do not match';
            errorElement.style.color = '#e74c3c';
            errorElement.style.display = 'block';
            confirmPassword.style.borderColor = '#e74c3c';
        } else if (confirmPassword.value && password.value === confirmPassword.value) {
            errorElement.textContent = 'Passwords match!';
            errorElement.style.color = '#27ae60';
            errorElement.style.display = 'block';
            confirmPassword.style.borderColor = '#27ae60';
        } else {
            errorElement.style.display = 'none';
            confirmPassword.style.borderColor = '';
        }
    }
}

function createPasswordErrorElement() {
    const errorElement = document.createElement('div');
    errorElement.id = 'password-match-error';
    errorElement.style.cssText = `
        font-size: 0.8rem;
        margin-top: 5px;
        display: none;
        font-weight: 600;
    `;
    
    const confirmPassword = document.getElementById('signup-confirm-password');
    if (confirmPassword && confirmPassword.parentNode) {
        confirmPassword.parentNode.appendChild(errorElement);
    }
    
    return errorElement;
}


// ==================== BACKEND AUTHENTICATION FUNCTIONS ====================

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store session token and user data
            localStorage.setItem('sessionToken', data.sessionToken);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Login successful
            currentUser = data.user;
            showAlert(`Welcome back, ${data.user.fullName}!`, 'success');
            document.getElementById('login-modal').style.display = 'none';
            e.target.reset();
            
            updateAuthUI();
            updateWelcomeMessage();
            
            // Redirect to dashboard if we're on home page
            if (window.location.pathname.includes('index.html')) {
                setTimeout(() => {
                    window.location.href = 'user-interface.html';
                }, 1000);
            }
        } else {
            showAlert(data.error, 'error');
        }
    } catch (error) {
        showAlert('Login failed. Please try again.', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Password validation
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }

    // Password match validation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store session token and user data
            localStorage.setItem('sessionToken', data.sessionToken);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Signup successful
            currentUser = data.user;
            showAlert(`Account created successfully! Welcome, ${data.user.fullName}!`, 'success');
            document.getElementById('signup-modal').style.display = 'none';
            e.target.reset();
            
            updateAuthUI();
            updateWelcomeMessage();
            
            // Clear password match error
            const errorElement = document.getElementById('password-match-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'user-interface.html';
            }, 1000);
        } else {
            showAlert(data.error, 'error');
        }
    } catch (error) {
        showAlert('Signup failed. Please try again.', 'error');
    }
}

async function logoutUser() {
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
            console.error('Logout API call failed:', error);
        }
    }
    
    // Clear local storage
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('currentUser');
    currentUser = null;
    
    updateAuthUI();
    updateWelcomeMessage();
    showAlert('Logged out successfully', 'success');
    
    // Redirect to home page if we're on dashboard
    if (window.location.pathname.includes('user-interface.html')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// ==================== FORGOT PASSWORD FUNCTIONALITY ====================

function setupForgotPassword() {
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const securityQuestionForm = document.getElementById('security-question-form');
    const resetPasswordForm = document.getElementById('reset-password-form');

    // Forgot password link
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('forgot-password-modal').style.display = 'block';
        });
    }

    // Forgot password form - step 1: enter email
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('reset-email').value.trim();
            
            if (!email) {
                showAlert('Please enter your email address', 'error');
                return;
            }

            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    document.getElementById('forgot-password-modal').style.display = 'none';
                    document.getElementById('security-question-modal').style.display = 'block';
                    
                    // Display security question
                    document.getElementById('security-question-text').textContent = data.security_question;
                    document.getElementById('security-answer-input').setAttribute('data-email', email);
                    
                    showAlert('Please answer your security question', 'info');
                } else {
                    showAlert(data.error, 'error');
                }
            } catch (error) {
                console.error('Forgot password request failed:', error);
                showAlert('Failed to process request. Please try again.', 'error');
            }
        });
    }

    // Security question form - step 2: answer security question
    if (securityQuestionForm) {
        securityQuestionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const answer = document.getElementById('security-answer-input').value.trim();
            const email = document.getElementById('security-answer-input').getAttribute('data-email');

            if (!answer) {
                showAlert('Please enter your answer', 'error');
                return;
            }

            try {
                const response = await fetch('/api/auth/verify-security-answer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        email: email,
                        security_answer: answer 
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    document.getElementById('security-question-modal').style.display = 'none';
                    document.getElementById('reset-password-modal').style.display = 'block';
                    
                    // Store the reset token temporarily
                    document.getElementById('reset-password-form').setAttribute('data-reset-token', data.reset_token);
                    document.getElementById('reset-password-form').setAttribute('data-email', email);
                    
                    showAlert('Security question verified! Please create a new password.', 'success');
                } else {
                    showAlert(data.error, 'error');
                }
            } catch (error) {
                console.error('Security answer verification failed:', error);
                showAlert('Failed to verify answer. Please try again.', 'error');
            }
        });
    }

    // Reset password form - step 3: create new password
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('new-reset-password').value;
            const confirmPassword = document.getElementById('confirm-reset-password').value;
            const resetToken = document.getElementById('reset-password-form').getAttribute('data-reset-token');
            const email = document.getElementById('reset-password-form').getAttribute('data-email');

            if (newPassword !== confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }

            if (newPassword.length < 6) {
                showAlert('Password must be at least 6 characters', 'error');
                return;
            }

            try {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        email: email,
                        new_password: newPassword,
                        reset_token: resetToken
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    document.getElementById('reset-password-modal').style.display = 'none';
                    showAlert('Password reset successfully! You can now login with your new password.', 'success');
                    
                    // Clear forms
                    document.getElementById('forgot-password-form').reset();
                    document.getElementById('security-question-form').reset();
                    document.getElementById('reset-password-form').reset();
                    
                    // Show login modal
                    setTimeout(() => {
                        document.getElementById('login-modal').style.display = 'block';
                    }, 2000);
                } else {
                    showAlert(data.error, 'error');
                }
            } catch (error) {
                console.error('Password reset failed:', error);
                showAlert('Failed to reset password. Please try again.', 'error');
            }
        });
    }
}

// ==================== UPDATED SIGNUP FUNCTION ====================

async function handleSignup(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const securityQuestion = document.getElementById('security-question').value;
    const securityAnswer = document.getElementById('security-answer').value.trim();

    // Validation
    if (!fullName || !email || !password || !confirmPassword || !securityQuestion || !securityAnswer) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Password validation
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }

    // Password match validation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                fullName, 
                email, 
                password,
                security_question: securityQuestion,
                security_answer: securityAnswer
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store session token and user data
            localStorage.setItem('sessionToken', data.sessionToken);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Signup successful
            currentUser = data.user;
            showAlert(`Account created successfully! Welcome, ${data.user.fullName}!`, 'success');
            document.getElementById('signup-modal').style.display = 'none';
            e.target.reset();
            
            updateAuthUI();
            updateWelcomeMessage();
            
            // Clear password match error
            const errorElement = document.getElementById('password-match-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'user-interface.html';
            }, 1000);
        } else {
            showAlert(data.error, 'error');
        }
    } catch (error) {
        showAlert('Signup failed. Please try again.', 'error');
    }
}

// Update checkAuthentication to use backend
async function checkAuthentication() {
    const sessionToken = localStorage.getItem('sessionToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (sessionToken && savedUser) {
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': sessionToken
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                updateAuthUI();
                updateWelcomeMessage();
            } else {
                // Token invalid, clear localStorage
                localStorage.removeItem('sessionToken');
                localStorage.removeItem('currentUser');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // Fallback to localStorage if API fails
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                updateAuthUI();
                updateWelcomeMessage();
            }
        }
    }
}



function updateAuthUI() {
    const authLinks = document.querySelector('.auth-links');
    const myAccountBtn = document.querySelector('.icon-link[title="My Account"]');
    
    if (authLinks) {
        if (currentUser) {
            authLinks.innerHTML = `
                <span style="color: var(--silver); font-weight: 600;">Welcome, ${currentUser.fullName}</span>
                <span class="auth-separator">|</span>
                <a href="#" class="auth-link" id="logout-btn">Logout</a>
            `;
            
            // Add logout event listener
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutUser();
                });
            }
        } else {
            authLinks.innerHTML = `
                <a href="#" class="auth-link" id="login-btn">Login</a>
                <span class="auth-separator">|</span>
                <a href="#" class="auth-link" id="signup-btn">Create Account</a>
            `;
            
            // Re-attach event listeners
            const loginBtn = document.getElementById('login-btn');
            const signupBtn = document.getElementById('signup-btn');
            
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('login-modal').style.display = 'block';
                });
            }
            
            if (signupBtn) {
                signupBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('signup-modal').style.display = 'block';
                });
            }
        }
    }
    
    // Update My Account icon tooltip
    if (myAccountBtn) {
        if (currentUser) {
            myAccountBtn.setAttribute('title', `My Account (${currentUser.fullName})`);
            myAccountBtn.style.background = 'linear-gradient(135deg, var(--gold) 0%, var(--light-gold) 100%)';
        } else {
            myAccountBtn.setAttribute('title', 'Login / Create Account');
            myAccountBtn.style.background = 'var(--light-gray)';
        }
    }
}

function updateWelcomeMessage() {
    const dashboardTitle = document.querySelector('.dashboard-title');
    if (dashboardTitle) {
        if (currentUser) {
            dashboardTitle.innerHTML = `Welcome, <span style="color: var(--gold); text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${currentUser.fullName}</span>`;
        } else {
            dashboardTitle.textContent = 'Welcome to Your Dashboard';
        }
    }
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertElement = document.createElement('div');
    alertElement.className = `alert-message alert-${type}`;
    alertElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    alertElement.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        min-width: 300px;
        backdrop-filter: blur(10px);
        ${type === 'success' ? 
            'background: linear-gradient(135deg, rgba(39, 174, 96, 0.95), rgba(46, 204, 113, 0.95));' : 
            'background: linear-gradient(135deg, rgba(231, 76, 60, 0.95), rgba(192, 57, 43, 0.95));'
        }
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        border: 1px solid ${type === 'success' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.2)'};
    `;

    document.body.appendChild(alertElement);

    setTimeout(() => {
        alertElement.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertElement.remove(), 300);
    }, 4000);
}



// Modal switching functions
function switchToSignup() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('signup-modal').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('signup-modal').style.display = 'none';
    document.getElementById('login-modal').style.display = 'block';
}


// ==================== DASHBOARD FUNCTIONS ====================



// Display All Products
function displayAllProducts(products = allProducts) {
    const productsGrid = document.getElementById('all-products');
    
    if (productsGrid) {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>
                    <p class="product-price">$${product.price}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                        <button class="btn btn-secondary add-to-wishlist" data-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Add event listeners
        attachProductEventListeners();
    }
}



// Update all functions to use localStorage:

function displayWishlist() {
    const wishlistGrid = document.getElementById('wishlist-items');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlistGrid) {
        wishlistGrid.innerHTML = '';
        
        if (wishlist.length === 0) {
            wishlistGrid.innerHTML = '<p class="empty-message">Your wishlist is empty</p>';
            return;
        }
        
        wishlist.forEach(product => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            
            wishlistItem.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="wishlist-item-details">
                    <h4>${product.name}</h4>
                    <p>${product.brand}</p>
                    <p class="product-price">GH₵${product.price}</p>
                </div>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary move-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="btn btn-secondary remove-from-wishlist" data-id="${product.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            wishlistGrid.appendChild(wishlistItem);
        });
        
        // Add event listeners
        document.querySelectorAll('.move-to-cart').forEach(button => {
            button.addEventListener('click', moveToCart);
        });
        
        document.querySelectorAll('.remove-from-wishlist').forEach(button => {
            button.addEventListener('click', removeFromWishlist);
        });
    }
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-message">Your cart is empty</p>';
            if (cartTotal) cartTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.brand}</p>
                    <p class="product-price">GH₵${item.price}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">
                    GH₵${itemTotal.toFixed(2)}
                </div>
                <div class="cart-item-actions">
                    <button class="btn btn-secondary remove-from-cart" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
        
        // Add event listeners
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
}

// Update cart functions
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateBadgeCounts();
        showAlert('Product added to cart!', 'success');
    }
}

function addToWishlist(e) {
    const productId = parseInt(e.target.closest('.add-to-wishlist').getAttribute('data-id'));
    const product = allProducts.find(p => p.id === productId);
    const heartIcon = e.target.closest('.add-to-wishlist').querySelector('i');
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!wishlist.find(item => item.id === productId)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        showAlert('Product added to wishlist!', 'success');
    } else {
        wishlist = wishlist.filter(item => item.id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        showAlert('Product removed from wishlist!', 'info');
    }
    
    displayWishlist();
    updateBadgeCounts();
}

// Update other cart/wishlist functions similarly...

// Display User Reviews
function displayUserReviews() {
    const reviewsContainer = document.getElementById('user-reviews');
    
    if (reviewsContainer) {
        reviewsContainer.innerHTML = '';
        
        if (userReviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="empty-message">You haven\'t written any reviews yet</p>';
            return;
        }
        
        userReviews.forEach(review => {
            const product = allProducts.find(p => p.id === review.productId);
            if (product) {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                
                reviewCard.innerHTML = `
                    <div class="review-header">
                        <span class="review-product">${product.name}</span>
                        <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                    </div>
                    <p class="review-text">${review.text}</p>
                    <div class="review-date">${review.date}</div>
                `;
                
                reviewsContainer.appendChild(reviewCard);
            }
        });
    }
}

// Filter Products
function setupFilters() {
    const genderFilter = document.getElementById('gender-filter');
    const scentFilter = document.getElementById('scent-filter');
    const brandFilter = document.getElementById('brand-filter');
    const moodFilter = document.getElementById('mood-filter');
    const seasonFilter = document.getElementById('season-filter');
    
    const filters = [genderFilter, scentFilter, brandFilter, moodFilter, seasonFilter];
    
    filters.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const gender = document.getElementById('gender-filter').value;
    const scent = document.getElementById('scent-filter').value;
    const brand = document.getElementById('brand-filter').value;
    const mood = document.getElementById('mood-filter').value;
    const season = document.getElementById('season-filter').value;
    
    let filteredProducts = allProducts;
    
    if (gender) {
        filteredProducts = filteredProducts.filter(product => product.category === gender);
    }
    
    if (scent) {
        filteredProducts = filteredProducts.filter(product => product.scent === scent);
    }
    
    if (brand) {
        filteredProducts = filteredProducts.filter(product => product.brandType === brand);
    }
    
    if (mood) {
        filteredProducts = filteredProducts.filter(product => product.mood === mood);
    }
    
    if (season) {
        filteredProducts = filteredProducts.filter(product => product.season === season);
    }
    
    displayAllProducts(filteredProducts);
}

// Product Event Listeners
function attachProductEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', addToWishlist);
    });
}

// Cart Functions
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    
    const existingItem = userCart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        userCart.push({
            productId: productId,
            quantity: 1
        });
    }
    
    displayCart();
    updateBadgeCounts();
    showAlert('Product added to cart!', 'success');
}

function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = userCart.find(item => item.productId === productId);
    
    if (item) {
        item.quantity += 1;
        displayCart();
    }
}

function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = userCart.find(item => item.productId === productId);
    
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            userCart = userCart.filter(item => item.productId !== productId);
        }
        displayCart();
    }
}

function removeFromCart(e) {
    const productId = parseInt(e.target.closest('.remove-from-cart').getAttribute('data-id'));
    userCart = userCart.filter(item => item.productId !== productId);
    displayCart();
}

// Wishlist Functions
function addToWishlist(e) {
    const productId = parseInt(e.target.closest('.add-to-wishlist').getAttribute('data-id'));
    const heartIcon = e.target.closest('.add-to-wishlist').querySelector('i');
    
    if (!userWishlist.includes(productId)) {
        userWishlist.push(productId);
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        showAlert('Product added to wishlist!', 'success');
    } else {
        userWishlist = userWishlist.filter(id => id !== productId);
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        showAlert('Product removed from wishlist!', 'info');
    }
    
    displayWishlist();
    updateBadgeCounts();
}

function moveToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    
    // Remove from wishlist
    userWishlist = userWishlist.filter(id => id !== productId);
    
    // Add to cart
    const existingItem = userCart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        userCart.push({
            productId: productId,
            quantity: 1
        });
    }
    
    displayWishlist();
    displayCart();
    showAlert('Product moved to cart!', 'success');
}

function removeFromWishlist(e) {
    const productId = parseInt(e.target.closest('.remove-from-wishlist').getAttribute('data-id'));
    userWishlist = userWishlist.filter(id => id !== productId);
    displayWishlist();
}

// Review Functions
function setupReviewForm() {
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = parseInt(document.getElementById('review-product').value);
            const rating = parseInt(document.getElementById('review-rating').value);
            const text = document.getElementById('review-text').value;
            
            const newReview = {
                productId: productId,
                rating: rating,
                text: text,
                date: new Date().toLocaleDateString()
            };
            
            userReviews.push(newReview);
            displayUserReviews();
            this.reset();
            showAlert('Review submitted!', 'success');
        });
    }
}

// Direct Message Form
function setupDirectMessageForm() {
    const messageForm = document.getElementById('direct-message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const subject = document.getElementById('message-subject').value;
            const message = document.getElementById('direct-message').value;
            
            // In a real app, this would send to the backend
            showAlert('Message sent! We will get back to you soon.', 'success');
            this.reset();
        });
    }
}

// Checkout Function
function setupCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (userCart.length === 0) {
                showAlert('Your cart is empty!', 'error');
                return;
            }
            
            showAlert('Proceeding to checkout!', 'success');
        });
    }
}


// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    let suggestionsContainer = null;

    if (searchInput && searchBtn) {
        // Create suggestions container
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        searchInput.parentNode.appendChild(suggestionsContainer);

        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm) {
                const filteredProducts = searchProducts(searchTerm, allProducts);

                if (filteredProducts.length === 0) {
                    showAlert('No products found matching your search', 'info');
                } else {
                    displayAllProducts(filteredProducts);
                    showAlert(`Found ${filteredProducts.length} product(s)`, 'success');
                }
                
                hideSuggestions();
            } else {
                displayAllProducts(allProducts);
            }
        };

        // Real-time search suggestions
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim().toLowerCase();
            if (searchTerm.length > 0) {
                showSuggestions(searchTerm);
            } else {
                hideSuggestions();
            }
        });

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Clear search when input is emptied
        searchInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                displayAllProducts(allProducts);
                hideSuggestions();
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && (!suggestionsContainer || !suggestionsContainer.contains(e.target))) {
                hideSuggestions();
            }
        });
    }
}

// Search products function
function searchProducts(searchTerm, products) {
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.scent.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}

// Show search suggestions
function showSuggestions(searchTerm) {
    const suggestionsContainer = document.querySelector('.search-suggestions');
    if (!suggestionsContainer) return;

    const suggestions = searchProducts(searchTerm, allProducts).slice(0, 5);

    if (suggestions.length > 0) {
        suggestionsContainer.innerHTML = suggestions.map(product => `
            <div class="suggestion-item" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="suggestion-image">
                <div class="suggestion-info">
                    <div class="suggestion-name">${product.name}</div>
                    <div class="suggestion-brand">${product.brand}</div>
                    <div class="suggestion-price">$${product.price}</div>
                </div>
            </div>
        `).join('');

        suggestionsContainer.style.display = 'block';

        // Add click event to suggestions
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.getAttribute('data-product-id');
                const searchInput = document.querySelector('.search-input');
                const product = allProducts.find(p => p.id == productId);
                
                if (product) {
                    searchInput.value = product.name;
                    hideSuggestions();
                    // Perform search with the selected product name
                    const filteredProducts = searchProducts(product.name.toLowerCase(), allProducts);
                    displayAllProducts(filteredProducts);
                    showAlert(`Found ${filteredProducts.length} product(s) for "${product.name}"`, 'success');
                }
            });
        });
    } else {
        hideSuggestions();
    }
}

// Hide search suggestions
function hideSuggestions() {
    const suggestionsContainer = document.querySelector('.search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}


// Update badge counts
function updateBadgeCounts() {
    const cartCount = document.getElementById('cart-count');
    const wishlistCount = document.getElementById('wishlist-count');
    
    if (cartCount) {
        cartCount.textContent = userCart.reduce((total, item) => total + item.quantity, 0);
    }
    
    if (wishlistCount) {
        wishlistCount.textContent = userWishlist.length;
    }
}



// Initialize User Interface
document.addEventListener('DOMContentLoaded', async function() {
    await checkAuthentication();
    protectDashboard();
    setupAuthModals();
    setupForgotPassword();
    
    // Only load dashboard content if user is authenticated
    if (currentUser || !window.location.pathname.includes('user-interface.html')) {
        displayAllProducts();
        displayWishlist();
        displayCart();
        displayUserReviews();
        setupFilters();
        setupReviewForm();
        setupDirectMessageForm();
        setupCheckout();
        setupSearch();
        updateBadgeCounts();
    }
});



// Add CSS for alert animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .form-group {
        position: relative;
    }
    
    .password-feedback {
        font-size: 0.8rem;
        margin-top: 5px;
        font-weight: 600;
        display: none;
    }
    
    .password-match {
        color: #27ae60;
    }
    
    .password-mismatch {
        color: #e74c3c;
    }
`;
document.head.appendChild(style);


