import React from "react";
import { useFetchTraineeList } from "../../../../../hooks/useTrainerRelations";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import style from "./menteesSection.module.css";
export default function ManageMentees() {
  const { data: traineeList } = useFetchTraineeList();

  return (
    <div>
      {traineeList.map((t) => (
        <div className="flex items-center bg-slate-900 rounded-2xl w-96">
          <img
            src={defaultAvatar}
            alt="Avatar"
            className="h-16 mr-2 rounded-3xl"
          />
          <p>
            {t.traineeId.name} {t.traineeId.surname}
          </p>
        </div>
      ))}
    </div>
  );
}
