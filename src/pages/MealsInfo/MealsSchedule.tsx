// MealsSchedule.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./meals-schedule.scss";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getMealsScheduleUrl } from "../../url";


interface MealPlan {
  id: number;
  day: string;
  type: string;
  num_meals: number;
}

const MealsSchedule = () => {
  const [schedule, setSchedule] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMealsSchedule = async () => {
      try {
        const mealsSched = await fetch(getMealsScheduleUrl)
        const mealsSchedResp = await mealsSched.json()
        setSchedule(mealsSchedResp.data);
      } catch (error) {
        console.error("Error fetching meals schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    getMealsSchedule();
  }, []);

  const handleCardClick = (id: number) => {
    console.log("Clicked meal plan ID:", id);
    // Navigate to the meal detail page with the id
    navigate(`/MealsDetail/${id}`);
  };

  const getMealTypeIcon = (type: string) => {
    return type === "Low-Carb" ? "🥗" : "🍚";
  };

  
  return (
    <div className="MealsSchedule">
      <h1>Weekly Meal Plan</h1>

      <div className="schedule-grid">
        {schedule.map(({ day, type, id, num_meals }) => (
          <div
            className="day-card"
            key={id}
            data-meal-type={type}
            onClick={() => handleCardClick(id)}
          >
            <div className="day-name">
              {getMealTypeIcon(type)}
              {day}
            </div>
            <div className="meal-type">{type}</div>
            <div className="meal-count">
              {num_meals} meals planned
            </div>
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

export default MealsSchedule;