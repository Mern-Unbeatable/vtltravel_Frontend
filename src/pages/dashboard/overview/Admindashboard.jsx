import React from "react";
import StatsGrid from "./components/StatsGrid";
import RecentActivityTable from "./components/RecentActivityTable";

const Admindashboard = () => {
  return (
    <>
      {/* Stats Cards Section */}
      <StatsGrid />

      {/* Recent Activity Table Section */}
      <RecentActivityTable />
    </>
  );
};

export default Admindashboard;
