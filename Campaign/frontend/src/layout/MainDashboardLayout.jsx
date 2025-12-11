
import Sidebar from "../components/layouts/Sidebar";
import Topbar from "../components/layouts/Topbar";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

export default function MainDashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <motion.div
          className="p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
