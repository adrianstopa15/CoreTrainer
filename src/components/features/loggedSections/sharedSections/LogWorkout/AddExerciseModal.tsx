// AddExerciseModal.tsx
import React from "react";
import Modal from "react-modal";

interface AddExerciseModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  modalStyles: any;

  newExercise: {
    name: string;
    bodyPart: string;
    bodySection: string;
    file: File | null;
  };
  handleChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeBodyPart: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitForm: (e: React.FormEvent) => void;
}

export default function AddExerciseModal({
  modalIsOpen,
  closeModal,
  modalStyles,

  newExercise,
  handleChangeName,
  handleChangeBodyPart,
  handleChangeFile,
  handleSubmitForm,
}: AddExerciseModalProps) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Dodaj ćwiczenie"
      style={modalStyles}
    >
      <div>
        <h2 className="mb-16 text-center text-m lg:text-2xl xl:text-3xl">
          Dodaj ćwiczenie do kreatora ćwiczeń
        </h2>
        <div>
          <form
            className="addWorkoutForm flex flex-col items-center"
            onSubmit={handleSubmitForm}
          >
            <h3>nazwa Ćwiczenia</h3>
            <input
              type="text"
              value={newExercise.name}
              onChange={handleChangeName}
              maxLength={30}
            />
            <h3>Partia mięśniowa</h3>
            <select
              value={newExercise.bodyPart}
              onChange={handleChangeBodyPart}
            >
              <option value="">-- wybierz --</option>
              <option value="Barki">Biceps</option>
              <option value="Brzuch">Brzuch</option>
              <option value="Biceps">Biceps</option>
              <option value="Czworoboczny uda">Czworoboczny uda</option>
              <option value="Czworogłowy uda">Czworogłowy uda</option>
              <option value="Grzbiet">Grzbiet</option>
              <option value="Klatka piersiowa">Klatka piersiowa</option>
              <option value="Łydki">Łydki</option>
              <option value="Plecy">Plecy</option>
              <option value="Pośladkowy">Pośladkowy</option>
              <option value="Prostownik grzbietu">Prostownik grzbietu</option>
              <option value="Przedramię">Przedramię</option>
              <option value="Triceps">Triceps</option>
            </select>

            <h3>Zdjęcie</h3>
            <input type="file" onChange={handleChangeFile} accept="image/*" />
            <div className="flex">
              <button
                className="button-dark-green mt-4 text-m lg:text-lg"
                type="submit"
              >
                Zapisz
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
