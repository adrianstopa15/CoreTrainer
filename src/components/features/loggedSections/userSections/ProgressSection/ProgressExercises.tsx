import React, { PureComponent, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  LineChart,
  Line,
} from "recharts";
import { useWorkouts } from "../../../../../hooks/useWorkouts";
import styles from "./ProgressSection.module.css";
export default function ProgressExercises() {
  const { data: trainings, isLoading, error } = useWorkouts();
  const [exerciseGroupData, setExerciseGroupData] = useState<any[]>([]);
  const [oneRepetitionMax, setOneRepetitionMax] = useState<
    Record<string, { date: string; oneRepMax: number }[]>
  >({});
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF2042",
    "#00C022",
    "#FFCC99",
    "#00D4",
  ];
  const RADIAN = Math.PI / 180;

  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;

    const sx = cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN);
    const sy = cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN);

    const mx = cx + (outerRadius + 20) * Math.cos(-midAngle * RADIAN);
    const my = cy + (outerRadius + 20) * Math.sin(-midAngle * RADIAN);

    const ex = cx + (outerRadius + 40) * Math.cos(-midAngle * RADIAN);
    const ey = cy + (outerRadius + 40) * Math.sin(-midAngle * RADIAN);

    const midRadius = (innerRadius + outerRadius) / 2;
    const xMid = cx + midRadius * Math.cos(-midAngle * RADIAN);
    const yMid = cy + midRadius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <line x1={sx} y1={sy} x2={mx} y2={my} stroke="#999" strokeWidth={1} />
        <line x1={mx} y1={my} x2={ex} y2={ey} stroke="#999" strokeWidth={1} />

        <text
          x={ex}
          y={ey}
          fill="#fff"
          fontSize="clamp(0.313rem, 0rem + 0.833vw, 0.75rem)"
          dominantBaseline="central"
          textAnchor={ex > cx ? "start" : "end"}
        >
          {name}
        </text>

        <text
          x={xMid}
          y={yMid}
          fill="#fff"
          fontSize="clamp(0.188rem, -0.214rem + 1.071vw, 0.75rem)"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {(percent * 100).toFixed(0) + "%"}
        </text>
      </g>
    );
  };

  useEffect(() => {
    if (!trainings || trainings.length === 0) return;

    const exerciseCount: Record<string, number> = {};
    for (const training of trainings)
      for (const exercise of training.exercises) {
        const exerciseName = exercise.name;
        exerciseCount[exerciseName] = (exerciseCount[exerciseName] || 0) + 1;
      }
    const formattedData = Object.entries(exerciseCount).map(
      ([exerciseName, count]) => {
        return {
          name: exerciseName,
          count,
        };
      }
    );
    setExerciseGroupData(formattedData);
  }, [trainings]);

  useEffect(() => {
    if (!trainings || trainings.length === 0) return;

    const exerciseData: Record<string, { date: string; oneRepMax: number }[]> =
      {};

    for (const training of trainings) {
      const trainingDate = training.date;
      for (const exercise of training.exercises) {
        const exerciseName = exercise.name;
        const bestOneRepMaxInTraining = exercise.series.reduce((max, serie) => {
          const kg = serie.kg || 1;
          const reps = serie.reps || 0;
          const oneRepMax = kg * (1 + reps / 30);

          return Math.max(max, oneRepMax);
        }, 0);

        if (!exerciseData[exerciseName]) {
          exerciseData[exerciseName] = [];
        }
        exerciseData[exerciseName].push({
          date: trainingDate,
          oneRepMax: parseFloat(bestOneRepMaxInTraining.toFixed(2)),
        });
      }
    }
    setOneRepetitionMax(exerciseData);

    if (Object.keys(exerciseData).length > 0) {
      setSelectedExercise(Object.keys(exerciseData)[0]);
    }
  }, [trainings]);

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }
  if (error) {
    return <p>Błąd: {String(error)}</p>;
  }
  if (!trainings) {
    return <p>Brak danych treningowych</p>;
  }
  const chartData = selectedExercise ? oneRepetitionMax[selectedExercise] : [];

  return (
    <>
      <div className={styles.statsElementBig}>
        <h2 className="text-center lg:text-xl mb-4">
          1 Rep max na przestrzeni czasu
        </h2>
        <div className="mb-4 flex justify-center">
          <label htmlFor="exercise-select" className="mr-2">
            Wybierz ćwiczenie:
          </label>
          <select
            className="mb-2"
            id="exercise-select"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            {Object.keys(oneRepetitionMax).map((exerciseName) => (
              <option key={exerciseName} value={exerciseName}>
                {exerciseName}
              </option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={400}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="oneRepMax"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.statsElementBig}>
        <h2 className="text-center lg:text-xl lg:mb-16">Ulubione Ćwiczenia</h2>
        <ResponsiveContainer>
          <PieChart margin={{ top: 20, right: 100, left: 100, bottom: 50 }}>
            <Pie
              data={exerciseGroupData}
              nameKey="name"
              dataKey="count"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              isAnimationActive={true}
              label={renderCustomLabel}
            >
              {exerciseGroupData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(count: any) => `${count} treningów`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
