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
  Tag, // Although not used for genre status, it's good to have if we expand genre properties
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { genreService } from "../../../services/genreManagement/genreService"; // Import the genreService

const GenreManagement = () => {
  const [genres, setGenres] = useState([]); // Initialize with empty array
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingGenre, setEditingGenre] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await genreService.getAllGenres();
      // Assuming your genre API response has a similar structure to movie API
      setGenres(response.result.content);
    } catch (error) {
      message.error("Failed to fetch genres.");
      console.error("Error fetching genres:", error);
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
      title: "Name",
      dataIndex: "name", // Assuming genre objects have a 'name' property
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this genre?"
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
    setEditingGenre(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (genre) => {
    setEditingGenre(genre);
    form.setFieldsValue(genre);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await genreService.deleteGenre(id);
      message.success("Xóa thể loại thành công");
      fetchGenres(); // Re-fetch genres after deletion
    } catch (error) {
      message.error("Failed to delete genre.");
      console.error("Error deleting genre:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingGenre) {
        // Update existing genre
        await genreService.updateGenre(editingGenre.id, values);
        message.success("Cập nhật thể loại thành công");
      } else {
        // Add new genre
        await genreService.createGenre(values);
        message.success("Thêm thể loại thành công");
      }
      setIsModalVisible(false);
      fetchGenres(); // Re-fetch genres after add/update
    } catch (error) {
      message.error("Failed to save genre.");
      console.error("Error saving genre:", error);
    }
  };

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchText.toLowerCase())
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
          placeholder="Tìm kiếm thể loại..."
          prefix={<SearchOutlined />}
          style={{ width: "300px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Thể Loại
        </Button>
      </div>

      {loading ? (
        <p>Loading genres...</p>
      ) : filteredGenres.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontSize: "18px",
            color: "#888",
          }}
        >
          Chưa có thể loại nào
        </p>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredGenres}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title={editingGenre ? "Sửa Thể Loại" : "Thêm Thể Loại"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Thể Loại"
            rules={[{ required: true, message: "Vui lòng nhập tên thể loại" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GenreManagement;
