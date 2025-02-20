import React from "react";
import { useFetchTrainerRequests } from "../../../../../../hooks/useTrainerRelations";
import defaultAvatar from "../../../../../../assets/defaultAvatar.png";
import styles from "./../friendsSection.module.css";
import axios from "axios";
export default function TraineeRequests() {
  const { data: trainerRequests } = useFetchTrainerRequests();

  const handleRequestAction = async (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/trainerRelationsResponse/${requestId}`,
        { action },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Błąd przy aktualizowaniu prośby", error);
    }
  };

  return (
    <>
      <h1 className="lg:text-2xl mb-3">Prośby o prowadzenie</h1>

      <div className={styles.usersGrid}>
        {trainerRequests.map((u) => {
          const handleAccept = () => {
            handleRequestAction(u._id, "accept");
            console.log(u._id);
          };
          const handleReject = () => {
            handleRequestAction(u._id, "reject");
          };
          return (
            <div className={styles.usersGridCard} key={u._id}>
              <img
                src={defaultAvatar}
                alt="profileAvatar"
                className={styles.profileAvatar}
              />

              <p className="text-xs text-gray-100 ml-3 mt-2">
                {u.traineeId.login}
              </p>
              <p className="text-xs text-gray-300 ml-3 mt-1">
                {u.traineeId.name} {u.traineeId.surname}
              </p>
              <button
                className={`${styles.btnBlue} mx-2  mt-2`}
                onClick={handleAccept}
              >
                Zaakceptuj
              </button>
              <button
                className={`${styles.btnRed} mx-2 my-2`}
                onClick={handleReject}
              >
                Odrzuć
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
