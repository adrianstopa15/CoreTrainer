import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFriends,
  fetchFriendsRequests,
  fetchUserFriends,
  FriendRequest,
  sendFriendRequest,
} from "../api/friends";
import axios from "axios";
import Swal from "sweetalert2";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data) => {
      console.log("zaproszenie wysłane", data);
      Swal.fire({
        title: "Zaproszenie zostało wysłane.",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        position: "top",
      });
      queryClient.invalidateQueries({ queryKey: ["myRequests", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["friendsRequests"] });
    },
    onError: (error) => {
      console.error("Błąd podczas wysyłania zaproszenia", error);
      Swal.fire({
        title: "Błąd!",
        text: "Nie udało się wysłać zaproszenia do znajomych.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        position: "top",
      });
    },
  });
}
