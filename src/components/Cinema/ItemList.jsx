import React from "react";
import { Link } from "react-router-dom";

const ItemList = ({ items }) => (
  <div className="flex flex-col gap-2 max-w-7xl mx-auto">
    {items.map((item, idx) => (
      <div
        key={item.id || idx}
        className="bg-transparent rounded-lg p-2 flex gap-4 hover:bg-gray-50 transition-colors"
      >
        {item.linkTo ? (
          <Link to={item.linkTo} className="w-72 h-48">
            <img
              src={item.poster}
              alt={item.title}
              className="w-full h-full object-cover rounded"
            />
          </Link>
        ) : (
          <img
            src={item.poster}
            alt={item.title}
            className="w-72 h-48 object-cover rounded"
          />
        )}
        <div className="flex-1">
          {item.linkTo ? (
            <Link to={item.linkTo}>
              <h3 className="text-xl font-semibold hover:text-sky-700">
                {item.title}
              </h3>
            </Link>
          ) : (
            <h3 className="text-xl font-semibold">{item.title}</h3>
          )}
          <div className="flex items-center gap-2 my-2">
            <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
              <i className="fa fa-eye mr-1"></i>
              {item.views.toLocaleString()}
            </span>
            {item.country && (
              <span className="bg-sky-100 px-2 py-1 rounded text-sm text-sky-700">
                {item.country}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm line-clamp-3">
            {item.description}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default ItemList;
