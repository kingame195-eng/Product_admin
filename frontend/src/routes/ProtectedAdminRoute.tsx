import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spin } from "antd";
import styles from "./ProtectedRoute.module.css";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * Chỉ cho admin users vào
 * - Nếu không login → redirect /login
 * - Nếu login nhưng không phải admin → redirect /user
 * - Nếu admin → show page
 */
export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  // Nếu đang load
  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // Nếu chưa login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không phải admin role
  if (user.role !== "admin") {
    return <Navigate to="/user" replace />;
  }

  // Nếu là admin → show page
  return <>{children}</>;
};
