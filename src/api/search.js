export const searchDoctors = async (text) => {
  const res = await fetch(`/api/doctors/search?q=${encodeURIComponent(text)}`);
  const data = await res.json();
  return data;
};