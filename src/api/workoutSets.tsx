import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface Series {
  kg: number | string;
  reps: number | string;
}

export interface Exercise {
  _id?: string;
  userId: string;
  usersWithAccess: string[];
  isGlobal: boolean;
  name: string;
  bodyPart: string;
  bodySection: string;
  img: string | null;
  series: Series[];
}

export interface WorkoutSetData {
  _id?: string;
  userId: string;
  isGlobal: boolean;
  usersWithAccess: string[];
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
