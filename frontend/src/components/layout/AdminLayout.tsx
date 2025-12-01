import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Button, Layout, Menu } from "antd";
import {
  LogoutOutlined,
  DashboardOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./AdminLayout.module.css";

const { Header, Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>Admin Dashboard</div>
        <div className={styles.headerRight}>
          <span>{user?.fullName || "User"}</span>
          <Button
            type="primary"
            danger
            onClick={handleLogout}
            icon={<LogoutOutlined />}
          >
            Logout
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider>
          <Menu theme="dark" mode="inline">
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="products" icon={<ShoppingOutlined />}>
              <Link to="/products">Products</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export { AdminLayout };
