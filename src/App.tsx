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
import UserProfile from "./components/features/loggedSections/userProfile/UserProfile";
import UserProfileInfo from "./components/features/loggedSections/userProfile/UserProfileInfo";
import UserProfileFriends from "./components/features/loggedSections/userProfile/UserProfileFriends";
import UserProfilePhotos from "./components/features/loggedSections/userProfile/UserProfilePhotos";
import TrainingSection from "./components/features/loggedSections/loggedMenuSections/TrainingSection/TrainingSection";
import ProgressSection from "./components/features/loggedSections/loggedMenuSections/ProgressSection/ProgressSection";
import FriendsSection from "./components/features/loggedSections/loggedMenuSections/FriendsSection/FriendsSection";
import WorkoutCreate from "./components/features/loggedSections/loggedMenuSections/TrainingSection/WorkoutCreate";
import WorkoutsHistory from "./components/features/loggedSections/loggedMenuSections/TrainingSection/WorkoutsHistory";
import WorkoutsAccept from "./components/features/loggedSections/loggedMenuSections/TrainingSection/WorkoutsAccept";
import TrainingCreator from "./components/features/loggedSections/loggedMenuSections/TrainingSection/WorkoutCreator";
import LogWorkout from "./components/features/loggedSections/loggedMenuSections/TrainingSection/LogWorkout";
import ProgressActivity from "./components/features/loggedSections/loggedMenuSections/ProgressSection/ProgressActivity";
import ProgressExercises from "./components/features/loggedSections/loggedMenuSections/ProgressSection/ProgressExercises";
import ProgressMuscles from "./components/features/loggedSections/loggedMenuSections/ProgressSection/ProgressMuscles";
import AutoTrainingCreator from "./components/features/loggedSections/loggedMenuSections/TrainingSection/AutoTrainingCreator";
import SearchFriends from "./components/features/loggedSections/loggedMenuSections/FriendsSection/SearchFriends";
import FriendsList from "./components/features/loggedSections/loggedMenuSections/FriendsSection/FriendsList";
import FriendsRequests from "./components/features/loggedSections/loggedMenuSections/FriendsSection/FriendsRequests";
import SearchTrainer from "./components/features/loggedSections/loggedMenuSections/FriendsSection/SearchTrainer";
Modal.setAppElement("#root");
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="root">
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/loggedMenu" element={<LoggedMenu />}>
                <Route
                  index
                  element={<Navigate to="trainingSection" replace />}
                />
                <Route path="trainingSection" element={<TrainingSection />}>
                  <Route
                    index
                    element={<Navigate to="workoutsToAccept" replace />}
                  />
                  <Route path="workoutCreate" element={<WorkoutCreate />} />
                  <Route path="workoutsHistory" element={<WorkoutsHistory />} />
                  <Route path="workoutsToAccept" element={<WorkoutsAccept />} />
                </Route>

                <Route path="trainingCreator" element={<TrainingCreator />} />
                <Route
                  path="autoTrainingCreator"
                  element={<AutoTrainingCreator />}
                />

                <Route path="logWorkout" element={<LogWorkout />} />
                <Route path="progressSection" element={<ProgressSection />}>
                  <Route index element={<Navigate to="muscles" replace />} />
                  <Route path="muscles" element={<ProgressMuscles />} />
                  <Route path="activity" element={<ProgressActivity />} />
                  <Route path="exercises" element={<ProgressExercises />} />
                </Route>
                <Route path="friendsSection" element={<FriendsSection />}>
                  <Route
                    index
                    element={<Navigate to="searchFriends" replace />}
                  />
                  <Route path="searchFriends" element={<SearchFriends />} />
                  <Route path="friendsList" element={<FriendsList />} />
                  <Route path="friendsRequests" element={<FriendsRequests />} />
                  <Route path="searchTrainer" element={<SearchTrainer />} />
                </Route>
              </Route>
              <Route path="userProfile/:id" element={<UserProfile />}>
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
