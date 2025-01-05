import "./App.css";
import MainMenu from "./components/main-menu/mainMenu";
import Modal from "react-modal";
import "./components/modals/modalStyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/store";
import Survey from "./components/user/Survey";

Modal.setAppElement("#root");
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div className="root">
          {/* <Survey /> */}
          <MainMenu />
        </div>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
