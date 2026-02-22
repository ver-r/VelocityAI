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

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  return await res.json();
};