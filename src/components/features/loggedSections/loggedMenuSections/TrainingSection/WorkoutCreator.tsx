import React, { useState } from "react";
import CreateWorkoutIcon from "../../../../../assets/createWorkout.png";
export default function WorkoutCreator() {
  const [step, setStep] = useState<number>(0);
  return (
    <div className="bgLogged">
      {step === 0 && (
        <div className="containerCreator pt-32">
          <div className="workoutCreatorElement">
            <h1 className="lg:text-3xl mb-10 mt-6">Brak pomysłu na trening?</h1>
            <img src={CreateWorkoutIcon} className="h-24 mb-8" />
            <h2 className="lg:text-2xl mb-4">
              Ułożymy go specjalnie do Twoich potrzeb!
            </h2>
            <p className="mx-4">
              Dzięki naszym inteligentym algorytmom, ułożymy trening biorąc pod
              uwagę Twoje predyspozycje oraz preferencję
            </p>
            <button className="button-blue lg:text-lg mt-8 mb-8">
              Rozpocznij
            </button>
          </div>
        </div>
      )}
      {step === 1 && <div>kolejny step</div>}
      {step === 2 && <div>jeszcze kolejny</div>}
    </div>
  );

  {
    /* {step === 0 && <div></div>}
  {step === 1 && <div></div>} */
  }
  // krok1: witaj w kreatorze treningu
  // kliknij aby rozpoczać
  //krok2: zaleznie od stazu treningowego jakis tekst, np "widze ze dopiero zaczynasz przygode z silownia"... wypelnij ankiete abysmy mogli jak najlepiej wybrac trening dla ciebie
  //krok3: suwaki- uzytkownik zaznacza w jakim stopniu mu zalezy na: siła,  rzeźba, mobilnosc, poprawa postury, ogolna sprawnosc fizyczna, ilosc czasu na trening w tygodniu,
  //ktore partie miesniowe sa najwazniejsze
  //jezeli jest poczatkujacym to tryb zycia, jezeli zaznaczy ze bardzo siedzacy to mniejsza mniejsza intensywnosc,
}
