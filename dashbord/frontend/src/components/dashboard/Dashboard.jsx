import React, { useEffect, useState } from "react";
import api from "../../api/api";

import Filters from "./Filters";
import DurationCard from "./DurationCard";
import UserInputCard from "./UserInputCard";
import CallsTable from "./CallTable";
import StatCard from "./StatCard";
import Charts from "./Charts";
import { PhoneCall, CheckCircle2 } from "lucide-react";
import { Timer, Clock3, Hourglass } from "lucide-react";



export default function Dashboard() {
  const [calls, setCalls] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [durationCount, setDurationCount] = useState({ min: 15, count: 0 });
  const [completedStats, setCompletedStats] = useState({});
  const [loading, setLoading] = useState(false);

  // FILTERS
  const [filters, setFilters] = useState({
    status: "",
    min_duration: 15,
    userinput: "",
    limit: 25,
    offset: 0,
    date_from: "",
    date_to: "",
  });

  // ---------------------------
  // FETCH ALL CALLS
  // ---------------------------
  const fetchCalls = async (customFilters = filters) => {
    try {
      setLoading(true);

      const res = await api.get("/call_logs", {
        params: customFilters,
      });

      setCalls(res.data.rows || []);
    } catch (err) {
      console.error("Error fetching calls:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // STATUS COUNTS
  // ---------------------------
  const fetchStatusCounts = async () => {
    try {
      const statuses = ["initiated", "completed"];
      let result = {};

      for (let s of statuses) {
        const res = await api.get(`/call_logs/status-count`, { params: { status: s } });
        result[s] = res.data.count;
      }

      setStatusCounts(result);
    } catch (err) {
      console.error("status-count error:", err);
    }
  };

  // ---------------------------
  // DURATION COUNT (for card)
  // ---------------------------
  const fetchDurationCount = async () => {
    try {
      const res = await api.get(`/call_logs/duration`, {
        params: { min: filters.min_duration },
      });

      setDurationCount({ min: filters.min_duration, count: res.data.count });
    } catch (err) {
      setDurationCount({ min: filters.min_duration, count: 0 });
    }
  };

  // ---------------------------
  // USER INPUT STATS (for card)
  // ---------------------------
  const fetchCompletedStats = async () => {
    try {
      const types = ["not_null", "blank", "timeout"];
      let result = {};

      for (let t of types) {
        const res = await api.get(`/call_logs/completed-by-userinput`, {
          params: { type: t },
        });
        result[t] = res.data.count;
      }

      setCompletedStats(result);
    } catch (err) {
      console.error("completed-by-userinput error:", err);
    }
  };

  // ---------------------------
  // INITIAL LOAD
  // ---------------------------
  useEffect(() => {
    fetchStatusCounts();
    fetchDurationCount();
    fetchCompletedStats();
    fetchCalls();
  }, []);

  // ---------------------------
  // APPLY FILTERS
  // ---------------------------
  const applyFilters = async () => {
    const newFilters = { ...filters, offset: 0 };
    setFilters(newFilters);

    await fetchCalls(newFilters);
    fetchDurationCount();
    fetchCompletedStats();
  };

  // ---------------------------
  // PAGINATION
  // ---------------------------
  const nextPage = async () => {
    const newFilters = { ...filters, offset: filters.offset + filters.limit };
    setFilters(newFilters);
    await fetchCalls(newFilters);
  };

  const prevPage = async () => {
    const newOffset = Math.max(0, filters.offset - filters.limit);
    const newFilters = { ...filters, offset: newOffset };

    setFilters(newFilters);
    await fetchCalls(newFilters);
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="p-6 space-y-6">

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-8 gap-4">
        {/* <StatCard title="Initiated Calls" value={statusCounts.initiated || 0} />
        <StatCard title="Completed Calls" value={statusCounts.completed || 0} /> */}

        <StatCard 
  title="Initiated Calls"
  value={statusCounts.initiated || 0}
  icon={PhoneCall}
  color="blue"
/>

<StatCard 
  title="Completed Calls"
  value={statusCounts.completed || 0}
  icon={CheckCircle2}
  color="green"
/>

        {/* PROPER WORKING Duration Card */}
        {/* <DurationCard
          durationCount={durationCount}
          onSelect={(min) => {
            setFilters({ ...filters, min_duration: min });
            setTimeout(() => fetchDurationCount(), 200);
          }}
        /> */}

        <DurationCard filters={filters}
  icon={Timer}   // ⭐ yaha add karo
  onSelect={(min) => {
    setFilters({ ...filters, min_duration: min });
    setTimeout(() => fetchDurationCount(), 200);
  }}
/>

      </div>

      {/* CHART */}
      <div className="lg:col-span-3">
        <Charts filters={filters} />
      </div>

      {/* USER INPUT CARD */}
     <UserInputCard filters={filters} />



      {/* FILTERS */}
      <Filters filters={filters} setFilters={setFilters} applyFilters={applyFilters} />

      {/* TABLE */}
      <CallsTable
        calls={calls}
        filters={filters}
        setFilters={setFilters}
        fetchCalls={fetchCalls}
        nextPage={nextPage}
        prevPage={prevPage}
      />

    </div>
  );
}
