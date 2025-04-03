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
