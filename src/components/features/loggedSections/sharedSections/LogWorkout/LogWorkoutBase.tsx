import React, { useEffect, useState } from "react";

import axios from "axios";

import { useSubmitWorkout } from "../../../../../hooks/useWorkouts";
import {
  useWorkoutSets,
  useSubmitWorkoutSet,
} from "../../../../../hooks/useWorkoutSet";

import { ISelectedExercise, Exercise, muscleGroupMap } from "./types";
import { modalStyles } from "./modalStyles";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import AddExerciseModal from "./AddExerciseModal";
import SaveWorkoutModal from "./SaveWorkoutModal";
import ExerciseInfoModal from "./ExerciseInfoModal";
import Swal from "sweetalert2";

interface LogWorkoutBaseProps {
  mode: "user" | "trainer";
}

export default function LogWorkoutBase({ mode }: LogWorkoutBaseProps) {
  const hidenKgInput = mode === "trainer";
  const hideDates = mode === "trainer";
  const alwaysSaveAsSet = mode === "trainer";

  const [filterBodySection, setFilterBodySection] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [setModeActive, setSetModeActive] = useState<boolean>(false);
  const [selectedExercises, setSelectedExercises] = useState<
    ISelectedExercise[]
  >([]);
  const [setChecked, setSetChecked] = useState<boolean>(false);

  const submitWorkoutMutation = useSubmitWorkout();
  const submitWorkoutSetMutation = useSubmitWorkoutSet();
  const { data: workoutSets, refetch: refetchSets } = useWorkoutSets();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [exerciseInfoModalIsOpen, setExerciseInfoModalIsOpen] = useState(false);
  const [setDescription, setSetDescription] = useState("");

  const [selectedExerciseInfo, setSelectedExerciseInfo] =
    useState<Exercise | null>(null);

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
  const [startDateTime, setStartDateTime] = useState(getCurrentDateTime());
  const [endDateTime, setEndDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getExercises",
        {
          withCredentials: true,
        }
      );
      setExercises(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania ćwiczeń", error);
    }
  };

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

  const handleDragStart = (e: React.DragEvent, exerciseOrSet: any) => {
    e.dataTransfer.setData("exercise", JSON.stringify(exerciseOrSet));
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dataString = e.dataTransfer.getData("exercise");
    const draggedObject = JSON.parse(dataString);

    if (draggedObject.exercises) {
      const exercisesFromSet: ISelectedExercise[] = draggedObject.exercises.map(
        (ex: any) => ({
          name: ex.name,
          bodySection: ex.bodySection,
          bodyPart: ex.bodyPart,
          img: ex.img,
          series: ex.series.map((s: any) => ({
            kg: "",
            reps: s.reps || "",
          })),
        })
      );
      setSelectedExercises((prev) => [...prev, ...exercisesFromSet]);
    } else {
      const exerciseWithSeries: ISelectedExercise = {
        ...draggedObject,
        series: [{ kg: "", reps: "" }],
      };
      setSelectedExercises((prev) => [...prev, exerciseWithSeries]);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExercise((prev) => ({ ...prev, name: e.target.value }));
  };
  const handleChangeBodyPart = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPart = e.target.value;
    const mappedSection = muscleGroupMap[selectedPart] || "";
    setNewExercise((prev) => ({
      ...prev,
      bodyPart: selectedPart,
      bodySection: mappedSection,
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
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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
      fetchExercises();
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

  const handleRemoveExercise = (exerciseName: string) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.filter((ex) => ex.name !== exerciseName)
    );
  };

  const handleSubmitWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const start = new Date(startDateTime).getTime();
      const end = new Date(endDateTime).getTime();
      const trainingDurationMs = end - start;
      const trainingTime = Math.floor(trainingDurationMs / (1000 * 60));

      if (mode === "trainer") {
        await submitWorkoutSetMutation.mutateAsync({
          name: workoutName + " (set)",
          description: setDescription,
          exercises: selectedExercises.map((ex) => ({
            ...ex,
            series: ex.series.map((s) => ({ ...s, kg: "" })),
          })),
        });
        Swal.fire({
          title: "Zestaw treningowy został zapisany!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          position: "top",
        });
        setSelectedExercises([]);
        closeWorkoutModal();

        return;
      } else {
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
      }
      Swal.fire({
        title: "Trening został zapisany!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        position: "top",
      });
      setSelectedExercises([]);
      closeWorkoutModal();
    } catch (error) {
      console.error("Nie udało się zapisać treningu", error);
    }
  };

  const handleStartDateTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStart = e.target.value;
    setStartDateTime(newStart);
    setEndDateTime(newStart);
  };
  const handleEndDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    const start = new Date(startDateTime).getTime();
    const end = new Date(newEnd).getTime();
    const eightHoursMs = 8 * 60 * 60 * 1000;
    if (end < start) {
      alert("Czas zakończenia nie może być wcześniejszy niż czas rozpoczęcia!");
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

  return (
    <>
      <div className="bgLoggedBlack">
        <div className="logHero">
          <LeftPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterBodySection={filterBodySection}
            HideUpper={HideUpper}
            HideLower={HideLower}
            setModeActive={setModeActive}
            setSetModeActive={setSetModeActive}
            exercises={exercises}
            workoutSets={workoutSets}
            handleDragStart={handleDragStart}
            openExerciseInfoModal={openExerciseInfoModal}
            openModal={openModal}
            setModeActiveValue={setModeActive}
            mode={mode}
          />

          <RightPanel
            selectedExercises={selectedExercises}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleCountSeries={handleCountSeries}
            handleSeriesChange={handleSeriesChange}
            openWorkoutModal={openWorkoutModal}
            hideKg={hidenKgInput}
            removeExercise={handleRemoveExercise}
          />
        </div>
      </div>

      <AddExerciseModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        modalStyles={modalStyles}
        newExercise={newExercise}
        handleChangeName={handleChangeName}
        handleChangeBodyPart={handleChangeBodyPart}
        handleChangeFile={handleChangeFile}
        handleSubmitForm={handleSubmitForm}
      />

      <SaveWorkoutModal
        workoutModalOpen={workoutModalOpen}
        closeWorkoutModal={closeWorkoutModal}
        modalStyles={modalStyles}
        workoutName={workoutName}
        setWorkoutName={setWorkoutName}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        handleStartDateTimeChange={handleStartDateTimeChange}
        handleEndDateTimeChange={handleEndDateTimeChange}
        getMaxEndTime={getMaxEndTime}
        setChecked={setSetChecked}
        handleSubmitWorkout={handleSubmitWorkout}
        hideDates={hideDates}
        alwaysSaveAsSet={alwaysSaveAsSet}
        mode={mode}
        setDescritpion={setDescription}
        setSetDescription={setSetDescription}
      />

      <ExerciseInfoModal
        exerciseInfoModalIsOpen={exerciseInfoModalIsOpen}
        closeExerciseInfoModal={closeExerciseInfoModal}
        modalStyles={modalStyles}
        selectedExerciseInfo={selectedExerciseInfo}
      />
    </>
  );
}

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
