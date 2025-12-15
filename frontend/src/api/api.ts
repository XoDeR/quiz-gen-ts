import axios, { AxiosError, type AxiosRequestConfig } from "axios";

// Uses URL of local server API
const API_BASE_URL = "http://localhost:5002/api";

export const apiPublic = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // cookies are still neaded for login and register
});

export const apiProtected = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // cookies
});

// Special client for refresh: cookies, but NO interceptor
const apiRefresh = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const apiRetry = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  // no interceptors attached
});

// to block concurrent requests to /auth/refresh
let refreshAttempted = false;

apiProtected.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    console.log("[Interceptor] error on:", originalRequest.url);

    // Skip refresh logic for public endpoints
    const publicPaths = ["/auth/login", "/auth/register", "/auth/refresh"];
    if (originalRequest?.url && publicPaths.some(p => originalRequest.url!.includes(p))) {
      console.log("[Interceptor] skipping public path:", originalRequest.url);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !refreshAttempted) {
      refreshAttempted = true;
      console.log("[Interceptor] 401 detected on:", originalRequest.url);

      try {
        console.log("[Interceptor] calling /auth/refresh…");
        // refresh call must include cookies
        await apiRefresh.post("/auth/refresh", {});
        console.log("[Interceptor] refresh succeeded, retrying:", originalRequest.url);
        // retry original request once
        return apiRetry.request(originalRequest);
      } catch (refreshError) {
        console.log("[Interceptor] refresh failed");
        return Promise.reject(refreshError);
      } finally {
        refreshAttempted = false;
      }
    }

    return Promise.reject(error);
  }
);

export const api = {
  public: apiPublic,
  protected: apiProtected,
};