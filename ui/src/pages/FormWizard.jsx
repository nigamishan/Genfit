import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import MultiSelect from '../components/MultiSelect';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #e0e0e0;
    z-index: 1;
  }
`;

const Step = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.active ? '#0066cc' : props.completed ? '#28a745' : '#e0e0e0'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
    }
  }
  
  .error {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: #0066cc;
    color: white;
    
    &:hover {
      background: #004c99;
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const FormWizard = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  
  const onSubmit = async (data) => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const response = await fetch('http://localhost:8000/api/workout-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
        
        // Redirect to workout plan page after successful submission
        window.location.href = '/workout-plan';
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  return (
    <FormContainer>
      <StepIndicator>
        {[1, 2, 3, 4].map((index) => (
          <Step 
            key={index}
            active={step === index}
            completed={step > index}
          >
            {index}
          </Step>
        ))}
      </StepIndicator>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <>
            <h2>Current Client Details</h2>
            <FormGroup>
              <label>Weight (kg)</label>
              <input
                type="number"
                {...register('weight', { required: 'Weight is required' })}
              />
              {errors.weight && <span className="error">{errors.weight.message}</span>}
            </FormGroup>
            
            <FormGroup>
              <label>Height (cm)</label>
              <input
                type="number"
                {...register('height', { required: 'Height is required' })}
              />
              {errors.height && <span className="error">{errors.height.message}</span>}
            </FormGroup>
            
            <FormGroup>
              <label>Age</label>
              <input
                type="number"
                {...register('age', { required: 'Age is required' })}
              />
              {errors.age && <span className="error">{errors.age.message}</span>}
            </FormGroup>
            
            <FormGroup>
              <label>Gender</label>
              <select {...register('gender', { required: 'Gender is required' })}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="error">{errors.gender.message}</span>}
            </FormGroup>

            <FormGroup>
              <label>Body Type</label>
              <select {...register('bodyType', { required: 'Body type is required' })}>
                <option value="">Select body type</option>
                <option value="ectomorph">Ectomorph</option>
                <option value="mesomorph">Mesomorph</option>
                <option value="endomorph">Endomorph</option>
              </select>
              {errors.bodyType && <span className="error">{errors.bodyType.message}</span>}
            </FormGroup>
          </>
        )}
        
        {step === 2 && (
          <>
            <h2>Current Fitness Information</h2>
            <FormGroup>
              <label>Gym Experience (months)</label>
              <input
                type="number"
                {...register('gymExperience', { required: 'Gym experience is required' })}
              />
              {errors.gymExperience && <span className="error">{errors.gymExperience.message}</span>}
            </FormGroup>
            
            <FormGroup>
              <label>Body Fat Percentage</label>
              <input
                type="number"
                step="0.1"
                {...register('bodyFat', { required: 'Body fat percentage is required' })}
              />
              {errors.bodyFat && <span className="error">{errors.bodyFat.message}</span>}
            </FormGroup>

            <FormGroup>
              <label>Deadlift PR (kg)</label>
              <input
                type="number"
                {...register('deadliftPR', { required: 'Deadlift PR is required' })}
              />
              {errors.deadliftPR && <span className="error">{errors.deadliftPR.message}</span>}
            </FormGroup>

            <FormGroup>
              <label>Bench Press PR (kg)</label>
              <input
                type="number"
                {...register('benchPressPR', { required: 'Bench Press PR is required' })}
              />
              {errors.benchPressPR && <span className="error">{errors.benchPressPR.message}</span>}
            </FormGroup>

            <FormGroup>
              <label>Squat PR (kg)</label>
              <input
                type="number"
                {...register('squatPR', { required: 'Squat PR is required' })}
              />
              {errors.squatPR && <span className="error">{errors.squatPR.message}</span>}
            </FormGroup>
          </>
        )}
        
        {step === 3 && (
          <>
            <h2>Available Resources</h2>
            <FormGroup>
              <label>Days Available for Gym</label>
              <select {...register('gymDays', { required: 'Available days are required' })}>
                <option value="">Select available days</option>
                <option value="3">3 days/week</option>
                <option value="4">4 days/week</option>
                <option value="5">5 days/week</option>
                <option value="6">6 days/week</option>
              </select>
              {errors.gymDays && <span className="error">{errors.gymDays.message}</span>}
            </FormGroup>
            
            <FormGroup>
              <label>Minutes Available per Session</label>
              <select {...register('sessionDuration', { required: 'Session duration is required' })}>
                <option value="">Select session duration</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
              {errors.sessionDuration && <span className="error">{errors.sessionDuration.message}</span>}
            </FormGroup>

            <FormGroup>
              <label>Available Equipment</label>
              <MultiSelect
                options={[
                  { value: 'squat_rack', label: 'Squat Rack' },
                  { value: 'dumbbells', label: 'Dumbbells' },
                  { value: 'barbell', label: 'Barbell' },
                  { value: 'pecfly_machine', label: 'Pec Fly Machine' },
                  { value: 'cable_machine', label: 'Cable Machine' },
                  { value: 'leg_press', label: 'Leg Press' },
                  { value: 'smith_machine', label: 'Smith Machine' },
                  { value: 'bench', label: 'Bench' },
                  { value: 'kettlebells', label: 'Kettlebells' },
                  { value: 'resistance_bands', label: 'Resistance Bands' },
                  { value: 'pull_up_bar', label: 'Pull-up Bar' },
                  { value: 'foam_roller', label: 'Foam Roller' }
                ]}
                value={watch('equipment') || []}
                onChange={(selectedValues) => setValue('equipment', selectedValues)}
                placeholder="Type to search equipment..."
              />
              {errors.equipment && <span className="error">{errors.equipment.message}</span>}
            </FormGroup>
          </>
        )}
        
        {step === 4 && (
          <>
            <h2>Target Goals</h2>
            <FormGroup>
              <label>Target Body Fat Percentage</label>
              <input
                type="number"
                step="0.1"
                {...register('targetBodyFat', { required: 'Target body fat is required' })}
              />
              {errors.targetBodyFat && <span className="error">{errors.targetBodyFat.message}</span>}
            </FormGroup>

            <FormGroup>
              <label>Target Weight (kg)</label>
              <input
                type="number"
                {...register('targetWeight', { required: 'Target weight is required' })}
              />
              {errors.targetWeight && <span className="error">{errors.targetWeight.message}</span>}
            </FormGroup>

            <FormGroup>
              <label>Target Deadlift PR (kg)</label>
              <input
                type="number"
                {...register('targetDeadlift', { required: 'Target deadlift is required' })}
              />
              {errors.targetDeadlift && <span className="error">{errors.targetDeadlift.message}</span>}
            </FormGroup>

            <FormGroup>
              <label>Target Squat PR (kg)</label>
              <input
                type="number"
                {...register('targetSquat', { required: 'Target squat is required' })}
              />
              {errors.targetSquat && <span className="error">{errors.targetSquat.message}</span>}
            </FormGroup>

            <FormGroup>
              <label>Target Bench Press PR (kg)</label>
              <input
                type="number"
                {...register('targetBenchPress', { required: 'Target bench press is required' })}
              />
              {errors.targetBenchPress && <span className="error">{errors.targetBenchPress.message}</span>}
            </FormGroup>
          </>
        )}
        
        <ButtonGroup>
          {step > 1 && (
            <Button
              type="button"
              className="secondary"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            className="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                Submitting...
              </>
            ) : (
              step === 4 ? 'Submit' : 'Next'
            )}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default FormWizard;