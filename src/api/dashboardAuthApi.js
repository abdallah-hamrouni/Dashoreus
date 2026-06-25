
const DASHBOARD_API_URL = "http://localhost:3000/api/dashboard-auth";
async function handleResponse(res) {
  let data = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || `Erreur serveur ${res.status}`);
  }

  return data;
}

export async function loginDashboard(payload) {
  const res = await fetch(`${DASHBOARD_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function signupResidence(payload) {
  const res = await fetch(`${DASHBOARD_API_URL}/signup-residence`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function forgotPasswordDashboard(email) {
  const res = await fetch(`${DASHBOARD_API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse(res);
}