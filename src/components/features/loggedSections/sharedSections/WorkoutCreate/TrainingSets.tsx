import React, { useState } from "react";
import Modal from "react-modal";
import { useWorkoutSets } from "../../../../../hooks/useWorkoutSet";
import dumbelImg from "../../../../../assets/dumbell.png";
export default function TrainingSets() {
  const { data: workoutSets } = useWorkoutSets();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

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
    <div className="bgLogged">
      <h1 className="text-center py-10 text-2xl lg:text-3xl">
        Moje zestawy treningowe
      </h1>
      <div className="setContainerGrid">
        {workoutSets.map((s) => (
          <div
            className="setContainerGridCard relative min-h-16 "
            onClick={openModal}
          >
            <img
              src={dumbelImg}
              alt="dumbel"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-16"
            />

            <div className="w-full h-full flex items-center justify-center">
              <h2 className="text-center pl-20 lg:text-xl">{s.name}</h2>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Info o ćwiczeniu"
        style={modalStyles}
      >
        <div>
          {workoutSets.map((w) => w.exercises.map((e) => <p>{e.name}</p>))}
        </div>
      </Modal>
    </div>
  );
  {
    /* <p>
    {s.exercises.map((e) => (
      <p className="ml-32">
        {e.name} {e.series.length} serie{" "}
        {e.series.map((e) => e.reps).join("x")}
      </p>
    ))}
  </p> */
  }
}
