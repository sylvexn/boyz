const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Create database file
const db = new Database('src/db/groomsmen.sqlite');

// Read current user data
const userData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../groomsmen-data.json'), 'utf8'));

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    title TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Create questions table
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

// Create site_config table
db.exec(`
  CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

// Create error_messages table
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
transaction();

console.log('Database setup complete!');
db.close(); 