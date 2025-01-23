import React, { useEffect, useState } from "react";
import lowerPartsIcon from "../../../../../assets/lowerPartsIcon.png";
import upperPartsIcon from "../../../../../assets/upperPartsIcon.png";
import barbelRowing from "../../../../../assets/exerciseBarbelRowingPhoto.png";
import Modal from "react-modal";
import axios from "axios";

interface ISelectedExercise {
  name: string;
  bodySection: string;
  bodyPart: string;
  img: string | null;
  series: {
    kg: number | string;
    reps: number | string;
  }[];
}
interface Exercise {
  _id: string;
  name: string;
  bodySection: string;
  bodyPart: string;
  img: string;
}

const muscleGroupMap: Record<string, "góra" | "dół"> = {
  Barki: "góra",
  Biceps: "góra",
  Triceps: "góra",
  Brzuch: "góra",
  "Czworoboczny uda": "dół",
  "Czworogłowy uda": "dół",
  Grzbiet: "góra",
  "Klatka piersiowa": "góra",
  Łydki: "dół",
  Plecy: "góra",
  Pośladkowy: "dół",
  "Prostownik grzbietu": "góra",
  Przedramię: "góra",
};

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "5rem",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.75)",
  },
};

export default function TrainingCreator() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [filterBodySection, setFilterBodySection] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [selectedExercises, setSelectedExercises] = useState<
    ISelectedExercise[]
  >([]);

  //do kreatora ćwiczzeń (nie treningu!!)
  const [newExercise, setNewExercise] = useState<{
    name: string;
    bodyPart: string;
    bodySection: string;
    file: File | null;
  }>({
    name: "",
    bodyPart: "",
    bodySection: "",
    file: null,
  });
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}=${month}-${day}T${hours}:${minutes}`;
  });

  const fetchExercises = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getExercises"
      );
      setExercises(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania ćwiczeń", error);
    }
  };
  useEffect(() => {
    fetchExercises();
  }, [exercises]);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
    setNewExercise({
      name: "",
      bodyPart: "",
      bodySection: "",
      file: null,
    });
  }

  //modal do treningu:
  const openWorkoutModal = () => {
    setWorkoutModalOpen(true);
  };
  const closeWorkoutModal = () => {
    setWorkoutModalOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, exercise: any) => {
    e.dataTransfer.setData("exercise", JSON.stringify(exercise));
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const exerciseData = e.dataTransfer.getData("exercise");
    const exercise = JSON.parse(exerciseData);

    const exerciseWithSeries: ISelectedExercise = {
      ...exercise,
      series: [{ kg: "", reps: "" }],
    };

    setSelectedExercises((prev) => [...prev, exerciseWithSeries]);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExercise((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleChangeBodyPart = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPart = e.target.value;
    const mappedSection = muscleGroupMap[selectedPart];
    setNewExercise((prev) => ({
      ...prev,
      bodyPart: selectedPart,
      bodySection: mappedSection ? mappedSection : "",
    }));
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewExercise((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const sendExerciseToApi = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newExercise.name);
      formData.append(
        "bodySection",
        newExercise.bodySection === "góra" ? "upper" : "lower"
      );
      formData.append("bodyPart", newExercise.bodyPart);

      if (newExercise.file) {
        formData.append("image", newExercise.file);
      }

      const response = await axios.post(
        "http://localhost:5000/api/addExercise",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Odpowiedź z serwera:", response.data);
      return response.data.newExercise;
    } catch (error) {
      console.error("Błąd podczas wysyłania żądania", error);
      throw error;
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newExercise.name ||
      !newExercise.bodyPart ||
      !newExercise.bodySection
    ) {
      alert("Uzupełnij brakujące pola!");
      return;
    }

    try {
      await sendExerciseToApi();
      closeModal();
    } catch (err) {
      console.error("Nie udało się dodać ćwiczenia", err);
    }
  };

  const handleCountSeries = (
    event: React.ChangeEvent<HTMLSelectElement>,
    exerciseName: string
  ) => {
    const count = parseInt(event.target.value, 10);
    setSelectedExercises((prevExercises) =>
      prevExercises.map((ex) => {
        if (ex.name !== exerciseName) return ex;
        let newSeries = [...ex.series];
        if (newSeries.length < count) {
          const missing = count - newSeries.length;
          for (let i = 0; i < missing; i++) {
            newSeries.push({ kg: "", reps: "" });
          }
        } else if (newSeries.length > count) {
          newSeries = newSeries.slice(0, count);
        }
        return { ...ex, series: newSeries };
      })
    );
  };

  const handleSeriesChange = (
    exerciseName: string,
    seriesIndex: number,
    field: "kg" | "reps",
    value: string
  ) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((ex) => {
        if (ex.name !== exerciseName) return ex;

        const updatedSeries = ex.series.map((serie, idx) => {
          if (idx === seriesIndex) {
            return { ...serie, [field]: value };
          }
          return serie;
        });

        return { ...ex, series: updatedSeries };
      })
    );
  };

  const handleSubmitWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/submitWorkout", {
        name: workoutName,
        date: workoutDate,
        exercises: selectedExercises,
      });
      console.log("trening zapisany");
      closeWorkoutModal();
    } catch (error) {
      console.error("Nie udało się zapisac treningu", error);
    }
  };

  return (
    <>
      <div className="bgLogged">
        <div className="flex flex-row">
          <div className="creatorSection-left">
            <input
              placeholder="wyszukaj ćwiczenie"
              className="text-center mt-4 bg-gray-200"
            />
            <div className="flex mt-3">
              <div
                className="mr-4"
                onClick={() => setFilterBodySection("lower")}
              >
                <img
                  src={upperPartsIcon}
                  alt=""
                  className={
                    filterBodySection === "lower"
                      ? "bodyPartsIconSelected"
                      : "bodyPartsIcon"
                  }
                />
              </div>
              <div>
                <img
                  src={lowerPartsIcon}
                  alt=""
                  className={
                    filterBodySection === "upper"
                      ? "bodyPartsIconSelected"
                      : "bodyPartsIcon"
                  }
                  onClick={() => setFilterBodySection("upper")}
                />
              </div>
            </div>

            <div className="creatorSection-left--workoutsContainer">
              <div className="exercises-grid">
                {exercises
                  .filter((e) => e.bodySection !== filterBodySection)
                  .map((e) => (
                    <div
                      className="exercises-grid--card"
                      key={e.name}
                      draggable
                      onDragStart={(event) => handleDragStart(event, e)}
                    >
                      <img
                        src={`http://localhost:5000/${e.img}`}
                        className="exerciseImg"
                        alt={e.name}
                      />
                      <h3 className="mt-1">{e.name}</h3>
                    </div>
                  ))}
              </div>

              <div className="exercisesButtonsContainer">
                <button className="button-green mr-8" onClick={openModal}>
                  dodaj ćwiczenie
                </button>
                <button className="button-blue">gotowe zestawy ćwiczeń</button>
              </div>
            </div>
          </div>
          <div className="creatorSection-right">
            <p className="mt-8">Ćwiczenia</p>
            <div
              className="exercisesBox"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {selectedExercises.map((exercise) => (
                <div className="selectedExerciseBox" key={exercise.name}>
                  <div className="selectedExerciseElement">
                    {exercise.img && (
                      <img
                        src={`http://localhost:5000/${exercise.img}`}
                        alt="ex-img"
                        width={60}
                      />
                    )}
                    {exercise.name}
                  </div>

                  <div className="selectedExerciseElementInfo">
                    <form className="selectedExerciseElementForm">
                      <div className="flex flex-col">
                        <p>ilość serii</p>
                        <select
                          className="text-center"
                          value={exercise.series.length}
                          onChange={(event) =>
                            handleCountSeries(event, exercise.name)
                          }
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div className="workoutContainer flex flex-col">
                        {exercise.series.map((serie, idx) => (
                          <div key={idx} className="flex items-center mt-2">
                            <p className="mr-2 w-14">seria {idx + 1}</p>
                            <input
                              value={serie.kg}
                              placeholder="ilość kilogramów"
                              className="mr-2 mb-1 p-1"
                              onChange={(ev) =>
                                handleSeriesChange(
                                  exercise.name,
                                  idx,
                                  "kg",
                                  ev.target.value
                                )
                              }
                            />
                            <input
                              value={serie.reps}
                              placeholder="liczba powtórzeń"
                              className="mb-1 p-1"
                              onChange={(ev) =>
                                handleSeriesChange(
                                  exercise.name,
                                  idx,
                                  "reps",
                                  ev.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </form>
                  </div>
                </div>
              ))}
            </div>
            <button className="button-green mt-1" onClick={openWorkoutModal}>
              Zapisz trening
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Dodaj ćwiczenie"
        style={modalStyles}
      >
        <div>
          <h2 className="mb-8 text-center">
            Dodaj ćwiczenie do kreatora ćwiczeń
          </h2>
          <div>
            <form
              className="addWorkoutForm flex flex-col"
              onSubmit={handleSubmitForm}
            >
              <label>
                nazwa Ćwiczenia
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={handleChangeName}
                />
              </label>
              <label>
                Partia mięśniowa
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
                  <option value="Prostownik grzbietu">
                    Prostownik grzbietu
                  </option>
                  <option value="Przedramię">Przedramię</option>
                  <option value="Triceps">Triceps</option>
                </select>
              </label>

              <label>
                Grupa mięśniowa
                <input type="text" value={newExercise.bodySection} readOnly />
              </label>

              <label>
                Zdjęcie{" "}
                <input
                  type="file"
                  onChange={handleChangeFile}
                  accept="image/*"
                />
              </label>

              <button className="button-green mt-4" type="submit">
                Zapisz
              </button>
            </form>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={workoutModalOpen}
        onRequestClose={closeWorkoutModal}
        contentLabel="Zapisz trening"
        style={modalStyles}
      >
        <div>
          <h2 className="mb-8 text-center">Zapisz swój trening</h2>
          <form onSubmit={handleSubmitWorkout}>
            <div className="flex flex-col mb-4">
              <label>Nazwa treningu</label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Np. Poniedziałek - klatka i triceps"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label>Data i godzina</label>

              <input
                type="datetime-local"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="button-green mr-2">
                Zapisz
              </button>
              <button
                type="button"
                className="button-blue"
                onClick={closeWorkoutModal}
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
