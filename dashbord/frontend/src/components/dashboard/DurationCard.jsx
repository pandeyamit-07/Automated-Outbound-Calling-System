// Updated & Compact DurationCard (Final)
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/api";

export default function DurationCard({ filters = {}, onSelect, icon: Icon, color = "blue" }) {
  const [durationCount, setDurationCount] = useState({ min: 15, count: 0 });
  const [loading, setLoading] = useState(false);

  const options = [15, 30, 45, 60];

  const theme = {
    blue: {
      card: "from-blue-500/10 to-blue-600/5 border-blue-200",
      text: "text-blue-700",
      activeBtn: "bg-blue-600 border-blue-700",
      hoverBtn: "hover:bg-blue-50",
    },
    green: {
      card: "from-green-500/10 to-green-600/5 border-green-200",
      text: "text-green-700",
      activeBtn: "bg-green-600 border-green-700",
      hoverBtn: "hover:bg-green-50",
    },
    orange: {
      card: "from-orange-500/10 to-orange-600/5 border-orange-200",
      text: "text-orange-700",
      activeBtn: "bg-orange-600 border-orange-700",
      hoverBtn: "hover:bg-orange-50",
    },
    purple: {
      card: "from-purple-500/10 to-purple-600/5 border-purple-200",
      text: "text-purple-700",
      activeBtn: "bg-purple-600 border-purple-700",
      hoverBtn: "hover:bg-purple-50",
    },
  };

  const c = theme[color];

  function todayIST() {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  }

  const dateFrom = useMemo(() => {
    if (filters?.date_from?.trim()) return String(filters.date_from);
    return todayIST();
  }, [filters?.date_from]);

  const dateTo = useMemo(() => {
    if (filters?.date_to?.trim()) return String(filters.date_to);
    return todayIST();
  }, [filters?.date_to]);

  const fetchDuration = async (minVal) => {
    setLoading(true);
    try {
      const res = await api.get("/call_logs/duration", {
        params: { min: minVal, date_from: dateFrom, date_to: dateTo },
      });

      setDurationCount({ min: minVal, count: res?.data?.count ?? 0 });
    } catch {
      setDurationCount({ min: minVal, count: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuration(durationCount.min);
  }, [dateFrom, dateTo]);

  return (
   <motion.div
  whileHover={{ scale: 1.0 ,boxShadow: "0 8px 25px rgba(0,0,0,0.15)"}}
  transition={{ type: "spring", stiffness: 180, damping: 14 }}
  className={`bg-gradient-to-br ${c.card}
    rounded-2xl p-5 border shadow-sm w-[390px]`}
>

      {/* Title + Icon inline */}
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/70 shadow-inner">
            <Icon size={18} className={c.text} />
          </div>
        )}
        <h3 className={`font-semibold text-base ${c.text}`}>Call Duration</h3>
      </div>

      {/* Date */}
      <div className="text-xs text-gray-600 mb-3">
        Showing for:{" "}
        <span className="font-medium text-gray-800">{dateFrom}</span>
      </div>

      {/* Duration options small */}
      <div className="flex gap-2 mb-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setDurationCount((prev) => ({ ...prev, min: opt }));
              fetchDuration(opt);
              onSelect?.(opt);
            }}
            className={`px-3 py-1 text-xs rounded-full border transition-all shadow-sm
              ${
                durationCount.min === opt
                  ? `${c.activeBtn} text-white scale-105`
                  : `bg-white text-gray-700 border-gray-300 ${c.hoverBtn}`
              }
            `}
          >
            {opt}s
          </button>
        ))}
      </div>

      {/* Final count */}
      <div className="text-center">
        <div className="text-xs text-gray-600">
          Calls greater than{" "}
          <span className={`${c.text} font-medium`}>{durationCount.min}s</span>
        </div>

        {loading ? (
          <div className="text-sm text-gray-500 mt-1">Loading...</div>
        ) : (
          <div className={`text-2xl font-bold mt-1 ${c.text}`}>
            {durationCount.count}
          </div>
        )}
      </div>
    </motion.div>
  );
}
