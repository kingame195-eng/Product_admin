import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Login.module.css";

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    console.log("Submit login form:", values);
    setLoading(true);
    try {
      await login(values.email, values.password);
      // Delay slightly to let state update before navigation
      setTimeout(() => navigate("/dashboard"), 100);
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["login-page"]}>
      <Card className={styles["login-card"]}>
        <Title level={2} className={styles["login-title"]}>
          Admin Login
        </Title>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
