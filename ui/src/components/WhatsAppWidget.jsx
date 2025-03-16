import React from 'react';
import styled from 'styled-components';

const WhatsAppContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
`;

const WhatsAppBanner = styled.div`
  background-color: #25D366;
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0 1rem;
  }
`;

const WhatsAppContent = styled.div`
  h3 {
    font-size: 1.3rem;
    margin: 0 0 0.5rem;
  }
  
  p {
    margin: 0 0 1rem;
    opacity: 0.9;
    font-size: 0.9rem;
  }
`;

const WhatsAppButton = styled.a`
  display: inline-block;
  background-color: white;
  color: #25D366;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const WhatsAppWidget = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  
  if (!isVisible) return null;
  
  return (
    <WhatsAppContainer>
      <WhatsAppBanner>
        <CloseButton onClick={() => setIsVisible(false)}>
          ×
        </CloseButton>
        <WhatsAppContent>
          <h3>Stay Connected!</h3>
          <p>
            Get daily workout reminders and instant support through our WhatsApp service.
          </p>
        </WhatsAppContent>
        <WhatsAppButton
          href="https://wa.me/your-whatsapp-number"
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect on WhatsApp
        </WhatsAppButton>
      </WhatsAppBanner>
    </WhatsAppContainer>
  );
};

export default WhatsAppWidget;