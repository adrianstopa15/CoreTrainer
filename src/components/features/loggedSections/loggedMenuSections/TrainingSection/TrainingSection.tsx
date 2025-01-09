import React, { useEffect, useRef } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

export default function TrainingSection() {
  const fakeTrainings = [
    { date: "09.01.2025", trainingName: "FBW-A", trainingTime: "1:15" },
    { date: "05.01.2025", trainingName: "FBW-B", trainingTime: "1:35" },
    { date: "03.01.2025", trainingName: "FBW-A", trainingTime: "1:10" },
    { date: "03.01.2025", trainingName: "FBW-A", trainingTime: "1:10" },
    { date: "03.01.2025", trainingName: "FBW-A", trainingTime: "1:10" },
    { date: "03.01.2025", trainingName: "FBW-A", trainingTime: "1:10" },
  ];

  return (
    <div className="bgLogged">
      <div className="pt-24 flex flex-col items-center">
        <p className="lg:text-2xl mb-3">Historia Treningów</p>
        <div className="trainingHistoryContainer">
          {fakeTrainings.map((t) => (
            <div className="trainingElement">
              <p>Data: {t.date}</p>
              <p>Nazwa treningu: {t.trainingName}</p>
              <p>Czas treningu: {t.trainingTime}</p>
            </div>
          ))}
        </div>
        <div className="my-3">
          <button className="button-green  mr-8">dodaj</button>
          <button className="button-blue">zaplanuj</button>
        </div>
        <p className="pt-2">
          {fakeTrainings.length} zarejestrowanych treningów.
        </p>
        <button className="mt-3 p-2 button-smooth">
          Pokaż wszystkie treningi
        </button>
      </div>
    </div>
  );
}
