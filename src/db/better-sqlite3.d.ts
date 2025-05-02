declare module 'better-sqlite3' {
  interface Database {
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
    transaction<T>(fn: () => T): () => T;
  }

  interface Statement {
    run(...params: any[]): { lastInsertRowid: number };
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  interface DatabaseConstructor {
    new (path: string, options?: any): Database;
    (path: string, options?: any): Database;
  }

  const Database: DatabaseConstructor;
  export = Database;
} 