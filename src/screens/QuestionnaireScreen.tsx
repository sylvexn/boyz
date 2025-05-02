import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import DecryptedText from '../textanimations/DecryptedText/DecryptedText';
import ClickSpark from '../animations/ClickSpark/ClickSpark';
import GlitchText from '../textanimations/GlitchText/GlitchText';
import FuzzyText from '../textanimations/FuzzyText/FuzzyText';

const QuestionnaireScreen: React.FC = () => {
  const { state, answerQuestion, resetQuestionnaire, siteConfig } = useApp();
  const { currentUser, currentQuestionIndex, isLoading } = state;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(true);
  const [showWrongFuzz, setShowWrongFuzz] = useState(false);
  const [randomizedOptions, setRandomizedOptions] = useState<string[]>([]);
  const [questionKey, setQuestionKey] = useState<string>(`question-${currentQuestionIndex}-initial`);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // On component mount, mark that we've completed initial render
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
    }
  }, [isInitialRender]);
  
  // Memoize the current question to avoid recreating it
  const currentQuestion = useMemo(() => {
    if (!currentUser || !currentUser.questions[currentQuestionIndex]) return null;
    return currentUser.questions[currentQuestionIndex];
  }, [currentUser, currentQuestionIndex]);
  
  // When the question changes, randomize the options once and store them
  useEffect(() => {
    if (!currentQuestion) return;
    
    const optionsArray = [
      currentQuestion.correctAnswer, 
      ...currentQuestion.wrongAnswers
    ];
    
    // Shuffle the array
    const shuffled = [...optionsArray].sort(() => Math.random() - 0.5);
    setRandomizedOptions(shuffled);
    
    // Skip animation on initial render to avoid double loading
    if (!isInitialRender && questionKey !== `question-${currentQuestionIndex}-initial`) {
      // Update the question key to force re-rendering
      setQuestionKey(`question-${currentQuestionIndex}-${Date.now()}`);
      
      // Reset states on question change
      setShowWrongFuzz(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsTransitioning(false);
      
      // Only animate transitions for non-initial renders
      setQuestionVisible(false);
      setTimeout(() => {
        setQuestionVisible(true);
      }, 50);
    }
  }, [currentQuestionIndex, currentQuestion, questionKey, isInitialRender]);

  if (!currentUser || !currentQuestion) return null;

  const progressText = siteConfig.progressLabel
    .replace('[CURRENT]', (currentQuestionIndex + 1).toString())
    .replace('[TOTAL]', currentUser.questions.length.toString());

  const handleAnswerClick = (answer: string) => {
    if (isTransitioning) return; // Prevent multiple clicks during transitions
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setIsTransitioning(true);
    
    // Check if answer is correct
    const correct = currentQuestion.correctAnswer === answer;
    setIsCorrect(correct);
    
    if (correct) {
      // For correct answers: show green feedback, then proceed
      setTimeout(() => {
        answerQuestion(answer);
        setIsTransitioning(false);
      }, 800);
    } else {
      // For wrong answers: show fuzzy text, fade out, then reset to question 1
      setShowWrongFuzz(true);
      
      // Begin fade out after 500ms (halfway through the 1s feedback period)
      setTimeout(() => {
        setQuestionVisible(false);
      }, 500);
      
      // After 1s total (feedback time), reset to question 1
      setTimeout(() => {
        resetQuestionnaire();
        setShowWrongFuzz(false);
        setShowFeedback(false);
        setSelectedAnswer(null);
        
        // Brief delay to ensure state updates process
        setTimeout(() => {
          setQuestionKey(`reset-${Date.now()}`);
          setQuestionVisible(true);
          setIsTransitioning(false);
        }, 50);
      }, 1000);
    }
  };

  const getButtonStyle = (option: string) => {
    if (!showFeedback || selectedAnswer !== option) {
      return {};
    }
    
    if (isCorrect) {
      return { 
        backgroundColor: 'rgba(0, 255, 0, 0.3)', 
        borderColor: '#00ff00',
        color: '#e0e0e0'
      };
    } else {
      return { 
        backgroundColor: 'rgba(255, 0, 0, 0.3)', 
        borderColor: '#ff0000',
        color: '#e0e0e0'
      };
    }
  };

  return (
    <div className="centered">
      <div className="container">
        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100px',
            textAlign: 'center',
            fontSize: '2rem',
            color: '#00ff7f'
          }}>
            <GlitchText
              speed={0.9}
              enableShadows={true}
            >
              loading . . .
            </GlitchText>
          </div>
        ) : (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div 
              style={{
                opacity: questionVisible ? 1 : 0,
                transition: 'opacity 500ms ease-out', // Consistently 0.5s fade transition
              }}
            >
              <div>
                <p 
                  style={{ 
                    fontSize: '0.9rem', 
                    opacity: 0.7, 
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  {progressText}
                </p>
                
                <div style={{ 
                  marginBottom: '2rem', 
                  minHeight: '60px',
                }}>
                  {showWrongFuzz ? (
                    <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                      <FuzzyText 
                        color="#ff4d4d"
                        baseIntensity={0.4}
                        fontSize="1.2rem"
                      >
                        {currentQuestion.text}
                      </FuzzyText>
                    </div>
                  ) : (
                    <DecryptedText
                      key={questionKey}
                      text={currentQuestion.text}
                      speed={40} 
                      maxIterations={30}
                      sequential={true}
                      characters="!@#$%^&*()_+-=[]{}|;:,./<>?"
                      animateOn="view"
                    />
                  )}
                </div>
                
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '2rem',
                  }}
                >
                  {randomizedOptions.map((option, index) => (
                    <ClickSpark
                      key={`${questionKey}-option-${index}`}
                      sparkColor="#00ff7f"
                      sparkSize={5}
                      sparkCount={8}
                      duration={300}
                    >
                      <button
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'center',
                          ...getButtonStyle(option)
                        }}
                        onClick={() => handleAnswerClick(option)}
                        disabled={showFeedback}
                      >
                        {showWrongFuzz && selectedAnswer === option ? (
                          <FuzzyText 
                            color="#ff4d4d"
                            baseIntensity={0.4}
                            fontSize="1rem"
                          >
                            {option}
                          </FuzzyText>
                        ) : (
                          option
                        )}
                      </button>
                    </ClickSpark>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireScreen; 