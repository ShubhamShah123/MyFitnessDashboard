import React, { useState, useEffect } from 'react';
import './progress-weeks.scss';
import { getProgressUrl } from '../../url';

interface Entry {
  breakfast: string;
  date: string;
  dinner: string;
  hip: string;
  id: string;
  lunch: string;
  preWorkout: string;
  sessionId: string;
  snack: string;
  stomach: string;
  thigh: string;
  waist: string;
  weight: string;
  workout: string;
}

interface WeekSummary {
  average_weight: number;
  meals_taken: {
    breakfast: number;
    dinner: number;
    lunch: number;
    snack: number;
  };
  total_entries: number;
  weight_readings: number[];
  workouts_completed: number;
}

interface WeekData {
  date_range: string;
  entries: Entry[];
  summary: WeekSummary;
  week_number: number;
}

interface ProgressData {
  msg: string;
  status_code: number;
  weekly_data: WeekData[];
}

const ProgressWeeks: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getProgressUrl); // Replace with your actual API endpoint
      const data: ProgressData = await response.json();
      console.log("Weekly Progress Data")
      console.log(data)
      if (data.status_code === 200) {
        setProgressData(data);
      } else {
        setError('Failed to fetch progress data');
      }
    } catch (err) {
      setError('Error fetching data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getMealCompletionRate = (meals: WeekSummary['meals_taken'], totalEntries: number) => {
    const totalMeals = meals.breakfast + meals.dinner + meals.lunch + meals.snack;
    const maxPossibleMeals = totalEntries * 4; // 4 meals per day
    return maxPossibleMeals > 0 ? (totalMeals / maxPossibleMeals) * 100 : 0;
  };

  const getWorkoutCompletionRate = (workoutsCompleted: number, totalEntries: number) => {
    return totalEntries > 0 ? (workoutsCompleted / totalEntries) * 100 : 0;
  };

  const getWeightTrend = (weightReadings: number[]) => {
    if (weightReadings.length < 2) return 'stable';
    const firstWeight = weightReadings[0];
    const lastWeight = weightReadings[weightReadings.length - 1];
    const difference = lastWeight - firstWeight;
    
    if (Math.abs(difference) < 0.5) return 'stable';
    return difference > 0 ? 'increasing' : 'decreasing';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="progress-weeks">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-weeks">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchProgressData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="progress-weeks">
        <div className="no-data">
          <p>No progress data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-weeks">
      <div className="progress-header">
        <h1>Progress Tracker.</h1>
        <p className="subtitle">Track your weekly progress and achievements</p>
      </div>

      <div className="weeks-overview">
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-value">{progressData.weekly_data.length}</div>
            <div className="stat-label">Weeks Tracked</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {progressData.weekly_data.reduce((sum, week) => sum + week.summary.workouts_completed, 0)}
            </div>
            <div className="stat-label">Total Workouts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {progressData.weekly_data.reduce((sum, week) => sum + week.summary.total_entries, 0)}
            </div>
            <div className="stat-label">Days Logged</div>
          </div>
        </div>
      </div>

      <div className="weeks-grid">
        {progressData.weekly_data.map((week) => {
          const mealRate = getMealCompletionRate(week.summary.meals_taken, week.summary.total_entries);
          const workoutRate = getWorkoutCompletionRate(week.summary.workouts_completed, week.summary.total_entries);
          const weightTrend = getWeightTrend(week.summary.weight_readings);
          const isSelected = selectedWeek === week.week_number;

          return (
            <div
              key={week.week_number}
              className={`week-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedWeek(isSelected ? null : week.week_number)}
            >
              <div className="week-header">
                <h3>Week {week.week_number}</h3>
                <span className="date-range">{week.date_range}</span>
              </div>

              <div className="week-metrics">
                <div className="metric">
                  <div className="metric-label">Workouts</div>
                  <div className="metric-value">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill workout-progress" 
                        style={{ width: `${workoutRate}%` }}
                      ></div>
                    </div>
                    <span>{week.summary.workouts_completed}/{week.summary.total_entries}</span>
                  </div>
                </div>

                <div className="metric">
                  <div className="metric-label">Meals</div>
                  <div className="metric-value">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill meal-progress" 
                        style={{ width: `${mealRate}%` }}
                      ></div>
                    </div>
                    <span>{Math.round(mealRate)}%</span>
                  </div>
                </div>

                {week.summary.average_weight > 0 && (
                  <div className="metric">
                    <div className="metric-label">Avg Weight</div>
                    <div className="metric-value weight-metric">
                      <span className="weight-value">{week.summary.average_weight.toFixed(1)} kg</span>
                      <span className={`weight-trend ${weightTrend}`}>
                        {weightTrend === 'increasing' && '↗'}
                        {weightTrend === 'decreasing' && '↘'}
                        {weightTrend === 'stable' && '→'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="week-details">
                  <div className="details-grid">
                    <div className="detail-section">
                      <h4>Meal Breakdown</h4>
                      <div className="meal-stats">
                        <div className="meal-stat">
                          <span>Breakfast:</span>
                          <span>{week.summary.meals_taken.breakfast}</span>
                        </div>
                        <div className="meal-stat">
                          <span>Lunch:</span>
                          <span>{week.summary.meals_taken.lunch}</span>
                        </div>
                        <div className="meal-stat">
                          <span>Dinner:</span>
                          <span>{week.summary.meals_taken.dinner}</span>
                        </div>
                        <div className="meal-stat">
                          <span>Snacks:</span>
                          <span>{week.summary.meals_taken.snack}</span>
                        </div>
                      </div>
                    </div>

                    {week.summary.weight_readings.length > 0 && (
                      <div className="detail-section">
                        <h4>Weight Readings</h4>
                        <div className="weight-readings">
                          {week.summary.weight_readings.map((weight, index) => (
                            <span key={index} className="weight-reading">
                              {weight} kg
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="daily-entries">
                    <h4>Daily Entries</h4>
                    <div className="entries-list">
                      {week.entries.map((entry) => (
                        <div key={entry.id} className="entry-item">
                          <div className="entry-date">{formatDate(entry.date)}</div>
                          <div className="entry-status">
                            <span className={`status-badge ${entry.workout === 'taken' ? 'completed' : 'missed'}`}>
                              {entry.workout === 'taken' ? '💪' : '❌'} Workout
                            </span>
                            {entry.weight && (
                              <span className="weight-badge">{entry.weight} kg</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressWeeks;