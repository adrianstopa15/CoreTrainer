import React from "react";
import { NavLink } from "react-router-dom";

export default function WorkoutsHistory() {
  const fakeTrainings = [
    { date: "09.01.2025", trainingName: "FBW-A", trainingTime: "1:15" },
    { date: "05.01.2025", trainingName: "FBW-B", trainingTime: "1:35" },
    { date: "03.01.2025", trainingName: "FBW-A", trainingTime: "1:05" },
    { date: "01.01.2025", trainingName: "FBW-A", trainingTime: "1:10" },
    { date: "27.12.2024", trainingName: "FBW-B", trainingTime: "1:55" },
    { date: "25.12.2024", trainingName: "FBW-A", trainingTime: "1:10" },
  ];
  return (
    <>
      <div className="trainingHistoryContainer">
        {fakeTrainings.map((t) => (
          <div className="trainingElement">
            <p>Data: {t.date}</p>
            <p>Nazwa treningu: {t.trainingName}</p>
            <p>Czas treningu: {t.trainingTime}</p>
          </div>
        ))}
      </div>

      <p className="pt-2">{fakeTrainings.length} zarejestrowanych treningów.</p>
      <button className="mt-3 p-2 button-smooth">
        Pokaż wszystkie treningi
      </button>
    </>
  );
}
