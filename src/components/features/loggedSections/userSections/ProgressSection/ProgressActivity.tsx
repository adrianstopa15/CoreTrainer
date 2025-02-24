import React, { PureComponent, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import styles from "./ProgressSection.module.css";
import { useWorkouts } from "../../../../../hooks/useWorkouts";
export default function ProgressActivity() {
  const { data: trainings, isLoading, error } = useWorkouts();
  const [monthlyTrainingData, setMonthlyTrainingData] = useState<any[]>([]);
  const [monthlyAverageTrainingTime, setMonthlyAverageTrainingTime] = useState<
    any[]
  >([]);

  useEffect(() => {
    if (!trainings || trainings.length === 0) return;

    const monthlyTrainingCount: Record<string, number> = {};

    const now = new Date();
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyTrainingCount[monthKey] = 0;
      return monthKey;
    });

    for (const training of trainings) {
      const trainingDate = new Date(training.date);
      const monthKey = `${trainingDate.getFullYear()}-${String(trainingDate.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyTrainingCount[monthKey] !== undefined) {
        monthlyTrainingCount[monthKey] += 1;
      }
    }

    const formattedMonthlyData = last12Months.reverse().map((monthKey) => {
      const [year, month] = monthKey.split("-");
      const monthName = new Date(
        Number(year),
        Number(month) - 1
      ).toLocaleString("default", { month: "long" });
      return {
        month: `${monthName} ${year}`,
        trainings: monthlyTrainingCount[monthKey],
      };
    });

    setMonthlyTrainingData(formattedMonthlyData);
  }, [trainings]);

  useEffect(() => {
    if (!trainings || trainings.length === 0) return;

    const monthlyTrainingTime: Record<
      string,
      { totalMinutes: number; count: number }
    > = {};

    const now = new Date();
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyTrainingTime[monthKey] = { totalMinutes: 0, count: 0 };
      return monthKey;
    });

    for (const training of trainings) {
      const trainingDate = new Date(training.date);
      const monthKey = `${trainingDate.getFullYear()}-${String(trainingDate.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyTrainingTime[monthKey] !== undefined) {
        monthlyTrainingTime[monthKey].totalMinutes += training.trainingTime;
        monthlyTrainingTime[monthKey].count += 1;
      }
    }

    const formattedData = last12Months.reverse().map((monthKey) => {
      const [year, month] = monthKey.split("-");
      const monthName = new Date(
        Number(year),
        Number(month) - 1
      ).toLocaleString("default", { month: "long" });
      const avgTime =
        monthlyTrainingTime[monthKey].count > 0
          ? (
              monthlyTrainingTime[monthKey].totalMinutes /
              monthlyTrainingTime[monthKey].count
            ).toFixed(2)
          : 0;

      return {
        month: `${monthName} ${year}`,
        avgTrainingTime: Number(avgTime),
      };
    });

    setMonthlyAverageTrainingTime(formattedData);
  }, [trainings]);

  return (
    <>
      <div className={styles.statsElement}>
        <h2 className="text-center lg:text-xl mb-4">
          Liczba treningów w danym miesiącu
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyTrainingData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              interval={0}
              dataKey="month"
              tick={{
                fontSize: "clamp(0.313rem, 0.089rem + 0.595vw, 0.625rem)",
                fill: "#FFF",
              }}
              dy={15}
              angle={-25}
            />
            <YAxis />
            <Tooltip formatter={(value: any) => `${value} treningów`} />
            <Bar dataKey="trainings" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.statsElementBig}>
        <h2 className="text-center lg:text-xl mb-4">
          Średni czas trwania treningu w ciągu ostatnich miesięcy
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyAverageTrainingTime}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              interval={0}
              dataKey="month"
              tick={{
                fontSize: "clamp(0.313rem, 0rem + 0.833vw, 0.75rem)",
                fill: "#FFF",
              }}
              dy={15}
              angle={-20}
            />
            <YAxis />
            <Tooltip formatter={(value: any) => `${value} minut`} />
            <Area
              type="monotone"
              dataKey="avgTrainingTime"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
