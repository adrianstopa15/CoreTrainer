import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import styles from "./friendsSection.module.css";
import { useFriendsRequests } from "../../../../../hooks/useFriends";
export default function FriendsRequests() {
  const { data: friends, isLoading, error } = useFriendsRequests();

  const handleFriendRequestAction = async (
    requestId: string,
    action: "accept" | "rejected"
  ) => {
    try {
      await axios.post(
        `http://localhost:5000/api/requestResponse/${requestId}`,
        { action },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Błąd przy aktualizowaniu zaproszenia", err);
    }
  };
  if (isLoading) {
    return (
      <div>
        <h1 className="lg:text-2xl mb-3">Zaproszenia do grona znajomych</h1>
        <p>Ładowanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="lg:text-2xl mb-3">Zaproszenia do grona znajomych</h1>
        <p>
          Wystąpił błąd:
          {error instanceof Error ? error.message : "Nieznany błąd"}
        </p>
      </div>
    );
  }
  const noRequest = friends.length === 0;

  return (
    <>
      <h1 className="lg:text-2xl mb-3">Zaproszenia do grona znajomych</h1>
      {noRequest ? (
        "Brak zaproszeń"
      ) : (
        <div className={styles.usersGrid}>
          {friends.map((u) => (
            <div className={styles.usersGridCard} key={u._id}>
              <img
                src={defaultAvatar}
                alt="profileAvatar"
                className={styles.profileAvatar}
              />
              <p className="text-sm text-gray-100 ml-3 mt-2">
                {u.sender.login}
              </p>
              <p className="text-sm text-gray-300 ml-3 mt-1">
                {u.sender.name} {u.sender.surname}
              </p>
              <div className="flex items-center justify-center my-4">
                <button
                  className={`${styles.btnBlue} mr-2 text-base`}
                  onClick={() => handleFriendRequestAction(u._id, "accept")}
                >
                  Zaakceptuj
                </button>
                <button
                  className={`${styles.btnRed} ml-2 px-3 text-base`}
                  onClick={() => handleFriendRequestAction(u._id, "rejected")}
                >
                  Odrzuć
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
