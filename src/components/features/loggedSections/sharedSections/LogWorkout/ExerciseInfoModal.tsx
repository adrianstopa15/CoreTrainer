import React from "react";
import Modal from "react-modal";
import { Exercise } from "./types";

interface ExerciseInfoModalProps {
  exerciseInfoModalIsOpen: boolean;
  closeExerciseInfoModal: () => void;
  modalStyles: any;
  selectedExerciseInfo: Exercise | null;
}

export default function ExerciseInfoModal({
  exerciseInfoModalIsOpen,
  closeExerciseInfoModal,
  modalStyles,
  selectedExerciseInfo,
}: ExerciseInfoModalProps) {
  return (
    <Modal
      isOpen={exerciseInfoModalIsOpen}
      onRequestClose={closeExerciseInfoModal}
      contentLabel="Info o ćwiczeniu"
      style={modalStyles}
    >
      {selectedExerciseInfo && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="lg:text-3xl mb-12">{selectedExerciseInfo.name}</h2>
          <img
            src={`http://localhost:5000/${selectedExerciseInfo.img}`}
            alt={selectedExerciseInfo.name}
            className="exerciseImgBig mb-4"
          />
          <p className="lg:text-xl">
            partia mięśniowa: {selectedExerciseInfo.bodyPart}
          </p>
        </div>
      )}
    </Modal>
  );
}
