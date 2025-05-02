import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GradientText from '../textanimations/GradientText/GradientText';
import Aurora from '../backgrounds/Aurora/Aurora';
import ClickSpark from '../animations/ClickSpark/ClickSpark';
import FadeContent from '../animations/FadeContent/FadeContent';
import MetaBalls from '../animations/MetaBalls/MetaBalls';

const AuthScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const { state, authenticate, setBackground } = useApp();
  const { isLoading, showLoginError, errorMessage } = state;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) return;
    
    // While loading, show the GridDistortion background
    if (!isLoading) {
      setBackground('griddistortion');
    }
    
    await authenticate(password);
  };

  return (
    <div className="centered">
      <div className="container">
        <div 
          className="card glassy"
          style={{ 
            maxWidth: '400px', 
            margin: '0 auto',
            position: 'relative',
            overflow: 'visible',
            backgroundColor: 'rgba(26, 35, 87, 0.25)', // More transparent royal blue
            borderColor: '#3949ab',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)', // For Safari
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(57, 73, 171, 0.2)'
          }}
        >
          {/* Aurora effect at the bottom of the card */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', overflow: 'hidden' }}>
            <Aurora 
              color1="#1a237e" // Darker royal blue
              color2="#4d69ff" // Vibrant blue
              color3="#00ff7f" // Accent color to make it pop
            />
          </div>
          
          <FadeContent 
            delay={0}
            duration={1000}
            threshold={0.1}
          >
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <GradientText 
                colors={["#8c9eff", "#536dfe", "#3d5afe"]}
                animationSpeed={8}
                showBorder={false}
              >
                authentication
              </GradientText>
            </div>
            
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', minHeight: '200px' }}>
                <div style={{ marginBottom: '1rem' }}>verifying credentials...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ 
                  marginBottom: '1.5rem',
                  background: 'rgba(0, 0, 0, 0.05)',
                  padding: '1rem',
                  borderRadius: '8px' 
                }}>
                  <input
                    type="password"
                    placeholder="enter password"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                    style={{ 
                      borderColor: '#536dfe',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      padding: '10px 15px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                {/* MetaBalls component below password input */}
                <div style={{ height: '150px', marginBottom: '2.5rem', position: 'relative', overflow: 'visible' }}>
                  <MetaBalls 
                    color="#536dfe"
                    cursorBallColor="#00ff7f"
                    speed={0.5}
                    animationSize={25}
                    ballCount={8}
                    clumpFactor={1.2}
                    cursorBallSize={2.5}
                    enableTransparency={true}
                  />
                </div>
                
                {showLoginError && (
                  <div style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>
                    {errorMessage}
                  </div>
                )}
                
                <ClickSpark
                  sparkColor="#536dfe"
                  sparkSize={8}
                  sparkCount={12}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div 
                      style={{
                        width: '200px',
                        textAlign: 'center'
                      }}
                    >
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(57, 73, 171, 0.5)',
                          color: 'white',
                          border: '1px solid #536dfe',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                          fontFamily: 'Roboto Mono, monospace',
                          fontSize: '14px',
                          textTransform: 'lowercase',
                          backdropFilter: 'blur(4px)',
                          WebkitBackdropFilter: 'blur(4px)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        authenticate
                      </button>
                    </div>
                  </div>
                </ClickSpark>
              </form>
            )}
          </FadeContent>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen; 