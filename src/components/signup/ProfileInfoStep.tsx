// src/components/auth/ProfileInfoStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks.ts';
import { setSignupProfile } from '../../store/slices/authSlice.ts'; 

const ProfileInfoStep: React.FC = () => {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const dispatch = useAppDispatch(); 
  const navigate = useNavigate();

  const isFormValid = name && day && month && year && gender;

  const handleNext = () => {
    if (isFormValid) {
      dispatch(setSignupProfile({ name, day, month, year, gender })); 
      navigate('/signup/terms');
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' },
    { value: '4', label: 'April' }, { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' }, { value: '9', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i).reverse();

  return (
    <div className="signup-step-content">
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup/password')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">Step 2 of 3<br/>Tell us about yourself</h2>
      </div>

      <label htmlFor="name" className="input-label">Name</label>
      <input
        id="name"
        type="text"
        placeholder="Name"
        className="input-field"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p className="input-hint">This will be shown on your profile</p>

      <label htmlFor="dob-day" className="input-label">Date of birth</label>
      <div className="date-pickers">
        <select id="dob-day" className="input-field" value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">Day</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select id="dob-month" className="input-field" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Month</option>
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select id="dob-year" className="input-field" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <p className="input-hint">Why do we need to know your date of birth?</p>

      <label className="input-label">Gender</label>
      <div className="gender-options">
        <label className="gender-option">
          <input
            type="radio"
            name="gender"
            value="female"
            checked={gender === 'female'}
            onChange={(e) => setGender(e.target.value)}
          />
          <span></span>
          Female
        </label>
        <label className="gender-option">
          <input
            type="radio"
            name="gender"
            value="male"
            checked={gender === 'male'}
            onChange={(e) => setGender(e.target.value)}
          />
          <span></span>
          Male
        </label>
        <label className="gender-option">
          <input
            type="radio"
            name="gender"
            value="prefer_not_to_say"
            checked={gender === 'prefer_not_to_say'}
            onChange={(e) => setGender(e.target.value)}
          />
          <span></span>
          Prefer not to say
        </label>
      </div>

      <button
        onClick={handleNext}
        className="primary-button"
        disabled={!isFormValid}
      >
        Next
      </button>
    </div>
  );
};

export default ProfileInfoStep;