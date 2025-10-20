import Home from "./pages/home/Home";
import DailyWorkoutList from "./pages/DailyWorkoutList/DailyWorkoutList";
import Product from "./pages/WorkoutSchedule/WorkoutSchedule";
import ProgressUploadForm from "./pages/UploadProgress/UploadProgress";
import WorkoutDetail from "./pages/WorkoutDetail/[id]";
import MealsInfo from "./pages/MealsDetail/[id]";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import "./styles/global.scss";
import MealsSchedule from "./pages/MealsInfo/MealsSchedule";
import ProgressWeeks from "./pages/ProgressWeeks/ProgressWeeks";
import UserProfile from "./pages/UserProfile/UserProfile";
import ExerciseList from "./pages/ExerciseLIst/ExerciseList";

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
      element: <Navigate to="/login" replace />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/dashboard",
          element: <Home />,
        },
        {
          path: "workout_schedule",
          element: <Product />,
        },
        {
          path: "WorkoutDetail/:id",
          element: <WorkoutDetail />,
        },
        {
          path: "meals_info",
          element: <MealsSchedule />,
        },
        {
          path: "MealsDetail/:id",
          element: <MealsInfo />,
        },
        {
          path: "get_progress",
          element: <ProgressWeeks />,
        },
        {
          path: "upload_progress",
          element: <ProgressUploadForm />,
        },
        {
          path: "profile",
          element: <UserProfile />,
        },
        {
          path: "exercise_list",
          element: <ExerciseList />,
        },
        {
          path: "daily_workout_list",
          element: <DailyWorkoutList />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
