import React from 'react';
import { useApp } from '../context/AppContext';
import ShinyText from '../textanimations/ShinyText/ShinyText';
import ASCIIText from '../textanimations/ASCIIText/ASCIIText';
import ScrollVelocity from '../textanimations/ScrollVelocity/ScrollVelocity';
import FadeContent from '../animations/FadeContent/FadeContent';
import FlowingMenu from '../components/FlowingMenu/FlowingMenu';

const SuccessScreen: React.FC = () => {
  const { state, users, siteConfig } = useApp();
  const { currentUser } = state;

  if (!currentUser) return null;

  const welcomeMessage = siteConfig.successMessage
    .replace('[TITLE]', currentUser.title.toLowerCase())
    .replace('[NAME]', currentUser.name.toLowerCase());
    
  // Create wedding party menu items with nickname shown by default, name on hover
  const weddingPartyItems = users.map(user => ({
    text: `${user.nickname} - ${user.title}`.toLowerCase(),
    hoverText: `${user.name} - ${user.title}`.toLowerCase(),
    link: '#', // We're not using actual links
    image: '/images/user-avatar.svg'
  }));

  return (
    <div className="centered">
      <div className="container">
        {/* Large ASCII text nickname takes center stage */}
        <div style={{ 
          marginBottom: '3rem', 
          marginTop: '1rem', 
          textAlign: 'center',
          minHeight: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ASCIIText
            text={currentUser.nickname}
            asciiFontSize={10}
            textFontSize={80}
            textColor="#00ff7f"
            enableWaves={true}
          />
        </div>
        
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <FadeContent 
            delay={100}
            duration={1200}
            blur={true}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <ShinyText
                text={welcomeMessage}
                speed={5}
                className="success-message"
              />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p>thanks for being a part of this special day.</p>
              <p style={{ marginTop: '1rem' }}>more details to come at the rehearsal dinner.</p>
            </div>
          </FadeContent>
        </div>
        
        {/* Wedding Party Roster */}
        <div style={{ marginTop: '4rem' }}>
          <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <FadeContent delay={200} duration={1200}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  color: '#00ff7f',
                  textTransform: 'lowercase',
                  marginBottom: '2rem' 
                }}>
                  wedding party
                </h3>
                <FlowingMenu items={weddingPartyItems} />
              </div>
            </FadeContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen; 