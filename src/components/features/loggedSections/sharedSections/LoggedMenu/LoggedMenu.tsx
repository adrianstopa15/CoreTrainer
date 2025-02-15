import { Outlet } from "react-router-dom";
import HeaderLoggedMenu from "./HeaderLoggedMenu";
import "./loggedSectionsStyles.css";
export default function LoggedMenu() {
  return (
    <>
      <HeaderLoggedMenu />

      <Outlet />
    </>
  );
}
