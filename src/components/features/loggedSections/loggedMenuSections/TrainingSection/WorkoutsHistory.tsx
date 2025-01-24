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
      setTrainingHistory(() => response.data.userWorkouts);
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
              <p>Data: {formattedDate}</p>
              <p>Godzina: {formattedTime}</p>
              <p>Nazwa treningu: {t.name}</p>
            </div>
          );
        })}
      </div>

      <p className="pt-2">
        {trainingHistory.length} zarejestrowanych treningów.
      </p>
      <button className="mt-3 p-2 button-smooth">
        Pokaż wszystkie treningi
      </button>
      <Modal
        isOpen={isModalOpen}
        contentLabel="Przejrzyj trening"
        onRequestClose={closeModal}
      >
        <div>
          {selectedTrainingHistory &&
            selectedTrainingHistory.exercises.map((exercise, index) => (
              <div key={index}>
                <p>Ćwiczenie: {exercise.name}</p>
                <p>Partia mięśniowa: {exercise.bodyPart}</p>
                <p>Seria:</p>
                {exercise.series.map((s, i) => (
                  <div key={i}>
                    <p>
                      {s.kg}x{s.reps}
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
