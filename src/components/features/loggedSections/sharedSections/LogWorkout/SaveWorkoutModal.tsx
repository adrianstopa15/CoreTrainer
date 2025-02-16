import React from "react";
import Modal from "react-modal";

interface SaveWorkoutModalProps {
  workoutModalOpen: boolean;
  closeWorkoutModal: () => void;
  modalStyles: any;

  workoutName: string;
  setWorkoutName: (val: string) => void;
  startDateTime: string;
  endDateTime: string;

  handleStartDateTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndDateTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getMaxEndTime: (start: string) => string;

  setChecked: (val: boolean) => void;
  handleSubmitWorkout: (e: React.FormEvent) => void;
  hideDates?: boolean;
  alwaysSaveAsSet?: boolean;
  mode: "user" | "trainer";
  setDescription: string;
  setSetDescription: (val: string) => void;
}

export default function SaveWorkoutModal({
  hideDates,
  alwaysSaveAsSet,
  workoutModalOpen,
  closeWorkoutModal,
  modalStyles,

  workoutName,
  setWorkoutName,
  startDateTime,
  endDateTime,
  handleStartDateTimeChange,
  handleEndDateTimeChange,
  getMaxEndTime,

  setChecked,
  handleSubmitWorkout,
  mode,
  setDescription,
  setSetDescription,
}: SaveWorkoutModalProps) {
  return (
    <Modal
      isOpen={workoutModalOpen}
      onRequestClose={closeWorkoutModal}
      contentLabel="Zapisz trening"
      style={modalStyles}
    >
      <div>
        <h2 className="mb-10 text-center text-m lg:text-2xl xl:text-3xl">
          {mode === "user" ? "Zapisz swój trening" : "Zapisz set treningowy"}
        </h2>
        <form onSubmit={handleSubmitWorkout} className="addWorkoutForm">
          <div className="mb-2">
            <h3>Nazwa treningu</h3>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Np. Poniedziałek - klatka i triceps"
              maxLength={30}
            />
          </div>
          {mode === "user" ? (
            <>
              <div>
                <h2>Data rozpoczęcia</h2>
                <input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={handleStartDateTimeChange}
                />
              </div>
              <div className="mb-2">
                <h2>Data zakończenia</h2>
                <input
                  min={startDateTime}
                  max={getMaxEndTime(startDateTime)}
                  type="datetime-local"
                  value={endDateTime}
                  onChange={handleEndDateTimeChange}
                  className="styling-none"
                />
              </div>

              <div className="flex mb-4">
                <p>Zapisz zestaw ćwiczeń</p>
                <input
                  type="checkbox"
                  className="ml-2"
                  onChange={(e) => setChecked(e.target.checked)}
                />
              </div>
            </>
          ) : (
            <div className="mb-2">
              <h2>Opis Treningu</h2>
              <textarea
                placeholder="Opis treningu wraz ze wskazówkami dla podopiecznego"
                className="bg-black min-h-20 min-w-64 text-sm p-1"
                onChange={(e) => setSetDescription(e.target.value)}
                maxLength={500}
              />
            </div>
          )}

          <div className="flex">
            <button
              type="submit"
              className="button-standard bg-green-800 hover:bg-green-700 hover:text-white mr-4 lg:text-lg"
            >
              Zapisz
            </button>
            <button
              type="button"
              className="button-standard text-white bg-red-900 hover:bg-red-800 lg:text-lg"
              onClick={closeWorkoutModal}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
