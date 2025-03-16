import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const WorkoutPlanContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background-color: ${props => props.primary ? '#0066cc' : '#28a745'};
  color: white;
  
  &:hover {
    background-color: ${props => props.primary ? '#004c99' : '#218838'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const WeeklyPlanContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const DayCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const DayHeader = styled.div`
  background-color: #0066cc;
  color: white;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
`;

const ExerciseList = styled.ul`
  list-style: none;
  padding: 1.5rem;
`;

const ExerciseItem = styled.li`
  margin-bottom: 1.2rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  p {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
`;

const WhatsAppWidget = styled.div`
  background-color: #25D366;
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const WhatsAppContent = styled.div`
  h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    opacity: 0.9;
  }
`;

const WhatsAppButton = styled.a`
  background-color: white;
  color: #25D366;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

// Mock data for the workout plan
const mockWorkoutPlan = {
  userInfo: {
    name: 'User',
    bodyType: 'Mesomorph',
    experience: 'Intermediate',
    goal: 'Build Muscle'
  },
  weeklyPlan: [
    {
      day: 'Monday',
      focus: 'Chest and Triceps',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Chest Flyes', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', rest: '45 sec' }
      ]
    },
    {
      day: 'Tuesday',
      focus: 'Back and Biceps',
      exercises: [
        { name: 'Pull-ups', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Bent Over Rows', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Lat Pulldowns', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '45 sec' },
        { name: 'Hammer Curls', sets: 3, reps: '12-15', rest: '45 sec' }
      ]
    },
    {
      day: 'Wednesday',
      focus: 'Rest or Light Cardio',
      exercises: [
        { name: 'Brisk Walking', sets: 1, reps: '30 minutes', rest: 'N/A' },
        { name: 'Stretching', sets: 1, reps: '15 minutes', rest: 'N/A' }
      ]
    },
    {
      day: 'Thursday',
      focus: 'Legs and Shoulders',
      exercises: [
        { name: 'Squats', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Leg Press', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '45 sec' }
      ]
    },
    {
      day: 'Friday',
      focus: 'Full Body',
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: '6-8', rest: '120 sec' },
        { name: 'Push-ups', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Lunges', sets: 3, reps: '10-12 each leg', rest: '60 sec' },
        { name: 'Plank', sets: 3, reps: '30-60 sec hold', rest: '45 sec' }
      ]
    },
    {
      day: 'Saturday',
      focus: 'Cardio and Core',
      exercises: [
        { name: 'HIIT Cardio', sets: 1, reps: '20 minutes', rest: 'N/A' },
        { name: 'Crunches', sets: 3, reps: '15-20', rest: '30 sec' },
        { name: 'Russian Twists', sets: 3, reps: '15-20 each side', rest: '30 sec' },
        { name: 'Leg Raises', sets: 3, reps: '12-15', rest: '30 sec' }
      ]
    },
    {
      day: 'Sunday',
      focus: 'Rest Day',
      exercises: [
        { name: 'Rest and Recovery', sets: 0, reps: 'N/A', rest: 'N/A' },
        { name: 'Light Stretching (Optional)', sets: 1, reps: '10-15 minutes', rest: 'N/A' }
      ]
    }
  ]
};

const WorkoutPlan = () => {
  const [plan] = useState(mockWorkoutPlan);
  
  return (
    <WorkoutPlanContainer>
      <PlanHeader>
        <h1>Your Personalized Workout Plan</h1>
        <p>Based on your {plan.userInfo.bodyType} body type and {plan.userInfo.experience} experience level</p>
      </PlanHeader>
      
      <WhatsAppWidget>
        <WhatsAppContent>
          <h3>Stay on Track with WhatsApp Reminders</h3>
          <p>Get daily workout reminders, tips, and motivation sent directly to your phone.</p>
        </WhatsAppContent>
        <WhatsAppButton href="#">
          Connect WhatsApp
        </WhatsAppButton>
      </WhatsAppWidget>
      
      <ActionButtons>
        <ActionButton primary>
          <span>📊</span> Export to Google Sheets
        </ActionButton>
        <ActionButton>
          <span>📱</span> Share Plan
        </ActionButton>
      </ActionButtons>
      
      <WeeklyPlanContainer>
        {plan.weeklyPlan.map((day, index) => (
          <DayCard key={index}>
            <DayHeader>{day.day} - {day.focus}</DayHeader>
            <ExerciseList>
              {day.exercises.map((exercise, idx) => (
                <ExerciseItem key={idx}>
                  <h3>{exercise.name}</h3>
                  <p><strong>Sets:</strong> {exercise.sets}</p>
                  <p><strong>Reps:</strong> {exercise.reps}</p>
                  <p><strong>Rest:</strong> {exercise.rest}</p>
                </ExerciseItem>
              ))}
            </ExerciseList>
          </DayCard>
        ))}
      </WeeklyPlanContainer>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/dashboard" style={{ color: '#0066cc', fontWeight: 500 }}>
          View Your Progress Dashboard →
        </Link>
      </div>
    </WorkoutPlanContainer>
  );
};

export default WorkoutPlan;