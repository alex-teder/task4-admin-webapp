const KEY = "user";

export function saveUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUser() {
  return JSON.parse(localStorage.getItem(KEY)) || {};
}
