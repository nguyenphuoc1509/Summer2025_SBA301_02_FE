import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { countryService } from "../../../services/countryManagement/countryService";

const CountryManagement = () => {
  const [countries, setCountries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCountry, setEditingCountry] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await countryService.getAllCountries();
      setCountries(response.result.content || []);
      message.success("Lấy danh sách quốc gia thành công");
    } catch (err) {
      message.error("Failed to fetch countries");
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this country?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingCountry(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (country) => {
    setEditingCountry(country);
    form.setFieldsValue(country);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await countryService.deleteCountry(id);
      message.success("Xóa quốc gia thành công");
      fetchCountries();
    } catch (err) {
      message.error("Failed to delete country");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCountry) {
        await countryService.updateCountry(editingCountry.id, values);
        message.success("Cập nhật quốc gia thành công");
      } else {
        await countryService.createCountry(values);
        message.success("Thêm quốc gia thành công");
      }
      setIsModalVisible(false);
      fetchCountries();
    } catch (err) {
      message.error("Failed to save country");
    }
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Tìm kiếm quốc gia..."
          prefix={<SearchOutlined />}
          style={{ width: "300px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Quốc Gia
        </Button>
      </div>

      {loading ? (
        <p>Loading countries...</p>
      ) : filteredCountries.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontSize: "18px",
            color: "#888",
          }}
        >
          Chưa có quốc gia
        </p>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredCountries}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title={editingCountry ? "Sửa Quốc Gia" : "Thêm Quốc Gia"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Quốc Gia"
            rules={[{ required: true, message: "Vui lòng nhập tên quốc gia" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CountryManagement;
