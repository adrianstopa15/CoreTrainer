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
      <p className=" lg:text-2xl">Dane osobowe:</p>
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
          <p className="userInfoP">
            {" "}
            Aktualny cel: {user ? `${user.userFeatures.goal} ` : ""}
          </p>
        </>
      )}
      {user.userFeatures.roles.includes("Trener") && (
        <>
          Kompetencję:
          <p className="userInfoP">
            {user.userFeatures.subroles.map((s) => (
              <p>{s}</p>
            ))}
          </p>
        </>
      )}
      <div className="flex">
        <p className="userInfoP mr-2">Płeć:</p>
        {user.userFeatures.gender === "woman" ? (
          <img src={womanIcon} className="h-6 mt-2" />
        ) : (
          <img src={manIcon} className="h-6 mt-2" />
        )}
      </div>
    </>
  );
}
