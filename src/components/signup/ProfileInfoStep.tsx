// src/components/auth/ProfileInfoStep.tsx

// Import React and core hooks for component state.
import React, { useState } from 'react';
// Imports for navigation (react-router-dom) and Redux state management (hooks and slices).
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setSignupProfile } from '../../store/slices/authSlice.ts';
// Import for internationalization (i18n).
import { useTranslation } from 'react-i18next';

// ProfileInfoStep component for collecting user's name, date of birth, and gender during signup.
const ProfileInfoStep: React.FC = () => {
  // States for name, day, month, year, and gender input fields.
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  // Redux dispatch hook to send actions.
  const dispatch = useAppDispatch();
  // Navigation hook for programmatic routing.
  const navigate = useNavigate();
  // Redux state selector for loading status.
  const { loading } = useAppSelector(state => state.auth);
  // Translation hook for i18n.
  const { t } = useTranslation();

  // Checks if all required form fields are filled.
  const isFormValid = name && day && month && year && gender;

  // Handler for the "Next" button click.
  const handleNext = () => {
    // If the form is valid, save profile data to Redux state and navigate to the terms step.
    if (isFormValid) {
      dispatch(setSignupProfile({ name, day, month, year, gender }));
      navigate('/signup/terms');
    }
  };

  // Generates arrays for day, month, and year options in the select dropdowns.
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '1', label: t('January') },
    { value: '2', label: t('February') },
    { value: '3', label: t('March') },
    { value: '4', label: t('April') },
    { value: '5', label: t('May') },
    { value: '6', label: t('June') },
    { value: '7', label: t('July') },
    { value: '8', label: t('August') },
    { value: '9', label: t('September') },
    { value: '10', label: t('October') },
    { value: '11', label: t('November') },
    { value: '12', label: t('December') }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Renders the profile information form.
  return (
    <div className="signup-step-content">
      {/* Header section with back arrow and step title. */}
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup/password')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">
          {t('Step 2 of 3')}
          <br/>
          {t('Tell us about yourself')}
        </h2>
      </div>

      {/* Name input field with label and hint text. */}
      <label htmlFor="name" className="input-label">{t('Name')}</label>
      <input
        id="name"
        type="text"
        placeholder={t('Name')}
        className="input-field"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p className="input-hint">{t('This will be shown on your profile')}</p>

      {/* Date of birth section with day, month, and year dropdowns. */}
      <label htmlFor="dob-day" className="input-label">{t('Date of birth')}</label>
      <div className="date-pickers">
        <select id="dob-day" className="input-field-date" value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">{t('Day')}</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select id="dob-month" className="input-field-date" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">{t('Month')}</option>
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select id="dob-year" className="input-field-date" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">{t('Year')}</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Gender selection radio options. */}
      <label className="input-label">{t('Gender')}</label>
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
          {t('Female')}
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
          {t('Male')}
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
          {t('Prefer not to say')}
        </label>
      </div>

      {/* "Next" button, disabled if the form is not valid or data is loading. */}
      <button
        onClick={handleNext}
        className="primary-button"
        disabled={!isFormValid || loading}
      >
        {loading ? t('Loading...') : t('Next')}
      </button>
    </div>
  );
};

// Export the component for use in the signup flow.
export default ProfileInfoStep;