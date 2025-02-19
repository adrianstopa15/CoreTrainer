import React, { useEffect, useState } from "react";
import styles from "./friendsSection.module.css";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
import { useAuth } from "../../../../../hooks/useAuth";
import {
  useFriendsList,
  useSendFriendRequest,
} from "../../../../../hooks/useFriends";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

interface FriendsGenericProps {
  mode: "search" | "list" | "requests";
  searchQuery: string;
}
interface OutletContextType {
  searchQuery: string;
}

export default function FriendsGeneric({
  mode,
}: {
  mode: "search" | "list" | "requests";
}) {
  const { searchQuery } = useOutletContext<OutletContextType>();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: currentUser, isLoading: userLoading } = useAuth();
  const { data: friendsList } = useFriendsList();
  const { data: myRequests } = useSendFriendRequest();
  const sendFriendRequestMutation = useSendFriendRequest();

  useEffect(() => {
    if (mode === "search") {
      fetchAllUsers();
    } else if (mode === "list") {
      setUsers(friendsList);
    }
    if (mode === "requests") {
      if (!myRequests || !currentUser) return;
      const requestsToMe = myRequests.filter(
        (r) => r.recipient._id === currentUser._id
      );
      setUsers(requestsToMe);
    }
  }, [mode, searchQuery, friendsList, myRequests, currentUser]);

  const handleSendRequest = async (id: string) => {
    sendFriendRequestMutation.mutate(id);
  };

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/getUsers", {
        params: { q: searchQuery },
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu użytkowników", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isMyFriend = (userId: string) => {
    return friendsList.some((fr: any) => fr._id === userId);
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

  const getButtonLabel = (obj: any) => {
    if (mode === "list") {
      return "Usuń znajomego";
    }
    if (mode === "requests") {
      return "Zaakceptuj/odrzuć";
    }

    if (isMyFriend(obj._id)) {
      return "Usuń znajomego";
    }
    const found = findRequest(obj._id);
    if (found) {
      if (found.sender._id === currentUser?._id) return "Zaproszenie wysłane";
      else return "Zaakceptuj zaproszenie";
    } else {
      return "Dodaj znajomego";
    }
  };

  const handleClick = (obj: any) => {
    if (mode === "list") {
      console.log("Usuń znajomego", obj._id);
      return;
    }
    if (mode === "requests") {
      console.log("Zaakceptuj/odrzuć zaproszenie id:", obj._id);
      return;
    }
    const label = getButtonLabel(obj);
    if (label === "Dodaj znajomego") {
      handleSendRequest(obj._id);
    } else if (label === "Zaproszenie wysłane") {
      console.log("Zaproszenie wysłane do", obj._id);
    } else if (label === "Zaakceptuj zaproszenie") {
      console.log("zaakceptuj zaproszenie od", obj._id);
    } else if (label === "Usuń znajomego") {
      console.log("Usuń znajomego", obj._id);
    }
  };

  if (userLoading) {
    return <p>Ładowanie usera...</p>;
  }
  if (isLoading && mode === "search") {
    return <p>Ładowanie użytkowników...</p>;
  }

  let displayData = [...users];
  if (searchQuery) {
    if (mode === "list") {
      displayData = displayData.filter((u) =>
        u.login.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (mode === "requests") {
      displayData = displayData.filter((r) =>
        r.sender.login.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }

  return (
    <div>
      {mode === "search" && <h2>Wyszukaj znajomych</h2>}
      {mode === "list" && <h2>Twoi znajomi</h2>}
      {mode === "requests" && <h2>Zaproszenia do Ciebie</h2>}

      <div className={styles.usersGrid}>
        {displayData.map((obj) => {
          let avatarUrl = defaultAvatar;
          let displayName = "";
          let uniqueId = "";

          if (mode === "requests") {
            avatarUrl = defaultAvatar;
            displayName = obj.sender.login;
            uniqueId = obj._id;
          } else {
            avatarUrl = defaultAvatar;
            displayName = obj.login;
            uniqueId = obj._id;
          }

          const label = getButtonLabel(obj);

          return (
            <div className={styles.usersGridCard} key={uniqueId}>
              <img
                src={avatarUrl}
                alt="avatar"
                className={styles.profileAvatar}
              />
              <p>{displayName}</p>
              <button onClick={() => handleClick(obj)}>{label}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
