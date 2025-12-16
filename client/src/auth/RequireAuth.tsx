import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { JSX } from "react";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
}
