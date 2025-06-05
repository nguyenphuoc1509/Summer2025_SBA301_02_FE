import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

// Mock data
const mockMovies = [
  {
    id: 1,
    title: "Avengers: Hồi Kết",
    director: "Anthony Russo",
    releaseDate: "2019-04-26",
    duration: "181",
    genre: "Hành Động",
    status: "active",
  },
  {
    id: 2,
    title: "Kỵ Sĩ Bóng Đêm",
    director: "Christopher Nolan",
    releaseDate: "2008-07-18",
    duration: "152",
    genre: "Hành Động",
    status: "active",
  },
  {
    id: 3,
    title: "Khởi Đầu",
    director: "Christopher Nolan",
    releaseDate: "2010-07-16",
    duration: "148",
    genre: "Khoa Học Viễn Tưởng",
    status: "inactive",
  },
];

const MovieManagement = () => {
  const [movies, setMovies] = useState(mockMovies);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingMovie, setEditingMovie] = useState(null);
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Director",
      dataIndex: "director",
      key: "director",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      sorter: (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate),
    },
    {
      title: "Duration (min)",
      dataIndex: "duration",
      key: "duration",
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      render: (genre) => <Tag color="blue">{genre}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
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
            title="Are you sure you want to delete this movie?"
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
    setEditingMovie(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    form.setFieldsValue(movie);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
    message.success("Xóa phim thành công");
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingMovie) {
        // Update existing movie
        setMovies(
          movies.map((movie) =>
            movie.id === editingMovie.id ? { ...movie, ...values } : movie
          )
        );
        message.success("Cập nhật phim thành công");
      } else {
        // Add new movie
        const newMovie = {
          ...values,
          id: Math.max(...movies.map((m) => m.id)) + 1,
        };
        setMovies([...movies, newMovie]);
        message.success("Thêm phim thành công");
      }
      setIsModalVisible(false);
    });
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
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
          placeholder="Tìm kiếm phim..."
          prefix={<SearchOutlined />}
          style={{ width: "300px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Phim
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredMovies}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingMovie ? "Sửa Phim" : "Thêm Phim"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tên Phim"
            rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="director"
            label="Đạo Diễn"
            rules={[{ required: true, message: "Vui lòng nhập tên đạo diễn" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label="Ngày Phát Hành"
            rules={[
              { required: true, message: "Vui lòng chọn ngày phát hành" },
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Thời Lượng (phút)"
            rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="genre"
            label="Thể Loại"
            rules={[{ required: true, message: "Vui lòng nhập thể loại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng Thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MovieManagement;
