import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    // Check token expiration
    if (
      payload.exp &&
      payload.exp * 1000 < Date.now()
    ) {
      localStorage.removeItem("accessToken");

      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }

    return children;

  } catch (error) {

    console.error(
      "ProtectedRoute token error:",
      error
    );

    localStorage.removeItem("accessToken");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
}

export default ProtectedRoute;