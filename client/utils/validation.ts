// Form validation utilities

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    // Allow various phone formats
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
};

export const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
    return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
    return value.trim().length <= maxLength;
};

export const sanitizeString = (value: string): string => {
    // Basic XSS prevention
    return value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

export interface ValidationErrors {
    [key: string]: string;
}

export const validateContactForm = (formData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!validateRequired(formData.name)) {
        errors.name = 'Name is required';
    }

    if (!validateRequired(formData.email)) {
        errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
    }

    if (!validateRequired(formData.subject)) {
        errors.subject = 'Please select a subject';
    }

    if (!validateRequired(formData.message)) {
        errors.message = 'Message is required';
    } else if (!validateMinLength(formData.message, 10)) {
        errors.message = 'Message must be at least 10 characters';
    } else if (!validateMaxLength(formData.message, 2000)) {
        errors.message = 'Message must not exceed 2000 characters';
    }

    return errors;
};

export const validateReviewForm = (formData: {
    name: string;
    email: string;
    rating: number;
    review: string;
    location: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!validateRequired(formData.name)) {
        errors.name = 'Name is required';
    }

    if (!validateRequired(formData.email)) {
        errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (formData.rating < 1 || formData.rating > 5) {
        errors.rating = 'Please select a rating';
    }

    if (!validateRequired(formData.review)) {
        errors.review = 'Review is required';
    } else if (!validateMinLength(formData.review, 20)) {
        errors.review = 'Review must be at least 20 characters';
    } else if (!validateMaxLength(formData.review, 1000)) {
        errors.review = 'Review must not exceed 1000 characters';
    }

    if (!validateRequired(formData.location)) {
        errors.location = 'Location is required';
    }

    return errors;
};

export const validateTransformationForm = (formData: {
    name: string;
    age: string;
    storyTitle: string;
    story: string;
    location: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!validateRequired(formData.name)) {
        errors.name = 'Name is required';
    }

    if (!validateRequired(formData.age)) {
        errors.age = 'Age is required';
    }

    if (!validateRequired(formData.storyTitle)) {
        errors.storyTitle = 'Story title is required';
    } else if (!validateMaxLength(formData.storyTitle, 100)) {
        errors.storyTitle = 'Title must not exceed 100 characters';
    }

    if (!validateRequired(formData.story)) {
        errors.story = 'Story is required';
    } else if (!validateMinLength(formData.story, 50)) {
        errors.story = 'Story must be at least 50 characters';
    } else if (!validateMaxLength(formData.story, 3000)) {
        errors.story = 'Story must not exceed 3000 characters';
    }

    if (!validateRequired(formData.location)) {
        errors.location = 'Location is required';
    }

    return errors;
};
