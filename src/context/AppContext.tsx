import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import dbService, { User as DBUser, Question as DBQuestion } from '../db/dbService';

type BackgroundType = 'letterglitch' | 'griddistortion' | 'dither' | 'balatro';

interface User {
  id: number;
  name: string;
  nickname: string;
  title: string;
  password: string;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  wrongAnswers: string[];
}

interface SiteConfig {
  [key: string]: string;
  successMessage: string;
  restartButtonText: string;
  nextButtonText: string;
  progressLabel: string;
}

interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
  currentQuestionIndex: number;
  isQuestionnaireComplete: boolean;
  isLoading: boolean;
  background: BackgroundType;
  showLoginError: boolean;
  errorMessage: string;
  isAppReady: boolean;
}

interface AppContextType {
  state: AppState;
  authenticate: (password: string) => Promise<boolean>;
  answerQuestion: (answer: string) => void;
  resetQuestionnaire: () => void;
  completeQuestionnaire: () => void;
  setBackground: (background: BackgroundType) => void;
  users: User[];
  errorMessages: string[];
  siteConfig: SiteConfig;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default error messages if not in DB
const defaultErrorMessages = [
  "hmm, that's not right. try again.",
  "nope, password incorrect.",
  "sorry, can't let you in with that.",
  "access denied. try a different password.",
  "that's not the password we're looking for."
];

// Default site config if not in DB
const defaultSiteConfig: SiteConfig = {
  successMessage: "welcome [title] [name]! you've successfully completed the security check.",
  restartButtonText: "restart",
  nextButtonText: "next",
  progressLabel: "question [CURRENT]/[TOTAL]"
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [errorMessages, setErrorMessages] = useState<string[]>(defaultErrorMessages);
  
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    currentUser: null,
    currentQuestionIndex: 0,
    isQuestionnaireComplete: false,
    isLoading: false,
    background: 'letterglitch',
    showLoginError: false,
    errorMessage: '',
    isAppReady: false
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all users with their questions
        const dbUsers = dbService.getAllUsers();
        
        if (dbUsers && dbUsers.length > 0) {
          // Map DB users to ensure questions is not undefined
          const formattedUsers: User[] = dbUsers.map(dbUser => ({
            id: dbUser.id,
            name: dbUser.name,
            nickname: dbUser.nickname,
            title: dbUser.title,
            password: dbUser.password,
            questions: dbUser.questions || []
          }));
          setUsers(formattedUsers);
        }
        
        // Get site config
        const dbConfig = dbService.getSiteConfig();
        if (Object.keys(dbConfig).length > 0) {
          setSiteConfig({
            ...defaultSiteConfig,
            ...dbConfig
          });
        }
        
        // Get error messages
        const dbErrorMessages = dbService.getErrorMessages();
        if (dbErrorMessages.length > 0) {
          setErrorMessages(dbErrorMessages);
        }

        // Mark app as ready
        setState(prev => ({
          ...prev,
          isAppReady: true
        }));
      } catch (error) {
        console.error('Failed to load data:', error);
        // If loading fails, we'll use default values and still mark as ready
        setState(prev => ({
          ...prev,
          isAppReady: true
        }));
      }
    };

    loadData();
  }, []);

  const authenticate = async (password: string): Promise<boolean> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      showLoginError: false,
      background: 'griddistortion'
    }));

    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Special test bypass password
      if (password.toLowerCase() === 'cheese') {
        // Create fake test user
        const fakeUser: User = {
          id: 9999,
          name: "Test User",
          nickname: "tester",
          title: "test account",
          password: "cheese",
          questions: [
            {
              id: 9001,
              text: "Lorem ipsum dolor sit amet?",
              correctAnswer: "Yes",
              wrongAnswers: ["No", "Maybe", "Sometimes"]
            },
            {
              id: 9002,
              text: "Consectetur adipiscing elit?",
              correctAnswer: "Absolutely",
              wrongAnswers: ["Never", "Occasionally", "Rarely"]
            },
            {
              id: 9003,
              text: "Sed do eiusmod tempor incididunt?",
              correctAnswer: "Confirmed",
              wrongAnswers: ["Denied", "Unknown", "Uncertain"]
            }
          ]
        };
        
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          currentUser: fakeUser,
          isLoading: false,
          background: 'dither'
        }));
        
        return true;
      }
      
      // Regular authentication flow
      const user = dbService.getUserByPassword(password);
      
      if (user) {
        // Ensure questions is not undefined
        const formattedUser: User = {
          id: user.id,
          name: user.name,
          nickname: user.nickname,
          title: user.title,
          password: user.password,
          questions: user.questions || []
        };
        
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          currentUser: formattedUser,
          isLoading: false,
          background: 'dither'
        }));
        
        return true;
      } else {
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        setState(prev => ({
          ...prev,
          isLoading: false,
          showLoginError: true,
          errorMessage: randomError,
          background: 'letterglitch'
        }));
        
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        showLoginError: true,
        errorMessage: "an error occurred. please try again.",
        background: 'letterglitch'
      }));
      
      return false;
    }
  };

  const answerQuestion = (answer: string) => {
    if (!state.currentUser) return;

    const currentQuestion = state.currentUser.questions[state.currentQuestionIndex];
    
    if (answer === currentQuestion.correctAnswer) {
      // Correct answer
      if (state.currentQuestionIndex === state.currentUser.questions.length - 1) {
        // Last question answered correctly
        completeQuestionnaire();
      } else {
        // More questions to go
        setState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }));
      }
    } else {
      // Wrong answer - reset to beginning
      resetQuestionnaire();
    }
  };

  const resetQuestionnaire = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0
    }));
  };

  const completeQuestionnaire = () => {
    setState(prev => ({
      ...prev,
      isQuestionnaireComplete: true,
      background: 'balatro'
    }));
    
    // No longer need to switch back to dither
    // The BackgroundTransition component will handle the smooth transition
  };

  const setBackground = (background: BackgroundType) => {
    setState(prev => ({
      ...prev,
      background
    }));
  };

  // Show loading indicator until data is loaded
  if (!state.isAppReady) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        state,
        authenticate,
        answerQuestion,
        resetQuestionnaire,
        completeQuestionnaire,
        setBackground,
        users,
        errorMessages,
        siteConfig
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 