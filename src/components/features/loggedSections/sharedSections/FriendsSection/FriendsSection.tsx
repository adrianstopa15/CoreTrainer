import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./friendsSection.module.css";
import searchIcon from "../../../../../assets/search.png";
import { useCurrentUserInfo } from "../../../../../hooks/useUserInfo";
export default function FriendsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: currentUser } = useCurrentUserInfo();
  return (
    <div className="bgLogged">
      <div className={styles.mainSection}>
        <div className={styles.leftBar}>
          <ul>
            <div className="relative">
              <img src={searchIcon} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="szukaj..."
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
            {currentUser?.userFeatures.roles.includes("Trener") && (
              <NavLink
                to="traineeRequests"
                className={({ isActive }) =>
                  isActive ? "l-selected" : "l-unselected"
                }
              >
                <li> Prośby o prowadzenie</li>
              </NavLink>
            )}
            {currentUser?.userFeatures.roles.includes("Podopieczny") && (
              <NavLink
                to="trainersList"
                className={({ isActive }) =>
                  isActive ? "l-selected" : "l-unselected"
                }
              >
                <li> twoi trenerzy</li>
              </NavLink>
            )}
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
