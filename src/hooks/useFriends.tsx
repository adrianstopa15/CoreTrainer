import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchFriends, FriendRequest, sendFriendRequest } from "../api/friends";

export function useFriends() {
  return useQuery<FriendRequest[]>({
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
