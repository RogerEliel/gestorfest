
// Validates a phone number in international format (e.g. +5511999999999)
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters except for the + at the beginning
  const cleanedPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if the phone starts with + and has at least 8 digits
  if (/^\+\d{8,15}$/.test(cleanedPhone)) {
    return true;
  }
  
  // Check if the phone is just digits and has at least 8 digits
  if (/^\d{8,15}$/.test(cleanedPhone)) {
    return true;
  }
  
  return false;
};

// Format a phone number to international format with + if needed
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If the phone already starts with +, return it as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // For Brazilian numbers
  if (digits.length === 11 || digits.length === 10) {
    return `+55${digits}`;
  }
  
  // If not recognized as Brazilian, just add + at the beginning
  return `+${digits}`;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate if a password meets the minimum requirements
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
  return passwordRegex.test(password);
};

// Validate CSV file format
export const isValidCSVFile = (file: File): boolean => {
  return file.type === 'text/csv' || file.name.endsWith('.csv');
};
