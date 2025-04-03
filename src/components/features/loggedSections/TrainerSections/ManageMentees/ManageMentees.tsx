import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useFetchTraineeList } from "../../../../../hooks/useTrainerRelations";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import messageIcon from "../../../../../assets/message.png";
import dumbellIcon from "../../../../../assets/dumbell.png";
import workoutSetIcon from "../../../../../assets/createWorkout.png";
import style from "./menteesSection.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import { WorkoutSetData } from "../../../../../api/workoutSets";
import { User } from "../../../../../api/auth";
import { Exercise } from "../../sharedSections/LogWorkout/types";

export default function ManageMentees() {
  const { data: traineeList } = useFetchTraineeList();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<User | null>(null);
  const [newWorkouts, setNewWorkouts] = useState([]);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSetData | null>(
    null
  );

  const fetchNewWorkouts = async (menteeId: string) => {
    if (!menteeId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/getNewWorkoutSetsForMentee/${menteeId}`,
        {
          withCredentials: true,
        }
      );
      setNewWorkouts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendWorkout = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/sendWorkoutSet/${selectedWorkout?._id}`,
        {
          menteeId: selectedMentee?._id,
        },
        {
          withCredentials: true,
        }
      );
      Swal.fire({
        title: "Wysłano zestaw ćwiczeń!",
        icon: "success",
        timer: 2000,
        position: "top",
        showConfirmButton: false,
      });
      setNewWorkouts((prev) =>
        prev.filter((w: WorkoutSetData) => w._id !== selectedWorkout?._id)
      );
      closeSubModal();
    } catch (error) {
      Swal.fire({
        title: "Błąd",
        text: "Nie udało się wysłać zestawu, spróbuj ponownie później.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Błąd podczas wysyłania zestawu", error);
    }
  };

  useEffect(() => {
    if (selectedMentee) {
      fetchNewWorkouts(selectedMentee._id);
    }
  }, [selectedMentee]);

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedMentee(null);
    setNewWorkouts([]);
  };
  const openModal = (id) => {
    setSelectedMentee(id);
    setModalIsOpen(true);
  };

  const openSubModal = (workout) => {
    setSelectedWorkout(workout);
    setIsSubModalOpen(true);
  };
  const closeSubModal = () => {
    setIsSubModalOpen(false);
    setSelectedWorkout(null);
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
      backgroundColor: "rgba(0,0,0,0.75)",
    },
  };

  return (
    <>
      <h1 className="text-center lg:text-2xl mb-8 text-gray-200">
        Twoi podopieczni
      </h1>
      <div className={style.menteeGridBox}>
        {traineeList.map((t) => (
          <div className={style.menteeGridElement}>
            <img
              src={defaultAvatar}
              alt="Avatar"
              className={`${style.avatarIcon} mr-3 rounded-[1.6rem]`}
            />
            <p className={`${style.pName}`}>
              {t.traineeId.name} {t.traineeId.surname}
            </p>
            <div className={style.menteeGridElementIcons}>
              <button>
                <img
                  src={messageIcon}
                  alt="message"
                  className={`${style.imageSmall} invert`}
                />
              </button>
              <button onClick={() => openModal(t.traineeId)}>
                <img
                  src={dumbellIcon}
                  alt="dumbell"
                  className={style.imageMedium}
                />
              </button>
              <button>
                <img
                  src={workoutSetIcon}
                  alt="workoutset"
                  className={style.imageMedium}
                />{" "}
              </button>
            </div>
          </div>
        ))}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Info o ćwiczeniu"
          style={modalStyles}
        >
          {selectedMentee && (
            <div className="flex flex-col">
              {" "}
              <h3 className="text-center mb-4 text-xl">
                {selectedMentee.name} {selectedMentee.surname}
              </h3>
              <p className="text-center mb-4 text-gray-300">
                Kliknij na zestaw aby przekazać go podopiecznemu
              </p>
              <div className={style.trainingSetElementBox}>
                {newWorkouts && newWorkouts.length > 0 ? (
                  newWorkouts.map((w: WorkoutSetData) => (
                    <div
                      className={style.trainingSetElement}
                      onClick={() => openSubModal(w)}
                    >
                      <img
                        src={dumbellIcon}
                        alt="dumbel"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6"
                      />

                      <h2 className="text-center text-xs">{w.name}</h2>
                    </div>
                  ))
                ) : (
                  <h2 className="text-center mt-4">
                    {selectedMentee.name} posiada już wszystkie Twoje zestawy.
                  </h2>
                )}
              </div>
            </div>
          )}
        </Modal>
        <Modal
          isOpen={isSubModalOpen}
          onRequestClose={closeSubModal}
          contentLabel="Zestaw treningowy"
          style={modalStyles}
        >
          {selectedWorkout && (
            <div className="flex flex-col">
              <h2 className="text-center text-xl mb-4">
                {selectedWorkout.name}
              </h2>
              {selectedWorkout.exercises &&
              selectedWorkout.exercises.length > 0 ? (
                <div className="mb-4">
                  {selectedWorkout.exercises.map((exercise: Exercise) => (
                    <p key={exercise._id} className="my-2">
                      {exercise.name}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mb-4">Brak ćwiczeń w tym zestawie.</p>
              )}

              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                  onClick={handleSendWorkout}
                >
                  Wyślij zestaw
                </button>
                <button
                  onClick={closeSubModal}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
