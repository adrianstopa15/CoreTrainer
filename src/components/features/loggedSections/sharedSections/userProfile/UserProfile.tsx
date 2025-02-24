import React, { useEffect, useState } from "react";
import HeaderLoggedMenu from "../LoggedMenu/HeaderLoggedMenu";
import profileIcon from "../../../../../assets/user.png";
import UserProfileInfo from "./UserProfileInfo";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { useUserInfo } from "../../../../../hooks/useUserInfo";
export default function UserProfile() {
  const { id } = useParams();
  const { data: user, isLoading, error } = useUserInfo(id || "");

  interface User {
    name: string;
    surname: string;
    email: string;
  }

  if (isLoading) return <p>Ładowanie użytkowników...</p>;

  if (error) return <p>Error: {String(error)}</p>;

  if (!user) return <p>Brak użytkownika</p>;

  return (
    <>
      <HeaderLoggedMenu />
      <div className="flex justify-center flex-col items-center bgLoggedSub">
        <div
          className={`bgLogged flex justify-center flex-col items-center pt-16 px-[15%]`}
        >
          <p>
            <img
              src={profileIcon}
              alt="userAvatar"
              className="h-36 mb-2 pointerItem"
            />
          </p>
          <p className="lg:text-3xl mb-2">
            {user ? `${user.name} ` : ""}
            {user ? `${user.surname}` : ""}
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
                isActive ? "l-selected mr-0" : "l-unselected mr-0"
              }
            >
              Zdjęcia
            </NavLink>
          </nav>

          <Outlet context={{ user }} />
        </div>
      </div>
    </>
  );
}
