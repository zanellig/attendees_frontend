import { Database } from "./database.interface";
import { MySQLDatabase } from "./mysql.database";
import { PostgresDatabase } from "./postgres.database";
import mysql from "mysql2/promise";
import { PoolConfig as PgPoolConfig } from "pg";

export type DatabaseType = "mysql" | "postgres";

export class DatabaseFactory {
  /**
   * Create a database instance based on the specified type
   * @param type Database type ('mysql' or 'postgres')
   * @param config Database configuration
   * @returns Database instance
   */
  static createDatabase(type: DatabaseType, config: any): Database {
    switch (type) {
      case "mysql":
        return new MySQLDatabase(config as mysql.PoolOptions);
      case "postgres":
        return new PostgresDatabase(config as PgPoolConfig);
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }
}
