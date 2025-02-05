import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchFriends,
  fetchFriendsRequests,
  FriendRequest,
  sendFriendRequest,
} from "../api/friends";

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
