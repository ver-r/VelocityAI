export const fetchWithAuth = async (url, options = {}) => {
  const token = await window.Clerk?.session?.getToken();

  const res = await fetch(`http://localhost:5000${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
};