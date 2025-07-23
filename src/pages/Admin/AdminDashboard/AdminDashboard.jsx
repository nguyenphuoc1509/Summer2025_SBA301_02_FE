import React, { useState, useEffect } from "react";
import {
  BarChartOutlined,
  UsergroupAddOutlined,
  VideoCameraOutlined,
  ShopOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

import StatCard from "../../../components/Dashboard/StatCard";
import RevenueChart from "../../../components/Dashboard/RevenueChart";
import TopMoviesTable from "../../../components/Dashboard/TopMoviesTable";
import CinemaPerformance from "../../../components/Dashboard/CinemaPerformance";
import RecentBookingsTable from "../../../components/Dashboard/RecentBookingsTable";
import DateRangePicker from "../../../components/Dashboard/DateRangePicker";

import {
  getDashboard,
  getAdminDashboard,
  getQuickDashboard,
} from "../../../services/dashboardService";

const formatCurrency = (value) => {
  if (!value) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const startDateStr = dateRange.startDate.toISOString().split("T")[0];
      const endDateStr = dateRange.endDate.toISOString().split("T")[0];

      const response = await getAdminDashboard(startDateStr, endDateStr);
      setDashboardData(response.result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  const handleQuickPeriod = async (period) => {
    try {
      setLoading(true);
      const response = await getQuickDashboard(period);
      setDashboardData(response.result);

      // Update date range state to match the selected period
      let startDate = new Date();
      const endDate = new Date();

      switch (period) {
        case "today":
          startDate = new Date();
          break;
        case "week":
          startDate = new Date();
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "month":
          startDate = new Date();
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case "quarter":
          startDate = new Date();
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case "year":
          startDate = new Date();
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate = new Date();
          startDate.setDate(endDate.getDate() - 30);
      }

      setDateRange({ startDate, endDate });
    } catch (error) {
      console.error("Error fetching quick dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange.startDate, dateRange.endDate]);

  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-2xl font-semibold text-gray-500">Đang tải...</div>
      </div>
    );
  }

  const {
    overview,
    topMovies,
    revenueChart,
    cinemaPerformances,
    recentBookings,
  } = dashboardData || {};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Date Range Picker */}
      <div className="mb-6">
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(overview?.totalRevenue)}
          icon={<DollarCircleOutlined style={{ fontSize: "24px" }} />}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Doanh thu hôm nay"
          value={formatCurrency(overview?.todayRevenue)}
          icon={<DollarCircleOutlined style={{ fontSize: "24px" }} />}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Tổng lượt đặt vé"
          value={overview?.totalBookings}
          icon={<BarChartOutlined style={{ fontSize: "24px" }} />}
          colorClass="bg-purple-500"
        />
        <StatCard
          title="Đặt vé hôm nay"
          value={overview?.todayBookings}
          icon={<CalendarOutlined style={{ fontSize: "24px" }} />}
          colorClass="bg-yellow-500"
        />
        <StatCard
          title="Tổng số phim"
          value={overview?.totalMovies}
          icon={<VideoCameraOutlined style={{ fontSize: "24px" }} />}
          colorClass="bg-red-500"
        />
        <StatCard
          title="Tổng số rạp"
          value={overview?.totalCinemas}
          icon={<ShopOutlined style={{ fontSize: "24px" }} />}
          colorClass="bg-indigo-500"
        />
      </div>

      {/* Revenue Chart */}
      <div className="mb-6">
        <RevenueChart data={revenueChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Movies */}
        <TopMoviesTable movies={topMovies} />

        {/* Cinema Performance */}
        <CinemaPerformance cinemas={cinemaPerformances} />
      </div>

      {/* Recent Bookings */}
      <div className="mb-6">
        <RecentBookingsTable bookings={recentBookings} />
      </div>
    </div>
  );
};

export default AdminDashboard;
