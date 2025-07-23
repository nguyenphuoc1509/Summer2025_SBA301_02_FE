import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { personService } from "../../../services/personManagement/personService";

const DirectorDetail = () => {
  const { id } = useParams();
  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDirectorDetails = async () => {
      setLoading(true);
      try {
        const response = await personService.getPersonById(id);
        if (response && response.result) {
          setDirector(response.result);
        }
      } catch (error) {
        console.error("Error fetching director details:", error);
        setError("Không thể tải thông tin đạo diễn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!director) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl">Không tìm thấy thông tin đạo diễn</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            {director.images && director.images.length > 0 ? (
              <img
                className="w-full h-96 object-cover object-center"
                src={director.images[0]}
                alt={director.name}
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Không có hình ảnh</span>
              </div>
            )}
          </div>
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {director.name}
            </h1>
            <div className="text-sm text-gray-600 mb-4">
              <span className="mr-4">
                <span className="font-medium">Quốc gia:</span>{" "}
                {director.country || "Không có thông tin"}
              </span>
              <span className="mr-4">
                <span className="font-medium">Ngày sinh:</span>{" "}
                {director.birthDate
                  ? new Date(director.birthDate).toLocaleDateString("vi-VN")
                  : "Không có thông tin"}
              </span>
              <span>
                <span className="font-medium">Chiều cao:</span>{" "}
                {director.height
                  ? `${director.height} cm`
                  : "Không có thông tin"}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h2 className="text-xl font-semibold mb-3">Mô tả</h2>
              <p className="text-gray-700 mb-4">
                {director.description || "Không có mô tả"}
              </p>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h2 className="text-xl font-semibold mb-3">Tiểu sử</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {director.biography || "Không có thông tin tiểu sử"}
              </p>
            </div>
          </div>
        </div>

        {/* Phần hiển thị thêm thông tin và các tác phẩm - có thể mở rộng sau */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Các tác phẩm nổi bật</h2>
          <div className="text-center text-gray-500 py-8">
            Dữ liệu về tác phẩm đang được cập nhật
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDetail;
