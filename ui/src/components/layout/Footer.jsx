import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #222;
  color: #fff;
  padding: 3rem 0 1.5rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.2rem;
    color: #fff;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -8px;
      width: 40px;
      height: 2px;
      background-color: #0066cc;
    }
  }
  
  ul {
    list-style: none;
  }
  
  li {
    margin-bottom: 0.8rem;
  }
  
  a {
    color: #ccc;
    transition: color 0.3s ease;
    
    &:hover {
      color: #0066cc;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #333;
    color: #fff;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #0066cc;
      transform: translateY(-3px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #444;
  color: #aaa;
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>GenFit</h3>
          <p>Your personalized workout solution for achieving fitness goals and maintaining a healthy lifestyle.</p>
          <SocialLinks>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <span>f</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <span>t</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <span>i</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <span>y</span>
            </a>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/form">Plan Generator</Link></li>
            <li><Link to="/workout-plan">Workout Plan</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h3>Resources</h3>
          <ul>
            <li><a href="#">Workout Tips</a></li>
            <li><a href="#">Nutrition Guide</a></li>
            <li><a href="#">Exercise Library</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h3>Contact Us</h3>
          <ul>
            <li>Email: info@genfit.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Fitness Street, Workout City, WO 12345</li>
          </ul>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <p>&copy; {new Date().getFullYear()} GenFit. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;