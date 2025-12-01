import React from "react";
import { Card, Row, Col, Button, Space, Alert } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";

/**
 * User Dashboard Page
 * Chỉ cho user (không phải admin) vào
 * Hiển thị thông tin user và không cho vào admin area
 */
export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <Row gutter={24}>
        {/* Header */}
        <Col xs={24}>
          <Card className={styles.header}>
            <div className={styles.headerContent}>
              <div>
                <h1>Welcome, {user?.fullName}! 👋</h1>
                <p>
                  Role: <strong>{user?.role}</strong>
                </p>
              </div>
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Card>
        </Col>

        {/* Warning Alert */}
        <Col xs={24}>
          <Alert
            message="Access Restricted"
            description="You don't have permission to access the admin panel. Only admin users can access admin features."
            type="warning"
            showIcon
            closable
          />
        </Col>

        {/* User Info */}
        <Col xs={24} sm={12}>
          <Card title="Profile Information">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <strong>Email:</strong>
                <p>{user?.email}</p>
              </div>
              <div>
                <strong>Full Name:</strong>
                <p>{user?.fullName}</p>
              </div>
              <div>
                <strong>Role:</strong>
                <p className={styles.role}>
                  {user?.role === "admin" && "👨‍💼 Administrator"}
                  {user?.role === "manager" && "👔 Manager"}
                  {user?.role === "staff" && "👤 Staff"}
                  {user?.role === "user" && "👥 Regular User"}
                </p>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Permissions Info */}
        <Col xs={24} sm={12}>
          <Card title="Your Permissions">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <p>✅ View your profile</p>
                <p>✅ View public products</p>
                <p>✅ Place orders</p>
              </div>
              <div className={styles.divider}>
                <p>❌ Access admin panel</p>
                <p>❌ Manage products</p>
                <p>❌ View reports</p>
                <p>❌ Manage users</p>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Available Features */}
        <Col xs={24}>
          <Card title="Available Features">
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <div className={styles.feature}>
                  <h3>📦 Browse Products</h3>
                  <p>View all available products and details</p>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className={styles.feature}>
                  <h3>🛒 Shopping Cart</h3>
                  <p>Add items to your cart and checkout</p>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className={styles.feature}>
                  <h3>📋 Order History</h3>
                  <p>View your past orders and status</p>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Upgrade Info */}
        <Col xs={24}>
          <Alert
            message="Want More Features?"
            description="Contact administrator to upgrade your account role"
            type="info"
            showIcon
          />
        </Col>
      </Row>
    </div>
  );
};
