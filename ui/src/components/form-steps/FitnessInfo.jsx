import React from 'react';
import { FormGroup } from '../../styles/FormStyles';

const FitnessInfo = ({ register, errors }) => {
  return (
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
  );
};

export default FitnessInfo;