import "./App.css";
import MainMenu from "./components/features/mainMenu/mainMenu";
import Modal from "react-modal";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./components/modals/modalStyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/store";
import Survey from "./components/features/firstLoginSurvey/Survey";
import LoggedMenu from "./components/features/loggedSections/sharedSections/LoggedMenu/LoggedMenu";
import UserProfile from "./components/features/loggedSections/sharedSections/userProfile/UserProfile";
import UserProfileInfo from "./components/features/loggedSections/sharedSections/userProfile/UserProfileInfo";
import UserProfileFriends from "./components/features/loggedSections/sharedSections/userProfile/UserProfileFriends";
import UserProfilePhotos from "./components/features/loggedSections/sharedSections/userProfile/UserProfilePhotos";
import TrainingSection from "./components/features/loggedSections/userSections/TrainingSection/TrainingSection";
import ProgressSection from "./components/features/loggedSections/userSections/ProgressSection/ProgressSection";
import FriendsSection from "./components/features/loggedSections/sharedSections/FriendsSection/FriendsSection";
import WorkoutCreate from "./components/features/loggedSections/userSections/TrainingSection/WorkoutCreate";
import WorkoutsHistory from "./components/features/loggedSections/userSections/TrainingSection/WorkoutsHistory";
import WorkoutsAccept from "./components/features/loggedSections/userSections/TrainingSection/WorkoutsAccept";
import TrainingCreator from "./components/features/loggedSections/userSections/TrainingSection/WorkoutCreator";
import LogWorkout from "./components/features/loggedSections/sharedSections/LogWorkout/LogWorkoutBase";
import ProgressActivity from "./components/features/loggedSections/userSections/ProgressSection/ProgressActivity";
import ProgressExercises from "./components/features/loggedSections/userSections/ProgressSection/ProgressExercises";
import ProgressMuscles from "./components/features/loggedSections/userSections/ProgressSection/ProgressMuscles";
import AutoTrainingCreator from "./components/features/loggedSections/userSections/TrainingSection/AutoTrainingCreator";
import SearchFriends from "./components/features/loggedSections/sharedSections/FriendsSection/SearchFriends";
import FriendsList from "./components/features/loggedSections/sharedSections/FriendsSection/FriendsList";
import FriendsRequests from "./components/features/loggedSections/sharedSections/FriendsSection/FriendsRequests";
import SearchTrainer from "./components/features/loggedSections/sharedSections/FriendsSection/SearchTrainer";
import TrainerPanel from "./components/features/loggedSections/TrainerSections/TrainerPanel";
import ManageWorkout from "./components/features/loggedSections/TrainerSections/ManageWorkouts/ManageWorkout";
import ManageMentees from "./components/features/loggedSections/TrainerSections/ManageMentees/ManageMentees";
import LogWorkoutTrainer from "./components/features/loggedSections/TrainerSections/ManageWorkouts/LogWorkoutTrainer";
import LogWorkoutUser from "./components/features/loggedSections/userSections/TrainingSection/LogWorkoutUser";
import TrainingSets from "./components/features/loggedSections/sharedSections/WorkoutCreate/TrainingSets";
import DefaultTrainingSets from "./components/features/loggedSections/sharedSections/WorkoutCreate/DefaultTrainingSets";
import TrainersList from "./components/features/loggedSections/sharedSections/FriendsSection/userOptions/TrainersList";
import TraineeRequests from "./components/features/loggedSections/sharedSections/FriendsSection/trainerOptions/TraineeRequests";
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
                <Route path="trainingSets" element={<TrainingSets />} />
                <Route
                  path="DefaultTrainingSets"
                  element={<DefaultTrainingSets />}
                />
                <Route
                  path="autoTrainingCreator"
                  element={<AutoTrainingCreator />}
                />

                <Route path="logWorkout" element={<LogWorkoutUser />} />
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
                  <Route path="trainersList" element={<TrainersList />} />
                  <Route path="traineeRequests" element={<TraineeRequests />} />
                </Route>
                <Route path="trainerPanel" element={<TrainerPanel />}>
                  <Route
                    index
                    element={<Navigate to="manageWorkout" replace />}
                  />
                  <Route path="manageWorkout" element={<ManageWorkout />} />
                  <Route path="manageMentees" element={<ManageMentees />} />
                </Route>
                <Route
                  path="logWorkoutTrainer"
                  element={<LogWorkoutTrainer />}
                />
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
