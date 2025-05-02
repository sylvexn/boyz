import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import DecryptedText from '../textanimations/DecryptedText/DecryptedText';
import ClickSpark from '../animations/ClickSpark/ClickSpark';
import FadeContent from '../animations/FadeContent/FadeContent';
import GlitchText from '../textanimations/GlitchText/GlitchText';
import FuzzyText from '../textanimations/FuzzyText/FuzzyText';

const QuestionnaireScreen: React.FC = () => {
  const { state, answerQuestion, siteConfig } = useApp();
  const { currentUser, currentQuestionIndex, isLoading } = state;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(true);
  const [showWrongFuzz, setShowWrongFuzz] = useState(false);
  const [randomizedOptions, setRandomizedOptions] = useState<string[]>([]);
  
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
    
    // Reset animation states
    setQuestionVisible(false);
    setShowWrongFuzz(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    
    // Small delay before showing new question to ensure animation resets
    const timer = setTimeout(() => {
      setQuestionVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, currentQuestion]);

  if (!currentUser || !currentQuestion) return null;

  const progressText = siteConfig.progressLabel
    .replace('[CURRENT]', (currentQuestionIndex + 1).toString())
    .replace('[TOTAL]', currentUser.questions.length.toString());

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    // Check if answer is correct
    const correct = currentQuestion.correctAnswer === answer;
    setIsCorrect(correct);
    
    if (!correct) {
      // If the answer is wrong, show the fuzzy effect
      setShowWrongFuzz(true);
      
      // Show feedback for longer (1200ms) before going back to question 1
      setTimeout(() => {
        answerQuestion(answer);
      }, 1200);
    } else {
      // Show feedback for 800ms before proceeding to next question
      setTimeout(() => {
        answerQuestion(answer);
      }, 800);
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
            <FadeContent 
              delay={200}
              duration={800}
              key={`fade-${currentQuestionIndex}`}
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
                  transition: 'opacity 0.3s ease',
                  opacity: questionVisible ? 1 : 0
                }}>
                  {questionVisible && (
                    showWrongFuzz ? (
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
                        key={`question-${currentQuestionIndex}`}
                        text={currentQuestion.text}
                        speed={80} // Slowed down for better visibility
                        maxIterations={30}
                        sequential={true}
                        characters="!@#$%^&*()_+-=[]{}|;:,./<>?"
                        animateOn="view"
                      />
                    )
                  )}
                </div>
                
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '2rem',
                    transition: 'opacity 0.3s ease',
                    opacity: questionVisible ? 1 : 0
                  }}
                >
                  {questionVisible && randomizedOptions.map((option, index) => (
                    <ClickSpark
                      key={`option-${currentQuestionIndex}-${index}`}
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
            </FadeContent>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireScreen; 