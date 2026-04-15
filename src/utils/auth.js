import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded?.exp) return false;
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  if (isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }

  return token;
};

export const setAuthSession = (token) => {
  if (!token) return;

  localStorage.setItem(TOKEN_KEY, token);

  try {
    const decoded = jwtDecode(token);
    const user = {
      id: decoded?.id,
      username: decoded?.username,
      role: decoded?.role || "user",
      exp: decoded?.exp,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    localStorage.removeItem(USER_KEY);
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  const rawUser = localStorage.getItem(USER_KEY);
  if (rawUser) {
    try {
      return JSON.parse(rawUser);
    } catch {
      localStorage.removeItem(USER_KEY);
    }
  }

  try {
    const decoded = jwtDecode(token);
    const user = {
      id: decoded?.id,
      username: decoded?.username,
      role: decoded?.role || "user",
      exp: decoded?.exp,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    clearAuthSession();
    return null;
  }
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const getRole = () => {
  const user = getUser();
  return user?.role || null;
};
