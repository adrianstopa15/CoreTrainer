import React from "react";
import CreateWorkoutIcon from "../../../../../assets/createWorkout.png";
import StartWorkoutIcon from "../../../../../assets/startWorkout.png";
import { NavLink, useNavigate } from "react-router-dom";

export default function WorkoutCreate() {
  const navigate = useNavigate();
  return (
    <div className="workoutSectionContainer mt-6">
      <div className="workoutSectionContainerElement bgLinearGreen mr-16">
        <img src={StartWorkoutIcon} className="workoutSectionIcon" />
        <div className="workoutButtonContainer">
          <button
            className="button-green-dark lg:text-lg"
            onClick={() => navigate("../../logWorkout")}
          >
            Rozpocznij Trening
          </button>
        </div>

        <p className="mx-4 lg:text-xl">
          Wprowadź dane z ostatnio wykonanego treningu
        </p>
      </div>
      <div className="workoutSectionContainerElement bgLinearBlue">
        <img src={CreateWorkoutIcon} className="workoutSectionIcon" />
        <div className="workoutButtonContainer">
          <button
            className="button-aqua-dark lg:text-lg"
            onClick={() => navigate("../../trainingCreator")}
          >
            Kreator treningów
          </button>
        </div>
        <p className="mx-4 lg:text-xl">
          Stwórz zestaw treningowy w oparciu o swoje preferencje i cele
        </p>
      </div>
    </div>
  );
}
