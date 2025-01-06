import "./App.css";
import MainMenu from "./components/main-menu/mainMenu";
import Modal from "react-modal";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./components/modals/modalStyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/store";
import Survey from "./components/user/Survey";
import LoggedMenu from "./components/features/LoggedMenu";

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
              <Route path="/loggedMenu" element={<LoggedMenu />} />
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
