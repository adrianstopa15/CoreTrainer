import React, { useState } from "react";
import PortalModal from "../modals/PortalModal";
import padLock from "../../assets/Padlock.png";
import loginAvatar from "../../assets/loginAvatar.png";
import axios from "axios";
// import SweetAlert2 from "react-sweetalert2";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";

export default function Header() {
  // const [swalProps, setSwalProps] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });
  const mutate = useMutation({});

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          login: loginData.login,
          password: loginData.password,
        },
        { withCredentials: true }
      );
      Swal.fire({
        title: "Sukces",
        text: "Zalogowano pomyślnie",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        position: "top",
      });
      console.log("Użytkownik został zalogowany", response.data);
    } catch (error) {
      console.error("Bladz podzcas logowania", error);
      Swal.fire({
        title: "Błąd!",
        text: "Nieprawidlowy login lub haslo",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        position: "top",
      });
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    login: "",
    name: "",
    surname: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        email: formData.email,
        login: formData.login,
        name: formData.name,
        surname: formData.surname,
        password: formData.password,
      });
      Swal.fire({
        title: "Sukces!",
        text: "Konto zostało zarejestrowane, zostaniesz przeniesiony do Logowania.",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        position: "top",
      });
      console.log("Uzytkownik zostal zarejestrowany:", response.data);

      setTimeout(() => {
        changeMode();
      }, 2500);
    } catch (error) {
      console.error("Błą podczas rejestracji:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCreateMode(false);
  };
  const changeMode = () => setCreateMode(!createMode);
  return (
    <>
      <header className="header  lg:flex lg:px-24 py-4 text-center ">
        <a className=" text-2xl xl:text-6xl text-gray-100">
          Core<span className="text-red-600">Trainer</span>
        </a>
        <nav className="navbar text-gray-300 flex flex-col lg:flex-row">
          <a
            href="#"
            className="my-2 xl:my-0 lg:ml-16 md:text-3xl xl:text-2xl mt-8 lg:mt-0"
          >
            Opis Aplikacji
          </a>
          <a href="#" className="my-2 xl:my-0 lg:ml-16 md:text-3xl xl:text-2xl">
            Wybór Programu
          </a>
          <a
            href="#"
            className="my-2 xl:my-0 lg:ml-16 md:text-3xl xl:mr-8 xl:text-2xl"
          >
            Kontakt
          </a>
          <a
            href="#"
            onClick={openModal}
            className="my-2 xl:my-0 lg:ml-16 md:text-3xl xl:text-2xl"
          >
            Logowanie
          </a>
        </nav>
      </header>
      <PortalModal isOpen={isModalOpen} onClose={closeModal}>
        {!createMode ? (
          <div className="modal-login flex flex-col">
            <h1 className="mb-6 text-center xl:text-3xl"> Sign In </h1>
            <form className="flex flex-col mx-16" onSubmit={handleLoginSubmit}>
              <span className="flex items-center border-b-2 mb-4">
                <img src={loginAvatar} className="max-w-6 mr-2 " />
                <input
                  type="text"
                  id="login"
                  name="login"
                  placeholder="Login"
                  className="py-4 size-full"
                  required
                  value={loginData.login}
                  onChange={handleLoginChange}
                />
              </span>

              <span className="flex items-center border-b-2 mb-4">
                <img src={padLock} className="max-w-6 mr-2 filter grayscale" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="py-4 size-full"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
              </span>
              <button
                type="submit"
                className="bg-emerald-500 mb-8 text-white p-2 rounded-sm"
              >
                Sign In
              </button>
              <a href="#" className="text-emerald-300 text-center mb-4">
                Forgot Password?
              </a>
              <span className="border-t-2">
                <p className="text-center mb-4 mt-4">
                  {" "}
                  Don't have an account?
                  <a
                    href="#"
                    className="text-emerald-300 ml-1"
                    onClick={changeMode}
                  >
                    Create one
                  </a>
                </p>
              </span>
            </form>
          </div>
        ) : (
          <div className="modal-login flex flex-col ">
            <h1 className="mb-6 text-center xl:text-3xl"> Register </h1>
            <form className="flex flex-col mx-16" onSubmit={handleSubmit}>
              <span className="flex items-center border-b-2 mb-4">
                <img src={loginAvatar} className="max-w-6 mr-2 " />
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="py-4 size-full"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </span>

              <span className="flex items-center border-b-2 mb-4">
                <img src={padLock} className="max-w-6 mr-2 filter grayscale" />
                <input
                  type="text"
                  id="login"
                  name="login"
                  placeholder="Login"
                  className="py-4 size-full"
                  required
                  value={formData.login}
                  onChange={handleChange}
                />
              </span>

              <span className="flex items-center border-b-2 mb-4">
                <img src={padLock} className="max-w-6 mr-2 filter grayscale" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  className="py-4 size-full"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </span>

              <span className="flex items-center border-b-2 mb-4">
                <img src={padLock} className="max-w-6 mr-2 filter grayscale" />
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  placeholder="Surname"
                  className="py-4 size-full"
                  required
                  value={formData.surname}
                  onChange={handleChange}
                />
              </span>

              <span className="flex items-center border-b-2 mb-4">
                <img src={padLock} className="max-w-6 mr-2 filter grayscale" />
                <input
                  type="password"
                  minLength={6}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="py-4 size-full"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </span>

              <button className="bg-emerald-500 mb-8 text-white p-2 rounded-sm">
                Register
              </button>
              <a href="#" className="text-emerald-300 text-center mb-4">
                Forgot Password?
              </a>
              <span className="border-t-2">
                <p className="text-center mb-4 mt-4">
                  {" "}
                  Have an account already?
                  <a
                    href="#"
                    className="text-emerald-300 ml-2"
                    onClick={changeMode}
                  >
                    Sign In
                  </a>
                </p>
              </span>
            </form>
          </div>
        )}
      </PortalModal>
    </>
  );
}
