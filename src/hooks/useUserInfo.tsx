import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo, UserDetails } from "../api/user";

export function useUserInfo() {
  return useQuery<UserDetails>({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
  });
}
