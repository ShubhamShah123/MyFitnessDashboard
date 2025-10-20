import { useEffect, useState } from "react";
import "./exercise-list.scss";
import { getExerciseListUrl } from "../../url";
import ModalBox from "../../components/modalBox/ModalBox";

// Type definitions
interface Exercise {
  gif: string;
  name: string;
}

interface ExerciseData {
  abs_exercises: Exercise[];
  cardio_exercises: Exercise[];
  unique_exercises: {
    [key: string]: Exercise[];
  };
}

interface ApiResponse {
  data: ExerciseData;
}

const ExerciseList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exerciseData, setExerciseData] = useState<ExerciseData | null>(null);

  // Modal to view exercise gif
  // Modal for viewing exercise details
	const [modalOpen, setModalOpen] = useState(false);
	const [modalData, setModalData] = useState({
		exerciseGifUrl: "",
	});

  useEffect(() => {
    console.log("Getting Exercise List");
    const getExerciseList = async () => {
      try {
        setLoading(true);
        const getExerciseListRequest = await fetch(getExerciseListUrl);
        const getExerciseListResponse: ApiResponse = await getExerciseListRequest.json();
        console.log("Response from server: \n", getExerciseListResponse);
        setExerciseData(getExerciseListResponse.data);
      } catch (err) {
        setError("Error fetching exercise data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getExerciseList();
  }, []);


  // Handle click event
  const handleExerciseClick = (exercise: Exercise) => {
    console.log("Exercise Clicked:");
    console.log("Name:", exercise.name);
    console.log("GIF:", exercise.gif);
    let gifUrl = `/images/${exercise.gif}.gif`;
		setModalData({
			exerciseGifUrl: gifUrl || "",
		});
		setModalOpen(true);
  };

  // Helper function to get category icon
  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      abs: "🔥",
      cardio: "❤️",
      "Back + Biceps": "💪",
      "Chest + Triceps": "🏋️",
      "Legs + Shoulders": "⚡",
    };
    return iconMap[category] || "🎯";
  };

  // Helper function to get category class name
  const getCategoryClass = (category: string): string => {
    const classMap: { [key: string]: string } = {
      abs: "abs",
      cardio: "cardio",
      "Back + Biceps": "back-biceps",
      "Chest + Triceps": "chest-triceps",
      "Legs + Shoulders": "legs-shoulders",
    };
    return classMap[category] || "";
  };

  // Calculate total exercises
  const getTotalExercises = (): number => {
    if (!exerciseData) return 0;
    let total = 0;
    total += exerciseData.abs_exercises?.length || 0;
    total += exerciseData.cardio_exercises?.length || 0;
    if (exerciseData.unique_exercises) {
      Object.values(exerciseData.unique_exercises).forEach((exercises) => {
        total += exercises.length;
      });
    }
    return total;
  };

  // Get category count
  const getCategoryCount = (): number => {
    if (!exerciseData) return 0;
    let count = 0;
    if (exerciseData.abs_exercises?.length) count++;
    if (exerciseData.cardio_exercises?.length) count++;
    if (exerciseData.unique_exercises) {
      count += Object.keys(exerciseData.unique_exercises).length;
    }
    return count;
  };

  // Loading state
  if (loading) {
    return (
      <div className="ExerciseList">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your workout library...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="ExerciseList">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!exerciseData) {
    return (
      <div className="ExerciseList">
        <div className="empty-state">
          <div className="empty-icon">🏋️</div>
          <h3>No exercises found</h3>
          <p>Your workout library is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ExerciseList">
      <div className="exercise-container">
        {/* Header */}
        <div className="exercise-header">
          <h1>Exercise Library</h1>
          <p className="subtitle">Your complete workout collection</p>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">{getTotalExercises()}</span>
              <span className="stat-label">Total Exercises</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getCategoryCount()}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>

        {/* ABS Exercises */}
        {exerciseData.abs_exercises && (
          <div className="exercise-category">
            <div className="category-header">
              <div className="category-badge">
                <div className={`category-icon ${getCategoryClass("abs")}`}>
                  {getCategoryIcon("abs")}
                </div>
                <h2>ABS Exercises</h2>
                <span className="exercise-count">
                  {exerciseData.abs_exercises.length}
                </span>
              </div>
            </div>
            <div className="exercise-grid">
              {exerciseData.abs_exercises.map((exercise, index) => (
                <div
                  className="exercise-card"
                  key={index}
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <div className="exercise-number">{index + 1}</div>
                  <p className="exercise-name">{exercise.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cardio Exercises */}
        {exerciseData.cardio_exercises && (
          <div className="exercise-category">
            <div className="category-header">
              <div className="category-badge">
                <div className={`category-icon ${getCategoryClass("cardio")}`}>
                  {getCategoryIcon("cardio")}
                </div>
                <h2>Cardio Exercises</h2>
                <span className="exercise-count">
                  {exerciseData.cardio_exercises.length}
                </span>
              </div>
            </div>
            <div className="exercise-grid">
              {exerciseData.cardio_exercises.map((exercise, index) => (
                <div
                  className="exercise-card"
                  key={index}
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <div className="exercise-number">{index + 1}</div>
                  <p className="exercise-name">{exercise.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unique Exercises (Back + Biceps, Chest + Triceps, etc.) */}
        {exerciseData.unique_exercises &&
          Object.entries(exerciseData.unique_exercises).map(
            ([category, exercises]) => (
              <div className="exercise-category" key={category}>
                <div className="category-header">
                  <div className="category-badge">
                    <div
                      className={`category-icon ${getCategoryClass(category)}`}
                    >
                      {getCategoryIcon(category)}
                    </div>
                    <h2>{category}</h2>
                    <span className="exercise-count">{exercises.length}</span>
                  </div>
                </div>
                <div className="exercise-grid">
                  {exercises.map((exercise, index) => (
                    <div
                      className="exercise-card"
                      key={index}
                      onClick={() => handleExerciseClick(exercise)}
                    >
                      <div className="exercise-number">{index + 1}</div>
                      <p className="exercise-name">{exercise.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
      </div>
      <ModalBox
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        exerciseGifUrl={modalData.exerciseGifUrl} title={""} body={""}			/>
    </div>
  );
};

export default ExerciseList;
