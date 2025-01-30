import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchWorkoutSets,
  submitWorkoutSet,
  WorkoutSetData,
  WorkoutSetResponse,
} from "../api/workoutSets";

export function useSubmitWorkoutSet() {
  return useMutation<WorkoutSetResponse, Error, WorkoutSetData>({
    mutationFn: submitWorkoutSet,
    onSuccess: (data) => {
      console.log("Zapisano zestaw:", data);
    },
    onError: (error) => {
      console.error("Nie udało się zapisać zestawu", error);
    },
  });
}

export function useWorkoutSets() {
  return useQuery<WorkoutSetData[]>({
    queryKey: ["workoutSets"],
    queryFn: fetchWorkoutSets,
    initialData: [],
  });
}
