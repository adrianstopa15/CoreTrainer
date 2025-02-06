import React from "react";
import { useUserFriendsList } from "../../../../hooks/useFriends";
import { useParams } from "react-router-dom";
import defaultAvatar from "../../../../assets/defaultAvatar.png";
export default function UserProfileFriends() {
  const { id } = useParams();
  const { data: friendsList, isLoading, error } = useUserFriendsList(id || "");
  console.log(friendsList);
  console.log(id);

  if (isLoading) return <p>Ładowanie znajomych...</p>;
  if (error) return <p>Błąd: {error.message}</p>;
  if (friendsList.lenght === 0) return <p>Brak znajomych...</p>;
  return (
    <div>
      <div className="flex items-center">
        <div className="profileGrid">
          {" "}
          {friendsList.map((friend) => (
            <div className="profileGridCard" key={friend._id}>
              <img
                src={defaultAvatar}
                alt="profileAvatar"
                className="profileAvatar"
              />
              <p className="text-sm text-gray-100 ml-3 mt-3">{friend.login}</p>
              <p className="text-sm text-gray-300 ml-3 mt-1">
                {friend.name} {friend.surname}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
