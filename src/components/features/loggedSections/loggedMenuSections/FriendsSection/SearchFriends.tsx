import React, { useEffect, useState } from "react";
import styles from "./friendsSection.module.css";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function SearchFriends() {
  interface User {
    name: string;
    surname: string;
    id_: string;
    login: string;
    role: string;
  }
  interface OutletContextType {
    searchQuery: string;
  }

  const { searchQuery } = useOutletContext<OutletContextType>();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = {
        q: searchQuery,
      };
      const response = await axios.get("http://localhost:5000/api/getUsers", {
        params,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania użytkowników.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  return (
    <>
      <h1 className="lg:text-2xl mb-3">Polecani znajomi</h1>
      <div className={styles.usersGrid}>
        {users.map((u) => (
          <div className={styles.usersGridCard}>
            <img
              src={defaultAvatar}
              alt="profileAvatar"
              className={styles.profileAvatar}
            />
            <p className="text-xs text-gray-100 ml-3 mt-2">{u.login}</p>
            <p className="text-xs text-gray-300 ml-3 mt-1">
              {u.name} {u.surname}
            </p>
            <button className={styles.btnBlue}>Dodaj znajomego</button>
          </div>
        ))}
      </div>
    </>
  );
}
