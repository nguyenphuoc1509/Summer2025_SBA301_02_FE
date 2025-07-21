import React, { useState, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userManagement/userService";
import axios from "axios";
import cinemaService from "../../services/cinemaManagement/cinemaService";
import scheduleService from "../../services/scheduleManagement";
import bookingService from "../../services/booking/bookingService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderAdmin = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBuyTicketModal, setShowBuyTicketModal] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new");
  const [step, setStep] = useState(1); // 1: chọn/tạo user, 2: chọn vé
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", phone: "", password: "" });
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [cinemaList, setCinemaList] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [loadingCinemas, setLoadingCinemas] = useState(false);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  // Dữ liệu mẫu phim, suất chiếu, ghế
  const movies = [
    { id: 1, name: "Avengers: Endgame" },
    { id: 2, name: "Spider-Man: No Way Home" },
  ];
  const seats = Array.from({ length: 12 }, (_, i) => `A${i + 1}`);
  // Thêm mapping cho roomType
  const ROOM_TYPE_CONFIG = {
    STANDARD: { rows: 6, columns: 6 },
    VIP: { rows: 7, columns: 5 },
    IMAX: { rows: 7, columns: 6 },
  };
  const [seatMap, setSeatMap] = useState([]);

  useEffect(() => {
    if (showBuyTicketModal && activeTab === "old") {
      setLoadingUsers(true);
      userService
        .getAllUsers()
        .then((res) => {
          console.log(res);
          // Lọc role CUSTOMER
          const users =
            res.result?.content?.filter((u) => u.roles?.includes("CUSTOMER")) ||
            [];
          setUserList(users);
        })
        .catch(() => setUserList([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [showBuyTicketModal, activeTab]);

  // Lấy danh sách rạp khi mở modal
  useEffect(() => {
    if (showBuyTicketModal) {
      setLoadingCinemas(true);
      cinemaService
        .getAllCinemas()
        .then((res) => {
          setCinemaList(res.data?.result || res.result || []);
        })
        .catch(() => setCinemaList([]))
        .finally(() => setLoadingCinemas(false));
    }
  }, [showBuyTicketModal]);
  // Lấy lịch chiếu khi chọn rạp
  useEffect(() => {
    if (selectedCinema) {
      setLoadingShowtimes(true);
      scheduleService
        .getShowtimesByCinema(selectedCinema)
        .then((res) => {
          // Giả sử res.data.result là response trả về
          const raw = res.data?.result || res.result || [];
          const flatShowtimes = [];
          raw.forEach((movie) => {
            (movie.showTimes || []).forEach((st) => {
              flatShowtimes.push({
                id: st.showTimeId,
                label: `${movie.movieName} - ${new Date(
                  st.showTime
                ).toLocaleString()} - ${st.roomType}`,
                ...st,
                movieName: movie.movieName,
                moviePosterUrl: movie.moviePosterUrl,
              });
            });
          });
          setShowtimes(flatShowtimes);
        })
        .catch(() => setShowtimes([]))
        .finally(() => setLoadingShowtimes(false));
    } else {
      setShowtimes([]);
    }
  }, [selectedCinema]);

  // Khi selectedShowtime thay đổi, cập nhật seatMap và bookedSeats
  useEffect(() => {
    if (!selectedShowtime) {
      setSeatMap([]);
      setBookedSeats([]);
      return;
    }
    const stObj = showtimes.find(
      (s) => String(s.id) === String(selectedShowtime)
    );
    if (!stObj) {
      setSeatMap([]);
      setBookedSeats([]);
      return;
    }
    const config = ROOM_TYPE_CONFIG[stObj.roomType] || { rows: 6, columns: 6 };
    const rows = config.rows;
    const columns = config.columns;
    // Sinh tên ghế: A1, A2,..., B1,...
    const seats = [];
    for (let r = 0; r < rows; r++) {
      const rowChar = String.fromCharCode(65 + r); // A, B, C...
      for (let c = 1; c <= columns; c++) {
        seats.push(`${rowChar}${c}`);
      }
    }
    setSeatMap(seats);
    setSelectedSeats([]); // reset chọn ghế khi đổi suất chiếu
    // Gọi API lấy bookedSeats
    bookingService
      .getSeatMap(selectedShowtime)
      .then((res) => {
        setBookedSeats(
          res.data?.result?.bookedSeats || res.result?.bookedSeats || []
        );
      })
      .catch(() => setBookedSeats([]));
  }, [selectedShowtime, showtimes]);

  const handleLogout = () => {
    localStorage.clear("token");
    navigate("/admin");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-sky-500">GalaX</h2>
            <h2 className="text-2xl font-bold text-red-400">Cinema</h2>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              onClick={() => setShowBuyTicketModal(true)}
            >
              Mua vé
            </button>
            <button className="text-gray-600 hover:text-gray-800 relative">
              <IoNotificationsOutline className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                2
              </span>
            </button>

            <div className="relative">
              <button
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FaRegUser className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Admin User
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <IoLogOutOutline className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {showBuyTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowBuyTicketModal(false);
                setStep(1);
                setSelectedUser(null);
                setNewUser({ name: "", phone: "", password: "" });
                setActiveTab("new");
                setSelectedCinema("");
              }}
            >
              Đóng
            </button>
            <h2 className="text-xl font-bold mb-4">Hỗ trợ mua vé</h2>
            {step === 1 && (
              <>
                <div className="flex mb-4 border-b">
                  <button
                    className={`px-4 py-2 font-semibold ${
                      activeTab === "new"
                        ? "border-b-2 border-sky-500 text-sky-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("new")}
                  >
                    Khách mới
                  </button>
                  <button
                    className={`px-4 py-2 font-semibold ${
                      activeTab === "old"
                        ? "border-b-2 border-sky-500 text-sky-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("old")}
                  >
                    Khách cũ
                  </button>
                </div>
                {activeTab === "new" && (
                  <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await userService.quickCreateCustomer(
                          newUser.phone,
                          newUser.name
                        );
                        const user = res.data?.result || res.result;
                        setSelectedUser({
                          id: user?.id,
                          fullName: user?.fullName || newUser.name,
                          phone: user?.email || newUser.phone,
                          email: user?.email,
                        });
                        setStep(2);
                        setNewUser({ name: "", phone: "", password: "" }); // reset form
                        toast.success("Tạo tài khoản thành công!");
                      } catch (err) {
                        toast.error("Tạo tài khoản thất bại!");
                      }
                    }}
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Họ tên
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            name: e.target.value,
                            password: newUser.phone,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full border rounded px-3 py-2"
                        value={newUser.phone}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            phone: e.target.value,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Mật khẩu (mặc định là email)
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 bg-gray-100"
                        value={newUser.phone}
                        readOnly
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded font-semibold mt-2"
                    >
                      Tạo tài khoản & tiếp tục
                    </button>
                  </form>
                )}
                {activeTab === "old" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tìm kiếm khách hàng
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 mb-2"
                      placeholder="Nhập tên, email hoặc số điện thoại..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="max-h-32 overflow-y-auto border rounded">
                      {loadingUsers ? (
                        <div className="px-4 py-2 text-gray-400">
                          Đang tải...
                        </div>
                      ) : (
                        userList
                          .filter(
                            (u) =>
                              !search ||
                              u.fullName
                                ?.toLowerCase()
                                .includes(search.toLowerCase()) ||
                              u.username
                                ?.toLowerCase()
                                .includes(search.toLowerCase()) ||
                              u.phone?.includes(search)
                          )
                          .map((u) => (
                            <button
                              key={u.id}
                              className="block w-full text-left px-4 py-2 hover:bg-sky-100"
                              onClick={() => {
                                setSelectedUser(u);
                                setStep(2);
                              }}
                            >
                              {u.fullName || u.username} - {u.phone || u.email}
                            </button>
                          ))
                      )}
                      {!loadingUsers &&
                        userList.filter(
                          (u) =>
                            !search ||
                            u.fullName
                              ?.toLowerCase()
                              .includes(search.toLowerCase()) ||
                            u.username
                              ?.toLowerCase()
                              .includes(search.toLowerCase()) ||
                            u.phone?.includes(search)
                        ).length === 0 && (
                          <div className="px-4 py-2 text-gray-400">
                            Không tìm thấy khách hàng
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </>
            )}
            {step === 2 && (
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBookingLoading(true);
                  setBookingError("");
                  setBookingSuccess("");
                  try {
                    // Gọi API đặt vé offline qua bookingService
                    await bookingService.bookSeatsOffline(
                      selectedCinema,
                      selectedUser.id,
                      selectedShowtime,
                      selectedSeats
                    );
                    setBookingSuccess("Đặt vé thành công!");
                    setShowBuyTicketModal(false);
                    setStep(1);
                    setSelectedUser(null);
                    setSelectedMovie("");
                    setSelectedShowtime("");
                    setSelectedSeats([]);
                    setSearch("");
                    setActiveTab("old");
                    setSelectedCinema("");
                    toast.success("Đặt vé thành công!");
                  } catch (err) {
                    setBookingError("Đặt vé thất bại!");
                    toast.error("Đặt vé thất bại!");
                  } finally {
                    setBookingLoading(false);
                  }
                }}
              >
                <div className="mb-2 text-sm text-gray-600">
                  Khách hàng:{" "}
                  <span className="font-semibold">
                    {selectedUser?.fullName || selectedUser?.username} -{" "}
                    {selectedUser?.phone || selectedUser?.email}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Chọn rạp
                  </label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedCinema}
                    onChange={(e) => {
                      setSelectedCinema(e.target.value);
                      setSelectedShowtime("");
                    }}
                    required
                  >
                    <option value="">-- Chọn rạp --</option>
                    {cinemaList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.cinemaName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Chọn suất chiếu
                  </label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedShowtime}
                    onChange={(e) => setSelectedShowtime(e.target.value)}
                    required
                    disabled={!selectedCinema || loadingShowtimes}
                  >
                    <option value="">-- Chọn suất chiếu --</option>
                    {loadingShowtimes && <option disabled>Đang tải...</option>}
                    {showtimes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Giữ nguyên phần chọn ghế */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Chọn ghế
                  </label>
                  <div
                    className={`grid gap-2`}
                    style={{
                      gridTemplateColumns: `repeat(${(() => {
                        const stObj = showtimes.find(
                          (s) => String(s.id) === String(selectedShowtime)
                        );
                        if (!stObj) return 6;
                        const config = ROOM_TYPE_CONFIG[stObj.roomType] || {
                          columns: 6,
                        };
                        return config.columns;
                      })()}, minmax(0, 1fr))`,
                    }}
                  >
                    {seatMap.map((seat) => {
                      const isBooked = bookedSeats.includes(seat);
                      return (
                        <button
                          type="button"
                          key={seat}
                          className={`border rounded px-2 py-1 text-sm ${
                            isBooked
                              ? "bg-red-400 text-white cursor-not-allowed"
                              : selectedSeats.includes(seat)
                              ? "bg-sky-500 text-white"
                              : "bg-gray-100"
                          }`}
                          onClick={() => {
                            if (isBooked) return;
                            setSelectedSeats(
                              selectedSeats.includes(seat)
                                ? selectedSeats.filter((s) => s !== seat)
                                : [...selectedSeats, seat]
                            );
                          }}
                          disabled={isBooked}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold mt-2"
                  disabled={
                    !selectedCinema ||
                    !selectedShowtime ||
                    selectedSeats.length === 0 ||
                    bookingLoading
                  }
                >
                  {bookingLoading ? "Đang đặt vé..." : "Xác nhận mua vé"}
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded font-semibold mt-2"
                  onClick={() => {
                    setStep(1);
                    setSelectedUser(null);
                    setSelectedMovie("");
                    setSelectedShowtime("");
                    setSelectedSeats([]);
                    setSearch("");
                    setActiveTab("old");
                    setSelectedCinema("");
                  }}
                >
                  Quay lại
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderAdmin;
