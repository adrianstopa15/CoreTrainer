import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function ProgressSection() {
  return (
    <div className="bgLogged">
      <div className="flex align-center justify-center mb-16 pt-16">
        <NavLink
          to="activity"
          className={({ isActive }) =>
            isActive ? "l-selected" : "l-unselected"
          }
        >
          Aktywność
        </NavLink>
        <NavLink
          to="muscles"
          className={({ isActive }) =>
            isActive ? "l-selected" : "l-unselected"
          }
        >
          Mięśnie
        </NavLink>
        <NavLink
          to="exercises"
          className={({ isActive }) =>
            isActive ? "l-selected" : "l-unselected"
          }
        >
          Ćwiczenia
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
