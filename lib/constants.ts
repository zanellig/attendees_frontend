/**
 * Shared constraint error messages for database operations
 */
export const CONSTRAINT_ERRORS = {
  unique_email: "El correo electrónico ya está en uso",
  unique_phone_number: "El número de teléfono ya está en uso",
  unique_name: "El nombre ya está en uso",
};

// Get database type from environment variables
export const dbType = process.env.DATABASE_TYPE || "mysql";