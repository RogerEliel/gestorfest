
// Utility functions for phone number validation and formatting

/**
 * Validates if a phone number is in correct format
 */
export function isValidPhoneNumber(phone: string): boolean {
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
}

/**
 * Formats a phone number to international format with + if needed
 */
export function formatPhoneNumber(phone: string): string {
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
}

/**
 * CORS headers for responses
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};
