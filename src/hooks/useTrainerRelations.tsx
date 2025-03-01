import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  createTrainerRelation,
  fetchTraineeList,
  fetchTrainerList,
  fetchTrainerRelations,
  fetchTrainerRequests,
} from "../api/trainerRelations";
import Swal from "sweetalert2";

const API_URL = "http://localhost:5000/api";

export interface TrainerRelationDoc {
  _id: string;
  trainerId: {
    _id: string;
    login: string;
    name: string;
    surname: string;
    roles: string[];
  };
  traineeId: {
    _id: string;
    login: string;
    name: string;
    surname: string;
    roles: string[];
  };
  status: "pending" | "active" | "expired" | "canceled" | "rejected";
  createdAt: string;
}

// export function useMyTrainerRelations() {
//   return useQuery<TrainerRelationDoc[]>({
//     queryKey: ["myTrainerRelations", "pending"],
//     queryFn: async () => {
//       const res = await axios.get(`${API_URL}/myTrainerRelations`, {
//         withCredentials: true,
//       });
//       return res.data;
//     },
//     initialData: [],
//   });
// }
export function useFetchTrainerPendingRelations() {
  return useQuery<TrainerRelationDoc[]>({
    queryKey: ["relations", "pending"],
    queryFn: fetchTrainerRelations,
    initialData: [],
  });
}

export function useFetchTrainerRequests() {
  return useQuery<TrainerRelationDoc[]>({
    queryKey: ["trainerRequests", "pending"],
    queryFn: fetchTrainerRequests,
    initialData: [],
  });
}
export function useFetchTrainerList() {
  return useQuery({
    queryKey: ["trainerList"],
    queryFn: fetchTrainerList,
    initialData: [],
  });
}

export function useFetchTraineeList() {
  return useQuery({
    queryKey: ["traineeList"],
    queryFn: fetchTraineeList,
    initialData: [],
  });
}
// interface CreateTrainerRelationPayload {
//   trainerId: string;
//   traineeId: string;
//   months?: number;
// }

export function useCreateTrainerRelation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrainerRelation,
    onSuccess: (data) => {
      console.log("Prośba wysłana", data);
      Swal.fire({
        title: "Zaproszenie wysłane!",
        text: "Prośba o relację trenerską została wysłana.",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        position: "top",
      });
      queryClient.invalidateQueries({
        queryKey: ["trainerRequests", "pending"],
      });
      queryClient.invalidateQueries({ queryKey: ["relations", "pending"] });
    },
    onError: (error) => {
      console.error("Błąd podczas wysyłania zaproszenia", error);
      Swal.fire({
        title: "Błąd!",
        text: "Nie udało się wysłać zaproszenia.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        position: "top",
      });
    },
  });
}
