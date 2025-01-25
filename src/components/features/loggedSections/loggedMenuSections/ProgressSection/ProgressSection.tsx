import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ProgressSection() {
  type Series = {
    kg: number;
    reps: number;
  };
  type Exercise = {
    name: string;
    bodyPart: string;
    bodySection: string;
    img: string | null;
    series: Series[];
  };
  type Training = {
    userId: string;
    name: string;
    date: string;
    exercises: Exercise[];
  };

  const [trainingHistory, setTrainingHistory] = useState<Training[]>([]);
  const [muscleGroupData, setMuscleGroupData] = useState([]);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getWorkouts");
      setTrainingHistory(response.data.userWorkouts);

      processMuscleGroupData(response.data.userWorkouts);
    } catch (error) {
      console.error(error);
    }
  };

  const processMuscleGroupData = (trainings: Training[]) => {
    const muscleCount: Record<string, number> = {};

    trainings.forEach((training) => {
      training.exercises.forEach((exercise) => {
        const muscle = exercise.bodyPart;
        if (muscleCount[muscle]) {
          muscleCount[muscle]++;
        } else {
          muscleCount[muscle] = 1;
        }
      });
    });

    const formattedData = Object.entries(muscleCount).map(([key, value]) => ({
      name: key,
      value,
    }));

    setMuscleGroupData(formattedData);
  };
  useEffect(() => {
    fetchTrainings();
  }, []);

  const data = [
    { name: "Przysiady", value: 400 },
    { name: "Wyciskanie", value: 300 },
    { name: "Martwy ciąg", value: 300 },
    { name: "Podciąganie", value: 200 },
  ];

  return (
    <>
      <div className="bgLogged">
        <h1>Strefa Progresu</h1>
        <div className="flex align-center justify-center mb-16 mt-4">
          <p className="mr-5">Aktywność</p>
          {/*
            ilosc treningow w ciagu ostatnich 30dni/roku/ogolnie-slupkowy,
            srednia ilosc treningow w danym miesiacu-slupkowy?,
           

          */}
          <p className="mr-5">Mięsnie</p>
          {/* jakie miesnie sa trenowane procentowo-kolowy,
           ile serii na dane miesnie bylo cwiczonie (ogolnie/w ostatnim miesiacu)-slupkowy, 
           
           */}
          <p>Ćwiczenia</p>
          {/*
           ulubione cwiczenie w ciagu ostatnich 30dni/roku/ogolnie-slupkowo,
          maxy- 1RM- przewidywany 1max rep dla danego cwiczenia na podstawie ilosci powtorzen i kilogramow w serii
          wzor:  waga* (1+ powtorzenia/30)-wykres

          */}
        </div>
      </div>
    </>
  );
}
