import axios from "axios";
import { API_URL } from "../config/api";

export interface User {
  _id: string;
  login: string;
  name: string;
  surname: string;
  email: string;
  firstLogin: boolean;
}

export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData {
  email: string;
  login: string;
  name: string;
  surname: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
}

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/api/login`, loginData, {
    withCredentials: true,
  });

  return response.data;
};

export const registerUser = async (
  registerData: RegisterData
): Promise<RegisterResponse> => {
  const response = await axios.post(`${API_URL}/api/register`, registerData);
  return response.data;
};
