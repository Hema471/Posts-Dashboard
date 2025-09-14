import { Menu } from "lucide-react";
const defaultImage =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

export default function Topbar({ setOpenSidebar }) {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="border-b border-gray-200 shadow px-4 py-3 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <div className="xl:hidden">
        <button
          onClick={() => setOpenSidebar((prev) => !prev)}
          className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Right side (User info) */}
      <div className="flex items-center space-x-4 ml-auto">
        <span className="text-gray-700 font-medium">Hi, {userData?.name}</span>
        {userData?.image && (
          <img
            src={userData?.image?.dataUrl || defaultImage}
            alt="avatar"
            className="rounded-full w-10 h-10 border shadow-sm"
            loading="lazy"
          />
        )}
      </div>
    </header>
  );
}
