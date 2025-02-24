import React, { useEffect, useRef } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { NavLink, Outlet } from "react-router-dom";
import WorkoutsHistory from "./WorkoutsHistory";
import WorkoutCreate from "./WorkoutCreate";
import WorkoutsAccept from "./WorkoutsAccept";
import { useLocation } from "react-router-dom";
export default function TrainingSection() {
  const location = useLocation();
  let currentHeader = "Historia Treningów";
  if (location.pathname.includes("workoutCreate")) {
    currentHeader = "Zarządzaj treningiem";
  } else if (location.pathname.includes("manageWorkout")) {
    currentHeader = "Zarządzaj zaplanowanymi treningami";
  } else if (location.pathname.includes("workoutsHistory")) {
    currentHeader = "Historia treningów";
  }
  return (
    <div className="bgLogged">
      <div className="pt-24 flex flex-col items-center">
        <p className="lg:text-4xl mb-3">{currentHeader}</p>
        <div className="flex mb-24 mt-2">
          <NavLink
            to="workoutsToAccept"
            className={({ isActive }) =>
              isActive ? "l-selected ml-3" : "l-unselected ml-3"
            }
          >
            zaplanowane treningi
          </NavLink>
          <NavLink
            to="workoutCreate"
            className={({ isActive }) =>
              isActive ? "l-selected" : "l-unselected"
            }
          >
            kreator treningów
          </NavLink>
          <NavLink
            to="workoutsHistory"
            className={({ isActive }) =>
              isActive ? "l-selected mr-0" : "l-unselected mr-0"
            }
          >
            wykonane treningi
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
