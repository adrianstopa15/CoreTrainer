import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import styles from "./friendsSection.module.css";

import {
  useFriendsList,
  useMyRequests,
  useSendFriendRequest,
} from "../../../../../hooks/useFriends";
import { useAuth } from "../../../../../hooks/useAuth";
import UserCard from "./UserCard";

interface User {
  _id: string;
  login: string;
  name: string;
  surname: string;
}
interface OutletContextType {
  searchQuery: string;
}

export default function SearchFriends() {
  const { searchQuery } = useOutletContext<OutletContextType>();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: currentUser } = useAuth();
  const { data: friendsList } = useFriendsList();
  const { data: myRequests } = useMyRequests("pending");
  const sendFriendRequestMutation = useSendFriendRequest();

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/getUsers", {
        params: { q: searchQuery },
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania użytkowników:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isMyFriend = (userId: string) => {
    return friendsList.some((fr) => fr._id === userId);
  };

  const findRequest = (userId: string) => {
    if (!myRequests || !currentUser) return undefined;
    return myRequests.find((req) => {
      if (req.sender._id === currentUser._id && req.recipient._id === userId) {
        return true;
      }
      if (req.sender._id === userId && req.recipient._id === currentUser._id) {
        return true;
      }
      return false;
    });
  };

  const getButtonLabel = (u: User) => {
    if (isMyFriend(u._id)) {
      return "Usuń znajomego";
    }
    const found = findRequest(u._id);
    if (found) {
      if (found.sender._id === currentUser?._id) {
        return "Wysłano zaproszenie";
      } else {
        return "Zaakceptuj zaproszenie";
      }
    } else {
      return "Dodaj znajomego";
    }
  };

  const handleClick = (u: User) => {
    const label = getButtonLabel(u);
    if (label === "Dodaj znajomego") {
      sendFriendRequestMutation.mutate(u._id);
    } else if (label === "Wysłano zaproszenie") {
      console.log("TODO: Wysłano zaproszenie do", u._id);
    } else if (label === "Zaakceptuj zaproszenie") {
      console.log("TODO: Zaakceptuj zaproszenie od", u._id);
    } else if (label === "Usuń znajomego") {
      console.log("TODO: Usuń znajomego", u._id);
    }
  };

  return (
    <>
      <h1 className="lg:text-2xl mb-3">Proponowani znajomi</h1>
      {/* {isLoading && <p>Ładowanie listy użytkowników...</p>} */}

      <div className={styles.usersGrid}>
        {users.map((u) => {
          const label = getButtonLabel(u);
          return (
            <UserCard
              key={u._id}
              userId={u._id}
              userLogin={u.login}
              userName={u.name}
              userSurname={u.surname}
              buttonLabel={label}
              onButtonClick={() => handleClick(u)}
            />
          );
        })}
      </div>
    </>
  );
}
