import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import img1 from "../assets/images/carousel_01.jpg";
import img2 from "../assets/images/carousel_02.jpg";
import img3 from "../assets/images/carousel_03.jpg";
import img4 from "../assets/images/carousel_04.jpg";

// Predefined carousel items - easy to modify
const carouselItems = [
  {
    id: 1,
    imageSrc: img1,
    altText: "Phim Mụng Tử Tuổi",
    href: "/phim/mung-tu-tuoi",
  },
  {
    id: 2,
    imageSrc: img2,
    altText: "Phim Quán Hiền",
    href: "/phim/quan-hien",
  },
  {
    id: 3,
    imageSrc: img3,
    altText: "Gojira: Minus One",
    href: "/phim/gojira-minus-one",
  },
  {
    id: 4,
    imageSrc: img4,
    altText: "Dune: Part Two",
    href: "/phim/dune-2",
  },
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = carouselItems.length;
  const timeoutRef = useRef(null);
  const slideInterval = 5000; // Auto slide every 5 seconds

  // Function to go to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Function to go to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // Function to go to a specific slide
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Reset the auto slide timer
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Effect for auto sliding
  useEffect(() => {
    resetTimeout();

    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, slideInterval);
    }

    return () => {
      resetTimeout();
    };
  }, [currentSlide, isPaused]);

  return (
    <div
      className="relative w-full overflow-hidden h-[500px] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselItems.map((item) => (
          <div key={item.id} className="min-w-full h-full flex-shrink-0">
            <a href={item.href} className="block w-full h-full">
              <div className="relative w-full h-full bg-gray-200">
                <img
                  src={item.imageSrc}
                  alt={item.altText}
                  className="w-full h-full object-cover absolute top-0 left-0"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.classList.add(
                      "flex",
                      "items-center",
                      "justify-center"
                    );
                    const textElement = document.createElement("span");
                    textElement.textContent =
                      item.altText || "Hình ảnh không khả dụng";
                    textElement.className = "text-gray-500 text-lg font-medium";
                    e.target.parentNode.appendChild(textElement);
                  }}
                />
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
