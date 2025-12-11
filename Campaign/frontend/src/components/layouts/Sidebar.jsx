



import { NavLink } from "react-router-dom";
import {
  Dashboard,
  QueueMusic,
  Contacts,
  Campaign,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";

const links = [
  { label: "Dashboard", to: "/dashboard", icon: <Dashboard fontSize="small" /> },
  { label: "Add Audio", to: "/add-audio", icon: <QueueMusic fontSize="small" /> },
  { label: "Add Contact", to: "/add-contact", icon: <Contacts fontSize="small" /> },
  { label: "Add Campaign", to: "/add-campaign", icon: <Campaign fontSize="small" /> },
];

export default function Sidebar() {
  const theme = useTheme();

  return (
    <aside
      className={`w-[240px] h-screen sticky top-0 px-4 py-6 border-r transition ${
        theme.palette.mode === "dark"
          ? "bg-[#1a1e24] border-[#333]"
          : "bg-[#fff5f5] border-[#ffe0e0]"
      }`}
    >
      {/* LOGO + TEXT */}
      <div className="flex items-center gap-3 mb-8">
        <img
  src="c.jpg"
  alt="logo"
  className={`w-9 h-9 spin-logo rounded-full object-cover border border-[#ff7676] ${
    theme.palette.mode === "dark" ? "invert brightness-125" : ""
  }`}
/>


        <h2
          className={`text-xl font-bold ${
            theme.palette.mode === "dark" ? "text-white" : "text-red-600"
          }`}
        >
          AutoDialer
        </h2>
      </div>

      <nav className="space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-red-500 text-white shadow-md"
                  : `${
                      theme.palette.mode === "dark"
                        ? "text-gray-300 hover:bg-[#2a2f36]"
                        : "text-gray-700 hover:bg-red-100"
                    }`
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
