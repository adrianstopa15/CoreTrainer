import React from "react";
import StartWorkoutIcon from "../../../../../assets/startWorkout.png";
export default function ManageWorkout() {
  return (
    <div className="workoutSectionContainer mt-6">
      <div className="workoutSectionContainerElement bgLinearGreen mr-16">
        <img src={StartWorkoutIcon} className="workoutSectionIcon" />
        <div className="workoutButtonContainer">
          <button className="button-green lg:text-lg">stwórz trening</button>
        </div>

        <p className="mx-4 lg:text-xl">
          Stwórz gotowy trening dla podopiecznych
        </p>
      </div>
    </div>
  );
}
