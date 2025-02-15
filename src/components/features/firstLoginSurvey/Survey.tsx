import React, { useEffect, useMemo, useReducer, useState } from "react";
import styles from "./Survey.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import menteeIcon from "../../../assets/mentee.png";
import trainerIcon from "../../../assets/trainer.png";
import manIcon from "../../../assets/manIcon.png";
import womanIcon from "../../../assets/womanIcon.png";

function Survey() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/getCurrentUser", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          console.error("nie znaleziono użytkownika");
        }
      })
      .catch((err) => console.error("Błąd pobierania usera", err));
  }, []);

  const navigate = useNavigate();
  const trainerRoles = [
    { role: "personalTrainer", name: "Rozpisywanie Treningów" },
    { role: "trainerLead", name: "Prowadzenie Treningów" },
    { role: "dietician", name: "Układanie Diety" },
    { role: "rehabilitationTrainer", name: "Rehabilitacja i Korekcja" },
    { role: "flexibilityTrainer", name: "Zwiększanie Mobilności" },
    { role: "performanceCoach", name: "Trening dla Sportowców" },
  ];
  const internships = [
    { name: "mniej niż miesiąc", value: "beginner" },
    { name: "1-6 miesięcy", value: "novice" },
    { name: "6-12 miesięcy", value: "intermediate" },
    { name: "1-3 lata", value: "advanced" },
    { name: "ponad 3 lata", value: "expert" },
  ];

  interface userFeatures {
    roles: string[];
    weight: number;
    height: number;
    goal: string;
    age: number;
    gender: string;
    experience: string;
    subroles: string[];
  }
  const [surveyForm, setSurveyForm] = useState<userFeatures>({
    roles: [],
    weight: 0,
    height: 0,
    goal: "",
    age: 0,
    gender: "",
    experience: "",
    subroles: [],
  });

  const setRole = () => {
    setSurveyForm((prev) => ({
      ...prev,
      roles: ["Podopieczny"],
    }));
  };
  const setGenderMan = () => {
    setSurveyForm((prev) => ({
      ...prev,
      gender: "man",
    }));
  };
  const setGenderWoman = () => {
    setSurveyForm((prev) => ({
      ...prev,
      gender: "woman",
    }));
  };

  const setRoleTrainer = () => {
    Swal.fire({
      title: "Czy jako trener chcesz również korzystać z opcji podopiecznego?",
      showDenyButton: true,
      confirmButtonText: "Tak",
      denyButtonText: "Nie",
      icon: "question",
      showConfirmButton: true,
      position: "top",
    }).then((result) => {
      if (result.isConfirmed) {
        setSurveyForm((prev) => ({
          ...prev,
          roles: ["Trener", "Podopieczny"],
        }));
      } else {
        setSurveyForm((prev) => ({
          ...prev,
          roles: ["Trener"],
        }));
      }
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurveyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showSteps = React.useMemo(() => {
    const steps = [0, 1];
    if (surveyForm.roles.includes("Podopieczny")) {
      steps.push(2);
    }
    if (surveyForm.roles.includes("Trener")) {
      steps.push(3);
    }
    steps.push(4);
    return steps;
  }, [surveyForm.roles]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStep = showSteps[currentIndex];

  const handleNext = () => {
    if (currentIndex < showSteps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSurveyForm((prev) => {
      if (checked) {
        return {
          ...prev,
          subroles: [...prev.subroles, name],
        };
      } else {
        return {
          ...prev,
          subroles: prev.subroles.filter((s) => s !== name),
        };
      }
    });
  };

  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/submitSurvey", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(surveyForm),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Błąd!" + data.error);
      } else {
        console.log(
          "Dane zostały zapisane!" + JSON.stringify(data.userFeatures)
        );
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Pomyślnie wypełniono ankietę.",
          text: "W każdej chwili możesz zmienić swoję dane w zakładce profil.",
          showConfirmButton: true,
          timer: 5000,
        }).then((result) => {
          navigate("/loggedMenu");
        });
      }
    } catch (error) {
      console.error("Problem z wysłaniem formularza", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.borderGlass}>
        <div>
          {currentStep === 0 && (
            <div className={styles.pageContainer}>
              <p className={`${styles.pMain} lg:text-6xl my-16`}>
                Witaj, Miło Cię nam Poznać
                {currentUser ? ` ${currentUser.name}!` : "nieznajomy"}
              </p>

              <p className={`lg:text-4xl`}>
                Jako, że widzimy się pierwszy raz poświęć nam chwilę, aby
                dowiedzieć się więcej o Tobie.
              </p>
              <p className="mt-36 text-3xl">Na początek, wybierz swoją płeć:</p>
              <div className="flex mt-24 justify-center">
                <img
                  src={manIcon}
                  alt=""
                  className={`${surveyForm.gender === "man" ? styles.genderIconSelected : styles.genderIcon} mr-16`}
                  onClick={setGenderMan}
                />
                <img
                  src={womanIcon}
                  alt=""
                  className={`${surveyForm.gender === "woman" ? styles.genderIconSelected : styles.genderIcon}`}
                  onClick={setGenderWoman}
                />
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div className={styles.pageContainer}>
              <p className={`${styles.pMain} lg:text-6xl my-20`}>
                Aplikacji chcę używać jako:
              </p>
              <div className={styles.rolesContainer}>
                <div
                  onClick={setRole}
                  className={
                    surveyForm.roles.includes("Podopieczny")
                      ? `${styles.rolePickerContainerSelected}`
                      : `${styles.rolePickerContainer}`
                  }
                >
                  <p className={`lg:text-4xl cursor-pointer my-8`}>
                    Podopieczny
                  </p>
                  <img
                    src={menteeIcon}
                    className={`${styles.roleIcon} lg:h-48`}
                  />
                </div>
                <div
                  onClick={setRoleTrainer}
                  className={
                    surveyForm.roles.includes("Trener")
                      ? `${styles.rolePickerContainerSelected}`
                      : `${styles.rolePickerContainer}`
                  }
                >
                  <p className={`lg:text-4xl cursor-pointer my-8`}>Trener</p>
                  <img
                    src={trainerIcon}
                    className={`${styles.roleIcon} lg:h-48`}
                  />
                </div>
              </div>

              {/* <p className={styles.pSubMain}>cos tam</p> */}
            </div>
          )}
          {currentStep === 2 && (
            <div className={styles.pageContainer}>
              <p className={`${styles.pMain} lg:text-6xl mt-8 mb-20`}>
                Wypełnij dane sylwetkowe:
              </p>
              <form className={`${styles.formMain} lg:text-3xl`}>
                <label>
                  <span> Wzrost</span>
                  <input
                    type="text"
                    name="height"
                    id="height"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span> Waga</span>{" "}
                  <input
                    type="number"
                    name="weight"
                    id="weight"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span> Wiek</span>{" "}
                  <input
                    type="number"
                    name="age"
                    id="age"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Staż</span>
                  <select
                    name="experience"
                    id="experience"
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {internships.map((i) => (
                      <option id={i.value} key={i.name}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Cel</span>
                  <select
                    id="goal"
                    name="goal"
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option id="reduction" key="reduction">
                      Redukcja
                    </option>
                    <option id="maintain" key="maintain">
                      Utrzymanie
                    </option>
                    <option id="mass" key="mass">
                      Masa
                    </option>
                  </select>
                </label>
                <p className="mb-12">Płeć:</p>
                <label>
                  <img
                    src={manIcon}
                    alt=""
                    className={`${styles.genderIcon} h-20 mr-16`}
                  />
                  <img
                    src={womanIcon}
                    alt=""
                    className={`${styles.genderIcon} h-20`}
                  />
                </label>
              </form>

              {/* <p className={styles.pSubMain}>cos tam</p> */}
            </div>
          )}
          {currentStep === 3 && (
            <div className={styles.pageContainer}>
              <p className={`lg:text-6xl mt-12 mb-24`}>
                Jako trener zaznacz swoję kompetencję:
              </p>
              {trainerRoles.map((role) => (
                <div className="flex flex-col lg:text-3xl">
                  <label className={styles.checkboxLabel}>
                    {role.name}
                    <input
                      type="checkbox"
                      key={role.name}
                      id={role.role}
                      name={role.role}
                      onChange={handleChangeCheckbox}
                      className={`${styles.checkbox} ml-4`}
                    />
                  </label>
                </div>
              ))}

              {/* <p className={styles.pSubMain}>cos tam</p> */}
            </div>
          )}
          {currentStep === 4 && (
            <div className={styles.pageContainer}>
              <p className={`lg:text-6xl mt-12 mb-24`}>Podsumowanie</p>
              <div className="flex flex-col justify-center mb-16 lg:text-3xl">
                <p className="mb-8">{surveyForm.roles.map((r) => `${r} `)}</p>
                <p className="mb-8">Wzrost: {surveyForm.height}</p>
                <p className="mb-8">Waga: {surveyForm.weight}</p>
                <p className="mb-8">Staż: {surveyForm.experience}</p>

                <p></p>
                <p></p>
              </div>
              <button onClick={handleSubmitSurvey} className="button-main">
                Zapisz
              </button>
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handlePrev} className="lg:text-xl">
            wróć
          </button>
          <button onClick={handleNext} className="lg:text-xl">
            dalej
          </button>
        </div>
      </div>
    </div>
  );
}

export default Survey;
