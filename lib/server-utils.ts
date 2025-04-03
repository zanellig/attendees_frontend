import 'server-only'
import { dbType } from './constants';


// Function to prepare ID parameter based on database type
export const prepareIdParam = (id: string) => {
  // For PostgreSQL, ensure the ID is treated as an integer
  if (dbType === "postgres") {
    return parseInt(id);
  }
  // For MySQL, return as is
  return id;
};
