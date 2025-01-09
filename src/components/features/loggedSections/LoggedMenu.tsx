import { Outlet } from "react-router-dom";
import HeaderLoggedMenu from "./HeaderLoggedMenu";
import TrainingSection from "./loggedMenuSections/TrainingSection/TrainingSection";
import "./loggedSectionsStyles.css";
export default function LoggedMenu() {
  return (
    <>
      <HeaderLoggedMenu />

      <Outlet />
    </>
  );
}
