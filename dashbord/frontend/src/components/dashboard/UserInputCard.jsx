// src/components/dashboard/UserInputCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, MinusCircle, Timer } from "lucide-react"; // icons
import api from "../../api/api";

export default function UserInputCard({ filters = {} }) {
  const [stats, setStats] = useState({ not_null: 0, blank: 0, timeout: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  }, []);

 const dateFrom =
  filters?.date_from && filters.date_from.trim() !== ""
    ? filters.date_from
    : today;

const dateTo =
  filters?.date_to && filters.date_to.trim() !== ""
    ? filters.date_to
    : today;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTypeCount(type) {
      const res = await api.get("/call_logs/completed-by-userinput", {
        params: { type, date_from: dateFrom, date_to: dateTo },
        signal: controller.signal,
      });
      return res?.data?.count ?? 0;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [not_null, blank, timeout] = await Promise.all([
          fetchTypeCount("not_null"),
          fetchTypeCount("blank"),
          fetchTypeCount("timeout"),
        ]);

        setStats({ not_null, blank, timeout });
      } catch (err) {
        if (err?.name !== "CanceledError") {
          setError("Failed to load stats");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [dateFrom, dateTo]);

  const gradients = {
    answered: "from-green-500/20 to-green-600/10 text-green-700 border-green-200",
    blank: "from-orange-500/20 to-orange-600/10 text-orange-700 border-orange-200",
    timeout: "from-purple-500/20 to-purple-600/10 text-purple-700 border-purple-200",
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-2 text-lg">
        Completed Calls by User Input
      </h3>

      <div className="text-xs text-gray-500 mb-4">
        Showing for:{" "}
        <span className="font-medium text-gray-700">
          {dateFrom}
          {dateFrom !== dateTo ? ` — ${dateTo}` : ""}
        </span>
      </div>

      {loading ? (
        <div className="py-6 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="py-6 text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-3 gap-3">

          {/* Answered */}
          <div
            className={`rounded-xl p-3 border bg-gradient-to-br ${gradients.answered} shadow-sm`}
          >
            <div className="flex items-center justify-center mb-1">
              <CheckCircle size={20} className="opacity-80" />
            </div>
            <div className="text-sm font-medium text-center">Answered</div>
            <div className="text-2xl font-semibold text-center">
              {stats.not_null}
            </div>
          </div>

          {/* Blank */}
          <div
            className={`rounded-xl p-3 border bg-gradient-to-br ${gradients.blank} shadow-sm`}
          >
            <div className="flex items-center justify-center mb-1">
              <MinusCircle size={20} className="opacity-80" />
            </div>
            <div className="text-sm font-medium text-center">Blank</div>
            <div className="text-2xl font-semibold text-center">
              {stats.blank}
            </div>
          </div>

          {/* Timeout */}
          <div
            className={`rounded-xl p-3 border bg-gradient-to-br ${gradients.timeout} shadow-sm`}
          >
            <div className="flex items-center justify-center mb-1">
              <Timer size={20} className="opacity-80" />
            </div>
            <div className="text-sm font-medium text-center">Timeout</div>
            <div className="text-2xl font-semibold text-center">
              {stats.timeout}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


