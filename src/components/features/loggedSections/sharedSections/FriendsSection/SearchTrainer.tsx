import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import styles from "./friendsSection.module.css";

import {
  useCreateTrainerRelation,
  useFetchTrainerPendingRelations,
  TrainerRelationDoc,
} from "../../../../../hooks/useTrainerRelations";
import { useCurrentUserInfo } from "../../../../../hooks/useUserInfo";

interface User {
  _id: string;
  login: string;
  name: string;
  surname: string;
  roles: string[];
}

interface OutletContextType {
  searchQuery: string;
}

export default function SearchTrainer() {
  const { searchQuery } = useOutletContext<OutletContextType>();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: myRelations, refetch } = useFetchTrainerPendingRelations();
  const createTrainerRelationMutation = useCreateTrainerRelation();
  const { data: currentUser } = useCurrentUserInfo();

  useEffect(() => {
    fetchTrainerUsers();
  }, [searchQuery]);

  const fetchTrainerUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/getUsers", {
        params: {
          q: searchQuery,
          role: "trener",
        },
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania trenerów:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const findTrainerRelation = (trainerId: string) => {
    if (!myRelations || !currentUser) return false;

    return myRelations.some((rel: TrainerRelationDoc) => {
      return (
        rel.trainerId._id === trainerId &&
        rel.traineeId._id === currentUser._id &&
        rel.status === "pending"
      );
    });
  };
  const getButtonLabel = (u: User) => {
    const found = findTrainerRelation(u._id);
    if (found) {
      return "Wysłano prośbę";
    }
    return "Poproś o prowadzenie";
  };

  const handleClick = (u: User) => {
    const label = getButtonLabel(u);
    if (!currentUser) return;

    if (label === "Poproś o prowadzenie") {
      createTrainerRelationMutation.mutate(u._id);
    } else if (label === "Wysłano prośbę") {
      console.log("TODO: Anuluj prośbę do", u._id);
    }
  };

  return (
    <>
      <h1 className="lg:text-2xl mb-3">Szukaj trenera</h1>

      <div className={styles.usersGrid}>
        {users.map((u) => {
          const label = getButtonLabel(u);
          return (
            <div className={styles.usersGridCard} key={u._id}>
              <img
                src={defaultAvatar}
                alt="profileAvatar"
                className={styles.profileAvatar}
              />
              <p className="text-xs text-gray-100 ml-3 mt-2">{u.login}</p>
              <p className="text-xs text-gray-300 ml-3 mt-1">
                {u.name} {u.surname}
              </p>
              <button
                className={`${styles.btnBlue} mx-2 my-2 mt-3`}
                onClick={() => handleClick(u)}
              >
                {label}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
