import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../config/api";

export interface Sender {
  _id?: string;
  login: string;
  name: string;
  surname: string;
}

export interface FriendRequest {
  _id: string;
  sender: Sender;
  recipient: string;
  status: string;
  createdAt: string;
}

export const fetchFriendsRequests = async (): Promise<FriendRequest[]> => {
  const response = await axios.get(`${API_URL}/api/getFriendRequests`, {
    withCredentials: true,
  });
  return response.data || [];
};

export const fetchFriends = async () => {
  const response = await axios.get(`${API_URL}/api/getFriends`, {
    withCredentials: true,
  });
  return response.data.friendsList;
};

export const fetchUserFriends = async (
  context: QueryFunctionContext<readonly [string, string]>
) => {
  const [, userId] = context.queryKey;
  const response = await axios.get(`${API_URL}/getUserFriends/${userId}`);
  return response.data.friendsList;
};

export const sendFriendRequest = async (recipientId: string) => {
  const response = await axios.post(
    `${API_URL}/friendRequests`,
    { recipientId },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};
