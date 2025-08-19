// WorkoutSchedule.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./workout-schedule.scss";
import { getWorkoutScheduleUrl } from "../../url";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const WorkoutSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getWorkoutSchedule = async () => {
      try {
        const response = await fetch(getWorkoutScheduleUrl);
        const data = await response.json();
        if (data.status_code === 200) {
          setSchedule(data.data);
        }
      } catch (error) {
        console.error("Error fetching workout schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    getWorkoutSchedule();
  }, []);

  const handleCardClick = (id: string) => {
    console.log("Clicked card ID:", id);
    // Navigate to the workout detail page with the id
    navigate(`/WorkoutDetail/${id}`);
  };

  return (
    <div className="WorkoutSchedule">
      <h1>Weekly Workout Plan</h1>

      <div className="schedule-grid">
        {schedule.map(({ day, exercise, id, key }) => (
          <div
            className="day-card"
            key={id}
            onClick={() => handleCardClick(key)}
          >
            <div className="day-name">{day}</div>
            <div className="exercise-text">{exercise}</div>
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