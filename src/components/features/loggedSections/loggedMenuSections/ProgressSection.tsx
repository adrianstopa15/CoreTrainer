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
        <div className="flex">
          <p>Aktywność</p>
          <p>Mięsnie</p>
          <p>Siła</p>
        </div>
        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="top"
                iconSize={10}
              />
              <Pie
                data={muscleGroupData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
              >
                {muscleGroupData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
                itemStyle={{ color: "#333" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
