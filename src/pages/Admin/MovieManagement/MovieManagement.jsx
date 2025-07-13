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
  Upload,
  Descriptions,
  Image,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { movieService } from "../../../services/movieManagement/movieService";
import { countryService } from "../../../services/countryManagement/countryService";
import { personService } from "../../../services/personManagement/personService";
import { genreService } from "../../../services/genreManagement/genreService";

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingMovie, setEditingMovie] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [persons, setPersons] = useState([]);
  const [genres, setGenres] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
      console.log("Raw movie data:", response.result.content);

      const processedMovies = response.result.content.map((movie) => {
        // Log the structure of each movie for debugging
        console.log(`Processing movie ${movie.id} (${movie.title}):`, {
          country: movie.country,
          genres: movie.genres,
          directors: movie.directors,
          actors: movie.actors,
        });

        return {
          ...movie,
          country: movie.country?.name || "",
          genres: movie.genres?.map((genre) => genre.name) || [],
          directors:
            movie.directors?.map((director) => ({
              id: director.id,
              name: director.name,
            })) || [],
          actors:
            movie.actors?.map((actor) => ({
              id: actor.id,
              name: actor.name,
            })) || [],
        };
      });

      setMovies(processedMovies);
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
      console.log("Fetched countries:", res.result.content);
      setCountries(res.result.content);
    } catch (error) {
      message.error("Failed to fetch countries.");
      console.error("Error fetching countries:", error);
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
      console.log("Fetched genres:", res.result.content);
      setGenres(res.result.content);
    } catch (error) {
      message.error("Failed to fetch genres.");
      console.error("Error fetching genres:", error);
    }
  };

  const fetchMovieDetails = async (id) => {
    setLoadingDetails(true);
    try {
      const response = await movieService.getMovieById(id);
      setMovieDetails(response.result);
      setIsDetailsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch movie details.");
      console.error("Error fetching movie details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const columns = [
    {
      title: "Mã phim",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên phim",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Ảnh bìa",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      render: (thumbnailUrl) =>
        thumbnailUrl ? (
          <img src={thumbnailUrl} alt="Movie thumbnail" style={{ width: 50 }} />
        ) : (
          "No image"
        ),
    },
    {
      title: "Đạo diễn",
      dataIndex: "directors",
      key: "directors",
      render: (directors) =>
        Array.isArray(directors) ? directors.map((d) => d.name).join(", ") : "",
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Ngày phát hành",
      dataIndex: "releaseDate",
      key: "releaseDate",
      sorter: (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate),
    },
    {
      title: "Thời lượng (phút)",
      dataIndex: "duration",
      key: "duration",
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: "Thể loại",
      dataIndex: "genres",
      key: "genres",
      render: (genres) =>
        Array.isArray(genres)
          ? genres.map((genre) => (
              <Tag color="blue" key={genre}>
                {genre}
              </Tag>
            ))
          : null,
    },
    {
      title: "Diễn viên",
      dataIndex: "actors",
      key: "actors",
      render: (actors) =>
        Array.isArray(actors) ? actors.map((a) => a.name).join(", ") : "",
    },
    {
      title: "Trạng thái",
      dataIndex: "movieStatus",
      key: "movieStatus",
      render: (status) => (
        <Tag color={status === "NOW_SHOWING" ? "green" : "red"}>
          {(status || "UNKNOWN").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<InfoCircleOutlined />}
            onClick={() => fetchMovieDetails(record.id)}
          >
            Chi tiết
          </Button>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phim này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingMovie(null);
    form.resetFields();
    setThumbnailUrl("");
    setThumbnailFile(null);
    setIsModalVisible(true);
  };

  const handleEdit = (movie) => {
    if (!movie) return;

    setEditingMovie(movie);
    setThumbnailUrl(movie.thumbnailUrl || "");

    // Extract genre IDs correctly
    let genreIds = [];
    if (movie.genres) {
      // If genres are objects with id properties
      if (
        movie.genres.length > 0 &&
        typeof movie.genres[0] === "object" &&
        "id" in movie.genres[0]
      ) {
        genreIds = movie.genres.map((g) => Number(g.id));
      }
      // If genres are already IDs
      else if (movie.genreIds && Array.isArray(movie.genreIds)) {
        genreIds = movie.genreIds.map((id) => Number(id));
      }
      // If we only have genre names, we need to find the corresponding IDs
      else {
        const genreNames = movie.genres;
        genreIds = genres
          .filter((g) => genreNames.includes(g.name))
          .map((g) => Number(g.id));
      }
    }

    // Extract director IDs correctly
    let directorIds = [];
    if (movie.directors) {
      directorIds = movie.directors
        .map((d) => {
          if (typeof d === "object" && d.id) return Number(d.id);
          return typeof d === "string" ? null : Number(d);
        })
        .filter((id) => id !== null);
    }

    // Extract actor IDs correctly
    let actorIds = [];
    if (movie.actors) {
      actorIds = movie.actors
        .map((a) => {
          if (typeof a === "object" && a.id) return Number(a.id);
          return typeof a === "string" ? null : Number(a);
        })
        .filter((id) => id !== null);
    }

    // Extract country ID correctly
    let countryId = null;
    if (movie.country) {
      if (typeof movie.country === "object" && movie.country.id) {
        countryId = Number(movie.country.id);
      } else if (movie.countryId) {
        countryId = Number(movie.countryId);
      } else {
        // Try to find the country by name in the countries list
        const countryName =
          typeof movie.country === "string" ? movie.country : "";
        const foundCountry = countries.find((c) => c.name === countryName);
        if (foundCountry) {
          countryId = Number(foundCountry.id);
        }
      }
    }

    console.log("Setting form values:", {
      genreIds,
      directorIds,
      actorIds,
      countryId,
      movie,
    });

    form.setFieldsValue({
      ...movie,
      genreIds,
      directorIds,
      actorIds,
      countryId,
      premiereDate: movie.premiereDate || movie.releaseDate,
      releaseDate: movie.releaseDate,
      endDate: movie.endDate || movie.releaseDate,
      ageRestriction: movie.ageRestriction || "T0",
      availableFormats: movie.availableFormats || ["TWO_D"],
      movieStatus: movie.movieStatus || "UPCOMING",
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await movieService.deleteMovie(id);
      message.success("Xóa phim thành công");
      fetchMovies();
    } catch (error) {
      message.error("Failed to delete movie.");
      console.error("Error deleting movie:", error);
    }
  };

  const handleThumbnailChange = (info) => {
    if (info.file) {
      setThumbnailFile(info.file);

      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailUrl(e.target.result);
      };
      reader.readAsDataURL(info.file);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setUploading(true);

      // Format dates to yyyy-mm-dd
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // Returns yyyy-mm-dd
      };

      // Ensure IDs are valid numbers
      const directorIds = values.directorIds
        ? values.directorIds.map((id) => Number(id)).filter((id) => !isNaN(id))
        : [];
      const actorIds = values.actorIds
        ? values.actorIds.map((id) => Number(id)).filter((id) => !isNaN(id))
        : [];
      const genreIds = values.genreIds
        ? values.genreIds.map((id) => Number(id)).filter((id) => !isNaN(id))
        : [];
      const countryId = values.countryId ? Number(values.countryId) : null;

      // Validate that we have valid genre IDs
      if (genreIds.length === 0) {
        message.error("Vui lòng chọn ít nhất một thể loại phim");
        setUploading(false);
        return;
      }

      // Validate that all genre IDs exist in the genres list
      const validGenreIds = genres.map((g) => g.id);
      const invalidGenreIds = genreIds.filter(
        (id) => !validGenreIds.includes(id)
      );
      if (invalidGenreIds.length > 0) {
        message.error(
          `Một số thể loại không hợp lệ: ${invalidGenreIds.join(", ")}`
        );
        setUploading(false);
        return;
      }

      // Build schema matching the required request body
      const movieData = {
        title: values.title,
        description: values.description,
        trailerUrl: values.trailerUrl,
        duration: Number(values.duration),
        premiereDate: formatDate(values.premiereDate),
        endDate: formatDate(values.endDate),
        directorIds: directorIds,
        actorIds: actorIds,
        ageRestriction: values.ageRestriction,
        countryId: countryId,
        availableFormats: values.availableFormats,
        releaseDate: formatDate(values.releaseDate),
        genreIds: genreIds,
        movieStatus: values.movieStatus,
      };

      // For debugging
      console.log("Sending movie data:", JSON.stringify(movieData));

      if (editingMovie) {
        await movieService.updateMovie(
          editingMovie.id,
          movieData,
          thumbnailFile
        );
        message.success("Cập nhật phim thành công");
      } else {
        await movieService.createMovie(movieData, thumbnailFile);
        message.success("Thêm phim thành công");
      }
      setIsModalVisible(false);
      fetchMovies();
    } catch (error) {
      message.error(
        `Failed to save movie: ${error.message || "Unknown error"}`
      );
      console.error("Error saving movie:", error);
    } finally {
      setUploading(false);
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
          Thêm phim
        </Button>
      </div>

      {loading ? (
        <p>Đang tải phim...</p>
      ) : filteredMovies.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontSize: "18px",
            color: "#888",
          }}
        >
          Chưa có phim nào.
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
        title={editingMovie ? "Sửa phim" : "Thêm phim"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={uploading}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tên phim"
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

          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              name="duration"
              label="Thời lượng (phút)"
              rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
              style={{ width: "50%" }}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="ageRestriction"
              label="Giới hạn tuổi"
              rules={[
                { required: true, message: "Vui lòng chọn giới hạn tuổi" },
              ]}
              style={{ width: "50%" }}
            >
              <Select>
                <Select.Option value="T0">0+</Select.Option>
                <Select.Option value="T13">13+</Select.Option>
                <Select.Option value="T16">16+</Select.Option>
                <Select.Option value="T18">18+</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              name="premiereDate"
              label="Ngày khởi chiếu"
              rules={[
                { required: true, message: "Vui lòng chọn ngày khởi chiếu" },
              ]}
              style={{ width: "50%" }}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              name="releaseDate"
              label="Ngày phát hành"
              rules={[
                { required: true, message: "Vui lòng chọn ngày phát hành" },
              ]}
              style={{ width: "50%" }}
            >
              <Input type="date" />
            </Form.Item>
          </div>

          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
            style={{ width: "50%" }}
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

          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              name="availableFormats"
              label="Định dạng phim"
              rules={[
                { required: true, message: "Vui lòng chọn định dạng phim" },
              ]}
              style={{ width: "50%" }}
            >
              <Select mode="multiple">
                <Select.Option value="TWO_D">2D</Select.Option>
                <Select.Option value="THREE_D">3D</Select.Option>
                <Select.Option value="IMAX">IMAX</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="movieStatus"
              label="Trạng Thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              style={{ width: "50%" }}
            >
              <Select>
                <Select.Option value="UPCOMING">Sắp chiếu</Select.Option>
                <Select.Option value="NOW_SHOWING">Đang chiếu</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="countryId"
            label="Quốc Gia"
            rules={[{ required: true, message: "Vui lòng chọn quốc gia" }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                return (
                  option &&
                  typeof option.children === "string" &&
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                );
              }}
            >
              {Array.isArray(countries) && countries.length > 0 ? (
                countries.map((country) => (
                  <Select.Option key={country.id} value={Number(country.id)}>
                    {country.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value={null} disabled>
                  No countries available
                </Select.Option>
              )}
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
              filterOption={(input, option) =>
                option &&
                typeof option.children === "string" &&
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {Array.isArray(genres)
                ? genres.map((genre) => (
                    <Select.Option key={genre.id} value={genre.id}>
                      {genre.name}
                    </Select.Option>
                  ))
                : null}
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
              filterOption={(input, option) =>
                option &&
                typeof option.children === "string" &&
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {Array.isArray(persons)
                ? persons
                    .filter((p) => p.occupation === "DIRECTOR")
                    .map((person) => (
                      <Select.Option key={person.id} value={person.id}>
                        {person.name}
                      </Select.Option>
                    ))
                : null}
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
              filterOption={(input, option) =>
                option &&
                typeof option.children === "string" &&
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {Array.isArray(persons)
                ? persons
                    .filter((p) => p.occupation === "ACTOR")
                    .map((person) => (
                      <Select.Option key={person.id} value={person.id}>
                        {person.name}
                      </Select.Option>
                    ))
                : null}
            </Select>
          </Form.Item>

          <Form.Item label="Ảnh Thumbnail" name="thumbnail">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleThumbnailChange}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>

              {thumbnailUrl && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết phim"
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsDetailsModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsDetailsModalVisible(false);
              handleEdit(movieDetails);
            }}
          >
            Sửa
          </Button>,
        ]}
        width={800}
      >
        {loadingDetails ? (
          <p>Đang tải thông tin phim...</p>
        ) : movieDetails ? (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                {movieDetails.thumbnailUrl && (
                  <Image
                    src={movieDetails.thumbnailUrl}
                    alt={movieDetails.title}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                )}
              </Col>
              <Col span={16}>
                <Typography.Title level={3}>
                  {movieDetails.title}
                </Typography.Title>

                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Mã phim">
                    {movieDetails.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời lượng">
                    {movieDetails.duration} phút
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày phát hành">
                    {movieDetails.releaseDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày khởi chiếu">
                    {movieDetails.premiereDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày kết thúc">
                    {movieDetails.endDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới hạn tuổi">
                    {movieDetails.ageRestriction === "T0"
                      ? "0+"
                      : movieDetails.ageRestriction === "T13"
                      ? "13+"
                      : movieDetails.ageRestriction === "T16"
                      ? "16+"
                      : movieDetails.ageRestriction === "T18"
                      ? "18+"
                      : "Không xác định"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag
                      color={
                        movieDetails.movieStatus === "RELEASED"
                          ? "green"
                          : "orange"
                      }
                    >
                      {movieDetails.movieStatus === "RELEASED"
                        ? "Đang chiếu"
                        : "Sắp chiếu"}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider />

            <Typography.Title level={4}>Mô tả</Typography.Title>
            <Typography.Paragraph>
              {movieDetails.description}
            </Typography.Paragraph>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Typography.Title level={4}>Thông tin chung</Typography.Title>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Quốc gia">
                    {movieDetails.country?.name || "Không xác định"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Định dạng">
                    {movieDetails.availableFormats?.map((format) => (
                      <Tag key={format} color="blue">
                        {format === "TWO_D"
                          ? "2D"
                          : format === "THREE_D"
                          ? "3D"
                          : format === "IMAX"
                          ? "IMAX"
                          : format}
                      </Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thể loại">
                    {movieDetails.genres?.map((genre) => (
                      <Tag key={genre.id} color="green">
                        {genre.name}
                      </Tag>
                    ))}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Typography.Title level={4}>Nhân sự</Typography.Title>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Đạo diễn">
                    {movieDetails.directors
                      ?.map((director) => director.name)
                      .join(", ") || "Không xác định"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Diễn viên">
                    {movieDetails.actors
                      ?.map((actor) => actor.name)
                      .join(", ") || "Không xác định"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            {movieDetails.trailerUrl && (
              <>
                <Divider />
                <Typography.Title level={4}>Trailer</Typography.Title>
                <div style={{ textAlign: "center" }}>
                  <iframe
                    width="560"
                    height="315"
                    src={movieDetails.trailerUrl.replace("watch?v=", "embed/")}
                    title="Movie Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </>
            )}
          </div>
        ) : (
          <p>Không tìm thấy thông tin phim.</p>
        )}
      </Modal>
    </div>
  );
};

export default MovieManagement;
