import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-60 bg-gray-100 p-4">
      <ul>
        <li className="mb-2"><a href="/editor">Document Editor</a></li>
        <li><a href="/whiteboard">Whiteboard</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
