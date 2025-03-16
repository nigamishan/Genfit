import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import DeadliftIcon from '../icons/DeadliftIcon';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0066cc;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    color: #28a745;
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: #0066cc;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 1rem;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const StyledNavLink = styled(NavLink)`
  color: #333;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #0066cc;
  }
  
  &.active {
    color: #0066cc;
    font-weight: 600;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <DeadliftIcon />
          Genfit
        </Logo>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
        
        <NavLinks isOpen={isMenuOpen}>
          <StyledNavLink to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </StyledNavLink>
          <StyledNavLink to="/form" onClick={() => setIsMenuOpen(false)}>
            Plan Generator
          </StyledNavLink>
          <StyledNavLink to="/workout-plan" onClick={() => setIsMenuOpen(false)}>
            Workout Plan
          </StyledNavLink>
          <StyledNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </StyledNavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;