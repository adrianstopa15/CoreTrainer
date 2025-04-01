import React from "react";
import { Exercise, ISelectedExercise } from "./types";

import searchIcon from "../../../../../assets/search.png";
import lowerPartsIcon from "../../../../../assets/lowerPartsIcon.png";
import upperPartsIcon from "../../../../../assets/upperPartsIcon.png";
import workoutSetIcon from "../../../../../assets/workoutSetIcon.png";

interface WorkoutSet {
  name: string;
  exercises: Exercise[];
}

interface LeftPanelProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterBodySection: string;
  HideUpper: () => void;
  HideLower: () => void;
  setModeActive: boolean;
  setSetModeActive: (val: boolean) => void;

  exercises: Exercise[];
  workoutSets?: WorkoutSet[];

  handleDragStart: (e: React.DragEvent, item: any) => void;
  openExerciseInfoModal: (exercise: Exercise) => void;

  setModeActiveValue: boolean;
  openModal: () => void;
  selectedExercises: ISelectedExercise[];
}

export default function LeftPanel({
  searchQuery,
  setSearchQuery,
  filterBodySection,
  HideUpper,
  HideLower,
  setModeActive,
  setSetModeActive,
  exercises,
  workoutSets,
  handleDragStart,
  openExerciseInfoModal,
  setModeActiveValue,
  openModal,
  selectedExercises,
}: LeftPanelProps) {
  return (
    <div className="creatorSection-left">
      <div className="relative">
        <input
          placeholder="wyszukaj ćwiczenie"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLocaleLowerCase())}
          className="text-gray-100 text-center mt-4 bg-gray-500"
        />
        <img src={searchIcon} className="searchIcon" alt="search-icon" />
      </div>

      {!setModeActive ? (
        <div className="flex mt-3 min-h-10">
          <div className="mr-4" onClick={HideUpper}>
            <img
              src={upperPartsIcon}
              alt="upperPartsIcon"
              className={
                filterBodySection === "lower"
                  ? "bodyPartsIconSelected"
                  : "bodyPartsIcon"
              }
            />
          </div>
          <div onClick={HideLower}>
            <img
              src={lowerPartsIcon}
              alt="lowerPartsIcon"
              className={
                filterBodySection === "upper"
                  ? "bodyPartsIconSelected"
                  : "bodyPartsIcon"
              }
            />
          </div>
        </div>
      ) : (
        <div className="min-h-10 mt-3"></div>
      )}

      <div className="creatorSection-left--workoutsContainer">
        <div className="exercises-grid">
          {!setModeActive ? (
            <>
              {exercises
                .filter(
                  (e) =>
                    e.bodySection !== filterBodySection &&
                    e.name.toLowerCase().includes(searchQuery)
                )
                .filter(
                  (e) => !selectedExercises.some((sel) => sel._id === e._id)
                )
                .map((e) => (
                  <div
                    className="exercises-grid--card"
                    key={e._id}
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
            </>
          ) : (
            <>
              {workoutSets?.map((set) => (
                <div
                  className="exercises-grid--card"
                  key={set.name}
                  draggable
                  onDragStart={(event) => handleDragStart(event, set)}
                >
                  <img
                    src={workoutSetIcon}
                    className="exerciseImg"
                    alt={set.name}
                  />
                  <h3 className="mt-1">{set.name}</h3>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="exercisesButtonsContainer">
        <button className="button-dark-green mr-8" onClick={openModal}>
          dodaj ćwiczenie
        </button>

        <button
          className="button-blue-dark"
          onClick={() => setSetModeActive(!setModeActive)}
        >
          {setModeActive ? "ćwiczenia" : "gotowe zestawy ćwiczeń"}
        </button>
      </div>
    </div>
  );
}
