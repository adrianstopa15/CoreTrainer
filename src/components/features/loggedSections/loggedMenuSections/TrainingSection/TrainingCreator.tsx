import React, { useState } from "react";
import HeaderLoggedMenu from "../../HeaderLoggedMenu";
import lowerPartsIcon from "../../../../../assets/lowerPartsIcon.png";
import upperPartsIcon from "../../../../../assets/upperPartsIcon.png";
import barbelRowing from "../../../../../assets/exerciseBarbelRowingPhoto.png";

export default function TrainingCreator() {
  const [filterBodyPart, setFilterBodyPart] = useState<string>("");
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [formData, setFormData] = useState();
  const fakeExercises = [
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
    {
      name: "wiosłowanie ze sztangą",
      bodySection: "upper",
      bodyPart: "shoulders",
      img: barbelRowing,
    },
  ];

  const handleDragStart = (e: React.DragEvent, exercise: any) => {
    e.dataTransfer.setData("exercise", JSON.stringify(exercise));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const exerciseData = e.dataTransfer.getData("exercise");
    const exercise = JSON.parse(exerciseData);
    setSelectedExercises((prev) => [...prev, exercise]);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="bgLogged">
        <div className="flex flex-row">
          <div className="creatorSection-left">
            <input
              placeholder="wyszukaj ćwiczenie"
              className="text-center mt-4 bg-gray-200"
            />
            <div className="flex mt-3">
              <div
                className="mr-4"
                onClick={() => setFilterBodyPart("filterUpperBody")}
              >
                <img
                  src={upperPartsIcon}
                  alt=""
                  className={
                    filterBodyPart === "filterUpperBody"
                      ? "bodyPartsIconSelected"
                      : "bodyPartsIcon"
                  }
                />
              </div>
              <div>
                <img
                  src={lowerPartsIcon}
                  alt=""
                  className={
                    filterBodyPart === "filterBottomBody"
                      ? "bodyPartsIconSelected"
                      : "bodyPartsIcon"
                  }
                  onClick={() => setFilterBodyPart("filterBottomBody")}
                />
              </div>
            </div>
            <div className="creatorSection-left--workoutsContainer">
              {/* tutaj bedzie tryb selekcji i tryb cwiczen, tryb selekcji bedzie po kliknieciu na 
                filtrowanie parti ciala, zamiast cwiczen to wyswietla sie poszczegolne miesnie, po jego kliknieciu
                wroci do trybu cwiczen juz z filtrowanymi cwiczeniami. oprocz tego jeszcze bedzie mozna kliknac
                na dole gotowe zestawy cwiczen, co tez wywola inne mapowanie- tym razem zestawow cwiczen. */}
              <div className="exercises-grid">
                {fakeExercises.map((e) => (
                  <div
                    className="exercises-grid--card"
                    key={e.name}
                    draggable
                    onDragStart={(event) => handleDragStart(event, e)}
                  >
                    <img src={e.img} className="exerciseImg" />
                    <h3>{e.name}</h3>
                  </div>
                ))}
              </div>
              <div className="exercisesButtonsContainer">
                <button className="button-green mr-8">dodaj ćwiczenie</button>
                <button className="button-blue">gotowe zestawy ćwiczeń</button>
              </div>
            </div>
          </div>
          <div className="creatorSection-right">
            <p className="mt-8">Ćwiczenia</p>
            <div
              className="exercisesBox"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {selectedExercises.map((e) => (
                <div className="selectedExerciseBox">
                  {" "}
                  <div className="selectedExerciseElement" id={e.name}>
                    <img src={e.img} />
                    {e.name}
                  </div>
                  <div className="selectedExerciseElementInfo">
                    <form className="selectedExerciseElementForm">
                      <div>
                        ilość serii
                        <select>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-center"> ilość powtórzeń w serii</p>
                        <input placeholder="1 seria" className="my-2" />
                        <input placeholder="2 seria" className="my-2" />
                        <input placeholder="3 seria" className="my-2" />
                        <input placeholder="4 seria" className="my-2" />
                        <input placeholder="5 seria" className="my-2" />
                      </div>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
