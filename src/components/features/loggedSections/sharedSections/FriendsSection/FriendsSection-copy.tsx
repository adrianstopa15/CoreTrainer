import React, { useEffect, useState } from "react";
import axios from "axios";
import searchIcon from "../../../../../assets/search.png";
import styles from "./friendsSection.module.css";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import Survey from "../../../firstLoginSurvey/Survey";
import { NavLink, Outlet } from "react-router-dom";

export default function FriendsSection() {
  interface User {
    name: string;
    surname: string;
    id_: string;
    login: string;
    role: string;
  }
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
            <NavLink
              to="searchFriends"
              className={({ isActive }) =>
                isActive ? "l-selected" : "l-unselected"
              }
            >
              <li>szukaj znajomych</li>
            </NavLink>
            <NavLink
              to="friendsList"
              className={({ isActive }) =>
                isActive ? "l-selected" : "l-unselected"
              }
            >
              <li> twoi znajomi</li>
            </NavLink>
            <NavLink
              to="friendsRequests"
              className={({ isActive }) =>
                isActive ? "l-selected" : "l-unselected"
              }
            >
              <li> zaproszenia do grona znajomych</li>
            </NavLink>
            <NavLink
              to="searchTrainer"
              className={({ isActive }) =>
                isActive ? "l-selected" : "l-unselected"
              }
            >
              <li> szukaj trenera</li>
            </NavLink>
          </ul>
        </div>
        <div className={`${styles.centerBar}`}>
          <Outlet context={{ searchQuery }} />
        </div>
        <div className={styles.rightBar}></div>
      </div>
    </div>
  );
}
