import React, { useEffect, useState } from "react";

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
    <div>
      <p>{currentUser ? `${currentUser.name}` : ""}</p>
      <p>{currentUser ? `${currentUser.surname}` : ""}</p>
    </div>
  );
}
