import { useEffect, useState } from "react";
import "./exercise-list.scss";
import { getExerciseListUrl } from "../../url";
import ModalBox from "../../components/modalBox/ModalBox";

// Type definitions
interface Exercise {
  gif: string;
  name: string;
}

interface ApiResponse {
  data: Exercise[];
  status: string;
  status_code: number;
}

const ExerciseList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Modal to view exercise gif
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
        setExercises(getExerciseListResponse.data);
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
    let gifUrl = `/images/${exercise.gif}`;
    setModalData({
      exerciseGifUrl: gifUrl || "",
    });
    setModalOpen(true);
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
  if (!exercises || exercises.length === 0) {
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
              <span className="stat-number">{exercises.length}</span>
              <span className="stat-label">Total Exercises</span>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="exercise-category">
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
      </div>
      <ModalBox
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        exerciseGifUrl={modalData.exerciseGifUrl}
        title={""}
        body={""}
      />
    </div>
  );
};

export default ExerciseList;