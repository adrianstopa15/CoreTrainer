import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
  loginUser,
  registerUser,
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
} from "../api/auth";
import { loginSuccess } from "../store/AuthSlice";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      dispatch(loginSuccess(data.user));
      // Swal.fire({
      //   title: "Sukces",
      //   text: "Zalogowano pomyślnie",
      //   icon: "success",
      //   showConfirmButton: false,
      //   timer: 2500,
      //   position: "top",
      // });
      console.log("Użytkownik został zalogowany", data);
    },
    onError: (error: Error) => {
      console.error("Błąd podczas logowania", error);
      Swal.fire({
        title: "Błąd!",
        text: "Nieprawidłowy login lub hasło",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        position: "top",
      });
    },
  });
};

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: registerUser,
    onSuccess: (data: RegisterResponse) => {
      Swal.fire({
        title: "Sukces!",
        text: "Konto zostało zarejestrowane.",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        position: "top",
      });
      console.log("Uzytkownik zostal zarejestrowany", data);
    },
    onError: (error: Error) => {
      console.error("Błąd podczas rejestracji", error);
      Swal.fire({
        title: "Błąd!",
        text: "Nie udało się zarejestrować konta",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        position: "top",
      });
    },
  });
};
