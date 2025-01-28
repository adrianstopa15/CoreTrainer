import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface UserDetails {
  email: string;
  login: string;
  name: string;
  surname: string;
  userFeatures: {
    roles: string[];
    weight: number;
    height: number;
    goal: string;
    age: number;
    experience: string;
    subroles: string;
  };
}

export const fetchUserInfo = async (): Promise<UserDetails> => {
  const response = await axios.get(`${API_URL}/getCurrentUser`, {
    withCredentials: true,
  });
  return response.data.user || [];
};
