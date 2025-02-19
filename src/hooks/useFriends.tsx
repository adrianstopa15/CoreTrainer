import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchFriends,
  fetchFriendsRequests,
  fetchUserFriends,
  FriendRequest,
  sendFriendRequest,
} from "../api/friends";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface FriendRequestDoc {
  _id: string;
  sender: {
    _id: string;
    login: string;
    name: string;
    surname: string;
  };
  recipient: {
    _id: string;
    login: string;
    name: string;
    surname: string;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export function useMyRequests(status: string = "pending") {
  return useQuery<FriendRequestDoc[]>({
    queryKey: ["myRequests", status],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/myrequests?status=${status}`, {
        withCredentials: true,
      });
      return res.data;
    },
    initialData: [],
  });
}

export function useFriendsRequests() {
  return useQuery<FriendRequest[]>({
    queryKey: ["friendsRequests"],
    queryFn: fetchFriendsRequests,
    initialData: [],
  });
}
export function useFriendsList() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
    initialData: [],
  });
}

export function useUserFriendsList(userId: string) {
  return useQuery({
    queryKey: ["friends", userId] as const,
    queryFn: fetchUserFriends,
    enabled: !!userId,
    initialData: [],
  });
}

export function useSendFriendRequest() {
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data) => {
      console.log("zaproszenie wysłane", data);
    },
    onError: (error) => {
      console.error("Błąd podczas wysyłania zaproszenia", error);
    },
  });
}
