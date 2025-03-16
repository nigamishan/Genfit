import React from 'react';
import { FormGroup } from '../../styles/FormStyles';
import MultiSelect from '../MultiSelect';

const Resources = ({ register, errors, watch, setValue }) => {
  return (
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
  );
};

export default Resources;