import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "./upload-progress.scss";
import { getSessionProgressUrl, updateSessionUrl } from "../../url";

interface MealTrackingData {
  breakfast: "taken" | "missed" | "";
  lunch: "taken" | "missed" | "";
  snack: "taken" | "missed" | "";
  preWorkout: "taken" | "missed" | "";
  dinner: "taken" | "missed" | "";
  workout: "taken" | "missed" | "";
}

interface BodyMeasurements {
  hip: string;
  stomach: string;
  thigh: string;
  waist: string;
  weight: string;
}

export default function ProgressUploadForm() {
  const [sessKey, setSessKey] = useState();
  const [sessionTime, setSessionTime] = useState<"morning" | "evening">("morning");
  const [mealTracking, setMealTracking] = useState<MealTrackingData>({
    breakfast: "",
    lunch: "",
    snack: "",
    preWorkout: "",
    dinner: "",
    workout: "",
  });

  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements>({
    hip: "",
    stomach: "",
    thigh: "",
    waist: "",
    weight: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMealChange = (
    meal: keyof MealTrackingData,
    value: "taken" | "missed"
  ) => {
    setMealTracking((prev) => ({
      ...prev,
      [meal]: value,
    }));
  };

  const handleMeasurementChange = (
    measurement: keyof BodyMeasurements,
    value: string
  ) => {
    if (value === "" || /^\d+\.?\d*$/.test(value)) {
      setBodyMeasurements((prev) => ({
        ...prev,
        [measurement]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("## HANDLE SUBMIT #######")
    e.preventDefault();
    setIsSubmitting(true);
    const dateSubmit1 = new Date();
    console.log("dateSubmit1: ",dateSubmit1)
    const dayName = dateSubmit1.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    console.log(dayName); // "Wednesday"
    const anotherData = new Date();
    console.log("anotherDate: ",anotherData)
    const today_new = format(anotherData, "MMM dd, yyyy");
    console.log("today_new: ",today_new);

    const formData2 = {
      date: today_new,
      ...mealTracking,
      ...bodyMeasurements,
      sessKey
    };
    console.log(formData2)
    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1000));
    const updateSessRequest = await fetch(updateSessionUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData2)
    })
    const updateSessResponse = await updateSessRequest.json()
    console.log("Update Session Response: ",updateSessResponse)
    alert(
      "Progress data submitted successfully! Check the console for details."
    );
    setIsSubmitting(false);

    console.log("SessionKey: ", sessKey);
  };

  useEffect(() => {
    const getSessionProgress = async () => {
      console.log("Getting the session Progress.");
      console.log(getSessionProgressUrl);
      const today = new Date();
      console.log(today);
      const formatter = new Intl.DateTimeFormat("en-US", {
        month: "short", // "Oct"
        day: "2-digit", // "02"
        year: "numeric", // "2025"
      });

      const formattedDate = formatter.format(today); // Format the date
      console.log(formattedDate);
      let dateSubmit = new Date().toISOString().split("T")[0];
      console.log("here: ",dateSubmit)
      const today_new = format(dateSubmit, "yyyy-MM-dd");
      console.log(today_new);
      const sessionRequest = await fetch(getSessionProgressUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query_date: formattedDate,
        }),
      });
      const sessionResponse = await sessionRequest.json();
      console.log("response from server: ", sessionResponse);

      // Set session key
      setSessKey(sessionResponse.data.sKey);

      // Populate meal tracking data
      const sVal = sessionResponse.data.sVal;
      if (sVal) {
        setMealTracking({
          breakfast: sVal.breakfast || "",
          lunch: sVal.lunch || "",
          snack: sVal.snack || "",
          preWorkout: sVal.preWorkout || "",
          dinner: sVal.dinner || "",
          workout: sVal.workout || "",
        });

        // Populate body measurements
        setBodyMeasurements({
          hip: sVal.hip || "",
          stomach: sVal.stomach || "",
          thigh: sVal.thigh || "",
          waist: sVal.waist || "",
          weight: sVal.weight || "",
        });

        // Populate session time if available
        if (sVal.sessionTime) {
          setSessionTime(sVal.sessionTime);
        }
      }
    };

    getSessionProgress();
  }, []);

  const mealItems = [
    { key: "breakfast", label: "Breakfast", icon: "🍳" },
    { key: "lunch", label: "Lunch", icon: "🥗" },
    { key: "snack", label: "Snack", icon: "🥜" },
    { key: "preWorkout", label: "Pre-workout", icon: "💪" },
    { key: "dinner", label: "Dinner", icon: "🍽️" },
    { key: "workout", label: "Workout", icon: "🏋️" },
  ];

  const measurementItems = [
    { key: "hip", label: "Hip", unit: "inches", icon: "📐" },
    { key: "stomach", label: "Stomach", unit: "inches", icon: "📏" },
    { key: "thigh", label: "Thigh", unit: "inches", icon: "📐" },
    { key: "waist", label: "Waist", unit: "inches", icon: "📏" },
    { key: "weight", label: "Weight", unit: "lbs", icon: "⚖️" },
  ];

  return (
    <div className="progress-upload">
      <div className="container">
        {/* Form */}
        <div className="upload-form">
          {/* Session Time Section */}
          <div className="session-time-section">
            <div className="section-header">
              <div className="section-icon-wrapper">
                <span className="section-icon">⏰</span>
              </div>
              <div className="section-title-wrapper">
                <h2 className="section-title">Session Time</h2>
                <p className="section-description">
                  Select when you're completing this session
                </p>
              </div>
            </div>

            <div className="session-time-options">
              <label className="session-time-option">
                <input
                  type="radio"
                  name="sessionTime"
                  value="morning"
                  checked={sessionTime === "morning"}
                  onChange={(e) => setSessionTime(e.target.value as "morning" | "evening")}
                />
                <div className="session-time-button morning">
                  <span className="session-time-icon">🌅</span>
                  <span className="session-time-text">Morning</span>
                </div>
              </label>

              <label className="session-time-option">
                <input
                  type="radio"
                  name="sessionTime"
                  value="evening"
                  checked={sessionTime === "evening"}
                  onChange={(e) => setSessionTime(e.target.value as "morning" | "evening")}
                />
                <div className="session-time-button evening">
                  <span className="session-time-icon">🌙</span>
                  <span className="session-time-text">Evening</span>
                </div>
              </label>
            </div>
          </div>

          {/* Meal Tracking Section */}
          <div className="form-sections-row">
            <div className="form-section meal-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <span className="section-icon">🍽️</span>
                </div>
                <div className="section-title-wrapper">
                  <h2 className="section-title">Meal Tracking</h2>
                  <p className="section-description">
                    Mark whether you've completed each meal or workout session
                  </p>
                </div>
              </div>

              <div className="meal-grid">
                {mealItems.map(({ key, label, icon }) => (
                  <div key={key} className="meal-item">
                    <div className="meal-header">
                      <span className="meal-icon">{icon}</span>
                      <h3 className="meal-label">{label}</h3>
                    </div>

                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name={key}
                          value="taken"
                          checked={
                            mealTracking[key as keyof MealTrackingData] ===
                            "taken"
                          }
                          onChange={() =>
                            handleMealChange(
                              key as keyof MealTrackingData,
                              "taken"
                            )
                          }
                        />
                        <div className="radio-button taken">
                          <span className="radio-text">✅ Taken</span>
                        </div>
                      </label>

                      <label className="radio-option">
                        <input
                          type="radio"
                          name={key}
                          value="missed"
                          checked={
                            mealTracking[key as keyof MealTrackingData] ===
                            "missed"
                          }
                          onChange={() =>
                            handleMealChange(
                              key as keyof MealTrackingData,
                              "missed"
                            )
                          }
                        />
                        <div className="radio-button missed">
                          <span className="radio-text">❌ Missed</span>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Body Measurements Section */}
            <div className="form-section measurements-section">
              <div className="section-header">
                <div className="section-icon-wrapper">
                  <span className="section-icon">📊</span>
                </div>
                <div className="section-title-wrapper">
                  <h2 className="section-title">Body Measurements</h2>
                  <p className="section-description">
                    Enter your current measurements (all fields are optional)
                  </p>
                </div>
              </div>

              <div className="measurements-grid">
                {measurementItems.map(({ key, label, unit, icon }) => (
                  <div key={key} className="measurement-item">
                    <label className="measurement-label">
                      <div className="label-header">
                        <span className="measurement-icon">{icon}</span>
                        <span className="label-text">{label}</span>
                        <span className="unit-badge">{unit}</span>
                      </div>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          className="measurement-input"
                          placeholder={`Enter ${label.toLowerCase()}`}
                          value={
                            bodyMeasurements[key as keyof BodyMeasurements]
                          }
                          onChange={(e) =>
                            handleMeasurementChange(
                              key as keyof BodyMeasurements,
                              e.target.value
                            )
                          }
                        />
                        <div className="input-glow"></div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`submit-btn ${isSubmitting ? "loading" : ""}`}
            >
              <div className="btn-content">
                <span className="btn-text">
                  {isSubmitting ? "Submitting..." : "Submit Progress Data"}
                </span>
                <svg
                  className="submit-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="btn-shimmer"></div>
              <div className="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}