import React, { useEffect, useState } from "react";
import {
  useCurrentUserInfo,
  useUserInfo,
} from "../../../../../hooks/useUserInfo";
import { useOutletContext } from "react-router-dom";
import { UserDetails } from "../../../../../api/user";
import womanIcon from "../../../../../assets/womanIcon.png";
import manIcon from "../../../../../assets/manIcon.png";
export default function UserProfileInfo() {
  const { user } = useOutletContext<{ user: UserDetails }>();

  return (
    <>
      <h2 className=" lg:text-2xl">Dane osobowe:</h2>
      <p className="userInfoP"> {user ? `${user.userFeatures.roles} ` : ""} </p>
      {user.userFeatures.roles.includes("Podopieczny") && (
        <>
          <p className="userInfoP">
            Wiek: {user ? `${user.userFeatures.age} ` : ""}
          </p>
          <p className="userInfoP">
            Waga: {user ? `${user.userFeatures.weight} ` : ""}
          </p>
          <p className="userInfoP">
            Staż: {user ? `${user.userFeatures.experience} ` : ""}
          </p>
        </>
      )}
      {user.userFeatures.roles.includes("Trener") && (
        <>
          <h3 className="text-xl mt-4">Kompetencję trenerskie:</h3>
          <div className="text-lg mb-2 mt-2 profileInfoTrainerBox">
            {user.userFeatures.subroles.map((s) => (
              <p>{s}</p>
            ))}
          </div>
        </>
      )}
    </>
  );
}
