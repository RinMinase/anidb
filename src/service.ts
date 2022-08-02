import axios from "axios";

const removeTrailSlashes = (str: string): string => {
  let i = str.length;

  while (str[--i] === '/');

  return str.slice(0, i+1);
}

let API_URL = import.meta.env.VITE_API_URL || "";

if (API_URL) {
  API_URL = removeTrailSlashes(API_URL);

  axios.defaults.baseURL = `${API_URL}/api`;
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;
}

