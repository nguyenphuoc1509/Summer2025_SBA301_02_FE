import React from "react";
import { Clock, ThumbsUp } from "lucide-react";

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <a href={movie.href} className="block relative">
        <div className="relative pt-[150%] bg-gray-200 overflow-hidden">
          <img
            src={movie.posterSrc}
            alt={movie.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              const container = e.target.parentNode;
              const textContainer = document.createElement("div");
              textContainer.className =
                "absolute inset-0 flex items-center justify-center p-4 text-center";
              const textElement = document.createElement("span");
              textElement.textContent = movie.title || "Poster không khả dụng";
              textElement.className = "text-gray-500 font-medium";
              textContainer.appendChild(textElement);
              container.appendChild(textContainer);
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
          <button className="bg-orange-500 text-white py-3 px-6 mb-6 rounded-md font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Mua Vé
          </button>
        </div>
      </a>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Clock size={16} className="mr-1" />
          <span>{movie.duration}</span>
          <span className="mx-2">•</span>
          <ThumbsUp size={16} className="mr-1 text-yellow-500" />
          <span>{movie.rating}/10</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-1">{movie.category}</p>
      </div>
    </div>
  );
};

export default MovieCard;
