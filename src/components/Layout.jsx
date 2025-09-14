import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div className="flex-1 flex flex-col">
        <Topbar setOpenSidebar={setOpenSidebar} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
