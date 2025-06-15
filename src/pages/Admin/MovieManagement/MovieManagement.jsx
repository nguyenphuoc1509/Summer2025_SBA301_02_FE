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
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { movieService } from "../../../services/movieManagement/movieService"; // Import the movieService
import { countryService } from "../../../services/countryManagement/countryService";
import { personService } from "../../../services/personManagement/personService";
import { genreService } from "../../../services/genreManagement/genreService";

const MovieManagement = () => {
  const [movies, setMovies] = useState([]); // Initialize with empty array
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingMovie, setEditingMovie] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [countries, setCountries] = useState([]);
  const [persons, setPersons] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchMovies();
    fetchCountries();
    fetchPersons();
    fetchGenres();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await movieService.getAllMovies();
      setMovies(response.result.content);
    } catch (error) {
      message.error("Failed to fetch movies.");
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await countryService.getAllCountries();
      setCountries(res.result.content);
    } catch (error) {
      message.error("Failed to fetch countries.");
    }
  };

  const fetchPersons = async () => {
    try {
      const res = await personService.getAllPersons();
      setPersons(res.result.content);
    } catch (error) {
      message.error("Failed to fetch persons.");
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await genreService.getAllGenres();
      setGenres(res.result.content);
    } catch (error) {
      message.error("Failed to fetch genres.");
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Director",
      dataIndex: "directors",
      key: "directors",
      render: (directors) =>
        Array.isArray(directors) ? directors.join(", ") : "",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
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
      dataIndex: "genres",
      key: "genres",
      render: (genres) =>
        Array.isArray(genres)
          ? genres.map((genre) => <Tag color="blue" key={genre}>{genre}</Tag>)
          : null,
    },
    {
      title: "Actors",
      dataIndex: "actors",
      key: "actors",
      render: (actors) =>
        Array.isArray(actors) ? actors.join(", ") : "",
    },
    {
      title: "Status",
      dataIndex: "movieStatus",
      key: "movieStatus",
      render: (status) => (
        <Tag color={status === "RELEASED" ? "green" : "red"}>
          {(status || "UNKNOWN").toUpperCase()}
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

    const genreIds = genres.filter(g => movie.genres.includes(g.name)).map(g => g.id);
    const directorIds = persons.filter(p => p.occupation === "DIRECTOR" && movie.directors.includes(p.name)).map(p => p.id);
    const actorIds = persons.filter(p => p.occupation === "ACTOR" && movie.actors.includes(p.name)).map(p => p.id);
    const countryId = countries.find(c => c.name === movie.country)?.id;

    form.setFieldsValue({
      ...movie,
      genreIds,
      directorIds,
      actorIds,
      countryId,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await movieService.deleteMovie(id);
      message.success("Xóa phim thành công");
      fetchMovies(); // Re-fetch movies after deletion
    } catch (error) {
      message.error("Failed to delete movie.");
      console.error("Error deleting movie:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Build schema
      const data = {
        title: values.title,
        description: values.description,
        duration: Number(values.duration),
        releaseDate: values.releaseDate,
        trailerUrl: values.trailerUrl,
        movieStatus: values.movieStatus,
        countryId: values.countryId,
        genreIds: values.genreIds,
        directorIds: values.directorIds,
        actorIds: values.actorIds,
      };
      if (editingMovie) {
        await movieService.updateMovie(editingMovie.id, data);
        message.success("Cập nhật phim thành công");
      } else {
        await movieService.createMovie(data);
        message.success("Thêm phim thành công");
      }
      setIsModalVisible(false);
      fetchMovies();
    } catch (error) {
      message.error("Failed to save movie.");
      console.error("Error saving movie:", error);
    }
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

      {loading ? (
        <p>Loading movies...</p>
      ) : filteredMovies.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontSize: "18px",
            color: "#888",
          }}
        >
          Chưa có phim nào
        </p>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredMovies}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

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
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Thời Lượng (phút)"
            rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label="Ngày Phát Hành"
            rules={[{ required: true, message: "Vui lòng chọn ngày phát hành" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="trailerUrl"
            label="Trailer URL"
            rules={[{ required: true, message: "Vui lòng nhập trailer URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="movieStatus"
            label="Trạng Thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Select.Option value="UPCOMING">UPCOMING</Select.Option>
              <Select.Option value="RELEASED">RELEASED</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="countryId"
            label="Quốc Gia"
            rules={[{ required: true, message: "Vui lòng chọn quốc gia" }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {countries.map((country) => (
                <Select.Option key={country.id} value={country.id}>
                  {country.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="genreIds"
            label="Thể Loại"
            rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn thể loại"
              optionFilterProp="children"
            >
              {genres.map((genre) => (
                <Select.Option key={genre.id} value={genre.id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="directorIds"
            label="Đạo Diễn"
            rules={[{ required: true, message: "Vui lòng chọn đạo diễn" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn đạo diễn"
              optionFilterProp="children"
            >
              {persons
                .filter((p) => p.occupation === "DIRECTOR")
                .map((person) => (
                  <Select.Option key={person.id} value={person.id}>
                    {person.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="actorIds"
            label="Diễn Viên"
            rules={[{ required: true, message: "Vui lòng chọn diễn viên" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn diễn viên"
              optionFilterProp="children"
            >
              {persons
                .filter((p) => p.occupation === "ACTOR")
                .map((person) => (
                  <Select.Option key={person.id} value={person.id}>
                    {person.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MovieManagement;
