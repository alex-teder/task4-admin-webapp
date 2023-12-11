export function isLoginFormValid({ email, password }) {
  return email && password;
}

export function isSignupFormValid({ username, email, password }) {
  return username && email && password;
}
