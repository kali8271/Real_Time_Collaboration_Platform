import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Your Documents</h2>
      <ul className="mt-4">
        <li><Link to="/editor/1" className="text-blue-500">Project Document 1</Link></li>
        <li><Link to="/editor/2" className="text-blue-500">Project Document 2</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
