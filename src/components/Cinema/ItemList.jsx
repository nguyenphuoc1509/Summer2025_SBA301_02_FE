import React from "react";

const ItemList = ({ items }) => (
  <div className="flex flex-col gap-2 max-w-7xl mx-auto">
    {items.map((movie, idx) => (
      <div
        key={movie.id || idx}
        className="bg-transparent rounded-lg p-2 flex gap-4"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-72 h-48 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{movie.title}</h3>
          <div className="flex items-center gap-2 my-2">
            <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
              <i className="fa fa-eye mr-1"></i>
              {movie.views.toLocaleString()}
            </span>
          </div>
          <p className="text-gray-500 text-sm line-clamp-2">
            {movie.description}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default ItemList;
