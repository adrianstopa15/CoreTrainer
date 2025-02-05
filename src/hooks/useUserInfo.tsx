import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUserInfo, fetchUserInfo, UserDetails } from "../api/user";

export function useCurrentUserInfo() {
  return useQuery<UserDetails>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUserInfo,
  });
}

export function useUserInfo(userId: string) {
  return useQuery<UserDetails, Error, UserDetails, readonly [string, string]>({
    queryKey: ["user", userId] as const,
    queryFn: fetchUserInfo,
    enabled: !!userId,
  });
}
