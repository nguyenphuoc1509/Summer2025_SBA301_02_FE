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
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

// Mock data for schedules
const mockSchedules = [
  {
    id: 1,
    movieTitle: "Avengers: Endgame",
    theater: "Rạp 1",
    date: "2024-03-20",
    startTime: "14:00",
    endTime: "17:01",
    price: 15.99,
    status: "active",
  },
  {
    id: 2,
    movieTitle: "The Dark Knight",
    theater: "Rạp 2",
    date: "2024-03-20",
    startTime: "19:00",
    endTime: "21:32",
    price: 12.99,
    status: "active",
  },
  {
    id: 3,
    movieTitle: "Inception",
    theater: "Rạp 3",
    date: "2024-03-21",
    startTime: "20:00",
    endTime: "22:28",
    price: 13.99,
    status: "inactive",
  },
];

// Mock data for movies and theaters
const mockMovies = [
  { id: 1, title: "Avengers: Endgame", duration: 181 },
  { id: 2, title: "The Dark Knight", duration: 152 },
  { id: 3, title: "Inception", duration: 148 },
];

const mockTheaters = [
  { id: 1, name: "Rạp 1", capacity: 200 },
  { id: 2, name: "Rạp 2", capacity: 150 },
  { id: 3, name: "Rạp 3", capacity: 180 },
];

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Phim",
      dataIndex: "movieTitle",
      key: "movieTitle",
      sorter: (a, b) => a.movieTitle.localeCompare(b.movieTitle),
    },
    {
      title: "Rạp chiếu",
      dataIndex: "theater",
      key: "theater",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Giờ chiếu",
      key: "time",
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: "Giá vé (VNĐ)",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => `${price.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Đang chiếu" : "Ngừng chiếu"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa lịch chiếu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    form.setFieldsValue({
      ...schedule,
      date: dayjs(schedule.date),
      startTime: dayjs(schedule.startTime, "HH:mm"),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
    message.success("Xóa lịch chiếu thành công");
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.startTime.format("HH:mm"),
        endTime: values.startTime
          .add(values.movie.duration, "minute")
          .format("HH:mm"),
      };

      if (editingSchedule) {
        setSchedules(
          schedules.map((schedule) =>
            schedule.id === editingSchedule.id
              ? { ...schedule, ...formattedValues }
              : schedule
          )
        );
        message.success("Cập nhật lịch chiếu thành công");
      } else {
        const newSchedule = {
          ...formattedValues,
          id: Math.max(...schedules.map((s) => s.id)) + 1,
        };
        setSchedules([...schedules, newSchedule]);
        message.success("Thêm lịch chiếu thành công");
      }
      setIsModalVisible(false);
    });
  };

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.movieTitle.toLowerCase().includes(searchText.toLowerCase())
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
          placeholder="Tìm kiếm lịch chiếu..."
          prefix={<SearchOutlined />}
          style={{ width: "300px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm lịch chiếu
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSchedules}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingSchedule ? "Chỉnh sửa lịch chiếu" : "Thêm lịch chiếu mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="movie"
            label="Phim"
            rules={[{ required: true, message: "Vui lòng chọn phim" }]}
          >
            <Select
              placeholder="Chọn phim"
              options={mockMovies.map((movie) => ({
                label: movie.title,
                value: movie,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="theater"
            label="Rạp chiếu"
            rules={[{ required: true, message: "Vui lòng chọn rạp chiếu" }]}
          >
            <Select
              placeholder="Chọn rạp chiếu"
              options={mockTheaters.map((theater) => ({
                label: theater.name,
                value: theater.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày chiếu"
            rules={[{ required: true, message: "Vui lòng chọn ngày chiếu" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Giờ bắt đầu"
            rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá vé (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
          >
            <Input type="number" step="1000" min="0" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              options={[
                { label: "Đang chiếu", value: "active" },
                { label: "Ngừng chiếu", value: "inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;
