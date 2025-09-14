import { LogOut, Home, Table, Settings, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Sidebar({ openSidebar, setOpenSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-indigo-500 text-white font-semibold shadow"
        : "hover:bg-indigo-400 hover:text-white text-slate-700"
    }`;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`!min-h-screen fixed xl:static top-0 left-0 w-64 
        bg-gradient-to-b from-indigo-100 to-indigo-200 text-slate-800 
        flex flex-col p-4 justify-between transform transition-transform 
        duration-300 z-[9999] ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        } xl:translate-x-0`}
      >
        {/* Logo / Title */}
        <div>
          <h1 className="text-2xl font-bold mb-8 text-indigo-700">
            Posts Dashboard
          </h1>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              onClick={() => setOpenSidebar(false)}
              end
              className={linkClasses}
            >
              <Home size={18} /> Dashboard
            </NavLink>
            <NavLink
              to="/entries"
              onClick={() => setOpenSidebar(false)}
              className={linkClasses}
            >
              <Table size={18} /> Entries
            </NavLink>
            <NavLink
              to="/settings"
              onClick={() => setOpenSidebar(false)}
              className={linkClasses}
            >
              <Settings size={18} /> Profile Settings
            </NavLink>
          </nav>
        </div>

        {/* User Section */}
        <div className="mt-6 border-t border-indigo-300 pt-4">
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <User size={18} />
            <span className="text-sm">{userData?.name}</span>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg 
            hover:bg-indigo-400 hover:text-white transition w-full 
            text-left cursor-pointer text-slate-700"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay when sidebar open on mobile */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/20 z-40 xl:hidden"
          onClick={() => setOpenSidebar(false)}
        ></div>
      )}
    </>
  );
}
