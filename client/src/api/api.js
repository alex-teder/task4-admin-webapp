const BASE_URL = "https://admin-webapp-nef5.onrender.com/";

const USERS_ENDPOINT = BASE_URL + "users";
const AUTH_ENDPOINT = BASE_URL + "auth";

async function genericFetch(url, options) {
  let data = null;
  let error = null;

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      data = await response.json();
    } else {
      error = await response.text();
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
    return { error: err.message };
  }

  return { data, error };
}

export async function apiWakeUp() {
  const controller = new AbortController();
  fetch(BASE_URL, { signal: controller.signal });
  return { abort: controller.abort };
}

export async function apiGetUsers(token) {
  const options = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return await genericFetch(USERS_ENDPOINT, options);
}

export async function apiBlockUsers(token, ids) {
  const options = {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ids, isBlocked: true }),
  };
  return await genericFetch(USERS_ENDPOINT, options);
}

export async function apiUnblockUsers(token, ids) {
  const options = {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ids, isBlocked: false }),
  };
  return await genericFetch(USERS_ENDPOINT, options);
}

export async function apiDeleteUsers(token, ids) {
  const options = {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  };
  return await genericFetch(USERS_ENDPOINT, options);
}

export async function apiLogIn(email, password) {
  const options = {
    method: "PUT",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  };
  return await genericFetch(AUTH_ENDPOINT, options);
}

export async function apiSignUp(username, email, password) {
  const options = {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
    headers: { "Content-Type": "application/json" },
  };
  return await genericFetch(AUTH_ENDPOINT, options);
}
