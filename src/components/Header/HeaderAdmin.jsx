import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const HeaderAdmin = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBuyTicketModal, setShowBuyTicketModal] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const [step, setStep] = useState(1); // 1: chọn/tạo user, 2: chọn vé
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', phone: '', password: '' });
  const [search, setSearch] = useState('');
  const [userList] = useState([
    { id: 1, name: 'Nguyễn Văn A', phone: '0909123456' },
    { id: 2, name: 'Trần Thị B', phone: '0912345678' },
    // ... dữ liệu mẫu
  ]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  // Dữ liệu mẫu phim, suất chiếu, ghế
  const movies = [
    { id: 1, name: 'Avengers: Endgame' },
    { id: 2, name: 'Spider-Man: No Way Home' },
  ];
  const showtimes = [
    { id: 1, time: '10:00 20/06/2024' },
    { id: 2, time: '14:00 20/06/2024' },
  ];
  const seats = Array.from({ length: 12 }, (_, i) => `A${i + 1}`);

  const handleLogout = () => {
    localStorage.clear("token");
    navigate("/admin");
  };

  return (
    <>
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-sky-500">Galaxy</h2>
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
                setNewUser({ name: '', phone: '', password: '' });
                setActiveTab('new');
              }}
            >
              Đóng
            </button>
            <h2 className="text-xl font-bold mb-4">Hỗ trợ mua vé</h2>
            {step === 1 && (
              <>
                <div className="flex mb-4 border-b">
                  <button
                    className={`px-4 py-2 font-semibold ${activeTab === 'new' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('new')}
                  >
                    Khách mới
                  </button>
                  <button
                    className={`px-4 py-2 font-semibold ${activeTab === 'old' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('old')}
                  >
                    Khách cũ
                  </button>
                </div>
                {activeTab === 'new' && (
                  <form
                    className="space-y-4"
                    onSubmit={e => {
                      e.preventDefault();
                      setSelectedUser({ ...newUser, id: Date.now() });
                      setStep(2);
                    }}
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">Họ tên</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={newUser.name}
                        onChange={e => setNewUser({ ...newUser, name: e.target.value, password: newUser.phone })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        className="w-full border rounded px-3 py-2"
                        value={newUser.phone}
                        onChange={e => setNewUser({ ...newUser, phone: e.target.value, password: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mật khẩu (mặc định là số điện thoại)</label>
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
                {activeTab === 'old' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Tìm kiếm khách hàng</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 mb-2"
                      placeholder="Nhập tên hoặc số điện thoại..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    <div className="max-h-32 overflow-y-auto border rounded">
                      {userList.filter(u =>
                        u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.phone.includes(search)
                      ).map(u => (
                        <button
                          key={u.id}
                          className="block w-full text-left px-4 py-2 hover:bg-sky-100"
                          onClick={() => {
                            setSelectedUser(u);
                            setStep(2);
                          }}
                        >
                          {u.name} - {u.phone}
                        </button>
                      ))}
                      {userList.filter(u =>
                        u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.phone.includes(search)
                      ).length === 0 && (
                        <div className="px-4 py-2 text-gray-400">Không tìm thấy khách hàng</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            {step === 2 && (
              <form
                className="space-y-4"
                onSubmit={e => {
                  e.preventDefault();
                  setShowBuyTicketModal(false);
                  setStep(1);
                  setSelectedUser(null);
                  setNewUser({ name: '', phone: '', password: '' });
                  setActiveTab('new');
                  // Thông báo thành công (có thể dùng toast hoặc alert)
                  alert('Đặt vé thành công!');
                }}
              >
                <div className="mb-2 text-sm text-gray-600">
                  Khách hàng: <span className="font-semibold">{selectedUser?.name} - {selectedUser?.phone}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chọn phim</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedMovie}
                    onChange={e => setSelectedMovie(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn phim --</option>
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chọn suất chiếu</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedShowtime}
                    onChange={e => setSelectedShowtime(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn suất chiếu --</option>
                    {showtimes.map(s => (
                      <option key={s.id} value={s.id}>{s.time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chọn ghế</label>
                  <div className="grid grid-cols-6 gap-2">
                    {seats.map(seat => (
                      <button
                        type="button"
                        key={seat}
                        className={`border rounded px-2 py-1 text-sm ${selectedSeats.includes(seat) ? 'bg-sky-500 text-white' : 'bg-gray-100'}`}
                        onClick={() => setSelectedSeats(selectedSeats.includes(seat)
                          ? selectedSeats.filter(s => s !== seat)
                          : [...selectedSeats, seat])}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold mt-2"
                  disabled={!selectedMovie || !selectedShowtime || selectedSeats.length === 0}
                >
                  Xác nhận mua vé
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded font-semibold mt-2"
                  onClick={() => {
                    setStep(1);
                    setSelectedUser(null);
                    setNewUser({ name: '', phone: '', password: '' });
                    setActiveTab('new');
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
