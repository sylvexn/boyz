// Client-side database service using localStorage instead of SQLite
// This solves the Node.js dependency issues when running in the browser

import initializeData from './initData';

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

// Sample data to use when no localStorage data is available
const SAMPLE_DATA = {
  "users": [
    {
      "id": 1,
      "name": "Brandon",
      "nickname": "big b",
      "title": "Best Man",
      "password": "uniquePassword1",
      "questions": [
        {
          "id": 1,
          "text": "When did we first meet?",
          "correctAnswer": "College",
          "wrongAnswers": ["High School", "Work", "Through Friends"]
        },
        {
          "id": 2,
          "text": "What was our favorite hangout spot?",
          "correctAnswer": "Joe's Diner",
          "wrongAnswers": ["Campus Library", "The Park", "Mike's Apartment"]
        }
      ]
    }
  ],
  "errorMessages": [
    "nah",
    "wrong",
    "bye",
    "go away",
    "nty",
    "STOP PLEASE IT HURTS MY EYES",
    "no",
    "try again"
  ],
  "siteConfig": {
    "successMessage": "AUTHENTICATION SUCCESSFUL. WELCOME [TITLE] [NAME].",
    "restartButtonText": "START OVER",
    "nextButtonText": "NEXT QUESTION",
    "progressLabel": "QUESTION [CURRENT]/[TOTAL]"
  }
};

class DBService {
  private data: any;
  
  constructor() {
    this.initializeData();
  }
  
  private initializeData() {
    try {
      // Use the initialization utility to load data from the JSON file
      // This will also check localStorage first
      const data = initializeData();
      
      if (data) {
        this.data = data;
      } else {
        // Fallback to sample data if initializing from JSON fails
        this.data = SAMPLE_DATA;
        // Store it in localStorage for future use
        localStorage.setItem('groomsmenData', JSON.stringify(this.data));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      // Fallback to sample data if there's an error
      this.data = SAMPLE_DATA;
    }
  }
  
  // Get all users with their questions
  getAllUsers(): User[] {
    try {
      return this.data.users || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }
  
  // Get a single user by password
  getUserByPassword(password: string): User | null {
    try {
      const user = this.data.users.find((u: User) => u.password === password);
      return user || null;
    } catch (error) {
      console.error('Error getting user by password:', error);
      return null;
    }
  }
  
  // Get site configuration
  getSiteConfig(): SiteConfig {
    try {
      return this.data.siteConfig || {};
    } catch (error) {
      console.error('Error getting site config:', error);
      return {};
    }
  }
  
  // Get error messages
  getErrorMessages(): string[] {
    try {
      return this.data.errorMessages || [];
    } catch (error) {
      console.error('Error getting error messages:', error);
      return [];
    }
  }
}

export default new DBService(); 