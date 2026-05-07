import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Always include cookies for cross-origin auth
export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

const GUEST_KEY = "memento_guest_session_id";

export const getGuestSessionId = () => {
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = `guest_${Math.random().toString(36).slice(2, 14)}_${Date.now().toString(36)}`;
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
};

export const clearGuestSessionId = () => {
  localStorage.removeItem(GUEST_KEY);
};
