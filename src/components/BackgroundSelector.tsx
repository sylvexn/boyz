import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import LetterGlitch from '../backgrounds/LetterGlitch/LetterGlitch';
import GridDistortion from '../backgrounds/GridDistortion/GridDistortion';
import Dither from '../backgrounds/Dither/Dither';
import Balatro from '../backgrounds/Balatro/Balatro';
import BackgroundTransition from '../animations/BackgroundTransition/BackgroundTransition';

// Path to grid image used for GridDistortion
const gridImagePath = '/images/grid-pattern.svg';

const BackgroundSelector: React.FC = () => {
  const { state } = useApp();
  const { background } = state;
  
  const [prevBackground, setPrevBackground] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // When background changes, trigger transition
  useEffect(() => {
    if (prevBackground && prevBackground !== background) {
      setIsTransitioning(true);
      
      // Reset transition state after animation completes
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 1500); // Match transition duration
      
      return () => clearTimeout(timeout);
    } else if (prevBackground === null) {
      // First render, set initial background without transition
      setPrevBackground(background);
    }
  }, [background, prevBackground]);
  
  // Update previous background after transition completes
  useEffect(() => {
    if (!isTransitioning && prevBackground !== background) {
      setPrevBackground(background);
    }
  }, [isTransitioning, background, prevBackground]);

  const renderBackgroundComponent = (bgType: string) => {
    switch (bgType) {
      case 'letterglitch':
        return (
          <LetterGlitch 
            glitchColors={["#1a2929", "#2a505c", "#213341"]}
            glitchSpeed={50}
            centerVignette={false}
            outerVignette={true}
            smooth={true}
          />
        );
      case 'griddistortion':
        return (
          <GridDistortion 
            imageSrc={gridImagePath} 
            grid={15}
            mouse={0.1}
            strength={0.15}
            relaxation={0.9}
          />
        );
      case 'dither':
        return <Dither />;
      case 'balatro':
        return (
          <Balatro 
            color1="#3949ab"
            color2="#536dfe"
            color3="#1a2357"
            spinSpeed={5}
            isRotate={true}
            contrast={4.2}
            lighting={0.5}
          />
        );
      default:
        return (
          <LetterGlitch 
            glitchColors={["#1a2929", "#2a505c", "#213341"]}
            glitchSpeed={50}
            centerVignette={false}
            outerVignette={true}
            smooth={true}
          />
        );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden'
      }}
    >
      <BackgroundTransition
        currentBackground={renderBackgroundComponent(background)}
        previousBackground={prevBackground ? renderBackgroundComponent(prevBackground) : undefined}
        isTransitioning={isTransitioning}
        transitionDuration={1500}
      />
    </div>
  );
};

export default BackgroundSelector; 