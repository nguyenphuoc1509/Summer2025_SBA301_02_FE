import React, { useState, useEffect } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  StarIcon,
  TicketIcon,
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
    return `${dateString}T00:00:00`;
  };

  // Fetch schedule for specific cinema
  const fetchSchedule = async (cinemaId) => {
    try {
      setScheduleLoading((prev) => ({ ...prev, [cinemaId]: true }));

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
      const date = new Date(timeString);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return timeString;
    }
  };

  // Group schedules by movie
  const groupSchedulesByMovie = (movies) => {
    if (!movies || !Array.isArray(movies)) return {};

    const result = {};

    movies.forEach((movie) => {
      result[movie.movieId] = {
        movie: {
          id: movie.movieId,
          name: movie.movieName,
          image: movie.moviePosterUrl,
          duration: movie.movieDuration,
          rating: movie.movieRating,
          releaseDate: movie.movieReleaseDate,
        },
        showtimes: movie.showTimes.map((showtime) => ({
          id: showtime.showTimeId,
          startTime: showtime.showTime,
          room: { name: `Phòng ${showtime.roomId}`, id: showtime.roomId },
          roomType: showtime.roomType,
        })),
      };
    });

    return result;
  };

  // Get unique provinces from API data
  const uniqueProvinces = [
    ...new Set(cinemas.map((cinema) => cinema.province)),
  ];

  // Get price based on room type
  const getPriceByRoomType = (roomType) => {
    switch (roomType) {
      case "STANDARD":
        return 90000;
      case "VIP":
        return 120000;
      case "IMAX":
        return 150000;
      default:
        return 90000;
    }
  };

  // Get room type badge color
  const getRoomTypeBadgeColor = (roomType) => {
    switch (roomType) {
      case "STANDARD":
        return "bg-blue-100 text-blue-800";
      case "VIP":
        return "bg-purple-100 text-purple-800";
      case "IMAX":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format display date
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Đang tải dữ liệu rạp chiếu...
          </p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Oops! Có lỗi xảy ra
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Hệ Thống Rạp Chiếu
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Khám phá{" "}
                <span className="font-semibold text-blue-600">
                  {cinemas.length} rạp chiếu phim
                </span>{" "}
                hiện đại trên toàn quốc
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Province Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Khu vực:
                </span>
              </div>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Ngày chiếu:
                </span>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Hiển thị{" "}
                  <span className="font-semibold text-blue-600">
                    {filteredCinemas.length}
                  </span>{" "}
                  rạp chiếu
                  {selectedProvince !== "all" && (
                    <span className="text-gray-500">
                      {" "}
                      tại {selectedProvince}
                    </span>
                  )}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {formatDisplayDate(selectedDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Cinema Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCinemas.map((cinema) => (
            <div
              key={cinema.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Cinema Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{cinema.name}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                        {cinema.province}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            cinema.active ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                        <span className="text-sm">
                          {cinema.active ? "Đang hoạt động" : "Tạm nghỉ"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Cinema Info */}
                <div className="space-y-3 mb-6">
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
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {cinema.hotline}
                    </a>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => toggleSchedule(cinema.id)}
                  disabled={!cinema.active}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 font-medium ${
                    cinema.active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <TicketIcon className="h-5 w-5" />
                  <span>
                    {showSchedule[cinema.id]
                      ? "Ẩn Lịch Chiếu"
                      : "Xem Lịch Chiếu"}
                  </span>
                </button>

                {/* Schedule Section */}
                {/* Schedule Section */}
                {showSchedule[cinema.id] && cinema.active && (
                  <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                      <h4 className="text-lg font-medium text-gray-900">
                        Lịch chiếu – {formatDisplayDate(selectedDate)}
                      </h4>
                    </div>

                    {scheduleLoading[cinema.id] ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
                        <span className="ml-2 text-gray-600 text-sm">
                          Đang tải...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {scheduleData[cinema.id]?.length > 0 ? (
                          Object.entries(
                            groupSchedulesByMovie(scheduleData[cinema.id])
                          ).map(([movieId, { movie, showtimes }]) => (
                            <div
                              key={movieId}
                              className="flex items-center bg-white rounded-lg p-3 shadow-sm"
                            >
                              {movie.image && (
                                <img
                                  src={movie.image}
                                  alt={movie.name}
                                  className="w-12 h-16 object-cover rounded"
                                />
                              )}
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between items-center">
                                  <h5 className="text-sm font-semibold text-gray-900">
                                    {movie.name}
                                  </h5>
                                  <span className="text-xs text-gray-500">
                                    {movie.duration}p • {movie.rating}
                                  </span>
                                </div>
                                <div className="mt-2 flex space-x-2 overflow-x-auto">
                                  {showtimes.map((s) => (
                                    <div
                                      key={s.id}
                                      className="flex-shrink-0 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap"
                                    >
                                      {formatTime(s.startTime)} | {s.room.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-gray-500 text-sm">
                            Không có lịch chiếu cho ngày này
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
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BuildingStorefrontIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy rạp chiếu
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Không có rạp chiếu nào trong khu vực này. Hãy thử chọn khu vực
              khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CinemaSystem;
