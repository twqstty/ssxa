const form = document.getElementById('registrationForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');
const usernameError = document.getElementById('usernameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');

const validationState = {
    username: false,
    email: false,
    phone: true,
    password: false,
    confirmPassword: false
};

function validateUsername() {
    const username = usernameInput.value.trim();
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    
    if (username === '') {
        showError(usernameInput, usernameError, 'Имя пользователя обязательно');
        validationState.username = false;
        return false;
    } else if (!usernameRegex.test(username)) {
        showError(usernameInput, usernameError, 'Имя должно содержать 3-20 символов (буквы и цифры)');
        validationState.username = false;
        return false;
    } else {
        showSuccess(usernameInput, usernameError);
        validationState.username = true;
        return true;
    }
}

function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === '') {
        showError(emailInput, emailError, 'Email обязателен');
        validationState.email = false;
        return false;
    } else if (!emailRegex.test(email)) {
        showError(emailInput, emailError, 'Введите корректный email');
        validationState.email = false;
        return false;
    } else {
        showSuccess(emailInput, emailError);
        validationState.email = true;
        return true;
    }
}

function formatPhoneNumber(value) {
    let phone = value.replace(/\D/g, '');
    if (phone.length > 0) {
        if (phone[0] === '7' || phone[0] === '8') {
            phone = phone.substring(0, 11);
        } else {
            phone = '7' + phone.substring(0, 10);
        }
    }
    
    if (phone.length === 0) return '';
    if (phone.length <= 1) return `+${phone}`;
    if (phone.length <= 4) return `+${phone.slice(0,1)} (${phone.slice(1)}`;
    if (phone.length <= 7) return `+${phone.slice(0,1)} (${phone.slice(1,4)}) ${phone.slice(4)}`;
    if (phone.length <= 9) return `+${phone.slice(0,1)} (${phone.slice(1,4)}) ${phone.slice(4,7)}-${phone.slice(7)}`;
    return `+${phone.slice(0,1)} (${phone.slice(1,4)}) ${phone.slice(4,7)}-${phone.slice(7,9)}-${phone.slice(9)}`;
}

function validatePhone() {
    const phone = phoneInput.value.trim();
    if (phone === '') {
        showSuccess(phoneInput, phoneError);
        validationState.phone = true;
        return true;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length === 11 && (phoneDigits[0] === '7' || phoneDigits[0] === '8')) {
        showSuccess(phoneInput, phoneError);
        validationState.phone = true;
        return true;
    } else {
        showError(phoneInput, phoneError, 'Введите корректный номер телефона');
        validationState.phone = false;
        return false;
    }
}


function showError(input, errorElement, message) {
    input.classList.remove('success');
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.style.display = 'none';
}
function togglePasswordVisibility(input, button) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    const icon = button.querySelector('i');
    if (type === 'text') {
        icon.className = 'fas fa-eye-slash';
        button.title = 'Скрыть пароль';
    } else {
        icon.className = 'fas fa-eye';
        button.title = 'Показать пароль';
    }
}

function updateSubmitButton() {
    const isFormValid = Object.values(validationState).every(state => state === true);
    
    if (isFormValid) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}
Object.keys(validationState).forEach(field => {
    Object.defineProperty(validationState, field, {
        get() {
            return this[`_${field}`];
        },
        set(value) {
            this[`_${field}`] = value;
            updateSubmitButton();
        }
    });
    validationState[field] = validationState[field];
});
function handleFormSubmit(event) {
    event.preventDefault();
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (isUsernameValid && isEmailValid && isPhoneValid && 
        isPasswordValid && isConfirmPasswordValid) {
        const formData = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim() || 'Не указан',
            password: passwordInput.value
        };
        console.log('Данные формы:', formData);
        successModal.style.display = 'flex';
        setTimeout(() => {
            form.reset();
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.classList.remove('success', 'error');
            });
            Object.keys(validationState).forEach(key => {
                validationState[key] = key === 'phone';
            });
            const icons = form.querySelectorAll('.toggle-password i');
            icons.forEach(icon => {
                icon.className = 'fas fa-eye';
            });
            passwordInput.setAttribute('type', 'password');
            confirmPasswordInput.setAttribute('type', 'password');
            usernameInput.focus();
        }, 2000);
    }
}

function validatePassword() {
    const password = passwordInput.value;
    
    if (password === '') {
        showError(passwordInput, passwordError, 'Пароль обязателен');
        validationState.password = false;
        return false;
    } else if (password.length < 6) {
        showError(passwordInput, passwordError, 'Пароль должен содержать не менее 6 символов');
        validationState.password = false;
        return false;
    } else {
        showSuccess(passwordInput, passwordError);
        validationState.password = true;
        if (confirmPasswordInput.value !== '') {
            validateConfirmPassword();
        }
        
        return true;
    }
}
function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword === '') {
        showError(confirmPasswordInput, confirmPasswordError, 'Подтверждение пароля обязательно');
        validationState.confirmPassword = false;
        return false;
    } else if (password !== confirmPassword) {
        showError(confirmPasswordInput, confirmPasswordError, 'Пароли не совпадают');
        validationState.confirmPassword = false;
        return false;
    } else {
        showSuccess(confirmPasswordInput, confirmPasswordError);
        validationState.confirmPassword = true;
        return true;
    }
}
function initEventListeners() {
    phoneInput.addEventListener('input', function() {
        this.value = formatPhoneNumber(this.value);
        validatePhone();
    });
    togglePasswordBtn.addEventListener('click', () => {
        togglePasswordVisibility(passwordInput, togglePasswordBtn);
    });
    
    toggleConfirmPasswordBtn.addEventListener('click', () => {
        togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn);
    });
    usernameInput.addEventListener('input', validateUsername);
    usernameInput.addEventListener('blur', validateUsername);
    
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    
    phoneInput.addEventListener('input', validatePhone);
    phoneInput.addEventListener('blur', validatePhone);
    
    passwordInput.addEventListener('input', validatePassword);
    passwordInput.addEventListener('blur', validatePassword);
    
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    form.addEventListener('submit', handleFormSubmit);
    closeModalBtn.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    updateSubmitButton();
});