import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
    candidate_id: process.env.NEXT_PUBLIC_CANDIDATE_ID,
  },
});
