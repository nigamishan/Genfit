import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #0066cc 0%, #004c99 100%);
  background-size: cover;
  background-position: center;
  color: white;
  padding: 6rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: #0066cc;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #004c99;
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: #f8f9fa;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 3rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: #0066cc;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    color: #666;
  }
  
  .icon {
    font-size: 2.5rem;
    color: #0066cc;
    margin-bottom: 1.5rem;
  }
`;

const TestimonialsSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const TestimonialsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const TestimonialCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  
  &:before {
    content: '"';
    position: absolute;
    top: 10px;
    left: 20px;
    font-size: 4rem;
    color: rgba(0, 102, 204, 0.1);
    font-family: Georgia, serif;
  }
  
  p {
    font-style: italic;
    margin-bottom: 1.5rem;
    color: #555;
  }
  
  .author {
    display: flex;
    align-items: center;
    
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 1rem;
    }
    
    .name {
      font-weight: 600;
      color: #333;
    }
    
    .title {
      font-size: 0.9rem;
      color: #666;
    }
  }
`;

const Home = () => {
  return (
    <>
      <HeroSection>
        <HeroContent>
          <h1>Your Personalized Fitness Journey Starts Here</h1>
          <p>Get a customized workout plan tailored to your goals, body type, and available equipment. Track your progress and achieve results faster.</p>
          <CTAButton to="/form">Create Your Plan</CTAButton>
        </HeroContent>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>Why Choose GenFit?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <div className="icon">📊</div>
            <h3>Personalized Plans</h3>
            <p>Get workout plans tailored to your specific body type, fitness level, and available equipment.</p>
          </FeatureCard>
          
          <FeatureCard>
            <div className="icon">📱</div>
            <h3>WhatsApp Integration</h3>
            <p>Receive daily workout reminders and tips directly through WhatsApp to stay motivated.</p>
          </FeatureCard>
          
          <FeatureCard>
            <div className="icon">📈</div>
            <h3>Progress Tracking</h3>
            <p>Track your fitness journey with detailed analytics and visual progress charts.</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <TestimonialsSection>
        <SectionTitle>Success Stories</SectionTitle>
        <TestimonialsContainer>
          <TestimonialCard>
            <p>"GenFit completely transformed my approach to fitness. The personalized workout plan was exactly what I needed, and the WhatsApp reminders kept me accountable."</p>
            <div className="author">
              <div>
                <div className="name">Sarah Johnson</div>
                <div className="title">Lost 15kg in 6 months</div>
              </div>
            </div>
          </TestimonialCard>
          
          <TestimonialCard>
            <p>"As someone who travels frequently, having a workout plan that adapts to my available equipment has been a game-changer. I can now maintain my fitness routine no matter where I am."</p>
            <div className="author">
              <div>
                <div className="name">Michael Chen</div>
                <div className="title">Gained 8kg of muscle in 4 months</div>
              </div>
            </div>
          </TestimonialCard>
        </TestimonialsContainer>
      </TestimonialsSection>
    </>
  );
};

export default Home;