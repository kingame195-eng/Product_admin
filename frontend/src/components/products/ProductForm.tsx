import React, { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Space,
  Card,
  Row,
  Col,
  message,
} from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import styles from "./ProductForm.module.css";
import { productApi } from "../../api/product.api";
import type { Product } from "../../api/product.api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import TextArea from "antd/es/input/TextArea";

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product, form]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Product>) =>
      product ? productApi.update(product._id, data) : productApi.create(data),
    onSuccess: () => {
      message.success(
        `Product ${product ? "updated" : "created"} successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.resetFields();
      onSuccess?.();
    },
    onError: () => {
      message.error("Failed to save product");
    },
  });

  const handleSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: "draft",
        quantity: 0,
        isFeatured: false,
      }}
    >
      <Row gutter={24}>
        <Col span={16}>
          <Card title="Product Information" style={{ marginBottom: 16 }}>
            <Form.Item
              label="Product Name"
              name="name"
              rules={[{ required: true, message: "Please enter product name" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="SKU"
                  name="sku"
                  rules={[{ required: true, message: "Please enter SKU" }]}
                >
                  <Input placeholder="e.g., PROD-001" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Brand" name="brand">
                  <Input placeholder="Enter brand name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Short Description" name="shortDescription">
              <TextArea rows={2} placeholder="Brief description" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea rows={6} placeholder="Detailed description" />
            </Form.Item>
          </Card>

          <Card title="Pricing & Inventory">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: "Please enter price" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) => `$ ${value}`}
                    parser={(value) =>
                      value
                        ? Number(String(value).replace(/[$\s,]/g, ""))
                        : (0 as any)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Sale Price" name="salePrice">
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) => `$ ${value}`}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Cost Price" name="costPrice">
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) => `$ ${value}`}
                    parser={(value) =>
                      value
                        ? Number(value.replace(/\$\s?|(,*)/g, ""))
                        : (0 as any)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[{ required: true, message: "Please enter quantity" }]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Weight (kg)" name="weight">
                  <InputNumber style={{ width: "100%" }} min={0} step={0.1} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Product Status" style={{ marginBottom: 16 }}>
            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="draft">Draft</Select.Option>
                <Select.Option value="published">Published</Select.Option>
                <Select.Option value="archived">Archived</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Category" name="categoryId">
              <Select placeholder="Select category">
                <Select.Option value="cat1">Electronics</Select.Option>
                <Select.Option value="cat2">Fashion</Select.Option>
                <Select.Option value="cat3">Home & Garden</Select.Option>
              </Select>
            </Form.Item>
          </Card>

          <Card title="Product Images">
            <Form.Item name="images">
              <Upload
                listType="picture-card"
                maxCount={5}
                beforeUpload={() => false}
              >
                <div>
                  <UploadOutlined />
                  <div className={styles.uploadLabel}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={mutation.isPending}
          >
            {product ? "Update Product" : "Create Product"}
          </Button>
          <Button onClick={() => form.resetFields()}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
