import axios from "axios";

const API_URL = "http://localhost:5000/api";

export type Series = {
  kg: number | string;
  reps: number | string;
};
export type Exercise = {
  name: string;
  bodyPart: string;
  bodySection: string;
  img: string | null;
  series: Series[];
};
export type Training = {
  userId: string;
  name: string;
  date: string;
  trainingTime: number;
  exercises: Exercise[];
};

export const fetchWorkouts = async (): Promise<Training[]> => {
  const response = await axios.get(`${API_URL}/getWorkouts`, {
    withCredentials: true,
  });
  return response.data.userWorkouts || [];
};

export interface SubmitWorkoutData {
  name: string;
  date: string;
  trainingTime: number;
  exercises: Exercise[];
}
export interface SubmitWorkoutResponse {
  message: string;
  newWorkout?: any;
}

export const submitWorkout = async (
  workoutData: SubmitWorkoutData
): Promise<SubmitWorkoutResponse> => {
  const response = await axios.post(`${API_URL}/submitWorkout`, workoutData, {
    withCredentials: true,
  });
  return response.data;
};
