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
  Tag,
  Select,
  DatePicker,
  TimePicker,
  Tabs,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import scheduleService from "../../../services/scheduleManagement";
import { movieService } from "../../../services/movieManagement/movieService";
import cinemaService from "../../../services/cinemaManagement/cinemaService";

const { TabPane } = Tabs;

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cinema");

  // Fetch movies and cinemas on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [moviesResponse, cinemasResponse] = await Promise.all([
          movieService.getAllMovies(),
          cinemaService.getAllCinemas(),
        ]);

        // Extract the actual data from the response structure
        const moviesData = moviesResponse?.result?.content || [];
        const cinemasData = cinemasResponse?.result || [];

        setMovies(moviesData);
        setCinemas(cinemasData);

        // If we have cinemas, select the first one by default
        if (cinemasData && cinemasData.length > 0) {
          handleCinemaSelect(cinemasData[0].id);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        message.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle cinema selection
  const handleCinemaSelect = async (cinemaId) => {
    if (!cinemaId) return;

    console.log("Fetching data for cinema ID:", cinemaId);
    setSelectedCinema(cinemaId);
    setLoading(true);
    try {
      // Get rooms for the selected cinema
      const roomsData = await scheduleService.getRoomsByCinema(cinemaId);
      console.log("Rooms data:", roomsData);
      setRooms(Array.isArray(roomsData) ? roomsData : []);

      // Get schedules for the selected cinema
      const schedulesResponse = await scheduleService.getShowtimesByCinema(
        cinemaId
      );
      console.log("Cinema schedules response:", schedulesResponse);

      // Process the cinema showtimes response
      const schedulesData = schedulesResponse?.result || [];

      // Check if the response is already in the format we need or needs transformation
      const processedSchedules = Array.isArray(schedulesData)
        ? schedulesData.map((schedule) => ({
            id: schedule.id || schedule.showTimeId,
            movieId: schedule.movieId,
            movieTitle:
              schedule.movieTitle ||
              movies.find((m) => m.id === schedule.movieId)?.title ||
              "Unknown Movie",
            cinemaId: schedule.cinemaId || cinemaId,
            cinemaName:
              schedule.cinemaName ||
              cinemas.find((c) => c.id === cinemaId)?.name ||
              "Unknown Cinema",
            roomId: schedule.roomId,
            roomName: schedule.roomName || `Phòng ${schedule.roomId}`,
            showtime: schedule.showtime || schedule.showTime,
            showDate:
              schedule.showDate || schedule.showTime || schedule.showtime,
            ticketPrice: schedule.ticketPrice || 0,
            active: schedule.active !== undefined ? schedule.active : true,
          }))
        : [];

      console.log("Processed cinema schedules:", processedSchedules);
      setSchedules(processedSchedules);
    } catch (error) {
      console.error("Error fetching cinema data:", error);
      message.error("Không thể tải dữ liệu rạp chiếu. Vui lòng thử lại sau.");
      setRooms([]);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle movie selection
  const handleMovieSelect = async (movieId) => {
    if (!movieId) return;

    console.log("Fetching schedules for movie ID:", movieId);
    setSelectedMovie(movieId);
    setLoading(true);
    try {
      const schedulesResponse = await scheduleService.getShowtimesByMovie(
        movieId
      );
      console.log("Movie schedules response:", schedulesResponse);

      // Process the movie showtimes response which has a nested structure
      const cinemaShowtimes = schedulesResponse?.result || [];

      // Transform the nested structure into a flat list of schedules
      const flattenedSchedules = [];

      cinemaShowtimes.forEach((cinema) => {
        const { cinemaId, cinemaName, cinemaAddress, showTimes } = cinema;

        showTimes.forEach((showtime) => {
          flattenedSchedules.push({
            id: showtime.showTimeId,
            movieId,
            movieTitle:
              movies.find((m) => m.id === movieId)?.title || "Unknown Movie",
            cinemaId,
            cinemaName,
            roomId: showtime.roomId,
            roomName: `Phòng ${showtime.roomId}`, // If room name is not available
            roomType: showtime.roomType,
            showtime: showtime.showTime,
            showDate: showtime.showTime, // Same as showtime for rendering
            ticketPrice: showtime.ticketPrice || 0,
            active: true, // Assuming active if returned in results
          });
        });
      });

      console.log("Flattened schedules:", flattenedSchedules);
      setSchedules(flattenedSchedules);
    } catch (error) {
      console.error("Error fetching movie schedules:", error);
      message.error("Không thể tải lịch chiếu phim. Vui lòng thử lại sau.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (activeKey) => {
    console.log("Tab changed to:", activeKey);
    setActiveTab(activeKey);
    setSchedules([]);

    if (activeKey === "cinema" && selectedCinema) {
      console.log("Selecting cinema:", selectedCinema);
      handleCinemaSelect(selectedCinema);
    } else if (activeKey === "movie") {
      // If there's already a selected movie, fetch its schedules
      if (selectedMovie) {
        console.log("Using existing selected movie:", selectedMovie);
        handleMovieSelect(selectedMovie);
      }
      // If no movie is selected yet but we have movies available, select the first one
      else if (movies.length > 0) {
        console.log("Selecting first movie:", movies[0].id);
        handleMovieSelect(movies[0].id);
        setSelectedMovie(movies[0].id);
      } else {
        console.log("No movies available to select");
      }
    }
  };

  // Fetch rooms when cinema is selected in the form
  const handleCinemaChange = async (cinemaId) => {
    try {
      const roomsData = await scheduleService.getRoomsByCinema(cinemaId);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      message.error("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
      setRooms([]);
    }
  };

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
      dataIndex: "cinemaName",
      key: "cinemaName",
    },
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "showDate",
      key: "showDate",
      sorter: (a, b) => new Date(a.showDate) - new Date(b.showDate),
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ chiếu",
      dataIndex: "showtime",
      key: "showtime",
      render: (time) => dayjs(time).format("HH:mm"),
    },
    {
      title: "Giá vé (VNĐ)",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
      sorter: (a, b) => a.ticketPrice - b.ticketPrice,
      render: (price) => `${price.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Đang chiếu" : "Ngừng chiếu"}
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
          <Button
            type={record.active ? "default" : "primary"}
            onClick={() => handleToggleStatus(record.id, !record.active)}
          >
            {record.active ? "Ngừng chiếu" : "Kích hoạt"}
          </Button>
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

    // Find the cinema ID for this schedule to load rooms
    const cinemaId = schedule.cinemaId;
    handleCinemaChange(cinemaId);

    form.setFieldsValue({
      movieId: schedule.movieId,
      cinemaId: schedule.cinemaId,
      roomId: schedule.roomId,
      showtime: dayjs(schedule.showtime),
      ticketPrice: schedule.ticketPrice,
    });

    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await scheduleService.toggleScheduleStatus(id, false);
      message.success("Xóa lịch chiếu thành công");
      refreshSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      message.error("Không thể xóa lịch chiếu. Vui lòng thử lại sau.");
    }
  };

  const handleToggleStatus = async (id, active) => {
    try {
      await scheduleService.toggleScheduleStatus(id, active);
      message.success(
        `${active ? "Kích hoạt" : "Ngừng chiếu"} lịch chiếu thành công`
      );
      refreshSchedules();
    } catch (error) {
      console.error("Error toggling schedule status:", error);
      message.error(
        `Không thể ${
          active ? "kích hoạt" : "ngừng chiếu"
        } lịch chiếu. Vui lòng thử lại sau.`
      );
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const scheduleData = {
        movieId: values.movieId,
        roomId: values.roomId,
        showtime: values.showtime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        ticketPrice: values.ticketPrice,
      };

      if (editingSchedule) {
        await scheduleService.updateSchedule(editingSchedule.id, scheduleData);
        message.success("Cập nhật lịch chiếu thành công");
      } else {
        await scheduleService.createSchedule(scheduleData);
        message.success("Thêm lịch chiếu thành công");
      }

      setIsModalVisible(false);
      refreshSchedules();
    } catch (error) {
      console.error("Error saving schedule:", error);
      message.error(
        "Không thể lưu lịch chiếu. Vui lòng kiểm tra lại thông tin."
      );
    }
  };

  // Function to refresh schedules based on current filter
  const refreshSchedules = async () => {
    setLoading(true);
    try {
      if (activeTab === "cinema" && selectedCinema) {
        // Get schedules for the selected cinema
        const schedulesResponse = await scheduleService.getShowtimesByCinema(
          selectedCinema
        );
        console.log("Refreshed cinema schedules response:", schedulesResponse);

        // Process the cinema showtimes response
        const schedulesData = schedulesResponse?.result || [];

        // Check if the response is already in the format we need or needs transformation
        const processedSchedules = Array.isArray(schedulesData)
          ? schedulesData.map((schedule) => ({
              id: schedule.id || schedule.showTimeId,
              movieId: schedule.movieId,
              movieTitle:
                schedule.movieTitle ||
                movies.find((m) => m.id === schedule.movieId)?.title ||
                "Unknown Movie",
              cinemaId: schedule.cinemaId || selectedCinema,
              cinemaName:
                schedule.cinemaName ||
                cinemas.find((c) => c.id === selectedCinema)?.name ||
                "Unknown Cinema",
              roomId: schedule.roomId,
              roomName: schedule.roomName || `Phòng ${schedule.roomId}`,
              showtime: schedule.showtime || schedule.showTime,
              showDate:
                schedule.showDate || schedule.showTime || schedule.showtime,
              ticketPrice: schedule.ticketPrice || 0,
              active: schedule.active !== undefined ? schedule.active : true,
            }))
          : [];

        setSchedules(processedSchedules);
      } else if (activeTab === "movie" && selectedMovie) {
        const schedulesResponse = await scheduleService.getShowtimesByMovie(
          selectedMovie
        );
        console.log("Refreshed movie schedules response:", schedulesResponse);

        // Process the movie showtimes response which has a nested structure
        const cinemaShowtimes = schedulesResponse?.result || [];

        // Transform the nested structure into a flat list of schedules
        const flattenedSchedules = [];

        cinemaShowtimes.forEach((cinema) => {
          const { cinemaId, cinemaName, cinemaAddress, showTimes } = cinema;

          showTimes.forEach((showtime) => {
            flattenedSchedules.push({
              id: showtime.showTimeId,
              movieId: selectedMovie,
              movieTitle:
                movies.find((m) => m.id === selectedMovie)?.title ||
                "Unknown Movie",
              cinemaId,
              cinemaName,
              roomId: showtime.roomId,
              roomName: `Phòng ${showtime.roomId}`, // If room name is not available
              roomType: showtime.roomType,
              showtime: showtime.showTime,
              showDate: showtime.showTime, // Same as showtime for rendering
              ticketPrice: showtime.ticketPrice || 0,
              active: true, // Assuming active if returned in results
            });
          });
        });

        setSchedules(flattenedSchedules);
      }
    } catch (error) {
      console.error("Error refreshing schedules:", error);
      message.error("Không thể cập nhật danh sách lịch chiếu.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.movieTitle?.toLowerCase().includes(searchText.toLowerCase())
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

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Theo rạp chiếu" key="cinema">
          <div style={{ marginBottom: 16 }}>
            <Select
              placeholder="Chọn rạp chiếu"
              style={{ width: 300 }}
              value={selectedCinema}
              onChange={handleCinemaSelect}
              options={cinemas.map((cinema) => ({
                label: cinema.name,
                value: cinema.id,
              }))}
            />
          </div>
        </TabPane>
        <TabPane tab="Theo phim" key="movie">
          <div style={{ marginBottom: 16 }}>
            <Select
              placeholder="Chọn phim"
              style={{ width: 300 }}
              value={selectedMovie}
              onChange={(value) => {
                setSelectedMovie(value);
                handleMovieSelect(value);
              }}
              options={movies.map((movie) => ({
                label: movie.title,
                value: movie.id,
              }))}
            />
          </div>
        </TabPane>
      </Tabs>

      <Table
        columns={columns}
        dataSource={filteredSchedules}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
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
            name="movieId"
            label="Phim"
            rules={[{ required: true, message: "Vui lòng chọn phim" }]}
          >
            <Select
              placeholder="Chọn phim"
              options={movies.map((movie) => ({
                label: movie.title,
                value: movie.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="cinemaId"
            label="Rạp chiếu"
            rules={[{ required: true, message: "Vui lòng chọn rạp chiếu" }]}
          >
            <Select
              placeholder="Chọn rạp chiếu"
              options={cinemas.map((cinema) => ({
                label: cinema.name,
                value: cinema.id,
              }))}
              onChange={handleCinemaChange}
            />
          </Form.Item>

          <Form.Item
            name="roomId"
            label="Phòng chiếu"
            rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
          >
            <Select
              placeholder="Chọn phòng chiếu"
              options={rooms.map((room) => ({
                label: room.name,
                value: room.id,
              }))}
              disabled={!rooms.length}
            />
          </Form.Item>

          <Form.Item
            name="showtime"
            label="Thời gian chiếu"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian chiếu" },
            ]}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="ticketPrice"
            label="Giá vé (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
          >
            <Input type="number" step="1000" min="0" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;
