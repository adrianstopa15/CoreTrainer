import React from "react";
import searchIcon from "../../../../assets/search.png";
import styles from "./friendsSection.module.css";
export default function FriendsSection() {
  return (
    <div className="bgLogged">
      <div className="flex justify-center pt-6 ">
        <div className="relative">
          <input
            type="text"
            placeholder="szukaj znajomych"
            className="bg-slate-600 text-center rounded-lg p-1"
          />
          <img src={searchIcon} className={styles.searchIcon} />
        </div>
      </div>
      <div className={styles.mainSection}>
        <div className={styles.leftBar}>
          <ul>
            <li> szukaj znajomych</li>
            <li> twoi znajomi</li>
            <li> zaproszenia do grona znajomych</li>
            <li> szukaj trenera</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
