import { useEffect, useState } from "react";
import "./daily-workout-list.scss";
import { getDailyWorkoutUrl, deleteDailyWorkoutUrl } from "../../url";

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

const DailyWorkoutList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
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
          // Reverse the data to show newest first
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

  // Pagination logic
  const totalPages = Math.ceil(workoutData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = workoutData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]); // Clear selections when changing page
  };

  const handleShow = (histKey: string, sessKey: string) => {
    console.log("histKey:", histKey);
    console.log("sessKey:", sessKey);
  };

  const handleCheckboxChange = (histKey: string, sessKey: string) => {
    const isSelected = selectedItems.some(item => item.histKey === histKey);
    
    if (isSelected) {
      setSelectedItems(selectedItems.filter(item => item.histKey !== histKey));
    } else {
      setSelectedItems([...selectedItems, { histKey, sessKey }]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      const allItems = currentData.map(item => ({ 
        histKey: item.histKey, 
        sessKey: item.sessKey 
      }));
      setSelectedItems(allItems);
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      alert("No items selected");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} workout(s)?`)) {
      return;
    }
    
    try {
      console.log("Selected items to delete:");
      selectedItems.forEach(item => {
        console.log("histKey:", item.histKey, "| sessKey:", item.sessKey);
      });
      
      let deleteItems = {
        'keyList': selectedItems
      }
      console.log(deleteItems)
      
      const deletRequest = await fetch(deleteDailyWorkoutUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteItems)
      });
      const result = await deletRequest.json();
      console.log("Delete Response:", result);
      
      if (result.status_code === 200) {
        // Remove deleted items from workoutData
        const deletedHistKeys = selectedItems.map(item => item.histKey);
        const updatedWorkoutData = workoutData.filter(
          workout => !deletedHistKeys.includes(workout.histKey)
        );
        setWorkoutData(updatedWorkoutData);
        
        // Clear selections
        setSelectedItems([]);
        
        // Adjust current page if necessary
        const newTotalPages = Math.ceil(updatedWorkoutData.length / itemsPerPage);
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
                    checked={selectedItems.length === currentData.length && currentData.length > 0}
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
                      checked={selectedItems.some(item => item.histKey === workout.histKey)}
                      onChange={() => handleCheckboxChange(workout.histKey, workout.sessKey)}
                    />
                  </td>
                  <td className="date-col">{workout.date}</td>
                  <td className="day-col">{workout.sessDay}</td>
                  <td className="session-col">
                    <span className={`session-name ${getIntensityClass(workout.sessName)}`}>
                      {workout.sessName}
                    </span>
                  </td>
                  <td className="action-col">
                    <button
                      className="show-btn"
                      onClick={() => handleShow(workout.histKey, workout.sessKey)}
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
                className={`page-number ${currentPage === page ? "active" : ""}`}
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
    </div>
  );
};

export default DailyWorkoutList;