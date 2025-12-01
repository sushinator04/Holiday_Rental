import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isLogged, setIsLogged] = useState(false);

  const checkAuthStatus = () => {
    const email = localStorage.getItem("login_email");
    const password = localStorage.getItem("login_password");
    setIsLogged(Boolean(email && password));
  };

  useEffect(() => {
    checkAuthStatus();
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("loggedIn", handleStorageChange);
    return () => window.removeEventListener("loggedIn", handleStorageChange);
  }, []);

  return { isLogged };
};
