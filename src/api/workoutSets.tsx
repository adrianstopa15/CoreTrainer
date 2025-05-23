import axios from "axios";
import { Exercise } from "../components/features/loggedSections/sharedSections/LogWorkout/types";

const API_URL = "http://localhost:5000/api";

export interface Series {
  kg: number | string;
  reps: number | string;
}

export interface WorkoutSetData {
  _id?: string;
  userId?: string;
  isGlobal?: boolean;
  usersWithAccess?: string[];
  name: string;
  description: string;
  exercises: Exercise[];
}
export interface WorkoutSetResponse {
  message: string;
  newSet?: any;
}

export async function submitWorkoutSet(
  data: WorkoutSetData
): Promise<WorkoutSetResponse> {
  const response = await axios.post(`${API_URL}/submitWorkoutSet`, data, {
    withCredentials: true,
  });
  return response.data;
}

export const fetchWorkoutSets = async (): Promise<WorkoutSetData[]> => {
  const response = await axios.get(`${API_URL}/getWorkoutSets`, {
    withCredentials: true,
  });
  return response.data;
};
