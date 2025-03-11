import { Pool, PoolClient, PoolConfig } from "pg";
import { Database } from "./database.interface";

export class PostgresDatabase implements Database {
  private pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  async query<T = any>(sql: string, params?: any[]): Promise<[T[], any]> {
    console.log("PostgreSQL query:", sql);
    console.log("PostgreSQL params:", params);

    const result = await this.pool.query(sql, params);
    console.log("PostgreSQL result:", result);

    // PostgreSQL returns rows in result.rows
    // For operations with RETURNING clause, the rows will contain the returned data
    // For operations without RETURNING, the rows array might be empty
    return [result.rows as T[], result] as [T[], any];
  }

  async getConnection(): Promise<PoolClient> {
    return this.pool.connect();
  }

  releaseConnection(connection: PoolClient): void {
    connection.release();
  }

  async beginTransaction(connection: PoolClient): Promise<void> {
    await connection.query("BEGIN");
  }

  async commit(connection: PoolClient): Promise<void> {
    await connection.query("COMMIT");
  }

  async rollback(connection: PoolClient): Promise<void> {
    await connection.query("ROLLBACK");
  }

  async end(): Promise<void> {
    await this.pool.end();
  }
}
