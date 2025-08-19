import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import Product from "./pages/WorkoutSchedule/WorkoutSchedule";
import ProgressUploadForm from "./pages/UploadProgress/UploadProgress";
import WorkoutDetail from "./pages/WorkoutDetail/[id]"; // Add this import
import MealsInfo from "./pages/MealsDetail/[id]"; // Add this import
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./styles/global.scss";
import MealsSchedule from "./pages/MealsInfo/MealsSchedule";
import ProgressWeeks from "./pages/ProgressWeeks/ProgressWeeks";

function App() {
	const Layout = () => {
		return (
			<div className="main">
				<Navbar />
				<div className="container">
					<div className="menuContainer">
						<Menu />
					</div>
					<div className="contentContainer">
						<Outlet />
					</div>
				</div>
				<Footer />
			</div>
		);
	};

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			children: [
				{
					path: "/",
					element: <Home />
				},
				{
					path: "users",
					element: <Users />
				},
				{
					path: "workout_schedule",
					element: <Product />
				},
				{
					path: "WorkoutDetail/:id", // Add this route for workout detail
					element: <WorkoutDetail />
				},
				{
					path: "meals_info",
					element: <MealsSchedule />
				},
				{
					path: "MealsDetail/:id",
					element: <MealsInfo />
				},
				{
					path: "get_progress",
					element: <ProgressWeeks />
				},
				{
					path: "upload_progress",
					element: <ProgressUploadForm />
				}
			]
		},
		{
			path: "/login",
			element: <Login />
		}
	]);

	return <RouterProvider router={router} />;
}

export default App;