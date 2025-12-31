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

type ReportType = 'weekly' | 'monthly';

const ProgressWeeks: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [reportType, setReportType] = useState<ReportType>('weekly');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getProgressUrl);
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

  const handleDownloadReport = () => {
    console.log(reportType);
    if (!progressData) return;
    
    generatePDF(progressData, reportType);
  };

  const generatePDF = (data: ProgressData, type: ReportType) => {
    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const totalWorkouts = data.weekly_data.reduce((sum, week) => sum + week.summary.workouts_completed, 0);
    const totalDays = data.weekly_data.reduce((sum, week) => sum + week.summary.total_entries, 0);
    const avgWeight = data.weekly_data.reduce((sum, week) => sum + week.summary.average_weight, 0) / data.weekly_data.length;

    // Get data based on report type
    const reportData = type === 'weekly' ? data.weekly_data : groupByMonth(data.weekly_data);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Progress Report - ${type === 'weekly' ? 'Weekly' : 'Monthly'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 50px;
              background: #ffffff;
              color: #1a1a1a;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 50px;
              padding-bottom: 20px;
              border-bottom: 3px solid #0a0a0a;
            }
            .header h1 {
              font-size: 32px;
              font-weight: 700;
              color: #0a0a0a;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            .header .subtitle {
              font-size: 14px;
              color: #666;
              font-weight: 400;
            }
            .summary-stats {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 0;
              margin-bottom: 50px;
              border: 2px solid #0a0a0a;
            }
            .stat-box {
              padding: 24px;
              text-align: center;
              border-right: 2px solid #0a0a0a;
            }
            .stat-box:last-child {
              border-right: none;
            }
            .stat-value {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 5px;
              color: #0a0a0a;
            }
            .stat-label {
              font-size: 11px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 600;
            }
            .week-section {
              margin-bottom: 40px;
              page-break-inside: avoid;
              border: 2px solid #0a0a0a;
              padding: 0;
            }
            .week-header {
              background: #0a0a0a;
              color: white;
              padding: 16px 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .week-title {
              font-size: 18px;
              font-weight: 700;
            }
            .week-date {
              font-size: 13px;
              font-weight: 400;
            }
            .week-content {
              padding: 20px;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 0;
              margin-bottom: 20px;
              border: 1px solid #e5e7eb;
            }
            .metric-item {
              padding: 16px;
              border-right: 1px solid #e5e7eb;
              border-bottom: 1px solid #e5e7eb;
            }
            .metric-item:nth-child(4n) {
              border-right: none;
            }
            .metric-label {
              font-size: 10px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
              font-weight: 600;
            }
            .metric-value {
              font-size: 18px;
              font-weight: 700;
              color: #0a0a0a;
            }
            .section-title {
              font-size: 13px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 15px;
              color: #0a0a0a;
              padding-bottom: 8px;
              border-bottom: 2px solid #0a0a0a;
            }
            .weight-section {
              margin-bottom: 25px;
            }
            .weight-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
              gap: 1px;
              background: #e5e7eb;
              border: 1px solid #e5e7eb;
              margin-bottom: 15px;
            }
            .weight-item {
              background: white;
              padding: 12px;
              text-align: center;
            }
            .weight-date {
              font-size: 10px;
              color: #666;
              margin-bottom: 4px;
              font-weight: 500;
            }
            .weight-value {
              font-size: 16px;
              font-weight: 700;
              color: #0a0a0a;
            }
            .weight-avg {
              background: #f9fafb;
              border: 2px solid #0a0a0a;
              padding: 16px;
              text-align: center;
            }
            .weight-avg-label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 4px;
              font-weight: 600;
              color: #666;
            }
            .weight-avg-value {
              font-size: 24px;
              font-weight: 700;
              color: #0a0a0a;
            }
            .meal-breakdown {
              margin-top: 25px;
            }
            .meal-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 1px;
              background: #e5e7eb;
              border: 1px solid #e5e7eb;
            }
            .meal-item {
              text-align: center;
              padding: 16px;
              background: white;
            }
            .meal-item-label {
              font-size: 10px;
              color: #666;
              margin-bottom: 5px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .meal-item-value {
              font-size: 20px;
              font-weight: 700;
              color: #0a0a0a;
            }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 3px solid #0a0a0a;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { 
                padding: 30px;
              }
              .week-section { 
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Progress Tracker Report</h1>
            <div class="subtitle">${type === 'weekly' ? 'Weekly' : 'Monthly'} Report - Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>

          <div class="summary-stats">
            <div class="stat-box">
              <div class="stat-value">${data.weekly_data.length}</div>
              <div class="stat-label">Weeks Tracked</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${totalWorkouts}</div>
              <div class="stat-label">Total Workouts</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${totalDays}</div>
              <div class="stat-label">Days Logged</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${avgWeight.toFixed(1)} kg</div>
              <div class="stat-label">Avg Weight</div>
            </div>
          </div>

          ${type === 'weekly' ? generateWeeklyHTML(data.weekly_data) : generateMonthlyHTML(groupByMonth(data.weekly_data))}

          <div class="footer">
            <p>Generated by Progress Tracker</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }, 250);
    };
  };

  const generateWeeklyHTML = (weeks: WeekData[]) => {
    return weeks.map(week => `
      <div class="week-section">
        <div class="week-header">
          <div class="week-title">Week ${week.week_number}</div>
          <div class="week-date">${week.date_range}</div>
        </div>
        
        <div class="week-content">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-label">Workouts Completed</div>
              <div class="metric-value">${week.summary.workouts_completed}/${week.summary.total_entries}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Total Entries</div>
              <div class="metric-value">${week.summary.total_entries}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Meal Completion</div>
              <div class="metric-value">${Math.round((week.summary.meals_taken.breakfast + week.summary.meals_taken.lunch + week.summary.meals_taken.dinner + week.summary.meals_taken.snack) / (week.summary.total_entries * 4) * 100)}%</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Weight Range</div>
              <div class="metric-value">${Math.min(...week.summary.weight_readings).toFixed(1)} - ${Math.max(...week.summary.weight_readings).toFixed(1)} kg</div>
            </div>
          </div>

          <div class="weight-section">
            <div class="section-title">Daily Weight Readings</div>
            <div class="weight-grid">
              ${week.entries.map(entry => `
                <div class="weight-item">
                  <div class="weight-date">${new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div class="weight-value">${entry.weight} kg</div>
                </div>
              `).join('')}
            </div>
            <div class="weight-avg">
              <div class="weight-avg-label">Weekly Average</div>
              <div class="weight-avg-value">${week.summary.average_weight.toFixed(1)} kg</div>
            </div>
          </div>

          <div class="meal-breakdown">
            <div class="section-title">Meal Breakdown</div>
            <div class="meal-grid">
              <div class="meal-item">
                <div class="meal-item-label">Breakfast</div>
                <div class="meal-item-value">${week.summary.meals_taken.breakfast}</div>
              </div>
              <div class="meal-item">
                <div class="meal-item-label">Lunch</div>
                <div class="meal-item-value">${week.summary.meals_taken.lunch}</div>
              </div>
              <div class="meal-item">
                <div class="meal-item-label">Dinner</div>
                <div class="meal-item-value">${week.summary.meals_taken.dinner}</div>
              </div>
              <div class="meal-item">
                <div class="meal-item-label">Snacks</div>
                <div class="meal-item-value">${week.summary.meals_taken.snack}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  };

  const groupByMonth = (weeks: WeekData[]) => {
    const monthlyData: { [key: string]: WeekData[] } = {};
    
    weeks.forEach(week => {
      const monthYear = new Date(week.entries[0].date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = [];
      }
      monthlyData[monthYear].push(week);
    });
    
    return monthlyData;
  };

  const generateMonthlyHTML = (monthlyData: { [key: string]: WeekData[] }) => {
    return Object.entries(monthlyData).map(([month, weeks]) => {
      const totalWorkouts = weeks.reduce((sum, w) => sum + w.summary.workouts_completed, 0);
      const totalEntries = weeks.reduce((sum, w) => sum + w.summary.total_entries, 0);
      const avgWeight = weeks.reduce((sum, w) => sum + w.summary.average_weight, 0) / weeks.length;
      const totalBreakfast = weeks.reduce((sum, w) => sum + w.summary.meals_taken.breakfast, 0);
      const totalLunch = weeks.reduce((sum, w) => sum + w.summary.meals_taken.lunch, 0);
      const totalDinner = weeks.reduce((sum, w) => sum + w.summary.meals_taken.dinner, 0);
      const totalSnacks = weeks.reduce((sum, w) => sum + w.summary.meals_taken.snack, 0);
      
      // Collect all weight readings for the month
      const allWeights: { date: string; weight: string }[] = [];
      weeks.forEach(week => {
        week.entries.forEach(entry => {
          if (entry.weight) {
            allWeights.push({ date: entry.date, weight: entry.weight });
          }
        });
      });
      
      const weightValues = allWeights.map(w => parseFloat(w.weight));
      const minWeight = Math.min(...weightValues);
      const maxWeight = Math.max(...weightValues);

      return `
        <div class="week-section">
          <div class="week-header">
            <div class="week-title">${month}</div>
            <div class="week-date">${weeks.length} weeks • ${totalEntries} days</div>
          </div>
          
          <div class="week-content">
            <div class="metrics-grid">
              <div class="metric-item">
                <div class="metric-label">Workouts Completed</div>
                <div class="metric-value">${totalWorkouts}/${totalEntries}</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Total Entries</div>
                <div class="metric-value">${totalEntries}</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Meal Completion</div>
                <div class="metric-value">${Math.round((totalBreakfast + totalLunch + totalDinner + totalSnacks) / (totalEntries * 4) * 100)}%</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Weight Range</div>
                <div class="metric-value">${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg</div>
              </div>
            </div>

            <div class="weight-section">
              <div class="section-title">Daily Weight Readings (${allWeights.length} readings)</div>
              <div class="weight-grid">
                ${allWeights.map(item => `
                  <div class="weight-item">
                    <div class="weight-date">${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div class="weight-value">${item.weight} kg</div>
                  </div>
                `).join('')}
              </div>
              <div class="weight-avg">
                <div class="weight-avg-label">Monthly Average</div>
                <div class="weight-avg-value">${avgWeight.toFixed(1)} kg</div>
              </div>
            </div>

            <div class="meal-breakdown">
              <div class="section-title">Monthly Meal Breakdown</div>
              <div class="meal-grid">
                <div class="meal-item">
                  <div class="meal-item-label">Breakfast</div>
                  <div class="meal-item-value">${totalBreakfast}</div>
                </div>
                <div class="meal-item">
                  <div class="meal-item-label">Lunch</div>
                  <div class="meal-item-value">${totalLunch}</div>
                </div>
                <div class="meal-item">
                  <div class="meal-item-label">Dinner</div>
                  <div class="meal-item-value">${totalDinner}</div>
                </div>
                <div class="meal-item">
                  <div class="meal-item-label">Snacks</div>
                  <div class="meal-item-value">${totalSnacks}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  const getMealCompletionRate = (meals: WeekSummary['meals_taken'], totalEntries: number) => {
    const totalMeals = meals.breakfast + meals.dinner + meals.lunch + meals.snack;
    const maxPossibleMeals = totalEntries * 4;
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
        <div className="header-content">
          <div className="header-left">
            <h1>Progress Tracker.</h1>
            <p className="subtitle">Track your weekly progress and achievements</p>
          </div>
          <div className="header-right">
            <div className="report-controls">
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="reportType"
                    value="weekly"
                    checked={reportType === 'weekly'}
                    onChange={(e) => setReportType(e.target.value as ReportType)}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Weekly</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="reportType"
                    value="monthly"
                    checked={reportType === 'monthly'}
                    onChange={(e) => setReportType(e.target.value as ReportType)}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Monthly</span>
                </label>
              </div>
              <button onClick={handleDownloadReport} className="download-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download Report
              </button>
            </div>
          </div>
        </div>
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