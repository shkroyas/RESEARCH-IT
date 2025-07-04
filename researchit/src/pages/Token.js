import { useState, useEffect } from "react";

export default function useAuthTokens(email, password) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const obtainTokens = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to obtain token");
      }

      const data = await response.json();
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
    } catch (error) {
      console.error("Error obtaining tokens:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        console.warn("No refresh token available");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      setAccessToken(data.access);
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  useEffect(() => {
    if (email && password) {
      obtainTokens();
    }
  }, [email, password]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken]);

  return { accessToken, refreshToken };
}