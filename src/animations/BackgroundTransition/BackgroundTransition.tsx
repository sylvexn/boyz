import React, { useState, useEffect } from 'react';
import './BackgroundTransition.css';

interface BackgroundTransitionProps {
  currentBackground: React.ReactNode;
  previousBackground?: React.ReactNode;
  transitionDuration?: number;
  isTransitioning?: boolean;
}

const BackgroundTransition: React.FC<BackgroundTransitionProps> = ({
  currentBackground,
  previousBackground,
  transitionDuration = 1500,
  isTransitioning = false,
}) => {
  const [showPrevious, setShowPrevious] = useState(isTransitioning);
  const [prevBgOpacity, setPrevBgOpacity] = useState(isTransitioning ? 1 : 0);
  const [currentBgOpacity, setCurrentBgOpacity] = useState(isTransitioning ? 0 : 1);
  const [prevBg, setPrevBg] = useState<React.ReactNode | undefined>(previousBackground);
  
  useEffect(() => {
    if (isTransitioning && previousBackground) {
      // Start transition
      setPrevBg(previousBackground);
      setShowPrevious(true);
      setPrevBgOpacity(1);
      setCurrentBgOpacity(0);
      
      // Fade out previous, fade in current
      const fadeTimeout = setTimeout(() => {
        setPrevBgOpacity(0);
        setCurrentBgOpacity(1);
      }, 50); // Small delay to ensure state update takes effect
      
      // Remove previous background after animation completes
      const cleanupTimeout = setTimeout(() => {
        setShowPrevious(false);
      }, transitionDuration + 100);
      
      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(cleanupTimeout);
      };
    }
  }, [isTransitioning, previousBackground, transitionDuration]);

  // If background changes without transition flag, update directly
  useEffect(() => {
    if (!isTransitioning) {
      setShowPrevious(false);
      setCurrentBgOpacity(1);
    }
  }, [currentBackground, isTransitioning]);

  return (
    <div className="background-transition-container">
      {/* Current background */}
      <div
        className="background-layer current"
        style={{
          opacity: currentBgOpacity,
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        {currentBackground}
      </div>

      {/* Previous background (shown during transition) */}
      {showPrevious && prevBg && (
        <div
          className="background-layer previous"
          style={{
            opacity: prevBgOpacity,
            transitionDuration: `${transitionDuration}ms`,
          }}
        >
          {prevBg}
        </div>
      )}
    </div>
  );
};

export default BackgroundTransition; 