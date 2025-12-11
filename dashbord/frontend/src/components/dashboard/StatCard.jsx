import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Circle } from "lucide-react"; // decorative icons

export default function StatCard({ title, value, icon: Icon, color = "blue" }) {
  const gradient = {
    blue: "from-blue-500/20 to-blue-600/10 text-blue-700 border-blue-200",
    green: "from-green-500/20 to-green-600/10 text-green-700 border-green-200",
    orange: "from-orange-500/20 to-orange-600/10 text-orange-700 border-orange-200",
    purple: "from-purple-500/20 to-purple-600/10 text-purple-700 border-purple-200",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.0, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`
        relative overflow-hidden
        rounded-2xl p-5 border shadow-sm 
        bg-gradient-to-br ${gradient[color]} transition-all duration-300
      `}
    >
      {/* Decorative floating icons (background shine) */}
      <Circle
        size={90}
        className="absolute -top-6 -right-4 opacity-[0.08]"
      />
      <Sparkles
        size={40}
        className="absolute bottom-3 right-3 opacity-[0.12]"
      />

      <div className="flex items-center gap-4 relative z-10">

        {/* Main icon */}
        {Icon && (
          <div
            className={`
              w-14 h-14 rounded-xl flex items-center justify-center 
              bg-white/70 backdrop-blur-sm 
              border border-white/60 shadow-md
            `}
          >
            <Icon size={32} className="opacity-80" />
          </div>
        )}

        {/* Text */}
        <div>
          <div className="text-sm font-medium opacity-80 flex items-center gap-1">
            <Sparkles size={14} className="opacity-60" /> {/* small sub-icon */}
            {title}
          </div>

          <div className="text-3xl font-bold mt-1 tracking-tight">
            {value}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
