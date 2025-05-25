// /src/utils/Validators.js

export const validatePassword = (password) => {
    const minLength = 6;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password?.length < minLength) {
        return 'Password must be at least 6 characters';
    }
    if (!hasNumber.test(password)) {
        return 'Password must contain at least one number';
    }
    if (!hasSpecialChar.test(password)) {
        return 'Password must contain at least one special character';
    }
    return null; // No error
};