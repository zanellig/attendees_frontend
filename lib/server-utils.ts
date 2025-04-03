import 'server-only'
import { dbType } from './constants';


// Function to prepare ID parameter based on database type
export const prepareIdParam = (id: string) => {
  // For PostgreSQL, ensure the ID is treated as an integer
  if (dbType === "postgres") {
    const parsedId = Number.parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new Error(`ID inválido: ${id}`);
    }
    return parsedId;
  }
  // For MySQL, return as is
  return id;
};
