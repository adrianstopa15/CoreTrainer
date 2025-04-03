import React from "react";
import { Exercise } from "./types";
import { WorkoutSetData } from "../../../../../api/workoutSets";

interface ExercisesListProps {
  exercises: Exercise[];
  workoutSets?: WorkoutSetData[];
  filterBodySection: string;
  searchQuery: string;
  setModeActive: boolean;
  onDragStart: (
    e: React.DragEvent,
    exercise: Exercise | WorkoutSetData
  ) => void;
  onClickExercise: (exercise: Exercise) => void;
}

export default function ExercisesList(props: ExercisesListProps) {
  const {
    exercises,
    workoutSets,
    filterBodySection,
    searchQuery,
    setModeActive,
    onDragStart,
    onClickExercise,
  } = props;

  return (
    <div className="exercises-grid">
      {!setModeActive ? (
        <>
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
                onDragStart={(ev) => onDragStart(ev, e)}
                onClick={() => onClickExercise(e)}
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
              onDragStart={(ev) => onDragStart(ev, set)}
            >
              <img
                src="workoutSetIcon.png"
                className="exerciseImg"
                alt={set.name}
              />
              <h3 className="mt-1">{set.name}</h3>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
