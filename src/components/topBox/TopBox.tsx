import "./topBox.scss";
import { topDealUsers } from "../../data";
import { useEffect, useState } from "react";
import { testGetRecentWorkouts } from "../../url";

const TopBox = () => {
	const [workouts, setWorkouts] = useState([]);
	useEffect(() => {
		const fetchRecentWorkouts = async () => {
			try {
				const res = await fetch(testGetRecentWorkouts);
				const json = await res.json();
				setWorkouts(json.data);
			} catch (err) {
				console.error("Network Error:", err);
			}
		};

		fetchRecentWorkouts();
	}, []);

	return (
		<div className="topBox">
			<h1>Recent Workouts</h1>
			<div className="list">
				{workouts.map((session, index) => (
					<div className="listItem" key={index}>
						<div className="user">
							{/* <img src={} alt="" /> */}
							<div className="userTexts">
								<span className="username">{session.day} - {session.name}</span>
								<span className="email">{session.date}</span>
							</div>
						</div>
						<span className="amount">{session.sessionTime}</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default TopBox