/**
 * This script sets up the initial database for the application.
 * Run this script once to initialize the database from the groomsmen-data.json file.
 * 
 * The database file is stored in src/db/groomsmen.sqlite and should be gitignored.
 * 
 * Usage:
 * - Make sure better-sqlite3 is installed: npm install better-sqlite3
 * - Run: node src/db/setup.js
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Paths
const DB_PATH = path.join(__dirname, 'groomsmen.sqlite');
const DATA_PATH = path.join(__dirname, 'groomsmen-data.json');

console.log('Setting up the database...');

// Check if the JSON data file exists
if (!fs.existsSync(DATA_PATH)) {
  console.error(`Error: ${DATA_PATH} does not exist!`);
  console.log(`Please create a groomsmen-data.json file in the src/db directory with the following structure:
  
{
  "users": [
    {
      "name": "Full Name",
      "nickname": "Nickname",
      "title": "Position (e.g., Best Man)",
      "password": "unique-password",
      "questions": [
        {
          "question": "Question text?",
          "answer": "Correct answer",
          "options": ["Wrong answer 1", "Correct answer", "Wrong answer 2", "Wrong answer 3"]
        },
        // More questions...
      ]
    },
    // More users...
  ],
  "errorMessages": [
    "Error message 1",
    "Error message 2",
    // More error messages...
  ],
  "siteConfig": {
    "successMessage": "AUTHENTICATION SUCCESSFUL. WELCOME [TITLE] [NAME].",
    "restartButtonText": "START OVER",
    "nextButtonText": "NEXT QUESTION",
    "progressLabel": "QUESTION [CURRENT]/[TOTAL]"
  }
}
  `);
  process.exit(1);
}

// If database already exists, confirm before overwriting
if (fs.existsSync(DB_PATH)) {
  console.warn(`Warning: ${DB_PATH} already exists!`);
  console.log('Removing existing database...');
  fs.unlinkSync(DB_PATH);
}

// Create the database
const db = new Database(DB_PATH);

// Read user data from JSON
let userData;
try {
  const fileData = fs.readFileSync(DATA_PATH, 'utf8');
  userData = JSON.parse(fileData);
} catch (error) {
  console.error('Error reading or parsing groomsmen-data.json:', error);
  process.exit(1);
}

// Create required tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    title TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    wrong_answers TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS error_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL
  )
`);

// Prepare statements
const insertUser = db.prepare('INSERT INTO users (name, nickname, title, password) VALUES (?, ?, ?, ?)');
const insertQuestion = db.prepare('INSERT INTO questions (user_id, question_text, correct_answer, wrong_answers) VALUES (?, ?, ?, ?)');
const insertConfig = db.prepare('INSERT INTO site_config (key, value) VALUES (?, ?)');
const insertErrorMessage = db.prepare('INSERT INTO error_messages (message) VALUES (?)');

// Start transaction
const transaction = db.transaction(() => {
  // Insert users and their questions
  userData.users.forEach(user => {
    const { name, nickname, title, password, questions } = user;
    
    // Insert user
    const userResult = insertUser.run(name, nickname, title, password);
    const userId = userResult.lastInsertRowid;
    
    // Insert questions
    questions.forEach(q => {
      // Get all options except the correct answer for wrong answers
      const wrongAnswers = q.options.filter(opt => opt !== q.answer);
      const wrongAnswersJson = JSON.stringify(wrongAnswers);
      
      insertQuestion.run(userId, q.question, q.answer, wrongAnswersJson);
    });
  });
  
  // Insert error messages
  if (userData.errorMessages) {
    userData.errorMessages.forEach(message => {
      insertErrorMessage.run(message);
    });
  }
  
  // Insert site config
  if (userData.siteConfig) {
    Object.entries(userData.siteConfig).forEach(([key, value]) => {
      insertConfig.run(key, value);
    });
  }
});

// Run transaction
try {
  transaction();
  console.log('✅ Database setup complete! Path:', DB_PATH);
  console.log(`
Add this file to your .gitignore:
src/db/groomsmen.sqlite
`);
} catch (error) {
  console.error('❌ Database setup failed:', error);
} finally {
  db.close();
} 