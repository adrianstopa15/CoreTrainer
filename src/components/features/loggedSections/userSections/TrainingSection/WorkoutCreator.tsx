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
      <div className="containerCreator">
        <div className="workoutCreatorElement bgLinearGreen">
          <h1 className="lg:text-2xl mb-10 mt-6">Moje zestawy treningowe</h1>
          <img src={CreateWorkoutIcon} className="workoutIcon mb-8" />
          <h2 className="text-md max-h-6 p-1">
            Przeglądaj swoje zestawy treningowe
          </h2>

          <NavLink className="navlink mt-8" to="../autoTrainingCreator">
            <button className="button-green-dark lg:text-lg  mb-8">
              Rozpocznij
            </button>
          </NavLink>
        </div>
        <div className="workoutCreatorElement bgLinearBlue">
          <h1 className="lg:text-2xl mb-10 mt-6">Stwórz zestaw treningowy</h1>
          <img src={CreateWorkoutIcon} className="workoutIcon  mb-8" />
          <h2 className="text-md max-h-6 p-1">
            Ułóż swój własny zestaw treningowy który może posłużyć Ci w
            następnym treningu
          </h2>

          <NavLink className="navlink mt-8" to="../autoTrainingCreator">
            <button className="button-aqua-dark lg:text-lg   mb-8">
              Rozpocznij
            </button>
          </NavLink>
        </div>
        <div className="workoutCreatorElement bgLinearOrange">
          <h1 className="lg:text-2xl mb-10 mt-6">Brak pomysłu na trening?</h1>
          <img src={CreateWorkoutIcon} className="workoutIcon mb-8" />
          <h2 className="text-md max-h-6 p-1">
            Dzięki naszym inteligentnym algorytmom, ułożymy trening biorąc pod
            uwagę Twoje predyspozycje oraz preferencję
          </h2>

          <NavLink className="navlink mt-8" to="../autoTrainingCreator">
            <button className="button-orange-dark lg:text-lg  mb-8">
              Rozpocznij
            </button>
          </NavLink>
        </div>
        <div className="workoutCreatorElement bgLinearPurple">
          <h1 className="lg:text-2xl mb-10 mt-6">Gotowe plany treningowe</h1>
          <img src={CreateWorkoutIcon} className="workoutIcon mb-8" />
          <h2 className="text-md max-h-6 p-1">
            Przeglądaj gotowe plany treningowe i dodaj je do swojej kolekcji.
          </h2>

          <NavLink className="navlink mt-8" to="../autoTrainingCreator">
            <button className="button-purple-dark lg:text-lg  mb-8">
              Rozpocznij
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
