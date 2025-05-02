// This file loads and transforms the groomsmen-data.json file 
// to initialize our application data in a browser-compatible way

// Import the sample data directly - webpack will bundle this
import groomsmenData from '../../groomsmen-data.json';

// Transform the data to match the format expected by our application
export function initializeData() {
  try {
    // Check if data is already initialized
    const existingData = localStorage.getItem('groomsmenData');
    if (existingData) {
      return JSON.parse(existingData);
    }

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

    // Store in localStorage
    localStorage.setItem('groomsmenData', JSON.stringify(transformedData));
    return transformedData;
  } catch (error) {
    console.error('Error initializing data:', error);
    return null;
  }
}

export default initializeData; 