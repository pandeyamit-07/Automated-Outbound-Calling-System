// import React from "react";

// export default function Filters({ filters, setFilters, applyFilters }) {
//   return (
//     <div className="bg-white rounded-2xl shadow p-4">
//       <div className="grid md:grid-cols-7 gap-4 items-end">
//         {/* Status */}
//         <div>
//           <label className="text-xs text-gray-600">Status</label>
//           <select
//             className="w-full border rounded px-2 py-2 mt-1"
//             value={filters.status}
//             onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
//           >
//             <option value="">Any</option>
//             <option value="completed">Completed</option>
//             <option value="initiated">Initiated</option>
//           </select>
//         </div>

//         {/* Min Duration */}
//         <div>
//           <label className="text-xs text-gray-600">Min Duration (s)</label>
//           <input
//             type="number"
//             className="w-full border rounded px-2 py-2 mt-1"
//             value={filters.min_duration}
//             onChange={(e) => setFilters((p) => ({ ...p, min_duration: Number(e.target.value) }))}
//           />
//         </div>

//         {/* User Input */}
//         <div>
//           <label className="text-xs text-gray-600">User Input</label>
//           <select
//             className="w-full border rounded px-2 py-2 mt-1"
//             value={filters.userinput}
//             onChange={(e) => setFilters((p) => ({ ...p, userinput: e.target.value }))}
//           >
//             <option value="">Any</option>
//             <option value="Answer">Answer</option>
//             <option value="Blank">Blank</option>
//             <option value="Timeout">Timeout</option>
//           </select>
//         </div>

//         {/* Limit */}
//         <div>
//           <label className="text-xs text-gray-600">Limit</label>
//           <input
//             type="number"
//             className="w-full border rounded px-2 py-2 mt-1"
//             value={filters.limit}
//             onChange={(e) => setFilters((p) => ({ ...p, limit: Number(e.target.value) }))}
//           />
//         </div>

//         {/* Date From */}
//         <div>
//           <label className="text-xs text-gray-600">Date From</label>
//           <input
//             type="date"
//             className="w-full border rounded px-2 py-2 mt-1"
//             value={filters.date_from || ""}
//             onChange={(e) => setFilters((p) => ({ ...p, date_from: e.target.value }))}
//           />
//         </div>

//         {/* Date To */}
//         <div>
//           <label className="text-xs text-gray-600">Date To</label>
//           <input
//             type="date"
//             className="w-full border rounded px-2 py-2 mt-1"
//             value={filters.date_to || ""}
//             onChange={(e) => setFilters((p) => ({ ...p, date_to: e.target.value }))}
//           />
//         </div>

//         {/* Apply Button */}
//         <div className="flex gap-2">
//           <button
//             onClick={applyFilters}
//             className="bg-indigo-600 text-white px-4 py-2 rounded mt-4 w-full hover:bg-indigo-700 transition"
//           >
//             Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";

export default function Filters({ filters, setFilters, applyFilters }) {
  return (
    <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700
      rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-5 transition-all">

      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        🔍 Filter Records
      </h2>

      <div className="grid md:grid-cols-7 gap-4 items-end">
        
        {/* Status */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</label>
          <select
            className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={filters.status}
            onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
          >
            <option value="">Any</option>
            <option value="completed">Completed</option>
            <option value="initiated">Initiated</option>
          </select>
        </div>

        {/* Min Duration */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Min Duration (s)</label>
          <input
            type="number"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={filters.min_duration}
            onChange={(e) =>
              setFilters((p) => ({ ...p, min_duration: Number(e.target.value) }))
            }
          />
        </div>

        {/* User Input */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">User Input</label>
          <select
            className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
              focus:ring-2 focus:ring-indigo-500 transition"
            value={filters.userinput}
            onChange={(e) =>
              setFilters((p) => ({ ...p, userinput: e.target.value }))
            }
          >
            <option value="">Any</option>
            <option value="Answer">Answer</option>
            <option value="Blank">Blank</option>
            <option value="Timeout">Timeout</option>
          </select>
        </div>

        {/* Limit */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Limit</label>
          <input
            type="number"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
              focus:ring-2 focus:ring-indigo-500 transition"
            value={filters.limit}
            onChange={(e) =>
              setFilters((p) => ({ ...p, limit: Number(e.target.value) }))
            }
          />
        </div>

        {/* Date From */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Date From</label>
          <input
            type="date"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
              focus:ring-2 focus:ring-indigo-500 transition"
            value={filters.date_from || ""}
            onChange={(e) =>
              setFilters((p) => ({ ...p, date_from: e.target.value }))
            }
          />
        </div>

        {/* Date To */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Date To</label>
          <input
            type="date"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
              focus:ring-2 focus:ring-indigo-500 transition"
            value={filters.date_to || ""}
            onChange={(e) =>
              setFilters((p) => ({ ...p, date_to: e.target.value }))
            }
          />
        </div>

        {/* Apply Button */}
        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="bg-indigo-600 hover:bg-indigo-700 
              text-white font-medium px-4 py-2 w-full rounded-xl mt-4 
              shadow-md hover:shadow-lg transition active:scale-[0.98]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
