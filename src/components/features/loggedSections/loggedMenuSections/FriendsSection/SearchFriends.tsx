import React, { useEffect, useState } from "react";
import styles from "./friendsSection.module.css";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import { useSendFriendRequest } from "../../../../../hooks/useFriends";

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
  const sendFriendRequestMutation = useSendFriendRequest();
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

  const handleSendRequest = async (id: string) => {
    sendFriendRequestMutation.mutate(id);
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
            <Link
              to={`../../../userProfile/${u._id}`}
              className={styles.profileLink}
            >
              <p className="text-xs text-gray-100 ml-3 mt-2">{u.login}</p>
            </Link>
            <p className="text-xs text-gray-300 ml-3 mt-1">
              {u.name} {u.surname}
            </p>
            <button
              className={`${styles.btnBlue} mx-2 my-2 mt-3`}
              onClick={() => handleSendRequest(u._id)}
            >
              Dodaj znajomego
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
