import mysql from "mysql2/promise";
import { Database } from "./database.interface";

export class MySQLDatabase implements Database {
  private pool: mysql.Pool;

  constructor(config: mysql.PoolOptions) {
    this.pool = mysql.createPool(config);
  }

  async query<T = any>(sql: string, params?: any[]): Promise<[T[], any]> {
    const result = await this.pool.query(sql, params);
    return result as unknown as [T[], any];
  }

  async getConnection(): Promise<mysql.PoolConnection> {
    return this.pool.getConnection();
  }

  releaseConnection(connection: mysql.PoolConnection): void {
    connection.release();
  }

  async beginTransaction(connection: mysql.PoolConnection): Promise<void> {
    await connection.beginTransaction();
  }

  async commit(connection: mysql.PoolConnection): Promise<void> {
    await connection.commit();
  }

  async rollback(connection: mysql.PoolConnection): Promise<void> {
    await connection.rollback();
  }

  async end(): Promise<void> {
    await this.pool.end();
  }
}
