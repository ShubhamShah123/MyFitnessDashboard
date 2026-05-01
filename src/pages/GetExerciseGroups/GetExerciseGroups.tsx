// TODO: WORK ON THE UPDATE EXCERSIZE AND UPLOAD TO GITHUB
 
import { useEffect, useState } from "react";
import "./get-exercise-groups.scss";
import { deleteSchedWorkoutUrl, getExerciseGroupsUrl, testAddNewExercise } from "../../url";


import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ModalBox from "../../components/modalBox/ModalBox";
// ─── Types ────────────────────────────────────────────────────────────────────

interface ExerciseDetail {
  exName: string;
  desc: string;
  sets: string | number;
  reps: string;
  id: string;
}

interface WorkoutGroup {
  exName: string;
  key: string;
  details: { [key: string]: ExerciseDetail } | "NA";
}



// ─── Helpers ──────────────────────────────────────────────────────────────────



const GROUP_ICONS: Record<string, string> = {
  "Chest & Back": "🏋️",
  "Shoulders & Arms": "💪",
  Legs: "🦵",
  Rest: "😴",
  "Cardio & Abs": "🔥",
};

type RowType = "superset" | "giant-set" | "cardio" | "warmup" | "default";

function sortExerciseKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const numA = parseFloat(a.replace(/[A-Z]/g, ""));
    const numB = parseFloat(b.replace(/[A-Z]/g, ""));
    if (numA !== numB) return numA - numB;
    return a.localeCompare(b);
  });
}

function getRowType(key: string, ex: ExerciseDetail): RowType {
  if (ex.exName.toLowerCase().includes("cardio")) return "cardio";
  if (!ex.sets && !ex.reps) return "cardio";
  if (key.startsWith("0")) return "warmup";
  const desc = (ex.desc || "").toLowerCase();
  if (desc.includes("giant")) return "giant-set";
  if (desc.includes("superset")) return "superset";
  return "default";
}

function getTagLabel(type: RowType): string | null {
  if (type === "superset") return "Superset";
  if (type === "giant-set") return "Giant Set";
  if (type === "cardio") return "Cardio";
  if (type === "warmup") return "Warmup";
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const GetExerciseGroups = () => {
  const [loading, setLoading] = useState(true);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [workoutGroups, setWorkoutGroups] = useState<WorkoutGroup[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({
		id: "",
		name: "",
		sets: "",
		reps: "",
		desc: "",
	});
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    title: "",
    body: "",
    exerciseDescription: "",
  });
  // Handling Delete
  const handleDelete = async (gId: string, exId: string) => {
    const url = deleteSchedWorkoutUrl;
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sId: gId, exId: exId }),
    });
    const result = await response.json();
    console.log("Delete Response:", result);

    setConfirmationData({
      title: "Exercise Deleted",
      body: result.status || "Exercise has been successfully deleted!",
      exerciseDescription: "",
    });
    setConfirmationModalOpen(true);

    // ✅ Remove from local state immediately
    setWorkoutGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.key !== gId) return group;

        const existingDetails = { ...(group.details as { [k: string]: ExerciseDetail }) };
        delete existingDetails[exId];

        return {
          ...group,
          details: existingDetails,
        };
      })
    );
  };
  // Hanlding update

  // Open Add Exercise dialog
	const handleAddExercise = (gk: string) => {
    setSelectedGroupKey(gk);
		setAddForm({ id: "", name: "", sets: "", reps: "", desc: "" });
		setAddDialogOpen(true);
    console.log("Handling add exercise")
  };

  // Handle input change in Add Exercise dialog
	const handleAddChange = (field: string, value: string) => {
		setAddForm((prev) => ({ ...prev, [field]: value }));
	};

  const handleAddSubmit = async () => {
    console.log("Handle add submit")
    console.log(addForm)
    console.log("Key: ", selectedGroupKey)
    const newExercise: ExerciseDetail = {
			id: addForm.id,
			exName: addForm.name,
			sets: addForm.sets,
			reps: addForm.reps,
			desc: addForm.desc,
		};
    const url = testAddNewExercise + selectedGroupKey;
    console.log(url)
    console.log(newExercise)
    const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newExercise),
			});
			const result = await response.json();
			console.log("Addition Response:", result);

			// Show confirmation modal with response message
			setConfirmationData({
				title: "Exercise Added",
				body: result.status || "Exercise has been successfully added!",
				exerciseDescription: result.key ? `Exercise ID: ${result.key}` : "",
			});
      setWorkoutGroups((prevGroups) => prevGroups.map((group) => {
        if (group.key != selectedGroupKey) return group;
        const exsitingDetails = group.details === "NA" ? {}:{...(group.details as object)};
        return {
          ...group,
          details:{
            ...exsitingDetails,
            [addForm.id]: newExercise,
          }
        }
      }));
			setConfirmationModalOpen(true);
      setAddDialogOpen(false);
  }

  useEffect(() => {
    const getExerciseGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch(getExerciseGroupsUrl);
        const json = await res.json();
        console.log("########## EXERCISE GROUPS RESPONSE #################");
        console.log(json);
        console.log("#####################################################");
        if (json.data) {
          setWorkoutGroups(json.data);
        }
      } catch (err) {
        setError("Error fetching exercise data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getExerciseGroups();
  }, []);

  if (loading) {
    return (
      <div className="ExerciseGroups">
        <div className="eg-container">
          <div className="eg-loading">
            <div className="eg-spinner"></div>
            <p>Loading exercise groups...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ExerciseGroups">
        <div className="eg-container">
          <div className="eg-error">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ExerciseGroups">
      <div className="eg-container">
        <div className="eg-page-header">
          <h1 className="eg-page-title">Exercise Groups</h1>
          <p className="eg-subtitle">Training Program Overview</p>
        </div>

        {workoutGroups.map((group) => {
          const isRest = group.details === "NA";
          const icon = GROUP_ICONS[group.exName] ?? "🏃";
          const exerciseCount = isRest
            ? 0
            : Object.keys(group.details as object).length;

          return (
            <div
              key={group.key}
              className={`eg-card${isRest ? " eg-card--rest" : ""}`}
            >
              {/* Card Header */}
              <div className="eg-card-header">
                <div className="eg-icon">{icon}</div>
                <span className="eg-group-name">{group.exName}</span>
                {!isRest && (
                  <span className="eg-count-badge">
                    {exerciseCount} exercises
                  </span>
                )}
                {!isRest && (
                  <button
                    className="eg-add-btn"
                    title="Add Exercise"
                    onClick={() => handleAddExercise(group.key)}
                  >
                    <span className="eg-add-btn__icon">+</span>
                    <span className="eg-add-btn__label">Add Exercise</span>
                  </button>
                )}
              </div>

              {/* Card Body */}
              {isRest ? (
                <div className="eg-rest-body">
                  Active Recovery Day — No exercises scheduled
                </div>
              ) : (
                <div className="eg-table-wrapper">
                  <table className="eg-table">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Exercise</th>
                        <th>Sets</th>
                        <th>Reps / Duration</th>
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortExerciseKeys(
                        Object.keys(group.details as object)
                      ).map((key) => {
                        const ex = (
                          group.details as { [k: string]: ExerciseDetail }
                        )[key];
                        const rowType = getRowType(key, ex);
                        const isCardio = rowType === "cardio";
                        const tag = getTagLabel(rowType);

                        return (
                          <tr
                            key={key}
                            className={`eg-row eg-row--${rowType}`}
                          >
                            {/* Key */}
                            <td>
                              <span className="eg-key">{key}</span>
                            </td>

                            {/* Exercise Name + optional desc */}
                            <td>
                              <div className="eg-ex-name">{ex.exName}</div>
                              {!isCardio && ex.desc ? (
                                <div className="eg-ex-desc">{ex.desc}</div>
                              ) : null}
                            </td>

                            {/* Sets */}
                            <td>
                              {isCardio ? (
                                <span className="eg-dash">—</span>
                              ) : (
                                <span className="eg-sets-reps">
                                  {ex.sets || "—"}
                                </span>
                              )}
                            </td>

                            {/* Reps / Duration */}
                            <td>
                              {isCardio ? (
                                <span className="eg-sets-reps eg-sets-reps--cardio">
                                  {ex.desc || "—"}
                                </span>
                              ) : (
                                <span className="eg-sets-reps">
                                  {ex.reps || "—"}
                                </span>
                              )}
                            </td>

                            {/* Type Tag */}
                            <td>
                              {tag && (
                                <span
                                  className={`eg-tag eg-tag--${rowType}`}
                                >
                                  {tag}
                                </span>
                              )}
                            </td>

                            {/* Action */}
                            <td>
                              <div className="eg-action-btns">
                                <button
                                  className="eg-btn eg-btn--update"
                                  title="Update"
                                  onClick={() =>
                                    console.log("UPDATE →", {
                                      id: key,
                                      exercise: ex.exName,
                                      group: group.exName,
                                      groupKey: group.key,
                                    })
                                  }
                                >
                                  ✏️
                                </button>
                                <button
                                  className="eg-btn eg-btn--delete"
                                  title="Delete"
                                  onClick={() => handleDelete(group.key, key)}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Confirmation Modal for Add/Delete Operations */}
			<ModalBox
				open={confirmationModalOpen}
				onClose={() => setConfirmationModalOpen(false)}
				title={confirmationData.title}
				body={confirmationData.body}
				exerciseDescription={confirmationData.exerciseDescription}
			/>
      <Dialog
				open={addDialogOpen}
				onClose={() => setAddDialogOpen(false)}
				disableRestoreFocus
				>
				<DialogTitle>Add New Exercise</DialogTitle>
				<DialogContent>
					<TextField
						margin="dense"
						label="ID"
						type="text"
						fullWidth
						variant="standard"
						value={addForm.id}
						onChange={(e) => handleAddChange("id", e.target.value)}
						placeholder="e.g., 1A, 2B, 5"
					/>
					<TextField
						margin="dense"
						label="Exercise Name"
						type="text"
						fullWidth
						variant="standard"
						value={addForm.name}
						onChange={(e) => handleAddChange("name", e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Sets"
						type="text"
						fullWidth
						variant="standard"
						value={addForm.sets}
						onChange={(e) => handleAddChange("sets", e.target.value)}
						placeholder="e.g., 3 or leave empty"
					/>
					<TextField
						margin="dense"
						label="Reps"
						type="text"
						fullWidth
						variant="standard"
						value={addForm.reps}
						onChange={(e) => handleAddChange("reps", e.target.value)}
						placeholder="e.g., 12-10-8 or leave empty"
					/>
					<TextField
						margin="dense"
						label="Description"
						type="text"
						fullWidth
						variant="standard"
						multiline
						rows={3}
						value={addForm.desc}
						onChange={(e) => handleAddChange("desc", e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleAddSubmit}>
						Add Exercise
					</Button>
				</DialogActions>
			</Dialog>
    </div>
    
  );
};

export default GetExerciseGroups;