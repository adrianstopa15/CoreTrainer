import React, { useEffect, useState } from "react";
import axios from "axios";
import searchIcon from "../../../../assets/search.png";
import styles from "./friendsSection.module.css";
import defaultAvatar from "../../../../assets/defaultAvatar.png";

interface User {
  name: string;
  surname: string;
  id_: string;
  login: string;
  role: string;
}

export default function FriendsSection() {
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    <div className="bgLogged">
      <div className={styles.mainSection}>
        <div className={styles.leftBar}>
          <ul>
            <div className="relative">
              <img src={searchIcon} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="szukaj znajomych"
                className="bg-slate-600 text-center rounded-lg p-1 mb-4"
                name="searchFriends"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <li> szukaj znajomych</li>
            <li> twoi znajomi</li>
            <li> zaproszenia do grona znajomych</li>
            <li> szukaj trenera</li>
          </ul>
        </div>
        <div className={`${styles.centerBar}`}>
          <div className={styles.usersGrid}>
            {users.map((u) => (
              <div className={styles.usersGridCard}>
                <img
                  src={defaultAvatar}
                  alt="profileAvatar"
                  className={styles.profileAvatar}
                />
                <p className="text-xs text-gray-300 ml-2 mt-2">{u.login}</p>
                <p className="text-xs text-gray-300 p-2">
                  {u.name} {u.surname}
                </p>
                <button className={styles.btnBlue}>Dodaj znajomego</button>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightBar}></div>
      </div>
    </div>
  );
}
