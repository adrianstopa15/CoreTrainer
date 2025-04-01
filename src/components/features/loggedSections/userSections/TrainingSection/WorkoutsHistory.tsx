import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";

export default function WorkoutsHistory() {
  // interface ITraining {
  //   userId: string;
  //   name: string;
  //   date: string;
  //   exercises: {
  //     name: string;
  //     bodyPart: string;
  //     bodySection: string;
  //     img: string | null;
  //     series: {
  //       kg: number;
  //       reps: number;
  //     }[];
  //   }[];
  // }
  type Series = {
    kg: number;
    reps: number;
  };
  type Exercise = {
    name: string;
    bodyPart: string;
    bodySection: string;
    img: string | null;
    series: Series[];
  };
  type Training = {
    userId: string;
    name: string;
    date: string;
    exercises: Exercise[];
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
      background: "linear-gradient(to right, #095e97f1, #032e7eef)",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.8)",
    },
  };

  const [trainingHistory, setTrainingHistory] = useState<Training[]>([]);
  const [selectedTrainingHistory, setSelectedTrainingHistory] =
    useState<Training | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (training: Training) => {
    setSelectedTrainingHistory(training);
    setIsModalOpen(() => true);
  };
  const closeModal = () => {
    setSelectedTrainingHistory(null);
    setIsModalOpen(() => false);
  };

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getWorkouts",
        {
          withCredentials: true,
        }
      );
      const sortedTrainings = response.data.userWorkouts.sort(
        (a: Training, b: Training) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTrainingHistory(sortedTrainings);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <>
      <div className="trainingHistoryContainer">
        {trainingHistory.map((t) => {
          const formattedDate = new Date(t.date).toLocaleDateString("en-CA");
          const formattedTime = new Date(t.date).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div className="trainingElement" onClick={() => openModal(t)}>
              <p className="ml-4">Data: {formattedDate}</p>
              <p>Godzina: {formattedTime}</p>
              <p>Nazwa treningu: {t.name}</p>
            </div>
          );
        })}
      </div>

      <p className="pt-4 text-gray-200">
        {trainingHistory.length} zarejestrowanych treningów.
      </p>
      {/* <button className="mt-3 p-2 button-smooth">
        Pokaż Zestawy Treningowe
      </button> */}
      <Modal
        isOpen={isModalOpen}
        contentLabel="Przejrzyj trening"
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <div className="text-white mx-16 flex flex-col items-center text-center">
          <h1 className=" lg:text-3xl mb-6 text-center">
            {selectedTrainingHistory?.name}
          </h1>

          {selectedTrainingHistory &&
            selectedTrainingHistory.exercises.map((exercise, index) => (
              <div key={index}>
                <p className="my-3">
                  <p className="text-lg">{exercise.name}</p>
                </p>

                <p className="mb-1"></p>
                {exercise.series.map((s, i) => (
                  <div key={i} className="mb-2">
                    <p>
                      {s.kg}kg x {s.reps}
                    </p>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
}
