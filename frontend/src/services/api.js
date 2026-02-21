export const fetchWithAuth = async (url, options = {}) => {
  const token = await window.Clerk.session.getToken();

  const res = await fetch(`http://localhost:5000${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options.body,
  });

  return await res.json();
};