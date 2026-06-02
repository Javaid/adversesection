import api from "./api";

export const searchDoctors = async (text) => {
  const { data } = await api.get("/v1/doctors/search", {
    params: { q: text },
  });
  return data;
};