import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

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

export const createTrainerRelation = async (trainerId: string) => {
  const response = await axios.post(
    `${API_URL}/trainerRelations`,
    { trainerId },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const fetchTrainerRelations = async () => {
  const response = await axios.get(`${API_URL}/getTrainerRelations`, {
    withCredentials: true,
  });
  return response.data;
};

export const fetchTrainerRequests = async () => {
  const response = await axios.get(`${API_URL}/trainerRelationsRequests`, {
    withCredentials: true,
  });
  return response.data;
};

export const fetchTrainerList = async () => {
  const response = await axios.get(`${API_URL}/getTrainers`, {
    withCredentials: true,
  });
  return response.data;
};
