"use client";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const { totalStudents, totalCourses, totalVideos, totalEnrollments, enrollmentStats } = analyticsData;

  const barData = {
    labels: enrollmentStats.map((stat) => stat.courseTitle),
    datasets: [
      {
        label: "Enrollments",
        data: enrollmentStats.map((stat) => stat.enrollmentCount),
        backgroundColor: "#4caf50",
      },
    ],
  };

  const pieData = {
    labels: ["Students", "Courses", "Videos", "Enrollments"],
    datasets: [
      {
        data: [totalStudents, totalCourses, totalVideos, totalEnrollments],
        backgroundColor: ["#2196f3", "#ff9800", "#f44336", "#9c27b0"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Analytics Dashboard</h1>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-md font-semibold text-gray-600">Today Orders</h2>
          <p className="text-xl font-bold text-blue-500">$574.12</p>
          <p className="text-sm text-green-600">+427 compared to last week</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-md font-semibold text-gray-600">Today Earnings</h2>
          <p className="text-xl font-bold text-red-500">$1,230.17</p>
          <p className="text-sm text-red-600">-23.09% compared to last week</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-md font-semibold text-gray-600">Total Earnings</h2>
          <p className="text-xl font-bold text-green-500">$7,125.70</p>
          <p className="text-sm text-green-600">52.09% compared to last week</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-md font-semibold text-gray-600">Product Sold</h2>
          <p className="text-xl font-bold text-orange-500">$4,820.50</p>
          <p className="text-sm text-orange-600">Compared to last week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrollment Statistics - Bar Chart */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Enrollment Statistics</h2>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </div>

        {/* Overview - Pie Chart */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <div className="h-64 relative">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <p className="text-lg font-semibold text-center mt-4">Metrics Distribution</p>
          <div className="flex justify-center gap-4 mt-2 text-sm font-medium">
            <span className="text-blue-500">Students</span>
            <span className="text-orange-500">Courses</span>
            <span className="text-red-500">Videos</span>
            <span className="text-purple-500">Enrollments</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h3 className="text-md font-medium text-gray-600">Total Students</h3>
          <p className="text-3xl font-bold text-blue-500">{totalStudents}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h3 className="text-md font-medium text-gray-600">Total Courses</h3>
          <p className="text-3xl font-bold text-orange-500">{totalCourses}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h3 className="text-md font-medium text-gray-600">Total Videos</h3>
          <p className="text-3xl font-bold text-red-500">{totalVideos}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h3 className="text-md font-medium text-gray-600">Total Enrollments</h3>
          <p className="text-3xl font-bold text-purple-500">{totalEnrollments}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
