import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <nav>
        <ul>
          <li className={pathname === "/" ? "active" : ""}>
            <Link to="/">Upload</Link>
          </li>
          <li className={pathname === "/browse" ? "active" : ""}>
            <Link to="/browse">Browse</Link>
          </li>
          {/* Add more links here like <li><Link to="/search">Search</Link></li> */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
