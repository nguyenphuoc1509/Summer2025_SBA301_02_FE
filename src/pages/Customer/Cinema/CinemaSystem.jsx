import React, { useState, useEffect } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import scheduleService from "../../../services/scheduleManagement";
import cinemaService from "../../../services/cinemaManagement/cinemaService";

const CinemaSystem = () => {
  const [cinemas, setCinemas] = useState([]);
  const [filteredCinemas, setFilteredCinemas] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState({});
  const [scheduleData, setScheduleData] = useState({});
  const [scheduleLoading, setScheduleLoading] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Fetch cinemas from API
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await cinemaService.getAllCinemasCustomer();

        if (response.code === 200) {
          setCinemas(response.result);
          setFilteredCinemas(response.result);
        } else {
          setCinemas([]);
          setFilteredCinemas([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching cinemas:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu rạp chiếu");
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  // Filter by province
  useEffect(() => {
    if (selectedProvince === "all") {
      setFilteredCinemas(cinemas);
    } else {
      setFilteredCinemas(
        cinemas.filter((cinema) => cinema.province === selectedProvince)
      );
    }
  }, [selectedProvince, cinemas]);

  // Function to format date to LocalDateTime format
  const formatDateToLocalDateTime = (dateString) => {
    // Tạo LocalDateTime với thời gian 00:00:00
    return `${dateString}T00:00:00`;
  };

  // Fetch schedule for specific cinema
  const fetchSchedule = async (cinemaId) => {
    try {
      setScheduleLoading((prev) => ({ ...prev, [cinemaId]: true }));

      // Format date to LocalDateTime format
      const formattedDate = formatDateToLocalDateTime(selectedDate);

      const response = await scheduleService.getShowtimesByCinema(
        cinemaId,
        formattedDate
      );

      if (response.code === 200) {
        setScheduleData((prev) => ({
          ...prev,
          [cinemaId]: response.result,
        }));
      } else {
        setScheduleData((prev) => ({
          ...prev,
          [cinemaId]: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setScheduleData((prev) => ({
        ...prev,
        [cinemaId]: [],
      }));
    } finally {
      setScheduleLoading((prev) => ({ ...prev, [cinemaId]: false }));
    }
  };

  // Toggle schedule display
  const toggleSchedule = (cinemaId) => {
    const isCurrentlyShowing = showSchedule[cinemaId];

    setShowSchedule((prev) => ({
      ...prev,
      [cinemaId]: !isCurrentlyShowing,
    }));

    // Fetch schedule data if not already loaded and showing
    if (!isCurrentlyShowing && !scheduleData[cinemaId]) {
      fetchSchedule(cinemaId);
    }
  };

  // Refetch schedule when date changes
  useEffect(() => {
    Object.keys(showSchedule).forEach((cinemaId) => {
      if (showSchedule[cinemaId]) {
        fetchSchedule(cinemaId);
      }
    });
  }, [selectedDate]);

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      // Handle both HH:mm:ss and HH:mm formats
      const timeParts = timeString.split(":");
      const hours = timeParts[0];
      const minutes = timeParts[1];
      return `${hours}:${minutes}`;
    } catch (error) {
      return timeString;
    }
  };

  // Group schedules by movie
  const groupSchedulesByMovie = (schedules) => {
    if (!schedules || !Array.isArray(schedules)) return {};

    return schedules.reduce((acc, schedule) => {
      const movieName = schedule.movie?.name || "Không có tên phim";
      if (!acc[movieName]) {
        acc[movieName] = {
          movie: schedule.movie,
          showtimes: [],
        };
      }
      acc[movieName].showtimes.push(schedule);
      return acc;
    }, {});
  };

  // Get unique provinces from API data
  const uniqueProvinces = [
    ...new Set(cinemas.map((cinema) => cinema.province)),
  ];

  // Retry function
  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Format display date
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu rạp chiếu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Hệ Thống Rạp Chiếu
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              Khám phá {cinemas.length} rạp chiếu phim trên toàn hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Province Filter */}
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Lọc theo khu vực:
              </span>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả khu vực</option>
                {uniqueProvinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-4">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Chọn ngày:
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              Hiển thị {filteredCinemas.length} rạp chiếu
              {selectedProvince !== "all" && ` tại ${selectedProvince}`}
            </p>
          </div>
        </div>

        {/* Cinema Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredCinemas.map((cinema) => (
            <div
              key={cinema.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Cinema Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {cinema.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {cinema.province}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        cinema.active ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        cinema.active ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {cinema.active ? "Đang hoạt động" : "Tạm nghỉ"}
                    </span>
                  </div>
                </div>

                {/* Cinema Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {cinema.address}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <a
                      href={`tel:${cinema.hotline}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {cinema.hotline}
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => toggleSchedule(cinema.id)}
                    disabled={!cinema.active}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-colors text-sm font-medium ${
                      cinema.active
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {showSchedule[cinema.id]
                        ? "Ẩn Lịch Chiếu"
                        : "Xem Lịch Chiếu"}
                    </span>
                  </button>
                </div>

                {/* Schedule Section */}
                {showSchedule[cinema.id] && cinema.active && (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <ClockIcon className="h-5 w-5 text-gray-500" />
                      <h4 className="text-lg font-medium text-gray-900">
                        Lịch chiếu {formatDisplayDate(selectedDate)}
                      </h4>
                    </div>

                    {scheduleLoading[cinema.id] ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">
                          Đang tải lịch chiếu...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.keys(
                          groupSchedulesByMovie(scheduleData[cinema.id])
                        ).length > 0 ? (
                          Object.entries(
                            groupSchedulesByMovie(scheduleData[cinema.id])
                          ).map(([movieName, data]) => (
                            <div
                              key={movieName}
                              className="bg-gray-50 rounded-lg p-4"
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                {data.movie?.image && (
                                  <img
                                    src={data.movie.image}
                                    alt={movieName}
                                    className="w-16 h-20 object-cover rounded"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                )}
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {movieName}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {data.movie?.duration &&
                                      `${data.movie.duration}p`}
                                    {data.movie?.genre &&
                                      ` • ${data.movie.genre}`}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {data.showtimes.map((showtime) => (
                                  <div
                                    key={showtime.id}
                                    className="bg-white border rounded-lg p-2 hover:shadow-sm transition-shadow cursor-pointer"
                                  >
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatTime(showtime.startTime)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {showtime.room?.name ||
                                        "Phòng không xác định"}
                                    </div>
                                    <div className="text-xs text-blue-600 font-medium">
                                      {showtime.price?.toLocaleString("vi-VN")}đ
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>Không có lịch chiếu cho ngày này</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCinemas.length === 0 && (
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Không tìm thấy rạp chiếu nào trong khu vực này
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CinemaSystem;
