import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import {
  MdOutlineCampaign,
  MdEventAvailable,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { SiTicktick } from "react-icons/si";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { title: "Tổng quan", icon: RiDashboardLine, path: "/admin" },
    { title: "Quản lí người dùng", icon: FiUsers, path: "/admin/users" },
    {
      title: "Quản lí phim",
      icon: SiTicktick,
      path: "/admin/verify-users",
    },
    { title: "Quản lí rạp", icon: MdOutlineCampaign, path: "/admin/cinemas" },
    {
      title: "Quản lí lịch chiếu",
      icon: MdEventAvailable,
      path: "/admin/schedules",
    },
    {
      title: "Quản lí blog",
      icon: MdProductionQuantityLimits,
      path: "/admin/blogs",
    },
    // { title: "Analytics", icon: IoStatsChartOutline, path: "/admin/analytics" },
    // { title: "Settings", icon: FiSettings, path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm h-[calc(100vh-64px)] fixed top-16">
      <div className="p-4 overflow-y-auto h-full">
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/admin" && location.pathname === "/admin/");

              return (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${isActive ? "text-blue-700" : ""}`}
                    />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
