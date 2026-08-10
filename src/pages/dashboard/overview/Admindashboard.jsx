import React, { useEffect, useState } from "react";
import StatsGrid from "./components/StatsGrid";
import RecentActivityTable from "./components/RecentActivityTable";
import { api } from "../../../api/apiMethods";
import { API_ENDPOINTS } from "../../../api/endpoints";
import Spinner from "../../../components/Spinner";

const Admindashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ENDPOINTS.ADMIN_STATS);
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError("Failed to load statistics.");
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Spinner />;
  }



  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl my-4">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards Section */}
      <StatsGrid stats={stats} />

      {/* Recent Activity Table Section */}
      <RecentActivityTable bookings={stats?.recentBookings || []} />
    </>
  );
};

export default Admindashboard;

