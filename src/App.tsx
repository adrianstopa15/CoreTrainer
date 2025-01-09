import "./App.css";
import MainMenu from "./components/main-menu/mainMenu";
import Modal from "react-modal";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./components/modals/modalStyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/store";
import Survey from "./components/user/Survey";
import LoggedMenu from "./components/features/loggedSections/LoggedMenu";
import UserProfile from "./components/features/loggedSections/UserProfile";
import UserProfileInfo from "./components/features/loggedSections/UserProfileInfo";
import UserProfileFriends from "./components/features/loggedSections/UserProfileFriends";
import UserProfilePhotos from "./components/features/userProfilePhotos";
import TrainingSection from "./components/features/loggedSections/loggedMenuSections/TrainingSection/TrainingSection";
import ProgressSection from "./components/features/loggedSections/loggedMenuSections/ProgressSection";
import FriendsSection from "./components/features/loggedSections/loggedMenuSections/FriendsSection";
import WorkoutCreate from "./components/features/loggedSections/loggedMenuSections/TrainingSection/WorkoutCreate";
import WorkoutsHistory from "./components/features/loggedSections/loggedMenuSections/TrainingSection/WorkoutsHistory";
import WorkoutsAccept from "./components/features/loggedSections/loggedMenuSections/TrainingSection/WorkoutsAccept";

Modal.setAppElement("#root");
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="root">
            {/* <Survey /> */}
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/loggedMenu" element={<LoggedMenu />}>
                <Route
                  index
                  element={<Navigate to="trainingSection" replace />}
                />
                <Route path="trainingSection" element={<TrainingSection />}>
                  <Route path="workoutCreate" element={<WorkoutCreate />} />
                  <Route path="workoutsHistory" element={<WorkoutsHistory />} />
                  <Route path="workoutsToAccept" element={<WorkoutsAccept />} />
                </Route>
                <Route path="progressSection" element={<ProgressSection />} />
                <Route path="friendsSection" element={<FriendsSection />} />
              </Route>

              <Route path="/userProfile" element={<UserProfile />}>
                <Route index element={<Navigate to="info" replace />} />
                <Route path="info" element={<UserProfileInfo />} />
                <Route path="friends" element={<UserProfileFriends />} />
                <Route path="photos" element={<UserProfilePhotos />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
