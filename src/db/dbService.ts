// Client-side database service using a singleton for in-memory storage
// This avoids localStorage and provides a consistent API

import { initializeDatabase } from './initData';

export interface User {
  id: number;
  name: string;
  nickname: string;
  title: string;
  password: string;
  questions?: Question[];
}

export interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  wrongAnswers: string[];
}

export interface SiteConfig {
  [key: string]: string;
}

// Define the database structure interface
export interface DatabaseData {
  users: User[];
  siteConfig: SiteConfig;
  errorMessages: string[];
}

// In-memory database singleton
class Database {
  private static instance: Database;
  private users: User[] = [];
  private siteConfig: SiteConfig = {};
  private errorMessages: string[] = [];
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const data = await initializeDatabase() as DatabaseData;
      if (data) {
        this.users = data.users;
        this.siteConfig = data.siteConfig;
        this.errorMessages = data.errorMessages;
        this.initialized = true;
      } else {
        console.error('Failed to initialize database');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getUserByPassword(password: string): User | null {
    return this.users.find((user) => user.password === password) || null;
  }

  public getSiteConfig(): SiteConfig {
    return this.siteConfig;
  }

  public getErrorMessages(): string[] {
    return this.errorMessages;
  }
}

class DBService {
  private database: Database;
  
  constructor() {
    this.database = Database.getInstance();
    // Initialize the database when the service is created
    this.database.initialize();
  }
  
  // Get all users with their questions
  getAllUsers(): User[] {
    return this.database.getUsers();
  }
  
  // Get a single user by password
  getUserByPassword(password: string): User | null {
    return this.database.getUserByPassword(password);
  }
  
  // Get site configuration
  getSiteConfig(): SiteConfig {
    return this.database.getSiteConfig();
  }
  
  // Get error messages
  getErrorMessages(): string[] {
    return this.database.getErrorMessages();
  }
}

// Export a singleton instance
export default new DBService(); 