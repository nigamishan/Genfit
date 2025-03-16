import React from 'react';
import { FormGroup } from '../../styles/FormStyles';

const Goals = ({ register, errors }) => {
  return (
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
  );
};

export default Goals;