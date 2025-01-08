import React, { useEffect, useState } from "react";
import HeaderLoggedMenu from "./HeaderLoggedMenu";
import profileIcon from "../../../assets/user.png";
export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState(null);

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
          <div className="profileOptionsP">
            <p className="p-selected">Informacje</p>
            <p className="">Znajomi</p>
            <p className="">Zdjęcia</p>
          </div>
          <p className="mt-16 lg:text-2xl">Dane osobowe:</p>
          <p className="userInfoP">
            {" "}
            {currentUser ? `${currentUser.userFeatures.roles} ` : ""}{" "}
          </p>
          <p className="userInfoP">
            Wiek: {currentUser ? `${currentUser.userFeatures.age} ` : ""}
          </p>
          <p className="userInfoP">
            Waga: {currentUser ? `${currentUser.userFeatures.weight} ` : ""}
          </p>
          <p className="userInfoP">
            Staż: {currentUser ? `${currentUser.userFeatures.experience} ` : ""}
          </p>
          <p className="userInfoP">
            {" "}
            Aktualny cel:{" "}
            {currentUser ? `${currentUser.userFeatures.goal} ` : ""}
          </p>
        </div>
      </div>
    </>
  );
}
