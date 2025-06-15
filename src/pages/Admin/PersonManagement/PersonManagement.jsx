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
  Upload,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { personService } from "../../../services/personManagement/personService"; // Import the personService
import moment from "moment"; // Import moment for DatePicker
import { uploadToCloudinary } from "../../../services/uploadService"; // Import uploadToCloudinary
import { countryService } from "../../../services/countryManagement/countryService"; // Thêm import

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const PersonManagement = () => {
  const [persons, setPersons] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPerson, setEditingPerson] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // State to manage uploaded files for Ant Design Upload
  const [activeTab, setActiveTab] = useState("ACTOR");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchPersons();
    fetchCountries();
  }, []);

  const fetchPersons = async () => {
    setLoading(true);
    try {
      const response = await personService.getAllPersons();
      // Assuming your person API response has a similar structure to movie/genre API
      setPersons(response.result.content);
    } catch (error) {
      message.error("Failed to fetch persons.");
      console.error("Error fetching persons:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await countryService.getAllCountries();
      setCountries(response.result.content);
    } catch (error) {
      message.error("Không thể tải danh sách quốc gia");
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
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Occupation",
      dataIndex: "occupation",
      key: "occupation",
      render: (occupation) => (
        <Tag color={occupation === "DIRECTOR" ? "geekblue" : "green"}>
          {occupation === "DIRECTOR" ? "Đạo diễn" : "Diễn viên"}
        </Tag>
      ),
    },
    {
      title: "Birth Date",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : ""),
      sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
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
            title="Are you sure you want to delete this person?"
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
    setEditingPerson(null);
    form.resetFields();
    setFileList([]);
    setActiveTab("ACTOR");
    setIsModalVisible(true);
    form.setFieldsValue({ occupation: "ACTOR" });
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setActiveTab(person.occupation || "ACTOR");
    form.setFieldsValue({
      ...person,
      occupation: person.occupation || "ACTOR",
      countryId: person.countryId,
      birthDate: person.birthDate ? moment(person.birthDate) : null,
      images: person.images
        ? person.images.map((url, index) => ({
            uid: `${url}-${index}`,
            name: url.substring(url.lastIndexOf("/") + 1),
            status: "done",
            url: url,
          }))
        : [],
    });
    setFileList(
      person.images
        ? person.images.map((url, index) => ({
            uid: `${url}-${index}`,
            name: url.substring(url.lastIndexOf("/") + 1),
            status: "done",
            url: url,
          }))
        : []
    );
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await personService.deletePerson(id);
      message.success("Xóa Person thành công");
      fetchPersons(); // Re-fetch persons after deletion
    } catch (error) {
      message.error("Failed to delete person.");
      console.error("Error deleting person:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true); // Set loading true during image upload and API call

      const imageUrls = [];
      for (const file of fileList) {
        if (file.originFileObj) {
          // New file to upload
          try {
            const url = await uploadToCloudinary(file.originFileObj);
            imageUrls.push(url);
          } catch (uploadError) {
            message.error(`Failed to upload image: ${file.name}`);
            console.error("Cloudinary upload error:", uploadError);
            setLoading(false);
            return; // Stop if any upload fails
          }
        } else if (file.url) {
          // Existing file (from editing a person with existing images)
          imageUrls.push(file.url);
        }
      }

      const payload = {
        ...values,
        // Convert moment object to "YYYY-MM-DD" string for API
        birthDate: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD")
          : null,
        images: imageUrls, // Send the array of URLs
      };

      if (editingPerson) {
        await personService.updatePerson(editingPerson.id, payload);
        message.success("Cập nhật Person thành công");
      } else {
        await personService.createPerson(payload);
        message.success("Thêm Person thành công");
      }
      setIsModalVisible(false);
      setLoading(false); // Set loading false after API call
      fetchPersons(); // Re-fetch persons after add/update
    } catch (error) {
      message.error("Failed to save person.");
      console.error("Error saving person:", error);
      setLoading(false); // Ensure loading is false on error
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // You might also want to update the form's field value if validation depends on fileList
    form.setFieldsValue({ images: newFileList });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    form.setFieldsValue({ occupation: key });
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchText.toLowerCase())
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
          placeholder="Tìm kiếm Person..."
          prefix={<SearchOutlined />}
          style={{ width: "300px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Person
        </Button>
      </div>

      {loading && persons.length === 0 ? ( // Only show "Loading..." if initial fetch is ongoing
        <p>Loading persons...</p>
      ) : filteredPersons.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontSize: "18px",
            color: "#888",
          }}
        >
          Chưa có người nào
        </p>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPersons}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading} // Keep loading state for table during re-fetches
        />
      )}

      <Modal
        title={editingPerson ? "Sửa Person" : "Thêm Person"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setFileList([]);
          form.resetFields();
        }}
        width={600}
      >
        <Tabs activeKey={activeTab} onChange={handleTabChange} style={{ marginBottom: 16 }}>
          <TabPane tab="Diễn viên" key="ACTOR" />
          <TabPane tab="Đạo diễn" key="DIRECTOR" />
        </Tabs>
        <Form form={form} layout="vertical">
          <Form.Item name="occupation" initialValue={activeTab} style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập tên Person" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô Tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="birthYear"
            label="Năm Sinh"
            rules={[
              { required: true, message: "Vui lòng nhập năm sinh" },
              {
                pattern: /^[0-9]{4}$/,
                message: "Năm sinh phải gồm 4 chữ số",
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const year = Number(value);
                  const currentYear = new Date().getFullYear();
                  if (year < 1800 || year > currentYear) {
                    return Promise.reject("Năm sinh không hợp lệ");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Nhập năm sinh, ví dụ: 1990" maxLength={4} />
          </Form.Item>
          <Form.Item
            name="height"
            label="Chiều Cao (mét)"
            rules={[{ message: "Vui lòng nhập chiều cao" }]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>
          <Form.Item
            name="biography"
            label="Tiểu Sử"
            rules={[{ required: true, message: "Vui lòng nhập tiểu sử" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="countryId"
            label="Quốc Gia"
            rules={[{ required: true, message: "Vui lòng chọn quốc gia" }]}
          >
            <Select
              showSearch
              placeholder="Chọn quốc gia"
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
            name="images"
            label="Hình Ảnh"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                message: "Vui lòng tải lên ít nhất một hình ảnh",
              },
            ]}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              accept="image/*"
              multiple
            >
              {fileList.length < 5 && (
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonManagement;
