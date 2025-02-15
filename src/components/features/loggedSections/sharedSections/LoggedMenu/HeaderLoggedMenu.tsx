import notificationIcon from "../../../../../assets/bell.png";
import messageIcon from "../../../../../assets/message.png";
import profileIcon from "../../../../../assets/user.png";
import trainingIcon from "../../../../../assets/training.png";
import progressIcon from "../../../../../assets/progress.png";
import trainerIcon from "../../../../../assets/trainer.png";
import friendsIcon from "../../../../../assets/friends.png";
import liIconProfil from "../../../../../assets/userLogin.png";
import liIconSettings from "../../../../../assets/settings.png";
import liIconLogout from "../../../../../assets/logout.png";
import styles from "./LoggedMenu.module.css";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCurrentUserInfo } from "../../../../../hooks/useUserInfo";
import axios from "axios";
export default function HeaderLoggedMenu() {
  const [isDropdown, setIsDropdown] = useState(false);
  const { data: currentUser } = useCurrentUserInfo();

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/logout", {
        withCredentials: true,
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Nie udało się wylogować użytkownika", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  return (
    <div>
      <header className={`${styles.header}  lg:flex text-center`}>
        <nav className={`${styles.navbar} flex flex-col lg:flex-row`}>
          <NavLink
            to="/loggedMenu"
            className=" text-2xl xl:text-3xl text-gray-100 ml-2 td-h"
          >
            Core<span className="text-red-600">Trainer</span>
          </NavLink>
        </nav>
        <nav className={`${styles.navbar} flex flex-col xl:flex-row`}>
          {currentUser?.userFeatures.roles.includes("Podopieczny") && (
            <>
              <NavLink to="/loggedMenu/trainingSection">
                {({ isActive }) => (
                  <div
                    className={`${styles.midIconContainer} xl:my-0 mx-6 py-3 px-8`}
                  >
                    <img
                      src={trainingIcon}
                      className={
                        isActive
                          ? styles.midIconsHeaderSelected
                          : styles.midIconsHeader
                      }
                    />
                  </div>
                )}
              </NavLink>

              <NavLink to="/loggedMenu/progressSection">
                {({ isActive }) => (
                  <div
                    className={`${styles.midIconContainer} xl:my-0 mx-6 py-3 px-8`}
                  >
                    <img
                      src={progressIcon}
                      className={
                        isActive
                          ? styles.midIconsHeaderSelected
                          : styles.midIconsHeader
                      }
                    />
                  </div>
                )}
              </NavLink>
            </>
          )}
          <NavLink to="/loggedMenu/friendsSection">
            {({ isActive }) => (
              <div
                className={`${styles.midIconContainer} xl:my-0 mx-6 py-3 px-8`}
              >
                <img
                  src={friendsIcon}
                  className={
                    isActive
                      ? styles.midIconsHeaderSelected
                      : styles.midIconsHeader
                  }
                />
              </div>
            )}
          </NavLink>
          {currentUser?.userFeatures.roles.includes("Trener") && (
            <NavLink to="/loggedMenu/trainerPanel">
              {({ isActive }) => (
                <div
                  className={`${styles.midIconContainer} xl:my-0 mx-6 py-3 px-8`}
                >
                  <img
                    src={trainerIcon}
                    className={
                      isActive
                        ? styles.midIconsHeaderSelected
                        : styles.midIconsHeader
                    }
                  />
                </div>
              )}
            </NavLink>
          )}
        </nav>
        <nav className={`${styles.navbar} flex flex-col xl:flex-row`}>
          <a
            href="#"
            className={`${styles.rightIconsContainer} py-2 my-2 xl:py-0 lg:ml-4 px-3 md:text-3xl xl:text-2xl mt-8 lg:mt-0`}
          >
            <img src={messageIcon} className={styles.iconsHeader} />
          </a>
          <a
            href="#"
            className={`${styles.rightIconsContainer} py-2 my-2  xl:my-0 lg:ml-4 px-3 md:text-3xl xl:text-2xl`}
          >
            <img src={notificationIcon} className={styles.iconsHeader} />
          </a>
          <a
            href="#"
            className={` my-2  xl:my-0 lg:ml-4  md:text-3xl xl:text-2xl`}
          >
            <img
              src={profileIcon}
              className={`${styles.iconsHeaderProfile} pointerItem`}
              onClick={toggleDropdown}
            />
            {isDropdown && (
              <div className={styles.profileDropdown}>
                <ul className={styles.ulDropdown}>
                  <Link
                    to={`../userProfile/${currentUser?._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <li>
                      <img src={liIconProfil} className={styles.liIcons} />
                      Pokaż profil
                    </li>
                  </Link>
                  <Link
                    to="/userSettings"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <li>
                      <img src={liIconSettings} className={styles.liIcons} />
                      Ustawienia
                    </li>
                  </Link>
                  <li onClick={() => handleLogout()}>
                    <img src={liIconLogout} className={styles.liIcons} />
                    Wyloguj się
                  </li>
                </ul>
              </div>
            )}
          </a>
        </nav>
      </header>
    </div>
  );
}
