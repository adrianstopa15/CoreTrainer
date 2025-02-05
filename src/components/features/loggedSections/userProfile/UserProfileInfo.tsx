import React, { useEffect, useState } from "react";
import { useCurrentUserInfo, useUserInfo } from "../../../../hooks/useUserInfo";
import { useOutletContext } from "react-router-dom";
import { UserDetails } from "../../../../api/user";
export default function UserProfileInfo() {
  const { user } = useOutletContext<{ user: UserDetails }>();

  return (
    <>
      <p className=" lg:text-2xl">Dane osobowe:</p>
      <p className="userInfoP"> {user ? `${user.userFeatures.roles} ` : ""} </p>
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
  );
}
