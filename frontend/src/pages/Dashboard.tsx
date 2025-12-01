import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, ShoppingOutlined } from "@ant-design/icons";

const Dashboard: React.FC = () => (
  <div>
    <h1>Dashboard</h1>
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Total Users"
            value={1250}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Total Products"
            value={542}
            prefix={<ShoppingOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Total Orders"
            value={1893}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
    </Row>
    <Card style={{ marginTop: 24 }}>
      <h2>Welcome to Admin Dashboard</h2>
      <p>Use the menu on the left to navigate through the application.</p>
    </Card>
  </div>
);

export { Dashboard };
