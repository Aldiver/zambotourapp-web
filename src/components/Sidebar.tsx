import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiLogout } from "@mdi/js";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const useAuth = () => useContext(AuthContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const { dispatch } = useAuth();

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };

  return (
    <>
      <div className="lg:hidden p-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white lg:relative lg:translate-x-0 lg:shadow-none shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-screen flex w-64 flex-col justify-between border-e bg-white">
          <div className="flex-1 px-4 py-6">
            <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
              Logo
            </span>

            <ul className="mt-6 space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-gray-100 text-gray-700"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`
                  }
                  onClick={isOpen ? toggleSidebar : () => {}}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-gray-100 text-gray-700"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`
                  }
                  onClick={isOpen ? toggleSidebar : () => {}}
                >
                  Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/destinations"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-gray-100 text-gray-700"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`
                  }
                  onClick={isOpen ? toggleSidebar : () => {}}
                >
                  Destinations
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/menu"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-gray-100 text-gray-700"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`
                  }
                  onClick={isOpen ? toggleSidebar : () => {}}
                >
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-gray-100 text-gray-700"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`
                  }
                  onClick={isOpen ? toggleSidebar : () => {}}
                >
                  Account
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="px-4 flex justify-between cursor-pointer bottom-0 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex flex-1 items-center gap-2 bg-white p-4 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <Icon path={mdiLogout} size={1} />

              <span className="w-full flex-1 grow text-ellipsis line-clamp-1 pr-12">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
