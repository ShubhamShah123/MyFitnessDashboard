import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	deleteSchedWorkoutUrl,
	getWorkoutDetailsUrl,
	testAddNewExercise,
	testUpdateExercise,
} from "../../url";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "./workoutDetail.scss";
import ModalBox from "../../components/modalBox/ModalBox";

interface WorkoutItem {
	id: string;
	day: string;
	exercise: string;
}

interface ExerciseDetail {
	desc: string;
	exercise: string;
	id: string;
	reps: string;
	sets: number;
	gif?: string;
}

const WorkoutDetail = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [exerciseID, setExerciseId] = useState(null);
	// Workout and exercise data states
	const [workout, setWorkout] = useState<WorkoutItem | null>(null);
	const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetail[]>([]);
	const [loading, setLoading] = useState(true);

	const [dayValue, setDayValue] = useState(null)
	// Modal for viewing exercise details

	// Confirmation modal for add/delete operations
	const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
	const [confirmationData, setConfirmationData] = useState({
		title: "",
		body: "",
		exerciseGifUrl: "",
		exerciseDescription: "",
	});

	// Dialog for editing exercise
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editForm, setEditForm] = useState({
		name: "",
		sets: 0,
		reps: "",
		desc: "",
	});
	const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
		null
	);

	// Dialog for adding new exercise
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [addForm, setAddForm] = useState({
		id: "",
		name: "",
		sets: 0,
		reps: "",
		desc: "",
	});

	// Fetch workout exercises when component mounts or id changes
	useEffect(() => {
		const fetchWorkoutDetail = async () => {
			console.log("Fetching workout details for ID:", id);
			try {
				const workoutDataRequest = await fetch(getWorkoutDetailsUrl + "/" + id);
				const wdResp = await workoutDataRequest.json();
				console.log(wdResp);
				setDayValue(wdResp.day)
				console.log("The ID is " + id);
				setExerciseId(id);

				// Map API response to ExerciseDetail
				setExerciseDetails(
					wdResp.data.map((item: any) => ({
						id: item.id,
						exercise: item.details.exercise,
						sets: item.details.sets,
						reps: item.details.reps,
						desc: item.details.desc,
						gif: item.details.gif
					}))
				);
			} catch (error) {
				console.error("Error fetching workout detail:", error);
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchWorkoutDetail();
	}, [id]);

	// Navigate back to workout schedule
	const handleBackClick = () => {
		navigate("/dashboard/workout_schedule");
	};

	// Handle click on exercise to open detail modal
	const handleExerciseClick = (exercise: ExerciseDetail, day: string) => {
		console.log("Exercise Click: ",day, id)
		console.log(exercise)
	};

	// Open Edit Exercise dialog
	const handleUpdateExercise = (exerciseId: string) => {
		const exercise = exerciseDetails.find((e) => e.id === exerciseId);
		if (exercise) {
			setEditForm({
				name: exercise.exercise,
				sets: exercise.sets,
				reps: exercise.reps,
				desc: exercise.desc,
			});
			setSelectedExerciseId(exerciseId);
			setEditDialogOpen(true);
		}
	};

	// Delete exercise
	const handleDeleteExercise = async (exerciseId: string) => {
		console.log("Deleting Exercise:", exerciseId);
		console.log("Exercise Details: ",exerciseDetails)
		console.log("ID: ",id)
		try {
			const url = deleteSchedWorkoutUrl;
			const response = await fetch(url, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({sId: id, exId: exerciseId})
			});
			const result = await response.json();
			console.log("Delete Response:", result);

			// Show confirmation modal with response message
			setConfirmationData({
				title: "Exercise Deleted",
				body: result.status || "Exercise has been successfully deleted!",
				exerciseGifUrl: "",
				exerciseDescription: "",
			});
			setConfirmationModalOpen(true);

			// Remove from local state
			setExerciseDetails((prev) => prev.filter((ex) => ex.id !== exerciseId));
		} catch (error) {
			console.error("Error deleting exercise:", error);
			setConfirmationData({
				title: "Delete Failed",
				body: "Failed to delete exercise. Please try again.",
				exerciseGifUrl: "",
				exerciseDescription: "",
			});
			setConfirmationModalOpen(true);
		}
	};

	// Handle input changes in Edit Exercise dialog
	const handleEditChange = (field: string, value: string) => {
		setEditForm((prev) => ({ ...prev, [field]: value }));
	};

	// Submit updated exercise to API and update state
	const handleEditSubmit = async () => {
		const updateExercise = { day: id, id: selectedExerciseId, ...editForm };
		console.log("Updated Exercise:", updateExercise);

		const url = testUpdateExercise + updateExercise.id;
		const response = await fetch(url, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updateExercise),
		});
		const result = await response.json();
		console.log("API Response:", result);

		setExerciseDetails((prev) =>
			prev.map((ex) =>
				ex.id === selectedExerciseId
					? {
							...ex,
							exercise: editForm.name,
							sets: Number(editForm.sets),
							reps: editForm.reps,
							desc: editForm.desc,
						}
					: ex
			)
		);
		setEditDialogOpen(false);
	};

	// Open Add Exercise dialog
	const handleAddExercise = () => {
		setAddForm({ id: "", name: "", sets: 0, reps: "", desc: "" });
		setAddDialogOpen(true);
	};

	// Handle input change in Add Exercise dialog
	const handleAddChange = (field: string, value: string) => {
		setAddForm((prev) => ({ ...prev, [field]: value }));
	};

	// Submit new exercise, log to console, and add to table
	const handleAddSubmit = async () => {
		console.log("New Exercise Data:", addForm);
		console.log("The exercise ID: ", exerciseID);
		
		const newExercise: ExerciseDetail = {
			id: addForm.id,
			exercise: addForm.name,
			sets: Number(addForm.sets),
			reps: addForm.reps,
			desc: addForm.desc,
		};

		try {
			const url = testAddNewExercise + exerciseID;
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
				exerciseGifUrl: "",
				exerciseDescription: result.key ? `Exercise ID: ${result.key}` : "",
			});
			setConfirmationModalOpen(true);

			setExerciseDetails((prev) => [...prev, newExercise]);
			setAddDialogOpen(false);
		} catch (error) {
			console.error("Error adding exercise:", error);
			setConfirmationData({
				title: "Add Failed",
				body: "Failed to add exercise. Please try again.",
				exerciseGifUrl: "",
				exerciseDescription: "",
			});
			setConfirmationModalOpen(true);
		}
	};

	// Group exercises by their ID (or any custom grouping logic)
	const getExerciseGroup = (exerciseId: string) => exerciseId;

	const groupedExercises = exerciseDetails.reduce((acc, exercise) => {
		const group = getExerciseGroup(exercise.id);
		if (!acc[group]) acc[group] = [];
		acc[group].push(exercise);
		return acc;
	}, {} as Record<string, ExerciseDetail[]>);

	// Determine if exercises in a group are superset
	const isSuperset = (exercises: ExerciseDetail[]) => exercises.length > 1;

	// Sort groups numerically and alphabetically
	const sortedGroupEntries = Object.entries(groupedExercises).sort((a, b) => {
		const parseId = (id: string) => {
			const match = id.match(/^(\d+)([A-Z]*)$/i);
			const num = parseInt(match?.[1] || "0", 10);
			const suffix = match?.[2] || "";
			return { num, suffix };
		};
		const idA = parseId(a[0]);
		const idB = parseId(b[0]);
		if (idA.num !== idB.num) return idA.num - idB.num;
		return idA.suffix.localeCompare(idB.suffix);
	});

	const totalExercises = exerciseDetails.length;
	// const totalSets = exerciseDetails.reduce((sum, e) => sum + e.sets, 0);
	// const estimatedDuration = Math.round(totalSets * 2.5);

	if (loading) {
		return (
			<Backdrop
				sx={{
					color: "#4caf50",
					zIndex: (theme) => theme.zIndex.drawer + 1,
					backgroundColor: "rgba(0,0,0,0.8)",
				}}
				open={loading}
			>
				<CircularProgress color="inherit" size={60} thickness={4} />
			</Backdrop>
		);
	}

	return (
		<div className="WorkoutDetail">
			{/* Header section */}
			<div className="workout-header">
				<button onClick={handleBackClick} className="back-button">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
						<path
							d="M19 12H5M12 19L5 12L12 5"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					Back to Schedule
				</button>
				<div className="workout-title">
					<h1>List of exercises</h1>
				</div>
				<div className="workout-stats">
					<div className="stat-item">
						<span>{totalExercises} exercises</span>
					</div>
					{/* <div className="stat-item"><span>~{estimatedDuration} min</span></div> */}
					{/* <div className="stat-item"><span>{totalSets} total sets</span></div> */}
				</div>
			</div>

			{/* Add Exercise button */}
			<div className="add-exercise-section">
				<button onClick={handleAddExercise} className="add-exercise-button">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
						<path
							d="M12 5V19M5 12H19"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					Add New Exercise
				</button>
			</div>

			{/* Exercises table */}
			<div className="workout-content">
				{sortedGroupEntries.map(([groupNumber, exercises]) => (
					<div key={groupNumber} className="exercise-group">
						<div className="group-header">
							<h2>Group {groupNumber}</h2>
							<div
								className={`group-indicator ${
									isSuperset(exercises) ? "superset" : ""
								}`}
							>
								{isSuperset(exercises) ? "Superset" : "Single Exercise"}
							</div>
						</div>
						<table className="exercises-table">
							<thead className="table-header">
								<tr>
									<th className="exercise-col">Exercise</th>
									<th className="sets-col">Sets</th>
									<th className="reps-col">Reps</th>
									<th className="description-col"></th>
									<th className="actions-col">Actions</th>
								</tr>
							</thead>
							<tbody className="table-body">
								{exercises.map((exercise, index) => (
									<tr key={`${groupNumber}-${exercise.id}-${index}`}>
										<td
											className="exercise-cell"
											onClick={() => handleExerciseClick(exercise, id)}
										>
											<div className="exercise-name">
												{exercise.exercise}
											</div>
										</td>
										<td className="sets-cell">
											<div className="stat-badge">{exercise.sets}</div>
										</td>
										<td className="reps-cell">
											<div className="stat-badge">{exercise.reps}</div>
										</td>
										<td
											className={`description-cell ${
												!exercise.desc ? "empty" : ""
											}`}
										>
											{exercise.desc ? (
												<div className="description-content">
													<strong>Instructions:</strong> {exercise.desc}
												</div>
											) : (
												"No specific instructions provided"
											)}
										</td>
										<td className="actions-cell">
											<button
												onClick={() => handleUpdateExercise(exercise.id)}
												className="update-exercise-button"
											>
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
												>
													<path
														d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
												Update
											</button>
											<button
												onClick={() => handleDeleteExercise(exercise.id)}
												className="delete-exercise-button"
											>
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
												>
													<path
														d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12z"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				))}
				{exerciseDetails.length === 0 && (
					<div className="no-exercises">
						<p>🏃‍♂️ No exercises found for this workout day.</p>
					</div>
				)}
			</div>


			{/* Confirmation Modal for Add/Delete Operations */}
			<ModalBox
				open={confirmationModalOpen}
				onClose={() => setConfirmationModalOpen(false)}
				title={confirmationData.title}
				body={confirmationData.body}
				// exerciseGifUrl={confirmationData.exerciseGifUrl}
				exerciseDescription={confirmationData.exerciseDescription}
			/>

			{/* Edit Exercise Dialog */}
			<Dialog
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				disableRestoreFocus
			>
				<DialogTitle>Edit Exercise: {editForm.name}</DialogTitle>
				<DialogContent>
					<TextField
						margin="dense"
						label="Sets"
						type="number"
						fullWidth
						variant="standard"
						value={editForm.sets}
						onChange={(e) => handleEditChange("sets", e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Reps"
						type="text"
						fullWidth
						variant="standard"
						value={editForm.reps}
						onChange={(e) => handleEditChange("reps", e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Description"
						type="text"
						fullWidth
						variant="standard"
						multiline
						rows={3}
						value={editForm.desc}
						onChange={(e) => handleEditChange("desc", e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleEditSubmit}>
						Save
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add Exercise Dialog */}
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
						type="number"
						fullWidth
						variant="standard"
						value={addForm.sets}
						onChange={(e) => handleAddChange("sets", e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Reps"
						type="text"
						fullWidth
						variant="standard"
						value={addForm.reps}
						onChange={(e) => handleAddChange("reps", e.target.value)}
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

export default WorkoutDetail;