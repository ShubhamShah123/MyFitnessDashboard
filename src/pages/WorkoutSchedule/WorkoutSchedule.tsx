// WorkoutSchedule.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./workout-schedule.scss";
import { getWorkoutScheduleUrl } from "../../url";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

interface WorkoutDay {
  exKey: string;
  id: string;
  name: string;
  dayNumber: number;
  weekNumber: number;
}

const WorkoutSchedule = () => {
  const [schedule, setSchedule] = useState<WorkoutDay[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const getWorkoutSchedule = async () => {
      try {
        const response = await fetch(getWorkoutScheduleUrl);
        const data = await response.json();
        console.log("Data: ", data);
        
        if (data.code === 200) {
          // Transform the nested data structure into a flat array for the selected week
          const weekData = data.data[selectedWeek];
          const workoutDays: WorkoutDay[] = Object.keys(weekData).map((dayNum) => ({
            ...weekData[dayNum],
            dayNumber: parseInt(dayNum),
            weekNumber: selectedWeek,
          }));
          setSchedule(workoutDays);
        }
      } catch (error) {
        console.error("Error fetching workout schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    getWorkoutSchedule();
  }, [selectedWeek]);

  const handleCardClick = (exKey: string, id: string) => {
    console.log("Clicked card ID:", id);
    console.log("Exercise Key:", exKey);
    // Navigate to the workout detail page with the exKey or id
    navigate(`/dashboard/WorkoutDetail/${exKey}`);
  };

  return (
    <div className="WorkoutSchedule">
      <h1>Weekly Workout Plan</h1>

      {/* Week Selector */}
      <div className="week-selector">
        <label htmlFor="week-select">Select Week: </label>
        <select
          id="week-select"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select>
      </div>

      <div className="schedule-grid">
        {schedule.map((workout) => (
          <div
            className={`day-card ${workout.name === "Rest" ? "rest-day" : ""}`}
            key={workout.id}
            onClick={() => handleCardClick(workout.exKey, workout.id)}
          >
            <div className="day-name">{dayNames[workout.dayNumber - 1]}</div>
            <div className="exercise-text">{workout.name}</div>
          </div>
        ))}
      </div>

      {/* MUI Backdrop with Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default WorkoutSchedule;