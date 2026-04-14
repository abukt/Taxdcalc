// app/sacrifice/constants.js

// Color Constants
export const COLORS = {
    PRIMARY: '#FF5733',
    SECONDARY: '#C70039',
    ACCENT: '#900C3F',
    BACKGROUND: '#F0F0F0',
    TEXT: '#333333',
};

// Tax Thresholds
export const TAX_THRESHOLDS = {
    LOW: 10000,
    MEDIUM: 30000,
    HIGH: 60000,
};

// Utility Functions
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const calculateTax = (salary) => {
    if (salary <= TAX_THRESHOLDS.LOW) return 0;
    if (salary <= TAX_THRESHOLDS.MEDIUM) return (salary - TAX_THRESHOLDS.LOW) * 0.1;
    if (salary <= TAX_THRESHOLDS.HIGH) return 2000 + (salary - TAX_THRESHOLDS.MEDIUM) * 0.2;
    return 8000 + (salary - TAX_THRESHOLDS.HIGH) * 0.3;
};
