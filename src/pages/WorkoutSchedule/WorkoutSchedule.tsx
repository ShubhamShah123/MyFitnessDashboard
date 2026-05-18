// WorkoutSchedule.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./workout-schedule.scss";
import { getWorkoutScheduleUrl } from "../../url";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useCookies } from "react-cookie";

interface WorkoutDay {
  exKey: string;
  day: string;
  name: string;
  dayNumber?: number;
  weekNumber?: string;
}


const WorkoutSchedule = () => {
  const [schedule, setSchedule] = useState<WorkoutDay[]>([]);
  const [selectedProfile, setSelectedProfile] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [schedProfile,,] = useCookies(['profile']);
  const [profileID, setProfileID] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const getWorkoutSchedule = async () => {
      console.log("Get Workout Schedule.");
      setLoading(false);
      console.log("Profile from cookies: ", schedProfile.profile)
      setSelectedProfile(schedProfile.profile)
    };

    getWorkoutSchedule();
  }, []);

  const getSchedule = async (profileId: number, weekNumber?: number) => {
    console.log("Get Schedule Clicked: ", profileId);
    setSchedule([]);
    setProfileID(profileId);
    let url = getWorkoutScheduleUrl + "?profile=" + profileId;
    if (profileId === 1 && weekNumber !== undefined) {
      url += "&week=" + weekNumber;
    }
    console.log(url);
    let request = await fetch(url, { method: "GET" });
    let response = await request.json();
    console.log("Request: ", request);
    console.log("Response: ", response);
    if (profileId === 1) {
      console.log("Profile 1, Week:", weekNumber);
      setSchedule(response.data); // wire up when ready
    } else {
      setSchedule(response.data);
    }
  };

  const handleCardClick = (exKey: string, selectedWeek: number) => {
    console.log("Exercise Key:", exKey);
    console.log("Week:", selectedWeek);
    console.log("PropfileID: ",profileID)
    navigate(`/dashboard/WorkoutDetail/${exKey}`,{
      state: {
        profileID,
        selectedWeek
      }
    });
  };

  return (
    <div className="WorkoutSchedule">
      <h1>Weekly Workout Plan</h1>

      {/* Profile + Week Selector */}
      <div className="week-selector">
        <label htmlFor="profile-select">Select Profile: </label>
        <select
          id="profile-select"
          value={selectedProfile}
          onChange={(e) => {
            setSelectedProfile(parseInt(e.target.value));
            setSelectedWeek(1); // reset week when profile changes
          }}
        >
          {Array.from({ length: 2 }, (_, i) => i + 1).map((profile) => (
            <option key={profile} value={profile}>
              Profile {profile}
            </option>
          ))}
        </select>

        {/* Conditionally show week dropdown only for Profile 1 */}
        {selectedProfile === 1 && (
          <>
            <label htmlFor="week-select" style={{ marginLeft: "12px" }}>
              Select Week:{" "}
            </label>
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
          </>
        )}

        <button
          className="log-btn"
          onClick={() =>
            getSchedule(
              selectedProfile,
              selectedProfile === 1 ? selectedWeek : undefined
            )
          }
        >
          Get Schedule
        </button>
      </div>

      <div className="schedule-grid">
        {schedule.map((workout) => (
          <div
            className={`day-card ${workout.name === "REST" ? "rest-day" : ""}`}
            key={workout.exKey}
            onClick={() => handleCardClick(workout.exKey, selectedWeek)}
          >
            <div className="day-name">{workout.day}</div>
            <div className="exercise-text">{workout.name}</div>
          </div>
        ))}
      </div>

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