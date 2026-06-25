export function saveDashboardSession(data) {
  localStorage.setItem("dashboard_token", data.token);
  localStorage.setItem("dashboard_user", JSON.stringify(data.user));

  localStorage.setItem(
    "dashboard_result",
    JSON.stringify({
      user: data.user,
      residences: data.residences || [],
      pharmacies: data.pharmacies || [],
    })
  );
}

export function getDashboardSession() {
  const token = localStorage.getItem("dashboard_token");
  const user = localStorage.getItem("dashboard_user");
  const result = localStorage.getItem("dashboard_result");

  return {
    token,
    user: user ? JSON.parse(user) : null,
    result: result ? JSON.parse(result) : null,
  };
}

export function clearDashboardSession() {
  localStorage.removeItem("dashboard_token");
  localStorage.removeItem("dashboard_user");
  localStorage.removeItem("dashboard_result");
}

export function saveDashboardProfile({
  address = "",
  postalCode = "",
  city = "",
  ville = "",
}) {
  localStorage.setItem(
    "dashboard_profile",
    JSON.stringify({
      address: String(address || "").trim(),
      postalCode: String(postalCode || "").trim(),
      city: String(city || ville || "").trim(),
    })
  );
}

export function getDashboardProfile() {
  const saved = localStorage.getItem("dashboard_profile");

  if (!saved) {
    return {
      address: "",
      postalCode: "",
      city: "",
    };
  }

  try {
    const parsed = JSON.parse(saved);

    return {
      address: String(parsed?.address || "").trim(),
      postalCode: String(parsed?.postalCode || "").trim(),
      city: String(parsed?.city || parsed?.ville || "").trim(),
    };
  } catch {
    return {
      address: "",
      postalCode: "",
      city: "",
    };
  }
}

export function savePharmacieActivation({ codepharm, nompharm }) {
  localStorage.setItem("code_societe", codepharm);
  localStorage.setItem("nom_pharmacie", nompharm);
}

export function getPharmacieActivation() {
  return {
    code: localStorage.getItem("code_societe"),
    nom: localStorage.getItem("nom_pharmacie"),
  };
}

export function clearPharmacieActivation() {
  localStorage.removeItem("code_societe");
  localStorage.removeItem("nom_pharmacie");
}