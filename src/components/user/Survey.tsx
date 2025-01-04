import { useReducer } from "react";
import styles from "./Survey.module.css";

type SurveyState = {
  step: number;
};

type SurveyAction = { type: "nextStep" } | { type: "prevStep" };

function Survey() {
  const initialState: SurveyState = {
    step: 0,
  };

  const SurveyReducer = (state: SurveyState, action: SurveyAction) => {
    switch (action.type) {
      case "nextStep": {
        return { step: state.step + 1 };
      }
      case "prevStep": {
        return { step: state.step - 1 };
      }
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(SurveyReducer, initialState);

  const trainerRoles = [
    { role: "personalTrainer", name: "Trener Personalny" },
    { role: "dietician", name: "Dietetyk" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.borderGlass}>
        <div>
          {state.step === 0 && (
            <div className={styles.pageContainer}>
              <p className={styles.pMain}>Witaj! Miło Cię nam Poznać %USER%</p>
              <p className={styles.pSubMain}>
                Jako, że widzimy się pierwszy raz poświęć nam chwilę, aby
                dowiedzieć się więcej o Tobie.
              </p>
            </div>
          )}
          {state.step === 1 && (
            <div className={styles.pageContainer}>
              <p className={styles.pMain}>Aplikacji chcę używać jako:</p>
              <div className={styles.rolesContainer}>
                <div>
                  <p>Trener</p>e
                </div>
                <div>
                  <p>Podopieczny</p>e
                </div>
              </div>

              {/* <p className={styles.pSubMain}>cos tam</p> */}
            </div>
          )}
          {state.step === 2 && (
            <div className={styles.pageContainer}>
              <p className={styles.pMain}>Wypełnij dane sylwetkowe:</p>
              <form className={styles.formMain}>
                <label>
                  <span> Wzrost:</span> <input />
                </label>
                <label>
                  <span> Waga:</span> <input />
                </label>
                <label>
                  <span> Wiek:</span> <input />
                </label>
                <label>
                  <span>Staż:</span>
                  <input />
                </label>
                <label>
                  <span>Cel:</span>
                  <select>
                    <option>Redukcja</option>
                    <option>Utrzymanie</option>
                    <option>Masa</option>
                  </select>
                </label>
              </form>

              {/* <p className={styles.pSubMain}>cos tam</p> */}
            </div>
          )}
          {state.step === 3 && (
            <div className={styles.pageContainer}>
              <p className={styles.pMain}>
                Jako trener, zaznacz swoje kompetencję:
              </p>
              {trainerRoles.map((role) => (
                <label>
                  {role.name}
                  <input type="checkbox" id={role.role} />
                </label>
              ))}

              {/* <p className={styles.pSubMain}>cos tam</p> */}
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={() => dispatch({ type: "prevStep" })}>prev</button>
          <button onClick={() => dispatch({ type: "nextStep" })}>next</button>
        </div>
      </div>
    </div>
  );
}

export default Survey;
