import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function TrainerPanel() {
  const location = useLocation();
  let currentHeader = "Historia Treningów";
  if (location.pathname.includes("manageWorkout")) {
    currentHeader = "Zarządzaj treningami";
  } else if (location.pathname.includes("manageMentees")) {
    currentHeader = "Zarządzaj podopiecznymi";
  } else if (location.pathname.includes("workoutsHistory")) {
    currentHeader = "Historia treningów";
  }
  return (
    <div className="bgLogged">
      <div className="pt-24 flex flex-col items-center">
        <p className="lg:text-4xl mb-3">{currentHeader}</p>
        <div className="flex mb-24 mt-2">
          <NavLink
            to="manageWorkout"
            className={({ isActive }) =>
              isActive ? "l-selected" : "l-unselected"
            }
          >
            kreator treningów
          </NavLink>
          <NavLink
            to="manageMentees"
            className={({ isActive }) =>
              isActive ? "l-selected mr-0" : "l-unselected mr-0"
            }
          >
            podopieczni
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
