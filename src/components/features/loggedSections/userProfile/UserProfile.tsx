import React, { useEffect, useState } from "react";
import HeaderLoggedMenu from "../HeaderLoggedMenu";
import profileIcon from "../../../../assets/user.png";
import UserProfileInfo from "./UserProfileInfo";
import { Link, NavLink, Outlet } from "react-router-dom";
export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  interface User {
    name: string;
    surname: string;
    email: string;
  }

  useEffect(() => {
    fetch("http://localhost:5000/api/getCurrentUser", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          console.error("nie znaleziono użytkownika");
        }
      })
      .catch((err) => console.error("Błąd pobierania usera", err));
  }, []);

  return (
    <>
      <HeaderLoggedMenu />
      <div className="flex justify-center flex-col items-center bgLoggedSub">
        <div
          className={`bgLogged flex justify-center flex-col items-center pt-16 px-96`}
        >
          <p>
            <img
              src={profileIcon}
              alt="userAvatar"
              className="h-36 mb-2 pointerItem"
            />
          </p>
          <p className="lg:text-3xl mb-2">
            {currentUser ? `${currentUser.name} ` : ""}
            {currentUser ? `${currentUser.surname}` : ""}
          </p>
          <p className="bm-w w-64 my-1"></p>
          <nav className="profileOptionsP mb-16">
            <NavLink
              to="info"
              className={({ isActive }) =>
                isActive ? "l-selected" : "l-unselected"
              }
            >
              Informacje
            </NavLink>
            <NavLink
              to="friends"
              className={({ isActive }) =>
                isActive ? "l-selected" : "l-unselected"
              }
            >
              Znajomi
            </NavLink>
            <NavLink
              to="photos"
              className={({ isActive }) =>
                isActive ? "l-selected" : "l-unselected"
              }
            >
              Zdjęcia
            </NavLink>
          </nav>

          <Outlet />
        </div>
      </div>
    </>
  );
}
