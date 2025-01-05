import React, { useMemo, useReducer, useState } from "react";
import styles from "./Survey.module.css";
import Swal from "sweetalert2";
import axios from "axios";
type SurveyAction = { type: "nextStep" } | { type: "prevStep" };

function Survey() {
  // const [step, setStep] = useState(0);
  const trainerRoles = [
    { role: "personalTrainer", name: "Trener Personalny" },
    { role: "dietician", name: "Dietetyk" },
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
    experience: string;
    subroles: string[];
  }
  const [surveyForm, setSurveyForm] = useState<userFeatures>({
    roles: [],
    weight: 0,
    height: 0,
    goal: "",
    age: 0,
    experience: "",
    subroles: [],
  });

  const setRole = () => {
    setSurveyForm((prev) => ({
      ...prev,
      roles: ["podopieczny"],
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
          roles: ["trener", "podopieczny"],
        }));
      } else {
        setSurveyForm((prev) => ({
          ...prev,
          roles: ["trener"],
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
    if (surveyForm.roles.includes("podopieczny")) {
      steps.push(2);
    }
    if (surveyForm.roles.includes("trener")) {
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyForm),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        alert("Błąd!" + data.error);
      } else {
        alert("Dane zostały zapisane!" + JSON.stringify(data.userFeatures));
      }
    } catch (error) {
      console.error("Problem z wyslaniem ankiety.", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.borderGlass}>
        <div>
          {currentStep === 0 && (
            <div className={styles.pageContainer}>
              <p className={styles.pMain}>Witaj! Miło Cię nam Poznać %USER%</p>
              <p className={styles.pSubMain}>
                Jako, że widzimy się pierwszy raz poświęć nam chwilę, aby
                dowiedzieć się więcej o Tobie.
              </p>
            </div>
          )}
          {currentStep === 1 && (
            <div className={styles.pageContainer}>
              <p className={styles.pMain}>Aplikacji chcę używać jako:</p>
              <div className={styles.rolesContainer}>
                <div onClick={setRole}>
                  <p>Podopieczny</p>e
                </div>
                <div onClick={setRoleTrainer}>
                  <p>Trener</p>e
                </div>
              </div>

              {/* <p className={styles.pSubMain}>cos tam</p> */}
            </div>
          )}
          {currentStep === 2 && (
            <div className={styles.pageContainer}>
              <p className={styles.pMain}>Wypełnij dane sylwetkowe:</p>
              <form className={styles.formMain}>
                <label>
                  <span> Wzrost:</span>{" "}
                  <input
                    type="text"
                    name="height"
                    id="height"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span> Waga:</span>{" "}
                  <input
                    type="number"
                    name="weight"
                    id="weight"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span> Wiek:</span>{" "}
                  <input
                    type="number"
                    name="age"
                    id="age"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Staż:</span>
                  <select
                    name="experience"
                    id="experience"
                    onChange={handleChange}
                  >
                    {internships.map((i) => (
                      <option id={i.value} key={i.name}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Cel:</span>
                  <select id="goal" name="goal" onChange={handleChange}>
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
              </form>

              {/* <p className={styles.pSubMain}>cos tam</p> */}
            </div>
          )}
          {currentStep === 3 && (
            <div className={styles.pageContainer}>
              <p className={styles.pMain}>
                Jako trener, zaznacz swoje kompetencję:
              </p>
              {trainerRoles.map((role) => (
                <label>
                  {role.role}
                  <input
                    type="checkbox"
                    key={role.name}
                    id={role.role}
                    name={role.role}
                    onChange={handleChangeCheckbox}
                  />
                </label>
              ))}

              {/* <p className={styles.pSubMain}>cos tam</p> */}
            </div>
          )}
          {currentStep === 4 && (
            <div className={styles.pageContainer}>
              <p>podsumowanie</p>
              <button onClick={handleSubmitSurvey}>Zapisz</button>
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handlePrev}>prev</button>
          <button onClick={handleNext}>next</button>
        </div>
      </div>
    </div>
  );
}

export default Survey;
