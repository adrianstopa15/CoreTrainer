import React, { useState } from "react";
import Modal from "react-modal";
import { useFetchTraineeList } from "../../../../../hooks/useTrainerRelations";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import messageIcon from "../../../../../assets/message.png";
import dumbellIcon from "../../../../../assets/dumbell.png";
import workoutSetIcon from "../../../../../assets/createWorkout.png";
import style from "./menteesSection.module.css";
export default function ManageMentees() {
  const { data: traineeList } = useFetchTraineeList();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      padding: "2rem",
      transform: "translate(-50%, -50%)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      backgroundImage:
        "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(220, 220, 220, 0.21))",
      backgroundColor: "transparent",
      border: "none",
      color: "white",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.7)",
    },
  };

  return (
    <>
      <h1 className="text-center lg:text-2xl mb-8">Twoi podopieczni</h1>
      <div className={style.menteeGridBox}>
        {traineeList.map((t) => (
          <div className={style.menteeGridElement}>
            <img
              src={defaultAvatar}
              alt="Avatar"
              className="h-16 mr-3 rounded-[1.6rem]"
            />
            <p className="lg:text-lg">
              {t.traineeId.name} {t.traineeId.surname}
            </p>
            <div className={style.menteeGridElementIcons}>
              <button>
                <img
                  src={messageIcon}
                  alt="message"
                  className="h-[1.4rem] invert"
                />
              </button>
              <button>
                <img src={dumbellIcon} alt="dumbell" className="h-[1.7rem]" />
              </button>
              <button>
                <img
                  src={workoutSetIcon}
                  alt="workoutset"
                  className="h-[1.7rem]"
                />{" "}
              </button>
            </div>
          </div>
        ))}
        <div className={style.menteeGridElement}>
          <img
            src={defaultAvatar}
            alt="Avatar"
            className="h-16 mr-3 rounded-[1.6rem]"
          />
          <p className="lg:text-lg">Adrian Stopa</p>
        </div>
        <div className={style.menteeGridElement}>
          <img
            src={defaultAvatar}
            alt="Avatar"
            className="h-16 mr-3 rounded-[1.6rem]"
          />
          <p className="lg:text-lg">Adrian Stopa</p>
        </div>
        <div className={style.menteeGridElement}>
          <img
            src={defaultAvatar}
            alt="Avatar"
            className="h-16 mr-3 rounded-[1.6rem]"
          />
          <p className="lg:text-lg">Adrian Stopa</p>
        </div>
        <div className={style.menteeGridElement}>
          <img
            src={defaultAvatar}
            alt="Avatar"
            className="h-16 mr-3 rounded-[1.6rem]"
          />
          <p className="lg:text-lg">Adrian Stopa</p>
        </div>
        <div className={style.menteeGridElement}>
          <img
            src={defaultAvatar}
            alt="Avatar"
            className="h-16 mr-3 rounded-[1.6rem]"
          />
          <p className="lg:text-lg">Adrian Stopa</p>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Info o ćwiczeniu"
          style={modalStyles}
        >
          <div>Zawartosc modala</div>
        </Modal>
      </div>
    </>
  );
}
