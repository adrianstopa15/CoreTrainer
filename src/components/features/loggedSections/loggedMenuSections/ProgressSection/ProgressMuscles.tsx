import React, { useEffect, useState } from "react";
import { useWorkouts } from "../../../../../hooks/useWorkouts";
import styles from "./ProgressSection.module.css";
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
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

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
        fontSize={14}
        dominantBaseline="central"
        textAnchor={ex > cx ? "start" : "end"}
      >
        {name}
      </text>

      <text
        x={xMid}
        y={yMid}
        fill="#fff"
        fontSize={14}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {(percent * 100).toFixed(0) + "%"}
      </text>
    </g>
  );
};

export default function ProgressMuscles() {
  const { data: trainings, isLoading, error } = useWorkouts();
  const [muscleGroupData, setMuscleGroupData] = useState<any[]>([]);
  const [seriesAvgData, setSeriesAvgData] = useState<any[]>([]);

  useEffect(() => {
    if (!trainings || trainings.length === 0) return;

    const muscleCount: Record<string, number> = {};
    for (const training of trainings) {
      for (const exercise of training.exercises) {
        const muscle = exercise.bodyPart;
        muscleCount[muscle] = (muscleCount[muscle] || 0) + 1;
      }
    }

    const formattedData = Object.entries(muscleCount).map(([key, value]) => ({
      name: key,
      value: value as number,
    }));

    setMuscleGroupData(formattedData);
  }, [trainings]);

  useEffect(() => {
    if (!trainings || trainings.length === 0) return;
    const totalTrainings = trainings.length;

    const muscleSeriesCounter: Record<string, number> = {};
    for (const training of trainings) {
      for (const exercise of training.exercises) {
        const muscle = exercise.bodyPart;
        const totalReps = exercise.series.length;
        muscleSeriesCounter[muscle] =
          (muscleSeriesCounter[muscle] || 0) + totalReps;
      }
    }
    const avgReps = Object.entries(muscleSeriesCounter).map(
      ([muscleName, reps]) => {
        const avg = reps / totalTrainings;

        return {
          muscleName,
          średnia: avg.toFixed(2),
        };
      }
    );
    setSeriesAvgData(avgReps);
  }, [trainings]);

  if (isLoading) {
    return <p>Ładowanie...</p>;
  }
  if (error) {
    return <p>Błąd: {String(error)}</p>;
  }
  if (!trainings) {
    return <p>Brak danych</p>;
  }

  return (
    <div className={styles.activityContainer}>
      <div className={styles.statsGrid}>
        <div className={styles.statsElement}>
          <h2 className="text-center lg:text-xl mb-4">
            Średnia ilość serii na daną partie mięśniową
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={seriesAvgData}
              margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="muscleName"
                tick={{ fontSize: 11, fill: "#FFF" }}
                dy={15}
                angle={-20}
                interval={0}
              />
              <YAxis />
              <Tooltip
                formatter={(value: any) => `${value} serii na trening`}
              />

              <Bar dataKey="średnia" stackId="a" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.statsElement}>
          <h2 className="text-center lg:text-xl">Ulubiona partia mięsniowa</h2>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={muscleGroupData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={160}
                isAnimationActive={true}
                label={renderCustomLabel}
              >
                {muscleGroupData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value: any) => `${value} treningów`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
