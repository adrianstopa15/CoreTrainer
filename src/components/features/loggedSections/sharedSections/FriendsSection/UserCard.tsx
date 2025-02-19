import React from "react";
import { Link } from "react-router-dom";
import styles from "./friendsSection.module.css";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";

interface UserCardProps {
  userId: string;
  userLogin: string;
  userName: string;
  userSurname: string;
  buttonLabel: string;
  secondaryButtonLabel?: string;
  onSecondaryClick?: () => void;
  onButtonClick: () => void;
}

export default function UserCard({
  userId,
  userLogin,
  userName,
  userSurname,
  buttonLabel,
  onButtonClick,
  secondaryButtonLabel,
  onSecondaryClick,
}: UserCardProps) {
  return (
    <div className={styles.usersGridCard}>
      <img
        src={defaultAvatar}
        alt="profileAvatar"
        className={styles.profileAvatar}
      />

      <Link
        to={`../../../userProfile/${userId}`}
        className={styles.profileLink}
      >
        <p className="text-xs text-gray-100 ml-3 mt-2">{userLogin}</p>
      </Link>

      <p className="text-xs text-gray-300 ml-3 mt-1 mb-1">
        {userName} {userSurname}
      </p>
      {buttonLabel && onButtonClick && (
        <button
          className={`${styles.btnBlue} mx-2 my-2`}
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>
      )}
      {secondaryButtonLabel && onSecondaryClick && (
        <button
          className={`${styles.btnRed} mx-2  mb-1 `}
          onClick={onSecondaryClick}
        >
          {secondaryButtonLabel}
        </button>
      )}
    </div>
  );
}
