import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { events } from "./mockData";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === parseInt(id)) || events[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/uu-dai")}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeftOutlined className="mr-2" />
        Quay lại
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-96 object-cover"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {event.title}
          </h1>
          <p className="text-gray-500 mb-6">{event.date}</p>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Chi tiết chương trình
            </h2>
            <p className="text-gray-600 mb-6">{event.description}</p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Điều kiện áp dụng
            </h2>
            <ul className="list-disc list-inside space-y-2 mb-6">
              {event.details.map((detail, index) => (
                <li key={index} className="text-gray-600">
                  {detail}
                </li>
              ))}
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                <span className="font-semibold">Lưu ý:</span> {event.terms}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
