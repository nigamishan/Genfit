import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, StepIndicator, Step, ButtonGroup, Button, LoadingSpinner } from '../styles/FormStyles';
import ClientDetails from '../components/form-steps/ClientDetails';
import FitnessInfo from '../components/form-steps/FitnessInfo';
import Resources from '../components/form-steps/Resources';
import Goals from '../components/form-steps/Goals';



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
        const formattedData = {
          clientData: {
            weight: data.weight,
            height: data.height,
            age: data.age,
            gender: data.gender,
            bodyType: data.bodyType
          },
          clientFitnessData: {
            gymExperience: data.gymExperience,
            bodyFat: data.bodyFat,
            deadliftPR: data.deadliftPR,
            benchPressPR: data.benchPressPR,
            squatPR: data.squatPR
          },
          clientGoals: {
            targetBodyFat: data.targetBodyFat,
            targetWeight: data.targetWeight,
            targetDeadlift: data.targetDeadlift,
            targetSquat: data.targetSquat,
            targetBenchPress: data.targetBenchPress
          },
          clientResources: {
            gymDays: data.gymDays,
            sessionDuration: data.sessionDuration,
            equipment: data.equipment || []
          }
        };

        const response = await fetch('http://localhost:8000/api/workout-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
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
        {step === 1 && <ClientDetails register={register} errors={errors} />}
        {step === 2 && <FitnessInfo register={register} errors={errors} />}
        {step === 3 && <Resources register={register} errors={errors} watch={watch} setValue={setValue} />}
        {step === 4 && <Goals register={register} errors={errors} />}
        
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