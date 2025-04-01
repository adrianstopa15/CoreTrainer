import React from "react";
import { ISelectedExercise } from "./types";

interface RightPanelProps {
  selectedExercises: ISelectedExercise[];
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;

  handleCountSeries: (
    event: React.ChangeEvent<HTMLSelectElement>,
    exerciseName: string
  ) => void;
  handleSeriesChange: (
    exerciseName: string,
    seriesIndex: number,
    field: "kg" | "reps",
    value: string
  ) => void;

  openWorkoutModal: () => void;
  hideKg?: boolean;
  removeExercise: (e) => void;
}

export default function RightPanel({
  selectedExercises,
  hideKg,
  handleDrop,
  handleDragOver,
  handleCountSeries,
  handleSeriesChange,
  openWorkoutModal,
  removeExercise,
}: RightPanelProps) {
  return (
    <div className="creatorSection-right">
      <div
        className="exercisesBox mt-8"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedExercises.length === 0 ? (
          <p className="text-center my-12 lg:text-lg text-gray-200">
            -- Przeciągnij ćwiczenia tutaj --
          </p>
        ) : (
          selectedExercises.map((exercise) => (
            <div className="selectedExerciseBox relative" key={exercise.name}>
              <div className="selectedExerciseElement flex items-center">
                {exercise.img && (
                  <img
                    src={`http://localhost:5000/${exercise.img}`}
                    alt="ex-img"
                    className="scaleImg"
                  />
                )}
                <p className="text-center mt-1 scaleText">{exercise.name}</p>
              </div>

              <div className="selectedExerciseElementInfo">
                <form className="selectedExerciseElementForm">
                  <div className="flex flex-col mt-1">
                    <p className="mb-1">ilość serii</p>
                    <select
                      className="text-center bg-gray-600 rounded-sm"
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
                        {!hideKg && (
                          <input
                            type="number"
                            value={serie.kg}
                            placeholder="ilość kilogramów"
                            className=" inputExerciseBox mr-2 mb-1 p-1"
                            onChange={(ev) =>
                              handleSeriesChange(
                                exercise.name,
                                idx,
                                "kg",
                                ev.target.value
                              )
                            }
                          />
                        )}
                        <input
                          type="number"
                          min={0}
                          max={999}
                          value={serie.reps}
                          placeholder="liczba powtórzeń"
                          className="inputExerciseBox mb-1 p-1"
                          onChange={(ev) =>
                            handleSeriesChange(
                              exercise.name,
                              idx,
                              "reps",
                              ev.target.value
                            )
                          }
                        />
                        <button
                          className="close-selectedExerciseBox"
                          onClick={() => removeExercise(exercise.name)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="button-dark-green mt-8" onClick={openWorkoutModal}>
        Zapisz trening
      </button>
    </div>
  );
}
