import axios from "axios";

const API_URL = "http://localhost:5000/api";

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

export const fetchFriends = async (): Promise<FriendRequest[]> => {
  const response = await axios.get(`${API_URL}/getFriendRequests`, {
    withCredentials: true,
  });
  return response.data || [];
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
