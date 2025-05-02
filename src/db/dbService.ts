// Add type declaration for better-sqlite3
declare module 'better-sqlite3';

import Database from 'better-sqlite3';
import path from 'path';

// Types that match your current data structure
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

// Database question structure
interface DBQuestion {
  id: number;
  user_id: number;
  question_text: string;
  correct_answer: string;
  wrong_answers: string;
}

export interface SiteConfig {
  [key: string]: string;
}

class DBService {
  private db: Database;
  
  constructor() {
    // In production, DB will be in the build directory
    const dbPath = process.env.NODE_ENV === 'production'
      ? path.resolve('./db/groomsmen.sqlite')
      : path.resolve('./src/db/groomsmen.sqlite');
    
    this.db = new Database(dbPath);
  }
  
  // Get all users with their questions
  getAllUsers(): User[] {
    const users = this.db.prepare('SELECT * FROM users').all() as User[];
    
    return users.map(user => {
      const questions = this.db.prepare('SELECT * FROM questions WHERE user_id = ?').all(user.id) as DBQuestion[];
      
      // Map database field names to our interface
      const formattedQuestions = questions.map((q: DBQuestion) => ({
        id: q.id,
        text: q.question_text,
        correctAnswer: q.correct_answer,
        wrongAnswers: JSON.parse(q.wrong_answers)
      }));
      
      return {
        ...user,
        questions: formattedQuestions
      };
    });
  }
  
  // Get a single user by password
  getUserByPassword(password: string): User | null {
    const user = this.db.prepare('SELECT * FROM users WHERE password = ?').get(password) as User | undefined;
    
    if (!user) return null;
    
    const questions = this.db.prepare('SELECT * FROM questions WHERE user_id = ?').all(user.id) as DBQuestion[];
    
    // Map database field names to our interface
    const formattedQuestions = questions.map((q: DBQuestion) => ({
      id: q.id,
      text: q.question_text,
      correctAnswer: q.correct_answer,
      wrongAnswers: JSON.parse(q.wrong_answers)
    }));
    
    return {
      ...user,
      questions: formattedQuestions
    };
  }
  
  // Get site configuration
  getSiteConfig(): SiteConfig {
    const configs = this.db.prepare('SELECT * FROM site_config').all() as { key: string; value: string }[];
    
    return configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as SiteConfig);
  }
  
  // Get error messages
  getErrorMessages(): string[] {
    const messages = this.db.prepare('SELECT message FROM error_messages').all() as { message: string }[];
    return messages.map(m => m.message);
  }
  
  // Close the database connection
  close(): void {
    this.db.close();
  }
}

export default new DBService(); 