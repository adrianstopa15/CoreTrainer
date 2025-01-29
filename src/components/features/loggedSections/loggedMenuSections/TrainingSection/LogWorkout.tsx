import React, { useEffect, useState } from "react";
import lowerPartsIcon from "../../../../../assets/lowerPartsIcon.png";
import upperPartsIcon from "../../../../../assets/upperPartsIcon.png";
import barbelRowing from "../../../../../assets/exerciseBarbelRowingPhoto.png";
import { useSubmitWorkout } from "../../../../../hooks/useWorkouts";
import { useSubmitWorkoutSet } from "../../../../../hooks/useWorkoutSet";
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
    padding: "2rem",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.75)",
  },
};

export default function LogWorkout() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [exerciseInfoModalIsOpen, setExerciseInfoModalIsOpen] = useState(false);
  const [selectedExerciseInfo, setSelectedExerciseInfo] =
    useState<Exercise | null>(null);
  const [filterBodySection, setFilterBodySection] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [workoutSetsMode, setWorkoutSetsMode] = useState<boolean>(false);
  const [setChecked, setSetChecked] = useState<boolean>(false);
  const submitWorkoutMutation = useSubmitWorkout();
  const submitWorkoutSetMutation = useSubmitWorkoutSet();

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
  const [startDateTime, setStartDateTime] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  const [endDateTime, setEndDateTime] = useState(() => {
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

  const openWorkoutModal = () => {
    setWorkoutModalOpen(true);
  };
  const closeWorkoutModal = () => {
    setWorkoutModalOpen(false);
  };
  const openExerciseInfoModal = (exercise: Exercise) => {
    setSelectedExerciseInfo(exercise);
    setExerciseInfoModalIsOpen(true);
  };
  const closeExerciseInfoModal = () => {
    setExerciseInfoModalIsOpen(false);
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

  const handleStartDateTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStart = e.target.value;
    setStartDateTime(newStart);
    setEndDateTime(newStart);

    if (new Date(newStart) > new Date(endDateTime)) {
      setEndDateTime(newStart);
    }
  };
  const handleEndDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    const start = new Date(startDateTime).getTime();
    const end = new Date(newEnd).getTime();
    const eightHoursMs = 8 * 60 * 60 * 1000;
    if (end < start) {
      alert("Czas zakończenia nie może być wczesniejszy niż czas rozpoczęcia!");
      setEndDateTime(startDateTime);
      return;
    }
    if (end > start + eightHoursMs) {
      alert("Nie możesz ustawić treningu dłuższego niż 8 godzin!");
      setEndDateTime(getMaxEndTime(startDateTime));
      return;
    }
    setEndDateTime(newEnd);
  };

  function getMaxEndTime(start: string): string {
    const startDate = new Date(start);
    const endLimit = new Date(startDate.getTime() + 8 * 60 * 60 * 1000);
    const year = endLimit.getFullYear();
    const month = String(endLimit.getMonth() + 1).padStart(2, "0");
    const day = String(endLimit.getDate()).padStart(2, "0");
    const hours = String(endLimit.getHours()).padStart(2, "0");
    const minutes = String(endLimit.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const handleSubmitWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const start = new Date(startDateTime).getTime();
      const end = new Date(endDateTime).getTime();

      const trainingDurationMs = end - start;
      const trainingTime = Math.floor(trainingDurationMs / (1000 * 60));

      // const workoutPayLoad = {
      //   name: workoutName,
      //   date: startDateTime,
      //   trainingTime,
      //   exercises: selectedExercises,
      // };

      await submitWorkoutMutation.mutateAsync({
        name: workoutName,
        date: startDateTime,
        trainingTime,
        exercises: selectedExercises,
      });

      if (setChecked) {
        await submitWorkoutSetMutation.mutateAsync({
          name: workoutName + " (set)",
          description: "",
          exercises: selectedExercises.map((ex) => ({
            ...ex,
            series: ex.series.map((s) => ({ ...s, kg: "" })),
          })),
        });
      }

      closeWorkoutModal();
    } catch (error) {
      console.error("Nie udało się zapisac treningu", error);
    }
  };

  const HideUpper = () => {
    if (filterBodySection === "lower") {
      setFilterBodySection("");
    } else {
      setFilterBodySection("lower");
    }
  };
  const HideLower = () => {
    if (filterBodySection === "upper") {
      setFilterBodySection("");
    } else {
      setFilterBodySection("upper");
    }
  };

  return (
    <>
      <div className="bgLogged">
        <div className="flex flex-row">
          <div className="creatorSection-left">
            <input
              placeholder="wyszukaj ćwiczenie"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value.toLocaleLowerCase())
              }
              className="bs-black text-center mt-4 bg-gray-200 text-gray-700"
            />
            <div className="flex mt-3">
              <div className="mr-4" onClick={HideUpper}>
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
                  onClick={HideLower}
                />
              </div>
            </div>

            <div className="creatorSection-left--workoutsContainer">
              <div className="exercises-grid ">
                {exercises
                  .filter(
                    (e) =>
                      e.bodySection !== filterBodySection &&
                      e.name.toLowerCase().includes(searchQuery)
                  )
                  .map((e) => (
                    <div
                      className="exercises-grid--card"
                      key={e.name}
                      draggable
                      onDragStart={(event) => handleDragStart(event, e)}
                      onClick={() => openExerciseInfoModal(e)}
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
              {!workoutSetsMode ? (
                <div className="exercisesButtonsContainer">
                  <button className="button-green mr-8" onClick={openModal}>
                    dodaj ćwiczenie
                  </button>
                  <button className="button-blue">
                    gotowe zestawy ćwiczeń
                  </button>
                </div>
              ) : (
                <div className="exercisesButtonsContainer">
                  <button className="button-green mr-8" onClick={openModal}>
                    dodaj zestaw ćwiczeń
                  </button>
                  <button className="button-blue">ćwiczenia</button>
                </div>
              )}
            </div>
          </div>
          <div className="creatorSection-right">
            <p className="mt-8 mb-1">Ćwiczenia</p>
            <div
              className="exercisesBox"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {selectedExercises.length === 0 ? (
                <p className="text-center mt-64 lg:text-lg text-gray-200">
                  -- Przeciągnij ćwiczenia tutaj --
                </p>
              ) : (
                selectedExercises.map((exercise) => (
                  <div
                    className="selectedExerciseBox relative"
                    key={exercise.name}
                  >
                    <div className="selectedExerciseElement m-8">
                      {exercise.img && (
                        <img
                          src={`http://localhost:5000/${exercise.img}`}
                          alt="ex-img"
                          className="h-36"
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

                        <div className="workoutContainer">
                          {exercise.series.map((serie, idx) => (
                            <div key={idx} className="flex items-center mt-2">
                              <p className="mr-2 w-14">seria {idx + 1}</p>
                              <input
                                type="number"
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
                                type="number"
                                min={0}
                                max={999}
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
                              <p className="close-selectedExerciseBox">X</p>
                            </div>
                          ))}
                        </div>
                      </form>
                    </div>
                  </div>
                ))
              )}
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
          <h2 className="mb-16 text-center text-m lg:text-2xl xl:text-3xl">
            Dodaj ćwiczenie do kreatora ćwiczeń
          </h2>
          <div>
            <form
              className="addWorkoutForm flex flex-col items-center"
              onSubmit={handleSubmitForm}
            >
              <h3 className="">nazwa Ćwiczenia</h3>
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
              {/* <label>
                Grupa mięśniowa
                <input type="text" value={newExercise.bodySection} readOnly />
              </label> */}
              <h3>Zdjęcie</h3>
              <input type="file" onChange={handleChangeFile} accept="image/*" />
              <div className="flex">
                <button
                  className="button-green-whitebg mt-4 text-m lg:text-xl"
                  type="submit"
                >
                  Zapisz
                </button>
              </div>
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
          <h2 className="mb-10 text-center text-m lg:text-2xl xl:text-3xl">
            Zapisz swój trening
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
                checked={setChecked}
                onChange={(e) => setSetChecked(e.target.checked)}
              />
            </div>

            <div className="flex">
              <button
                type="submit"
                className="button-green-whitebg mr-2 lg:text-lg"
              >
                Zapisz
              </button>
              <button
                type="button"
                className="button-blue bg-blue-500 hover:bg-blue-400 lg:text-lg"
                onClick={closeWorkoutModal}
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </Modal>
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
            <p className="lg: text-xl">
              partia mięsniowa: {selectedExerciseInfo.bodyPart}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
