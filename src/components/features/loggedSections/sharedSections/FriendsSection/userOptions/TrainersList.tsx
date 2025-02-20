import React from "react";
import { useFetchTrainerList } from "../../../../../../hooks/useTrainerRelations";
import defaultAvatar from "../../../../../../assets/defaultAvatar.png";
import styles from "./../friendsSection.module.css";
export default function TrainersList() {
  const { data: trainerList } = useFetchTrainerList();
  return (
    <>
      <h1 className="lg:text-2xl mb-3">Twoi trenerzy</h1>

      <div className={styles.usersGrid}>
        {trainerList.map((t) => {
          // const handleAccept = () => {
          //   handleRequestAction(t._id, "accept");
          //   console.log(t._id);
          // };
          // const handleReject = () => {
          //   handleRequestAction(t._id, "reject");
          // };
          return (
            <div className={styles.usersGridCard} key={t._id}>
              <img
                src={defaultAvatar}
                alt="profileAvatar"
                className={styles.profileAvatar}
              />

              <p className="text-xs text-gray-100 ml-3 mt-2">
                {t.traineeId.login}
              </p>
              <p className="text-xs text-gray-300 ml-3 mt-1">
                {t.traineeId.name} {t.traineeId.surname}
              </p>
              <button className={`${styles.btnBlue} mx-2  mt-2`}>
                Napisz wiadomość
              </button>
              <button className={`${styles.btnRed} mx-2 my-2`}>
                Zakończ współprace
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
