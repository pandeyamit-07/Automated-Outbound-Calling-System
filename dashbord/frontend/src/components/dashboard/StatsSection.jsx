// import React from "react";
// import StatCard from "./StatCard";

// export default function StatsSection({ calls }) {
//   const total = calls.length;
//   const completed = calls.filter((c) => c.status === "completed").length;
//   const initiated = calls.filter((c) => c.status === "initiated").length;
//   const avgDuration =
//     calls.length > 0
//       ? (calls.reduce((a, c) => a + (c.duration || 0), 0) / calls.length).toFixed(1)
//       : 0;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//       <StatCard title="Total Calls" value={total} />
//       <StatCard title="Completed" value={completed} />
//       <StatCard title="Initiated" value={initiated} />
//       <StatCard title="Avg Duration (s)" value={avgDuration} />
//     </div>
//   );
// }
