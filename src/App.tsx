import React from 'react';
import { useApp } from './context/AppContext';
import AuthScreen from './screens/AuthScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import SuccessScreen from './screens/SuccessScreen';
import BackgroundSelector from './components/BackgroundSelector';

const App: React.FC = () => {
  const { state } = useApp();
  const { isAuthenticated, isQuestionnaireComplete } = state;

  return (
    <div className="app">
      <BackgroundSelector />
      
      {!isAuthenticated && <AuthScreen />}
      
      {isAuthenticated && !isQuestionnaireComplete && <QuestionnaireScreen />}
      
      {isAuthenticated && isQuestionnaireComplete && <SuccessScreen />}
    </div>
  );
};

export default App; 