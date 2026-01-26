import axios from "axios";

const removeTrailSlashes = (str: string): string => {
  let i = str.length;

  while (str[--i] === "/");

  return str.slice(0, i + 1);
};

let API_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = import.meta.env.VITE_API_KEY || "";

if (API_URL) {
  API_URL = removeTrailSlashes(API_URL);

  axios.defaults.baseURL = `${API_URL}/api`;
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.common["x-api-key"] = API_KEY;
  axios.defaults.withCredentials = true;

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      const isUnauthorized =
        err.response.data &&
        err.response.data.status === 401 &&
        err.response.data.message == "Unauthorized";

      if (isUnauthorized) {
        localStorage.clear();

        const excludedUrls = ["/", "/register"];

        // Skip redirecting on excluded urls
        if (excludedUrls.includes(window.location.pathname)) {
          return Promise.reject(err);
        }

        window.history.pushState(null, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }

      return Promise.reject(err);
    },
  );

  if (localStorage.getItem("authToken")) {
    const AUTH_TOKEN = `Bearer ${localStorage.getItem("authToken")}`;
    axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
  }
}
