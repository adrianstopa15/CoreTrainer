import React from "react";
import { useWorkoutSets } from "../../../../../hooks/useWorkoutSet";

export default function TrainingSets() {
  const { data: workoutSets } = useWorkoutSets();
  return (
    <div className="bgLogged">
      <h1 className="text-center py-10 lg:text-3xl">Moje Zestawy</h1>
      <div className="setContainerGrid">
        {workoutSets.map((s) => (
          <div className="setContainerGridCard">
            <h2>{s.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
