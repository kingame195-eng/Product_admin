import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ProtectedRoute.module.css";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <Spin size="large" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
