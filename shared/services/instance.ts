import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
const appUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3000";
const baseURL = typeof window === "undefined" && apiUrl.startsWith("/")
  ? new URL(apiUrl, appUrl).toString()
  : apiUrl;

export const axiosInstance = axios.create({
  baseURL,
});
