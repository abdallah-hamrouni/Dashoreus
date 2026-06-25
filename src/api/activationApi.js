

const ACTIVATION_API_URL = "http://localhost:3000/api/activation";

async function handleResponse(res) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Erreur serveur");
  }

  return data;
}

export async function checkActivationEmail(email, typeCompte) {
  const res = await fetch(`${ACTIVATION_API_URL}/check-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      typeCompte,
    }),
  });

  return handleResponse(res);
}