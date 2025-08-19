import { testGetWorkoutDay } from "../../url";
import "./pieChartBox.scss";
import { useEffect, useState } from "react";

interface WorkoutData {
  name: string;
  exercise_list: string[];
}

const PieChartBox = () => {
  const [workout, setWorkout] = useState<WorkoutData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching today's workout...");
        const res = await fetch(testGetWorkoutDay);
        const data = await res.json();
        console.log(data);
        setWorkout(data.data);
      } catch (err) {
        console.error("Error fetching workout:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pieChartBox">
      <h1>Workout of the Day</h1>
      {workout ? (
        <div className="workoutContent">
          <h2 className="workoutName">{workout.name}</h2>
          <ul className="exerciseList">
            {workout.exercise_list.map((item, index) => {
              const exerciseName = item.exercise; // extract string
              let type = "main";

              if (exerciseName.toLowerCase().includes("warmup"))
                type = "warmup";
              else if (exerciseName.toLowerCase().includes("cardio"))
                type = "cardio";

              return (
                <li key={index} className={`exerciseItem ${type}`}>
                  <span className="dot" />
                  {exerciseName}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PieChartBox;
