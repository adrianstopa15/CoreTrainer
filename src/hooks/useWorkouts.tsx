import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWorkouts, submitWorkout } from "../api/workouts";
import type { Training } from "../api/workouts";

export function useWorkouts() {
  return useQuery<Training[]>({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
    initialData: [],
  });
}

export function useSubmitWorkout() {
  return useMutation(submitWorkout, {
    onSuccess: (data) => {
      console.log("trening zapisany", data);
    },
    onError: (error) => {
      console.error("Błąd podczas zapisywania treningu", error);
    },
  });
}
