import React from "react";
import { useFriendsList } from "../../../../../hooks/useFriends";
import UserCard from "./UserCard";
import styles from "./friendsSection.module.css";
import { useOutletContext } from "react-router-dom";

interface OutletContextType {
  searchQuery: string;
}

export default function FriendsList() {
  const space = " ";
  const { data: friendsList } = useFriendsList();
  const { searchQuery } = useOutletContext<OutletContextType>();
  const filteredFriends = friendsList.filter(
    (friend) =>
      friend.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.surname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const noFriends = friendsList.length === 0;

  const handleRemove = (id: string) => {
    //TODOO: obslluzyc to:
    console.log("usun znajomego", id);
  };

  return (
    <>
      <h1 className="lg:text-2xl mb-3">Twoi znajomi</h1>
      {noFriends ? (
        "Brak znajomych"
      ) : (
        <div className={styles.usersGrid}>
          {filteredFriends.map((friend) => (
            <UserCard
              key={friend._id}
              userId={friend._id}
              userLogin={friend.login}
              userName={friend.name}
              userSurname={friend.surname}
              buttonLabel=""
              onButtonClick={() => {}}
              secondaryButtonLabel="Usuń znajomego"
              onSecondaryClick={() => handleRemove(friend._id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
