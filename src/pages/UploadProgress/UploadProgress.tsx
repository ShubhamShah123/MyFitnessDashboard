import React, { useState } from 'react';
import './upload-progress.scss';

interface MealTrackingData {
  breakfast: 'taken' | 'missed' | '';
  lunch: 'taken' | 'missed' | '';
  snack: 'taken' | 'missed' | '';
  preworkout: 'taken' | 'missed' | '';
  dinner: 'taken' | 'missed' | '';
  workout: 'taken' | 'missed' | '';
}

interface BodyMeasurements {
  hip: string;
  stomach: string;
  thigh: string;
  waist: string;
  weight: string;
}

export default function ProgressUploadForm() {
  const [mealTracking, setMealTracking] = useState<MealTrackingData>({
    breakfast: '',
    lunch: '',
    snack: '',
    preworkout: '',
    dinner: '',
    workout: ''
  });

  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements>({
    hip: '',
    stomach: '',
    thigh: '',
    waist: '',
    weight: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMealChange = (meal: keyof MealTrackingData, value: 'taken' | 'missed') => {
    setMealTracking(prev => ({
      ...prev,
      [meal]: value
    }));
  };

  const handleMeasurementChange = (measurement: keyof BodyMeasurements, value: string) => {
    if (value === '' || /^\d+\.?\d*$/.test(value)) {
      setBodyMeasurements(prev => ({
        ...prev,
        [measurement]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = {
      date: new Date().toISOString().split('T')[0],
      mealTracking,
      bodyMeasurements: {
        ...bodyMeasurements,
        hip: bodyMeasurements.hip ? parseFloat(bodyMeasurements.hip) : null,
        stomach: bodyMeasurements.stomach ? parseFloat(bodyMeasurements.stomach) : null,
        thigh: bodyMeasurements.thigh ? parseFloat(bodyMeasurements.thigh) : null,
        waist: bodyMeasurements.waist ? parseFloat(bodyMeasurements.waist) : null,
        weight: bodyMeasurements.weight ? parseFloat(bodyMeasurements.weight) : null,
      }
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Progress Data Submitted:', formData);
    alert('Progress data submitted successfully! Check the console for details.');
    setIsSubmitting(false);
  };

  const mealItems = [
    { key: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { key: 'lunch', label: 'Lunch', icon: '🥗' },
    { key: 'snack', label: 'Snack', icon: '🥜' },
    { key: 'preworkout', label: 'Pre-workout', icon: '💪' },
    { key: 'dinner', label: 'Dinner', icon: '🍽️' },
    { key: 'workout', label: 'Workout', icon: '🏋️' }
  ];

  const measurementItems = [
    { key: 'hip', label: 'Hip', unit: 'inches', icon: '📐' },
    { key: 'stomach', label: 'Stomach', unit: 'inches', icon: '📏' },
    { key: 'thigh', label: 'Thigh', unit: 'inches', icon: '📐' },
    { key: 'waist', label: 'Waist', unit: 'inches', icon: '📏' },
    { key: 'weight', label: 'Weight', unit: 'lbs', icon: '⚖️' }
  ];

  return (
    <div className="progress-upload">
      <div className="container">
        {/* Form */}
        <div className="upload-form">
          {/* Meal Tracking Section */}
          <div className="form-sections-row">

            <div className="form-section meal-section">
            <div className="section-header">
              <div className="section-icon-wrapper">
                <span className="section-icon">🍽️</span>
              </div>
              <div className="section-title-wrapper">
                <h2 className="section-title">Meal Tracking</h2>
                <p className="section-description">
                  Mark whether you've completed each meal or workout session
                </p>
              </div>
            </div>

            <div className="meal-grid">
              {mealItems.map(({ key, label, icon }) => (
                <div key={key} className="meal-item">
                  <div className="meal-header">
                    <span className="meal-icon">{icon}</span>
                    <h3 className="meal-label">{label}</h3>
                  </div>
                  
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={key}
                        value="taken"
                        checked={mealTracking[key as keyof MealTrackingData] === 'taken'}
                        onChange={() => handleMealChange(key as keyof MealTrackingData, 'taken')}
                      />
                      <div className="radio-button taken">
                        <span className="radio-text">✅ Taken</span>
                      </div>
                    </label>
                    
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={key}
                        value="missed"
                        checked={mealTracking[key as keyof MealTrackingData] === 'missed'}
                        onChange={() => handleMealChange(key as keyof MealTrackingData, 'missed')}
                      />
                      <div className="radio-button missed">
                        <span className="radio-text">❌ Missed</span>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Body Measurements Section */}
          <div className="form-section measurements-section">
            <div className="section-header">
              <div className="section-icon-wrapper">
                <span className="section-icon">📊</span>
              </div>
              <div className="section-title-wrapper">
                <h2 className="section-title">Body Measurements</h2>
                <p className="section-description">
                  Enter your current measurements (all fields are optional)
                </p>
              </div>
            </div>

            <div className="measurements-grid">
              {measurementItems.map(({ key, label, unit, icon }) => (
                <div key={key} className="measurement-item">
                  <label className="measurement-label">
                    <div className="label-header">
                      <span className="measurement-icon">{icon}</span>
                      <span className="label-text">{label}</span>
                      <span className="unit-badge">{unit}</span>
                    </div>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="measurement-input"
                        placeholder={`Enter ${label.toLowerCase()}`}
                        value={bodyMeasurements[key as keyof BodyMeasurements]}
                        onChange={(e) => handleMeasurementChange(key as keyof BodyMeasurements, e.target.value)}
                      />
                      <div className="input-glow"></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          

          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
            >
              <div className="btn-content">
                <span className="btn-text">
                  {isSubmitting ? 'Submitting...' : 'Submit Progress Data'}
                </span>
                <svg className="submit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="btn-shimmer"></div>
              <div className="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}