import React from "react";
import StartWorkoutIcon from "../../../../../assets/startWorkout.png";
import { useNavigate } from "react-router-dom";
export default function ManageWorkout() {
  const navigate = useNavigate();
  return (
    <div className="workoutSectionContainer mt-6">
      <div className="workoutSectionContainerElement bgLinearGreen mr-16">
        <img src={StartWorkoutIcon} className="workoutSectionIcon" />
        <div className="workoutButtonContainer">
          <button
            className="button-green lg:text-lg"
            onClick={() => navigate("../../LogWorkoutTrainer")}
          >
            stwórz trening
          </button>
        </div>

        <p className="mx-4 lg:text-xl">
          Stwórz gotowy trening dla podopiecznych
        </p>
      </div>
    </div>
  );
}
