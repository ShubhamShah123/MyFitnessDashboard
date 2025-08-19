import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./meals-detail.scss";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getMealsDetailsUrl } from "../../url";

interface MealDetail {
  meal_num: number;
  meal_type: string;
  meal_name: string;
  recipe: string[];
}

interface MealPlan {
  id: number;
  day: string;
  type: string;
  details: MealDetail[];
}

const MealsInfo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMealInfo = async () => {
      try {
        if (!id) return;

        console.clear();
        const url = getMealsDetailsUrl + id;
        console.log("Fetching from:", url);

        const res = await fetch(url);
        const data = await res.json();
        console.log("API response:", data);

        if (data?.data) {
          const apiPlan: MealPlan = {
            id: parseInt(id),
            day: data.data.day,
            type: data.data.type,
            details: data.data.details.map((meal: any, index: number) => ({
              meal_num: index + 1,
              meal_type: meal.meal_type || "---",
              meal_name: meal.meal_name || "Unnamed Meal",
              recipe: meal.recipe || []
            }))
          };
          setMealPlan(apiPlan);
        } else {
          setMealPlan(null);
        }
      } catch (error) {
        console.error("Error fetching meal info:", error);
        setMealPlan(null);
      } finally {
        setLoading(false);
      }
    };

    getMealInfo();
  }, [id]);

  const getMealTypeIcon = (type: string) => {
    return type === "Low-Carb" ? "🥗" : "🍚";
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return "🌅";
      case "lunch":
        return "🌞";
      case "dinner":
        return "🌙";
      case "snack":
        return "🍎";
      default:
        return "☕";
    }
  };

  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!mealPlan) {
    return (
      <div className="MealsInfo error">
        <h1>Meal Plan Not Found</h1>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="MealsInfo">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <div className="day-info">
          <h1>
            {getMealTypeIcon(mealPlan.type)} {mealPlan.day}
          </h1>
          <span className="meal-type-badge" data-type={mealPlan.type}>
            {mealPlan.type}
          </span>
        </div>
      </div>

      <div className="meals-container">
        {mealPlan.details.map((meal) => (
          <div key={meal.meal_num} className="meal-card">
            <div className="meal-header">
              <div className="meal-info">
                <span className="meal-icon">
                  {getMealIcon(meal.meal_type)}
                </span>
                <div>
                  <h3 className="meal-name">{meal.meal_name}</h3>
                  {meal.meal_type !== "---" && (
                    <span className="meal-type-label">{meal.meal_type}</span>
                  )}
                </div>
              </div>
              <span className="meal-number">#{meal.meal_num}</span>
            </div>

            {meal.recipe.length > 0 ? (
              <div className="recipe-section">
                <h4>Ingredients:</h4>
                <ul className="ingredients-list">
                  {meal.recipe.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="no-recipe">
                <p>No specific ingredients listed</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsInfo;
