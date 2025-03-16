import React from 'react';
import { FormGroup } from '../../styles/FormStyles';

const ClientDetails = ({ register, errors }) => {
  return (
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
  );
};

export default ClientDetails;