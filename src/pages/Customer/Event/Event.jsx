import React from "react";
import { useNavigate } from "react-router-dom";
import { events } from "./mockData";

const Event = () => {
  const navigate = useNavigate();

  const handleEventClick = (eventId) => {
    navigate(`/uu-dai/${eventId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Ưu đãi đặc biệt
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event.id)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{event.description}</p>
              <p className="text-gray-500 text-sm">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Event;
