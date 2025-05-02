// This file loads data from groomsmen-data.json for the application
// It serves as a central place for initial data loading

import groomsmenData from './groomsmen-data.json';

/**
 * Initializes the database by loading data from the groomsmen-data.json file
 * No localStorage usage - data is loaded fresh on each app start
 * @returns {Promise<{users: Array, siteConfig: Object, errorMessages: Array}>} The transformed data object
 */
export async function initializeDatabase() {
  try {
    // Transform the data structure from the JSON file format
    // to the format our application expects
    const transformedData = {
      users: groomsmenData.users.map((user, index) => ({
        id: index + 1,
        name: user.name,
        nickname: user.nickname,
        title: user.title,
        password: user.password,
        questions: user.questions.map((q, qIndex) => ({
          id: qIndex + 1,
          text: q.question,
          correctAnswer: q.answer,
          wrongAnswers: q.options.filter(option => option !== q.answer)
        }))
      })),
      errorMessages: groomsmenData.errorMessages,
      siteConfig: groomsmenData.siteConfig
    };

    return transformedData;
  } catch (error) {
    console.error('Error initializing database:', error);
    return null;
  }
}

// For backward compatibility
export default function initializeData() {
  console.warn('initializeData is deprecated, use initializeDatabase instead');
  return initializeDatabase();
} 