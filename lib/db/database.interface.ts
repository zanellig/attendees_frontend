/**
 * Database interface that defines the contract for database implementations
 */
export interface Database {
  /**
   * Execute a query with parameters
   * @param sql SQL query string
   * @param params Query parameters
   * @returns Promise with query results
   */
  query<T = any>(sql: string, params?: any[]): Promise<[T[], any]>;

  /**
   * Get a connection from the pool
   * @returns Promise with a connection
   */
  getConnection(): Promise<any>;

  /**
   * Release a connection back to the pool
   * @param connection Connection to release
   */
  releaseConnection(connection: any): void;

  /**
   * Begin a transaction
   * @param connection Connection to use for the transaction
   * @returns Promise
   */
  beginTransaction(connection: any): Promise<void>;

  /**
   * Commit a transaction
   * @param connection Connection with the active transaction
   * @returns Promise
   */
  commit(connection: any): Promise<void>;

  /**
   * Rollback a transaction
   * @param connection Connection with the active transaction
   * @returns Promise
   */
  rollback(connection: any): Promise<void>;

  /**
   * Close all connections in the pool
   * @returns Promise
   */
  end(): Promise<void>;
}
