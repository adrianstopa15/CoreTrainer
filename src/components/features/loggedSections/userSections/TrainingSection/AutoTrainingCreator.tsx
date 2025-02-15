import React, { useState } from "react";
import { useCurrentUserInfo } from "../../../../../hooks/useUserInfo";
import { data } from "react-router-dom";
import { Switch } from "@headlessui/react";
export default function AutoTrainingCreator() {
  const { data: userInfo, isLoading, error } = useCurrentUserInfo();
  const [step, setStep] = useState<number>(0);
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="bgLogged flex flex-col pt-32 items-center ">
      {step === 0 && (
        <>
          <h1 className="lg:text-4xl mb-4">
            Zanim zaczniemy, czy te informacje z Twojego profilu są aktualne?
          </h1>
          <p className="mb-16 lg:text-xl">
            Jest to ważne, gdyż na ich podstawie będziemy układać trening
          </p>
          <div className="mb-8 lg:text-xl space-y-4">
            <p>wiek: {userInfo?.userFeatures.age} lat</p>
            <p>Staż treningowy: {userInfo?.userFeatures.experience}</p>
            <p>cel sylwetkowy: {userInfo?.userFeatures.goal}</p>
          </div>
          <div className="flex mt-8">
            <button
              className="button-green mr-8 lg:text-lg"
              onClick={() => setStep(step + 1)}
            >
              Tak, możemy zaczynać
            </button>
            <button className="button-blue lg:text-lg">
              Nie, chciałbym je zmienić
            </button>
          </div>
        </>
      )}
      {step === 1 && <></>}
    </div>
  );
}

// krok1: witaj w kreatorze treningu
// kliknij aby rozpoczać
//krok2: zaleznie od stazu treningowego jakis tekst, np "widze ze dopiero zaczynasz przygode z silownia"... wypelnij ankiete abysmy mogli jak najlepiej wybrac trening dla ciebie
//krok3: suwaki- uzytkownik zaznacza w jakim stopniu mu zalezy na: siła,  rzeźba, mobilnosc, poprawa postury, ogolna sprawnosc fizyczna, ilosc czasu na trening w tygodniu,
//ktore partie miesniowe sa najwazniejsze
//jezeli jest poczatkujacym to tryb zycia, jezeli zaznaczy ze bardzo siedzacy to mniejsza intensywnosc,
//do uzupelnienia tez ma miec ile dni w tygodniu ma czas na trening, ile czasu moze poswiecac na jeden trening
