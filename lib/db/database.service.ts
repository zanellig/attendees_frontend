import { Database } from "./database.interface";
import { DatabaseFactory, DatabaseType } from "./database.factory";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get database type from environment variables, default to MySQL
const dbType = (process.env.DATABASE_TYPE || "mysql") as DatabaseType;
console.log("Database type:", dbType);

// Create database configuration based on the database type
const getDbConfig = () => {
  switch (dbType) {
    case "mysql":
      return {
        host: process.env.DATABASE_HOST || "localhost",
        user: process.env.DATABASE_USER || "root",
        password: process.env.DATABASE_PASSWORD || "",
        database: process.env.DATABASE_NAME || "events_db",
        port: process.env.DATABASE_PORT
          ? parseInt(process.env.DATABASE_PORT)
          : 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      };
    case "postgres":
      return {
        host: process.env.DATABASE_HOST || "localhost",
        user: process.env.DATABASE_USER || "postgres",
        password: process.env.DATABASE_PASSWORD || "",
        database: process.env.DATABASE_NAME || "events_db",
        port: process.env.DATABASE_PORT
          ? parseInt(process.env.DATABASE_PORT)
          : 5432,
        max: 10, // Connection pool max size
        idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      };
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
};

// Create the database instance
const db: Database = DatabaseFactory.createDatabase(dbType, getDbConfig());

// SQL query transformers for different database types
export const transformQuery = (sql: string): string => {
  if (dbType === "postgres") {
    // Replace MySQL-style parameter placeholders (?) with PostgreSQL-style placeholders ($1, $2, etc.)
    let paramIndex = 0;
    const transformedSql = sql.replace(/\?/g, () => `$${++paramIndex}`);
    console.log("Transformed SQL:", transformedSql);
    return transformedSql;
  }
  return sql;
};

export default db;
