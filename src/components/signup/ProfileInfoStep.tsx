// src/components/auth/ProfileInfoStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setSignupProfile } from '../../store/slices/authSlice.ts';
import { useTranslation } from 'react-i18next'; // تم إضافة هذا الاستيراد

const ProfileInfoStep: React.FC = () => {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector(state => state.auth);
  const { t } = useTranslation(); // تم تعريف دالة الترجمة هنا

  const isFormValid = name && day && month && year && gender;

  const handleNext = () => {
    if (isFormValid) {
      dispatch(setSignupProfile({ name, day, month, year, gender }));
      navigate('/signup/terms');
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '1', label: t('January') }, // تم تعريب الشهور
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

  return (
    <div className="signup-step-content">
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup/password')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">
          {t('Step 2 of 3')}
          <br/>
          {t('Tell us about yourself')} {/* تم تعريب العنوان */}
        </h2>
      </div>

      <label htmlFor="name" className="input-label">{t('Name')}</label> {/* تم تعريب الليبل */}
      <input
        id="name"
        type="text"
        placeholder={t('Name')} 
        className="input-field"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p className="input-hint">{t('This will be shown on your profile')}</p> {/* تم تعريب التلميح */}

      <label htmlFor="dob-day" className="input-label">{t('Date of birth')}</label> {/* تم تعريب الليبل */}
      <div className="date-pickers">
        <select id="dob-day" className="input-field-date" value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">{t('Day')}</option> {/* تم تعريب خيار اليوم */}
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select id="dob-month" className="input-field-date" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">{t('Month')}</option> {/* تم تعريب خيار الشهر */}
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select id="dob-year" className="input-field-date" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">{t('Year')}</option> {/* تم تعريب خيار السنة */}
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <label className="input-label">{t('Gender')}</label> {/* تم تعريب الليبل */}
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
          {t('Female')} {/* تم تعريب خيار الجنس */}
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
          {t('Male')} {/* تم تعريب خيار الجنس */}
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
          {t('Prefer not to say')} {/* تم تعريب خيار الجنس */}
        </label>
      </div>

      <button
        onClick={handleNext}
        className="primary-button"
        disabled={!isFormValid || loading}
      >
        {loading ? t('Loading...') : t('Next')} {/* تم تعريب نص الزر */}
      </button>
    </div>
  );
};

export default ProfileInfoStep;