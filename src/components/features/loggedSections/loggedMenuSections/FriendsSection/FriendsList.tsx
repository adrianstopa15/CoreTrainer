import React from "react";
import { useFriendsList } from "../../../../../hooks/useFriends";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import styles from "./friendsSection.module.css";
export default function FriendsList() {
  const { data: friendsList } = useFriendsList();
  console.log(friendsList);

  const noFriends = friendsList.length === 0;

  return (
    <>
      <h1 className="lg:text-2xl mb-3">Twoi znajomi</h1>
      {noFriends ? (
        "Brak zaproszeń"
      ) : (
        <div className={styles.usersGrid}>
          {friendsList.map((friend) => (
            <div className={styles.usersGridCard} key={friend._id}>
              <img
                src={defaultAvatar}
                alt="profileAvatar"
                className={styles.profileAvatar}
              />
              <p className="text-sm text-gray-100 ml-3 mt-3">{friend.login}</p>
              <p className="text-sm text-gray-300 ml-3 mt-1">
                {friend.name} {friend.surname}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
