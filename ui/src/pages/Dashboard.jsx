import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    color: #333;
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
  
  div {
    height: 100%;
    background: #0066cc;
    width: ${props => props.progress}%;
    transition: width 0.3s ease;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  
  h4 {
    margin: 0;
    color: #666;
    font-size: 0.875rem;
  }
  
  p {
    margin: 0.5rem 0 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  
  h2 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const StartButton = styled(Link)`
  display: inline-block;
  background-color: #0066cc;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #004c99;
    transform: translateY(-2px);
  }
`;

const CrossPoint = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  position: relative;
  margin: 0 4px;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #dc3545;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  
  &:before {
    transform: translateY(-50%) rotate(45deg);
  }
  
  &:after {
    transform: translateY(-50%) rotate(-45deg);
  }
`;

const MissedDays = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  
  span {
    color: #666;
    margin: 0 1rem;
  }
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <h1>Fitness Dashboard</h1>
      
      <StatGrid>
        <StatCard>
          <h4>Current Weight</h4>
          <p>--</p>
        </StatCard>
        <StatCard>
          <h4>Workouts Completed</h4>
          <p>0</p>
        </StatCard>
        <StatCard>
          <h4>Total Time</h4>
          <p>0h 0m</p>
        </StatCard>
        <StatCard>
          <h4>Calories Burned</h4>
          <p>0</p>
        </StatCard>
      </StatGrid>
      
      <DashboardGrid>
        <Card>
          <CardHeader>
            <h3>Progress Tracking</h3>
          </CardHeader>
          <EmptyState>
            <h2>Start Your Fitness Journey</h2>
            <p>Track your progress and achieve your fitness goals by creating a personalized workout plan.</p>
            <MissedDays>
              <span>Missed Days:</span>
              <CrossPoint />
              <CrossPoint />
              <CrossPoint />
            </MissedDays>
            <StartButton to="/form">Create Your Plan</StartButton>
          </EmptyState>
        </Card>
        
        <Card>
          <CardHeader>
            <h3>Weekly Goals</h3>
          </CardHeader>
          <EmptyState>
            <h2>Set Your Goals</h2>
            <p>Define your weekly fitness goals and track your progress towards achieving them.</p>
            <StartButton to="/form">Set Goals</StartButton>
          </EmptyState>
        </Card>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default Dashboard;