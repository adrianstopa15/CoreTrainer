import React from "react";
import axios from "axios";
import styles from "./friendsSection.module.css";
import { useFriendsRequests } from "../../../../../hooks/useFriends";
import UserCard from "./UserCard";
import { useOutletContext } from "react-router-dom";

interface OutletContextType {
  searchQuery: string;
}

export default function FriendsRequests() {
  const { data: requests, isLoading, error } = useFriendsRequests();
  const { searchQuery } = useOutletContext<OutletContextType>();

  const filteredRequests = requests.filter(
    (req) =>
      req.sender.login
        .toLowerCase()
        .includes(searchQuery.toLocaleLowerCase()) ||
      req.sender.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
      req.sender.surname.toLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

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
        <h1 className="lg:text-2xl mb-3 ml-2">
          Zaproszenia do grona znajomych
        </h1>
        <p>Ładowanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="lg:text-2xl mb-3 ml-2">
          Zaproszenia do grona znajomych
        </h1>
        <p>
          Wystąpił błąd:{" "}
          {error instanceof Error ? error.message : "Nieznany błąd"}
        </p>
      </div>
    );
  }

  const noRequest = requests.length === 0;
  return (
    <>
      <h1 className="lg:text-2xl mb-3 ml-2">Zaproszenia do grona znajomych</h1>
      {noRequest ? (
        "Brak zaproszeń"
      ) : (
        <div className={styles.usersGrid}>
          {filteredRequests.map((req) => {
            const handleAccept = () =>
              handleFriendRequestAction(req._id, "accept");
            const handleReject = () =>
              handleFriendRequestAction(req._id, "rejected");

            return (
              <UserCard
                key={req._id}
                userId={req.sender._id}
                userLogin={req.sender.login}
                userName={req.sender.name}
                userSurname={req.sender.surname}
                buttonLabel="Zaakceptuj"
                onButtonClick={handleAccept}
                secondaryButtonLabel="Odrzuć"
                onSecondaryClick={handleReject}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
