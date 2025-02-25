import React from "react";
import { useUserFriendsList } from "../../../../../hooks/useFriends";
import { Link, useParams } from "react-router-dom";
import defaultAvatar from "../../../../../assets/defaultAvatar.png";
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
              <Link to={`/userProfile/${friend._id}`}>
                <p className="text-gray-100 text-center mt-3 p-1">
                  {friend.login}
                </p>
              </Link>
              <p className=" text-gray-300 text-center mt-1 p-2">
                {friend.name} {friend.surname}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
