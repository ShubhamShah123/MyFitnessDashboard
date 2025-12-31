import { useEffect, useState } from "react";
import "./daily-workout-list.scss";
import {
  getDailyWorkoutUrl,
  deleteDailyWorkoutUrl,
  getDailyWorkoutReport,
} from "../../url";

interface WorkoutData {
  date: string;
  histKey: string;
  sessDay: string;
  sessKey: string;
  sessName: string;
}

interface SelectedItem {
  histKey: string;
  sessKey: string;
}

interface WorkoutDetail {
  data: {
    date: string;
    meals: {
      breakfast: string;
      dinner: string;
      hip: string;
      lunch: string;
      preWorkout: string;
      snack: string;
      stomach: string;
      thigh: string;
      waist: string;
      weight: string;
      workout: string;
    };
    session: {
      day: string;
      exercise: { [key: string]: string };
      name: string;
      sessionTime: string;
      totalTimeTaken: string;
    };
  };
  status: string;
}

const DailyWorkoutList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkoutDetail, setSelectedWorkoutDetail] =
    useState<WorkoutDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Getting Exercise List");
    const getExerciseList = async () => {
      try {
        setLoading(true);
        const getDailyWorkoutList = await fetch(getDailyWorkoutUrl);
        const getDailyWorkoutListResponse = await getDailyWorkoutList.json();
        console.log("########## DAILY WORKOUT RESPONSE #################");
        console.log(getDailyWorkoutListResponse);
        console.log("#################################################");

        if (getDailyWorkoutListResponse.data) {
          setWorkoutData([...getDailyWorkoutListResponse.data].reverse());
        }
      } catch (err) {
        setError("Error fetching exercise data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getExerciseList();
  }, []);

  const totalPages = Math.ceil(workoutData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = workoutData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]);
  };

  const handleShow = async (hist: string, sess: string) => {
    console.log("histKey:", hist);
    console.log("sessKey:", sess);

    setLoadingDetail(true);
    setShowModal(true);

    // TODO: Replace with your actual API endpoint
    // const response = await fetch(`your-api-url?histKey=${histKey}&sessKey=${sessKey}`);
    // const data = await response.json();
    const getDailyWorkoutReportRequest = await fetch(getDailyWorkoutReport, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        histKey: hist,
        sessKey: sess,
      }),
    });
    const getDailyWorkoutReportReqsponse =
      await getDailyWorkoutReportRequest.json();
    console.log(getDailyWorkoutReportReqsponse);
    setSelectedWorkoutDetail(getDailyWorkoutReportReqsponse);
    setLoadingDetail(false);
  };

  const handleCheckboxChange = (histKey: string, sessKey: string) => {
    const isSelected = selectedItems.some((item) => item.histKey === histKey);

    if (isSelected) {
      setSelectedItems(
        selectedItems.filter((item) => item.histKey !== histKey)
      );
    } else {
      setSelectedItems([...selectedItems, { histKey, sessKey }]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      const allItems = currentData.map((item) => ({
        histKey: item.histKey,
        sessKey: item.sessKey,
      }));
      setSelectedItems(allItems);
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      alert("No items selected");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedItems.length} workout(s)?`
      )
    ) {
      return;
    }

    try {
      console.log("Selected items to delete:");
      selectedItems.forEach((item) => {
        console.log("histKey:", item.histKey, "| sessKey:", item.sessKey);
      });

      let deleteItems = {
        keyList: selectedItems,
      };
      console.log(deleteItems);

      const deletRequest = await fetch(deleteDailyWorkoutUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteItems),
      });
      const result = await deletRequest.json();
      console.log("Delete Response:", result);

      if (result.status_code === 200) {
        const deletedHistKeys = selectedItems.map((item) => item.histKey);
        const updatedWorkoutData = workoutData.filter(
          (workout) => !deletedHistKeys.includes(workout.histKey)
        );
        setWorkoutData(updatedWorkoutData);
        setSelectedItems([]);

        const newTotalPages = Math.ceil(
          updatedWorkoutData.length / itemsPerPage
        );
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        alert("Successfully deleted selected workouts");
      } else {
        alert("Failed to delete workouts");
      }
    } catch (error) {
      console.error("Error deleting workouts:", error);
      alert("Error occurred while deleting workouts");
    }
  };

  const getIntensityClass = (sessName: string) => {
    if (sessName.includes("Heavy")) return "intensity-heavy";
    if (sessName.includes("Light")) return "intensity-light";
    return "";
  };

  if (loading) {
    return (
      <div className="ExerciseList">
        <div className="exercise-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading workout data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ExerciseList">
        <div className="exercise-container">
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ExerciseList">
      <div className="exercise-container">
        <div className="exercise-header">
          <h1>Daily Workout List</h1>
        </div>

        <div className="table-controls">
          <div className="table-info">
            <span className="record-count">
              Total Records: <strong>{workoutData.length}</strong>
            </span>
            <span className="selected-count">
              Selected: <strong>{selectedItems.length}</strong>
            </span>
          </div>
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={selectedItems.length === 0}
          >
            Delete Selected
          </button>
        </div>

        <div className="table-wrapper">
          <table className="workout-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === currentData.length &&
                      currentData.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Date</th>
                <th>Day</th>
                <th>Session Name</th>
                <th className="action-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((workout) => (
                <tr key={workout.histKey}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedItems.some(
                        (item) => item.histKey === workout.histKey
                      )}
                      onChange={() =>
                        handleCheckboxChange(workout.histKey, workout.sessKey)
                      }
                    />
                  </td>
                  <td className="date-col">{workout.date}</td>
                  <td className="day-col">{workout.sessDay}</td>
                  <td className="session-col">
                    <span
                      className={`session-name ${getIntensityClass(
                        workout.sessName
                      )}`}
                    >
                      {workout.sessName}
                    </span>
                  </td>
                  <td className="action-col">
                    <button
                      className="show-btn"
                      onClick={() =>
                        handleShow(workout.histKey, workout.sessKey)
                      }
                    >
                      Show
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Workout Detail Modal */}
      {showModal && (
        <WorkoutModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          workoutDetail={selectedWorkoutDetail}
          loading={loadingDetail}
        />
      )}
    </div>
  );
};

// Workout Modal Component
const WorkoutModal = ({
  isOpen,
  onClose,
  workoutDetail,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  workoutDetail: WorkoutDetail | null;
  loading: boolean;
}) => {
  if (!isOpen) return null;

  const getMealIcon = (status: string) => {
    if (status === "taken") return "✓";
    if (status === "missed") return "✗";
    return "-";
  };

  const getMealClass = (status: string) => {
    if (status === "taken") return "meal-taken";
    if (status === "missed") return "meal-missed";
    return "meal-empty";
  };

  if (loading || !workoutDetail) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content loading-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Loading workout details...</p>
          </div>
        </div>
      </div>
    );
  }

  const { data, status } = workoutDetail;
  const exercises = Object.entries(data.session.exercise);
  const doneCount = exercises.filter(([_, status]) => status === "Done").length;
  const totalCount = exercises.length;
  const completionRate = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">{data.session.name}</h2>
            <div className="modal-meta">
              <span className="meta-badge">📅 {data.date}</span>
              <span className="meta-badge">📆 {data.session.day}</span>
              <span className="meta-badge">⏰ {data.session.sessionTime}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Status and Time Section */}
          <div className="stats-grid">
            <div className="stat-card status-card">
              <div className="stat-icon">✓</div>
              <div className="stat-info">
                <div className="stat-label">Status</div>
                <div className="stat-value">{status}</div>
              </div>
            </div>
            <div className="stat-card time-card">
              <div className="stat-icon">⏱</div>
              <div className="stat-info">
                <div className="stat-label">Duration</div>
                <div className="stat-value">{data.session.totalTimeTaken}</div>
              </div>
            </div>
            <div className="stat-card completion-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-label">Completion</div>
                <div className="stat-value">{completionRate}%</div>
              </div>
            </div>
          </div>

          {/* Body Metrics Section */}
          {data.meals.weight && (
            <div className="section">
              <h3 className="section-title">📊 Body Metrics</h3>
              <div className="metrics-grid">
                {data.meals.weight && (
                  <div className="metric-item">
                    <span className="metric-label">Weight</span>
                    <span className="metric-value">{data.meals.weight} kg</span>
                  </div>
                )}
                {data.meals.waist && (
                  <div className="metric-item">
                    <span className="metric-label">Waist</span>
                    <span className="metric-value">{data.meals.waist} cm</span>
                  </div>
                )}
                {data.meals.hip && (
                  <div className="metric-item">
                    <span className="metric-label">Hip</span>
                    <span className="metric-value">{data.meals.hip} cm</span>
                  </div>
                )}
                {data.meals.thigh && (
                  <div className="metric-item">
                    <span className="metric-label">Thigh</span>
                    <span className="metric-value">{data.meals.thigh} cm</span>
                  </div>
                )}
                {data.meals.stomach && (
                  <div className="metric-item">
                    <span className="metric-label">Stomach</span>
                    <span className="metric-value">
                      {data.meals.stomach} cm
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Meals Section */}
          <div className="section">
            <h3 className="section-title">🍽 Meal Tracking</h3>
            <div className="meals-grid">
              <div
                className={`meal-card ${getMealClass(data.meals.breakfast)}`}
              >
                <span className="meal-icon">
                  {getMealIcon(data.meals.breakfast)}
                </span>
                <span className="meal-name">Breakfast</span>
              </div>
              <div className={`meal-card ${getMealClass(data.meals.lunch)}`}>
                <span className="meal-icon">
                  {getMealIcon(data.meals.lunch)}
                </span>
                <span className="meal-name">Lunch</span>
              </div>
              <div className={`meal-card ${getMealClass(data.meals.snack)}`}>
                <span className="meal-icon">
                  {getMealIcon(data.meals.snack)}
                </span>
                <span className="meal-name">Snack</span>
              </div>
              <div className={`meal-card ${getMealClass(data.meals.dinner)}`}>
                <span className="meal-icon">
                  {getMealIcon(data.meals.dinner)}
                </span>
                <span className="meal-name">Dinner</span>
              </div>
              <div
                className={`meal-card ${getMealClass(data.meals.preWorkout)}`}
              >
                <span className="meal-icon">
                  {getMealIcon(data.meals.preWorkout)}
                </span>
                <span className="meal-name">Pre-Workout</span>
              </div>
              <div className={`meal-card ${getMealClass(data.meals.workout)}`}>
                <span className="meal-icon">
                  {getMealIcon(data.meals.workout)}
                </span>
                <span className="meal-name">Workout</span>
              </div>
            </div>
          </div>

          {/* Exercises Section */}
          <div className="section">
            <h3 className="section-title">
              💪 Exercises ({doneCount}/{totalCount})
            </h3>
            <div className="exercises-list">
              {exercises.map(([name, exerciseStatus]) => (
                <div
                  key={name}
                  className={`exercise-item ${
                    exerciseStatus === "Done"
                      ? "exercise-done"
                      : "exercise-not-done"
                  }`}
                >
                  <span className="exercise-status-icon">
                    {exerciseStatus === "Done" ? "✓" : "○"}
                  </span>
                  <span className="exercise-name">{name}</span>
                  <span className="exercise-badge">{exerciseStatus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyWorkoutList;
