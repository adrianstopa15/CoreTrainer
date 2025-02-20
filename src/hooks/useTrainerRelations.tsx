import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  createTrainerRelation,
  fetchTrainerRelations,
} from "../api/trainerRelations";

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

// interface CreateTrainerRelationPayload {
//   trainerId: string;
//   traineeId: string;
//   months?: number;
// }

export function useCreateTrainerRelation() {
  return useMutation({
    mutationFn: createTrainerRelation,
    onSuccess: (data) => {
      console.log("prośba wysłana", data);
    },
    onError: (error) => {
      console.error("Błąd podczas wysyłania zaproszenia", error);
    },
  });
}
