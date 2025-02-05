import React, { useState } from "react";
import CreateWorkoutIcon from "../../../../../assets/createWorkout.png";
import { useCurrentUserInfo } from "../../../../../hooks/useUserInfo";
import { NavLink } from "react-router-dom";
export default function WorkoutCreator() {
  const { data: userInfo, isLoading, error } = useCurrentUserInfo();
  const [step, setStep] = useState<number>(0);

  if (isLoading) {
    return <p>Ładowanie danych użytkwonika...</p>;
  }
  if (error) {
    return <p>Błąd podczas ładowania danych użytkownika {error.message}</p>;
  }
  return (
    <div className="bgLogged">
      <div className={`containerCreator "pt-32" pt-8`}>
        <div className="workoutCreatorElement">
          <h1 className="lg:text-3xl mb-10 mt-6">Brak pomysłu na trening?</h1>
          <img src={CreateWorkoutIcon} className="h-24 mb-8" />
          <h2 className="lg:text-2xl mb-4">
            Ułożymy go specjalnie do Twoich potrzeb!
          </h2>
          <p className="mx-4">
            Dzięki naszym inteligentnym algorytmom, ułożymy trening biorąc pod
            uwagę Twoje predyspozycje oraz preferencję
          </p>
          <NavLink to="../autoTrainingCreator">
            <button className="button-blue lg:text-lg mt-8 mb-8">
              Rozpocznij
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
