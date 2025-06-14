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
      dispatch(setSignupProfile({ name, day, month, year, gender })); // <--- حفظ معلومات الملف الشخصي
      navigate('/signup/terms');
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '1', label: 'يناير' }, { value: '2', label: 'فبراير' }, { value: '3', label: 'مارس' },
    { value: '4', label: 'أبريل' }, { value: '5', label: 'مايو' }, { value: '6', label: 'يونيو' },
    { value: '7', label: 'يوليو' }, { value: '8', label: 'أغسطس' }, { value: '9', label: 'سبتمبر' },
    { value: '10', label: 'أكتوبر' }, { value: '11', label: 'نوفمبر' }, { value: '12', label: 'ديسمبر' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i).reverse();

  return (
    <div className="signup-step-content">
      {/* ... باقي الـ JSX كما هو ... */}
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup/password')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">الخطوة 2 من 3<br/>عرّفنا عن نفسك</h2>
      </div>

      <label htmlFor="name" className="input-label">الاسم</label>
      <input
        id="name"
        type="text"
        placeholder="اسمك"
        className="input-field"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p className="input-hint">سيظهر هذا الاسم في صفحتك الشخصية</p>

      <label htmlFor="dob-day" className="input-label">تاريخ الميلاد</label>
      <div className="date-pickers">
        <select id="dob-day" className="input-field" value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">اليوم</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select id="dob-month" className="input-field" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">الشهر</option>
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select id="dob-year" className="input-field" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">العام</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <p className="input-hint">لماذا نحتاج إلى معرفة تاريخ ميلادك؟</p>

      <label className="input-label">النوع</label>
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
          امرأة
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
          رجل
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
          أفضل عدم الإجابة
        </label>
      </div>

      <button
        onClick={handleNext}
        className="primary-button"
        disabled={!isFormValid}
      >
        التالي
      </button>
    </div>
  );
};

export default ProfileInfoStep;