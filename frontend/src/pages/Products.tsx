import React from "react";
import { Card, Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const Products: React.FC = () => {
  const columns = [
    {
      title: "Product ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space>
          <Button type="primary" size="small" icon={<EditOutlined />}>
            Edit
          </Button>
          <Button danger size="small" icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      name: "Product 1",
      price: 99.99,
      stock: 50,
      key: "1",
    },
    {
      id: 2,
      name: "Product 2",
      price: 149.99,
      stock: 30,
      key: "2",
    },
  ];

  return (
    <div>
      <Card
        title="Products"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Add Product
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export { Products };
