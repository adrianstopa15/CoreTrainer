import React, { useEffect, useState } from "react";
import styles from "./friendsSection.module.css";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function SearchFriends() {
  interface User {
    name: string;
    surname: string;
    _id: string;
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

  const sendRequest = async (id: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/friendRequests",
        { recipientId: id },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("zaproszenie wysłane:", response.data);
    } catch (error) {
      console.error("Błąd przy wysyłaniu zaproszenia", error);
    }
  };

  return (
    <>
      <h1 className="lg:text-2xl mb-3">Proponowani znajomi</h1>
      <div className={styles.usersGrid}>
        {users.map((u) => (
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
              className={styles.btnBlue}
              onClick={() => sendRequest(u._id)}
            >
              Dodaj znajomego
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
