import React, { useEffect, useState } from "react";
export default function UserProfileInfo() {
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
      <p className=" lg:text-2xl">Dane osobowe:</p>
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
        Aktualny cel: {currentUser ? `${currentUser.userFeatures.goal} ` : ""}
      </p>
    </>
  );
}
