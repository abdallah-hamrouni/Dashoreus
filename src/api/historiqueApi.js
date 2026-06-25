

const API_URL = "http://localhost:3000/api/historique";

async function handleResponse(res) {
  let data = null;

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || "Erreur serveur");
  }

  return data;
}

function cleanToken(token) {
  if (!token) return null;

  return token.startsWith("Bearer ")
    ? token.replace("Bearer ", "")
    : token;
}

export async function getHistoriqueDashboard(token, role) {
  const tokenValue = cleanToken(token);

  if (!tokenValue) {
    throw new Error("Token dashboard introuvable");
  }

  const isResidence = role === "RESIDENCE";

  const url = isResidence ? `${API_URL}/residence` : API_URL;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenValue}`,
    },
  });

  return handleResponse(res);
}

export async function getHistoriquePdfDetails(id, token, role) {
  const tokenValue = cleanToken(token);

  if (!tokenValue) {
    throw new Error("Token dashboard introuvable");
  }

  const isResidence = role === "RESIDENCE";

  const url = isResidence
    ? `${API_URL}/residence/${id}/pdf`
    : `${API_URL}/${id}/pdf`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenValue}`,
    },
  });

  return handleResponse(res);
}