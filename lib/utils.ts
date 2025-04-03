import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Transforms a phone number to the format: "XXYXXXXXXXXX"
 * Where XX is the country code, followed by a 9, followed by the 10-digit phone number
 */
export function transformPhoneNumber(
  phoneNumber: string,
  countryCode: string = "54"
): string {
  // Remove all non-numeric characters
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  // Ensure we have a 10-digit phone number
  if (cleanedNumber.length !== 10) {
    throw new Error("El número de teléfono debe tener 10 dígitos");
  }

  // Format as "XXYXXXXXXXXX" (country code + 9 + phone number)
  return `${countryCode}9${cleanedNumber}`;
}

/**
 * Validates a phone number format
 * Returns true if valid, false otherwise
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Remove all non-numeric characters
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  // Check if we have exactly 10 digits
  return cleanedNumber.length === 10;
}

