import React, { useState } from "react";
import Stepper from "../../../components/Stepper";
import DropdownSection from "../../../components/DropdownSection";
import ChooseSeat from "./ChooseSeat";
import Payment from "./Payment";
import Confirm from "./Confirm";

const LOCATIONS = [
  "TP Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bến Tre",
  "Cà Mau",
  "Đắk Lắk",
  "Hải Phòng",
  "Khánh Hòa",
  "Nghệ An",
  "Thừa Thiên Huế",
];
const MOVIES = [
  { id: 1, name: "Avengers: Endgame" },
  { id: 2, name: "Spider-Man: No Way Home" },
  { id: 3, name: "Minions: The Rise of Gru" },
];
const SHOWTIMES = ["10:00", "13:00", "16:00", "19:00", "21:30"];

const Ticket = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [openDropdown, setOpenDropdown] = useState({
    location: true,
    movie: false,
    showtime: false,
  });
  const [selected, setSelected] = useState({
    location: "",
    movie: null,
    showtime: "",
    seats: [],
  });

  // Xử lý chọn
  const handleSelect = (type, value) => {
    setSelected((prev) => ({
      ...prev,
      [type]: value,
      ...(type === "location" ? { movie: null, showtime: "" } : {}),
      ...(type === "movie" ? { showtime: "" } : {}),
    }));
    // Mở dropdown tiếp theo
    if (type === "location")
      setOpenDropdown({ location: false, movie: true, showtime: false });
    if (type === "movie")
      setOpenDropdown({ location: false, movie: false, showtime: true });
  };

  // Xử lý tiếp tục
  const handleNext = (data) => {
    if (currentStep === 1 && data && data.selectedSeats) {
      setSelected((prev) => ({ ...prev, seats: data.selectedSeats }));
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  };
  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  // Thông tin tổng kết
  const movieObj = MOVIES.find((m) => m.id === selected.movie);

  // Render từng bước
  let mainContent = null;
  if (currentStep === 0) {
    mainContent = (
      <div className="flex gap-12">
        {/* Bên trái: các lựa chọn */}
        <div className="flex-1">
          <DropdownSection
            title="Chọn vị trí"
            open={openDropdown.location}
            onToggle={() =>
              setOpenDropdown((o) => ({ ...o, location: !o.location }))
            }
          >
            <div className="flex flex-wrap gap-4">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  className={`px-6 py-3 rounded-lg border text-lg ${
                    selected.location === loc
                      ? "bg-orange-400 text-white border-orange-400"
                      : "bg-white border-gray-300 hover:border-orange-400"
                  }`}
                  onClick={() => handleSelect("location", loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </DropdownSection>

          <DropdownSection
            title="Chọn phim"
            open={openDropdown.movie}
            onToggle={() => setOpenDropdown((o) => ({ ...o, movie: !o.movie }))}
          >
            <div className="flex flex-wrap gap-4">
              {MOVIES.map((movie) => (
                <button
                  key={movie.id}
                  className={`px-6 py-3 rounded-lg border text-lg ${
                    selected.movie === movie.id
                      ? "bg-orange-400 text-white border-orange-400"
                      : "bg-white border-gray-300 hover:border-orange-400"
                  }`}
                  onClick={() => handleSelect("movie", movie.id)}
                  disabled={!selected.location}
                >
                  {movie.name}
                </button>
              ))}
            </div>
          </DropdownSection>

          <DropdownSection
            title="Chọn suất"
            open={openDropdown.showtime}
            onToggle={() =>
              setOpenDropdown((o) => ({ ...o, showtime: !o.showtime }))
            }
          >
            <div className="flex flex-wrap gap-4">
              {SHOWTIMES.map((time) => (
                <button
                  key={time}
                  className={`px-6 py-3 rounded-lg border text-lg ${
                    selected.showtime === time
                      ? "bg-orange-400 text-white border-orange-400"
                      : "bg-white border-gray-300 hover:border-orange-400"
                  }`}
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, showtime: time }))
                  }
                  disabled={!selected.movie}
                >
                  {time}
                </button>
              ))}
            </div>
          </DropdownSection>
        </div>

        {/* Bên phải: tổng kết và nút điều hướng */}
        <div className="w-[400px] bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-32 h-40 bg-gray-100 flex items-center justify-center rounded-lg">
                {/* Ảnh phim */}
                <svg
                  width="64"
                  height="64"
                  fill="none"
                  stroke="gray"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    strokeWidth="2"
                  />
                  <path d="M3 7l18 0" strokeWidth="2" />
                  <rect x="7" y="9" width="2" height="2" fill="gray" />
                  <rect x="11" y="9" width="2" height="2" fill="gray" />
                  <rect x="15" y="9" width="2" height="2" fill="gray" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-xl">
                  {movieObj ? movieObj.name : "-"}
                </div>
                <div className="text-base text-gray-500 mt-2">
                  {selected.location || "-"}
                </div>
                <div className="text-base text-gray-500 mt-2">
                  {selected.showtime || "-"}
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between items-center mt-6">
              <span className="font-semibold text-lg">Tổng cộng</span>
              <span className="text-orange-500 font-bold text-2xl">0 đ</span>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <button
              className="text-orange-400 font-semibold text-lg hover:underline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Quay lại
            </button>
            <button
              className="bg-orange-400 text-white px-10 py-3 rounded-lg font-semibold text-lg disabled:opacity-50 hover:bg-orange-500 transition-colors"
              onClick={() => handleNext()}
              disabled={
                !(selected.location && selected.movie && selected.showtime)
              }
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    );
  } else if (currentStep === 1) {
    mainContent = (
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <ChooseSeat onNext={handleNext} onBack={handleBack} data={selected} />
        </div>
      </div>
    );
  } else if (currentStep === 2) {
    mainContent = (
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <Payment />
          <div className="flex justify-between mt-8">
            <button
              className="text-orange-400 font-semibold text-lg hover:underline"
              onClick={handleBack}
            >
              Quay lại
            </button>
            <button
              className="bg-orange-400 text-white px-10 py-3 rounded-lg font-semibold text-lg hover:bg-orange-500 transition-colors"
              onClick={handleNext}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    );
  } else if (currentStep === 3) {
    mainContent = (
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <Confirm />
          <div className="flex justify-between mt-8">
            <button
              className="text-orange-400 font-semibold text-lg hover:underline"
              onClick={handleBack}
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Stepper currentStep={currentStep} />
        <div className="mt-8">{mainContent}</div>
      </div>
    </div>
  );
};

export default Ticket;
