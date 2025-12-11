// // src/components/Charts.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import api from "../../api/api"; // tumhara axios instance
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// // helper: today's date in IST as YYYY-MM-DD
// function todayIST() {
//   const now = new Date();
//   return now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
// }

// // format incoming props / filters to df/dt
// function normalizeDates({ dateFrom, dateTo, filters }) {
//   // priority: explicit props.dateFrom/dateTo -> filters.date_from/date_to -> today
//   let df = dateFrom ?? (filters && filters.date_from) ?? null;
//   let dt = dateTo ?? (filters && filters.date_to) ?? null;

//   // if neither provided -> today
//   if (!df && !dt) {
//     df = todayIST();
//     dt = todayIST();
//   } else if (df && !dt) {
//     // single-day selection (df only) -> treat dt = df
//     dt = df;
//   } else if (!df && dt) {
//     df = dt;
//   }

//   return { df, dt };
// }

// export default function Charts(props) {
//   // props can be: { dateFrom, dateTo } or { filters }
//   const { dateFrom, dateTo, filters } = props;

//   const { df, dt } = useMemo(() => normalizeDates({ dateFrom, dateTo, filters }), [dateFrom, dateTo, filters]);

//   const [calls, setCalls] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     let cancelled = false;

//     // prefer using limit large so we aggregate client-side; ideally server aggregation endpoint is better
//     const fetchForDates = async (from, to) => {
//       try {
//         setLoading(true);
//         // only send date filters so other frontend filters don't affect chart
//         const res = await api.get("/call_logs", {
//           params: {
//             date_from: from,
//             date_to: to,
//             // fetch lots of rows to ensure accurate counts; adjust if your DB is huge
//             limit: 10000,
//             offset: 0,
//           },
//         });

//         if (!cancelled) {
//           setCalls(Array.isArray(res.data.rows) ? res.data.rows : []);
//         }
//       } catch (err) {
//         if (!cancelled) console.error("Charts: error fetching date-range calls", err);
//         if (!cancelled) setCalls([]);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     fetchForDates(df, dt);

//     return () => {
//       cancelled = true;
//     };
//   }, [df, dt]);

//   // derive counts by status from fetched calls (only date-filtered data)
//   const counts = useMemo(() => {
//     const c = { completed: 0, initiated: 0, failed: 0, other: 0 };
//     for (const call of calls) {
//       const s = (call.status || "").toString().toLowerCase();
//       if (s === "completed") c.completed++;
//       else if (s === "initiated") c.initiated++;
//       else if (s === "failed") c.failed++;
//       else c.other++;
//     }
//     return c;
//   }, [calls]);

//   const data = [
//     { name: "Completed", value: counts.completed },
//     { name: "Initiated", value: counts.initiated },
//     { name: "Failed", value: counts.failed },
//     { name: "Other", value: counts.other },
//   ];

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-6 transition hover:shadow-lg">
//       <h2 className="text-xl font-semibold mb-4 text-gray-700">📊 Call Status Overview</h2>

//       <div className="text-sm text-gray-500 mb-3">
//         Showing data for:{" "}
//         <span className="font-medium text-gray-800">
//           {df}
//           {df === dt ? "" : ` — ${dt}`}
//         </span>
//         <span className="ml-2 text-xs text-gray-400">(only date filter affects chart)</span>
//       </div>

//       <div className="h-72">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
//             <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
//             <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
//             <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
//             <Tooltip
//               cursor={{ fill: "rgba(79,70,229,0.05)" }}
//               contentStyle={{
//                 backgroundColor: "#fff",
//                 borderRadius: "0.5rem",
//                 boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//               }}
//             />
//             <Legend />
//             <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={45} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="mt-4 text-sm text-gray-500 text-center">
//         {loading ? (
//           "Loading chart..."
//         ) : (
//           <>
//             Total Calls: <span className="font-semibold text-gray-800">{calls.length}</span>
//           </>
//         )}
//         <div className="text-xs text-gray-400 mt-1">Showing data for {df}{df === dt ? "" : ` — ${dt}`}</div>
//       </div>
//     </div>
//   );
// }



// src/components/Charts.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

function todayIST() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function normalizeDates({ dateFrom, dateTo, filters }) {
  let df = dateFrom ?? filters?.date_from ?? null;
  let dt = dateTo ?? filters?.date_to ?? null;

  if (!df && !dt) {
    df = todayIST();
    dt = todayIST();
  } else if (df && !dt) dt = df;
  else if (!df && dt) df = dt;

  return { df, dt };
}

export default function Charts(props) {
  const { dateFrom, dateTo, filters } = props;
  const { df, dt } = useMemo(
    () => normalizeDates({ dateFrom, dateTo, filters }),
    [dateFrom, dateTo, filters]
  );

  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancel = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/call_logs", {
          params: {
            date_from: df,
            date_to: dt,
            limit: 10000,
            offset: 0,
          },
        });

        if (!cancel) setCalls(res?.data?.rows ?? []);
      } catch {
        if (!cancel) setCalls([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchData();

    return () => (cancel = true);
  }, [df, dt]);

  const counts = useMemo(() => {
    const c = { completed: 0, initiated: 0, failed: 0, other: 0 };
    for (const call of calls) {
      const s = (call.status || "").toLowerCase();
      if (s === "completed") c.completed++;
      else if (s === "initiated") c.initiated++;
      else if (s === "failed") c.failed++;
      else c.other++;
    }
    return c;
  }, [calls]);

  const data = [
    { name: "Completed", value: counts.completed },
    { name: "Initiated", value: counts.initiated },
    { name: "Failed", value: counts.failed },
    { name: "Other", value: counts.other },
  ];

  const COLORS = {
    Completed: "#22c55e", // green
    Initiated: "#3b82f6", // blue
    Failed: "#ef4444", // red
    Other: "#a855f7", // purple
  };

  return (
    <div
      className="
        bg-white/80 backdrop-blur-md
        rounded-2xl 
        shadow-[0_4px_20px_rgba(0,0,0,0.08)]
        border border-gray-200
        p-6 
        transition-all duration-300
        hover:border-indigo-300
      "
    >
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        📊 Call Status Overview
      </h2>

      <div className="text-sm text-gray-500 mb-4">
        Showing data for:
        <span className="font-semibold text-gray-800 ml-1">
          {df} {df !== dt && `— ${dt}`}
        </span>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 20, left: 0, bottom: 10 }}
            barGap={12}
          >
            <defs>
              {/* subtle bar gloss */}
              <linearGradient id="barGloss" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" className="opacity-40" />
            <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} />
            <YAxis tick={{ fill: "#555", fontSize: 12 }} />

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              contentStyle={{
                background: "white",
                borderRadius: "10px",
                border: "1px solid #eee",
                padding: "10px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
            />

            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(val) => (
                <span style={{ color: COLORS[val], fontWeight: 600 }}>{val}</span>
              )}
            />

            <Bar dataKey="value" radius={[14, 14, 4, 4]} barSize={55}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name]}
                />
              ))}

              {/* gloss overlay */}
              <Cell fill="url(#barGloss)" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        {loading ? (
          "Loading chart..."
        ) : (
          <>
            Total Calls:{" "}
            <span className="text-gray-900 font-semibold">{calls.length}</span>
          </>
        )}
      </div>
    </div>
  );
}
