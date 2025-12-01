import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Popconfirm,
  message,
  Image,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../../api/product.api";
import type { Product, ProductFilter } from "../../api/product.api";
import styles from "./ProductList.module.css";

// Helper function
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const { Search } = Input;
const { Option } = Select;

export const ProductList: React.FC = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<ProductFilter>({
    page: 1,
    limit: 10,
    search: "",
    status: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch products
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", filter],
    queryFn: () => productApi.getAll(filter),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      message.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      message.error("Failed to delete product");
    },
  });

  const columns = [
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 80,
      render: (thumbnail: string) => (
        <Image
          width={50}
          height={50}
          src={thumbnail || "/placeholder.png"}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 120,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number, record: Product) => (
        <div>
          <div>{formatCurrency(price)}</div>
          {record.salePrice && (
            <div className={styles.salePrice}>
              Sale: {formatCurrency(record.salePrice)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Stock",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (quantity: number) => (
        <Tag color={quantity > 10 ? "green" : quantity > 0 ? "orange" : "red"}>
          {quantity}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: "published" | "draft" | "archived") => {
        const colors: Record<"published" | "draft" | "archived", string> = {
          published: "green",
          draft: "orange",
          archived: "red",
        };
        if (!status) return null;
        return (
          <Tag color={colors[status] || "default"}>{status.toUpperCase()}</Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right" as const,
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete product?"
            description="Are you sure you want to delete this product?"
            onConfirm={() => deleteMutation.mutate(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (id: string) => {
    // Navigate to edit page
    console.log("Edit product:", id);
  };

  const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
    setFilter({
      ...filter,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: sorter.field || "createdAt",
      sortOrder: sorter.order === "ascend" ? "asc" : "desc",
    });
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Space>
            <Search
              placeholder="Search products..."
              allowClear
              style={{ width: 300 }}
              onSearch={(value) =>
                setFilter({ ...filter, search: value, page: 1 })
              }
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 150 }}
              onChange={(value) =>
                setFilter({ ...filter, status: value, page: 1 })
              }
            >
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
              <Option value="archived">Archived</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Product
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="_id"
        loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: data?.data.pagination?.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};
