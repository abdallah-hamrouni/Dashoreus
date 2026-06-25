
// src/api/authApi.js

const AUTH_API_URL = "http://localhost:3000/api/auth";

async function handleResponse(res) {
  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error("Réponse invalide reçue du serveur");
  }

  if (!res.ok) {
    throw new Error(
      data.message || data.error || "Erreur serveur"
    );
  }

  return data;
}

export async function signupPharmacien(payload) {
  const res = await fetch(`${AUTH_API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

