
// // src/components/dashboard/CallsTable.jsx
// import React, { useState, useEffect } from "react";
// import { Eye, X, FileText, Copy, Download } from "lucide-react";

// /**
//  * CallsTable
//  * props:
//  *  - calls: array
//  *  - filters: { offset, limit, ... }
//  *  - setFilters: fn
//  *  - fetchCalls: fn
//  *
//  * Includes "View" button and modal with full details + raw JSON
//  */
// export default function CallsTable({ calls, filters, setFilters, fetchCalls }) {
//   const [selectedCall, setSelectedCall] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [copyStatus, setCopyStatus] = useState(""); // "", "copied"
//   const [downloadUrl, setDownloadUrl] = useState(null);

//   useEffect(() => {
//     // cleanup download URL
//     return () => {
//       if (downloadUrl) URL.revokeObjectURL(downloadUrl);
//     };
//   }, [downloadUrl]);

//   const formatDate = (isoString) => {
//     if (!isoString) return "-";
//     const date = new Date(isoString);
//     return date.toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatTime = (isoString) => {
//     if (!isoString) return "-";
//     const date = new Date(isoString);
//     return date.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   };

//   const openModal = (call) => {
//     setSelectedCall(call);
//     setIsOpen(true);
//     setCopyStatus("");
//     // prepare download blob
//     try {
//       const blob = new Blob([JSON.stringify(call, null, 2)], { type: "application/json" });
//       const url = URL.createObjectURL(blob);
//       setDownloadUrl(url);
//     } catch (e) {
//       setDownloadUrl(null);
//     }
//     // lock scroll
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setSelectedCall(null);
//     setCopyStatus("");
//     if (downloadUrl) {
//       URL.revokeObjectURL(downloadUrl);
//       setDownloadUrl(null);
//     }
//     document.body.style.overflow = "";
//   };

//   // close on ESC
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") closeModal();
//     };
//     if (isOpen) window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [isOpen]);

//   const handleCopy = async () => {
//     if (!selectedCall) return;
//     try {
//       await navigator.clipboard.writeText(JSON.stringify(selectedCall, null, 2));
//       setCopyStatus("copied");
//       setTimeout(() => setCopyStatus(""), 1800);
//     } catch {
//       setCopyStatus("fail");
//       setTimeout(() => setCopyStatus(""), 1800);
//     }
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = `call-${selectedCall?.id || "data"}.json`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleNext = async () => {
//     const newOffset = filters.offset + filters.limit;
//     setFilters((prev) => ({ ...prev, offset: newOffset }));
//     await fetchCalls();
//   };

//   const handlePrev = async () => {
//     const newOffset = Math.max(0, filters.offset - filters.limit);
//     setFilters((prev) => ({ ...prev, offset: newOffset }));
//     await fetchCalls();
//   };

//   return (
//     <>
//       <div
//         className="
//           mt-10 rounded-3xl p-6 
//           bg-white/80 dark:bg-gray-900/60 
//           backdrop-blur-md shadow-[0_10px_30px_rgba(2,6,23,0.08)]
//           border border-white/50 dark:border-gray-700/40
//         "
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">📞 Recent Calls</h3>
//           <div className="text-sm text-gray-500 dark:text-gray-300">
//             Showing <span className="font-medium">{filters.offset + 1}</span> –
//             <span className="font-medium"> {filters.offset + calls.length}</span>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-gray-100 dark:bg-gray-800">
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">ID</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Status</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Duration</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">User Input</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Phone</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Date</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Start</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">End</th>
//                 <th className="p-3 text-right font-medium text-xs text-gray-600 dark:text-gray-300">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               {calls.length > 0 ? (
//                 calls.map((c) => (
//                   <tr
//                     key={c.id}
//                     className="bg-white dark:bg-gray-900 hover:shadow-md transition-shadow duration-150"
//                   >
//                     <td className="p-3">{c.id}</td>

//                     <td className="p-3">
//                       <span
//                         className={`
//                           inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
//                           ${
//                             String(c.status).toLowerCase() === "completed"
//                               ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//                               : String(c.status).toLowerCase() === "initiated"
//                               ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
//                               : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
//                           }
//                         `}
//                       >
//                         {String(c.status || "-").toUpperCase()}
//                       </span>
//                     </td>

//                     <td className="p-3">{c.call_duration ?? "-"}</td>
//                     <td className="p-3 max-w-xs truncate" title={c.user_input || ""}>
//                       {c.user_input || "-"}
//                     </td>
//                     <td className="p-3">{c.phone_number || "-"}</td>
//                     <td className="p-3">{formatDate(c.created_at)}</td>
//                     <td className="p-3">{formatTime(c.call_start_time)}</td>
//                     <td className="p-3">{formatTime(c.call_end_time)}</td>

//                     <td className="p-3 text-right">
//                       <div className="inline-flex items-center gap-2">
//                         <button
//                           title="View details"
//                           onClick={() => openModal(c)}
//                           className="
//                             inline-flex items-center gap-2 px-3 py-1 rounded-lg
//                             bg-indigo-600 text-white text-xs font-medium
//                             hover:bg-indigo-700 shadow-sm transition
//                           "
//                         >
//                           <Eye size={14} />
//                           View
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="9" className="text-center p-8 text-gray-500 dark:text-gray-400">
//                     No call records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between mt-6">
//           <div>
//             <button
//               onClick={handlePrev}
//               disabled={filters.offset === 0}
//               className={`px-4 py-2 rounded-lg font-medium transition ${
//                 filters.offset === 0
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800"
//                   : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm dark:bg-gray-800 dark:text-gray-200"
//               }`}
//             >
//               ← Previous
//             </button>
//           </div>

//           <div className="text-sm text-gray-600 dark:text-gray-300">
//             Showing <b>{filters.offset + 1}</b>–<b>{filters.offset + calls.length}</b>
//           </div>

//           <div>
//             <button
//               onClick={handleNext}
//               disabled={calls.length < filters.limit}
//               className={`px-4 py-2 rounded-lg font-medium transition ${
//                 calls.length < filters.limit
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800"
//                   : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
//               }`}
//             >
//               Next →
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isOpen && selectedCall && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           role="dialog"
//           aria-modal="true"
//         >
//           {/* backdrop */}
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             onClick={closeModal}
//           />

//           {/* panel */}
//           <div
//             className="
//               relative z-10 w-full max-w-2xl mx-4
//               transform transition-all duration-200
//               bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-700
//             "
//             style={{ animation: "200ms ease-out 0s 1 normal none running scaleIn" }}
//           >
//             {/* header */}
//             <div className="flex items-start justify-between p-5 border-b dark:border-gray-800">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                   Call Details — ID #{selectedCall.id}
//                 </h3>
//                 <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                   {selectedCall.phone_number || "-"} · {selectedCall.status?.toUpperCase() || "-"}
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={handleCopy}
//                   title="Copy JSON"
//                   className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm"
//                 >
//                   <Copy size={14} />
//                   {copyStatus === "copied" ? "Copied" : "Copy"}
//                 </button>

//                 <button
//                   onClick={handleDownload}
//                   title="Download JSON"
//                   className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm"
//                 >
//                   <Download size={14} />
//                   Download
//                 </button>

//                 <button
//                   onClick={closeModal}
//                   title="Close"
//                   className="p-2 rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* body */}
//             <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <div className="text-xs text-gray-500">Phone</div>
//                   <div className="font-medium">{selectedCall.phone_number || "-"}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">Status</div>
//                   <div className="font-medium capitalize">{selectedCall.status || "-"}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">Duration (s)</div>
//                   <div className="font-medium">{selectedCall.call_duration ?? "-"}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">User Input</div>
//                   <div className="font-medium">{selectedCall.user_input || "-"}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">Date</div>
//                   <div className="font-medium">{formatDate(selectedCall.created_at)}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">Start Time</div>
//                   <div className="font-medium">{formatTime(selectedCall.call_start_time)}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">End Time</div>
//                   <div className="font-medium">{formatTime(selectedCall.call_end_time)}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">ID</div>
//                   <div className="font-medium">{selectedCall.id}</div>
//                 </div>
//               </div>

//               {/* Raw JSON collapsible */}
//               <details className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border dark:border-gray-700">
//                 <summary className="cursor-pointer font-medium">Show raw JSON</summary>
//                 <pre className="mt-2 max-h-60 overflow-auto text-xs bg-transparent p-2">
//                   {JSON.stringify(selectedCall, null, 2)}
//                 </pre>
//               </details>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* small inline animation CSS (scoped, tailwind can't do keyframes inline) */}
//       <style>{`
//         @keyframes scaleIn {
//           0% { transform: translateY(6px) scale(.985); opacity: 0; }
//           100% { transform: translateY(0) scale(1); opacity: 1; }
//         }
//         .scaleIn { animation: scaleIn 200ms ease-out both; }
//       `}</style>
//     </>
//   );
// }




// src/components/dashboard/CallsTable.jsx
// import React, { useState, useEffect } from "react";
// import { Eye, X, Copy, Download } from "lucide-react";

// /**
//  * CallsTable
//  * - shows cust_name (from backend)
//  * - keeps all previous behaviour (modal, copy, download, pagination)
//  */

// export default function CallsTable({ calls = [], filters, setFilters, fetchCalls }) {
//   const [selectedCall, setSelectedCall] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [copyStatus, setCopyStatus] = useState(""); // "", "copied"
//   const [downloadUrl, setDownloadUrl] = useState(null);

//   useEffect(() => {
//     // cleanup download URL
//     return () => {
//       if (downloadUrl) URL.revokeObjectURL(downloadUrl);
//     };
//   }, [downloadUrl]);

//   const formatDate = (isoString) => {
//     if (!isoString) return "-";
//     const date = new Date(isoString);
//     return date.toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatTime = (isoString) => {
//     if (!isoString) return "-";
//     const date = new Date(isoString);
//     return date.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   };

//   const openModal = (call) => {
//     setSelectedCall(call);
//     setIsOpen(true);
//     setCopyStatus("");
//     // prepare download blob
//     try {
//       const blob = new Blob([JSON.stringify(call, null, 2)], { type: "application/json" });
//       const url = URL.createObjectURL(blob);
//       setDownloadUrl(url);
//     } catch (e) {
//       setDownloadUrl(null);
//     }
//     // lock scroll
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setSelectedCall(null);
//     setCopyStatus("");
//     if (downloadUrl) {
//       URL.revokeObjectURL(downloadUrl);
//       setDownloadUrl(null);
//     }
//     document.body.style.overflow = "";
//   };

//   // close on ESC
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") closeModal();
//     };
//     if (isOpen) window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [isOpen]);

//   const handleCopy = async () => {
//     if (!selectedCall) return;
//     try {
//       await navigator.clipboard.writeText(JSON.stringify(selectedCall, null, 2));
//       setCopyStatus("copied");
//       setTimeout(() => setCopyStatus(""), 1800);
//     } catch {
//       setCopyStatus("fail");
//       setTimeout(() => setCopyStatus(""), 1800);
//     }
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = `call-${selectedCall?.id || "data"}.json`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleNext = async () => {
//     const newOffset = filters.offset + filters.limit;
//     setFilters((prev) => ({ ...prev, offset: newOffset }));
//     await fetchCalls();
//   };

//   const handlePrev = async () => {
//     const newOffset = Math.max(0, filters.offset - filters.limit);
//     setFilters((prev) => ({ ...prev, offset: newOffset }));
//     await fetchCalls();
//   };

//   return (
//     <>
//       <div
//         className="
//           mt-10 rounded-3xl p-6 
//           bg-white/80 dark:bg-gray-900/60 
//           backdrop-blur-md shadow-[0_10px_30px_rgba(2,6,23,0.08)]
//           border border-white/50 dark:border-gray-700/40
//         "
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">📞 Recent Calls</h3>
//           <div className="text-sm text-gray-500 dark:text-gray-300">
//             Showing <span className="font-medium">{filters.offset + 1}</span> –
//             <span className="font-medium"> {filters.offset + calls.length}</span>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-gray-100 dark:bg-gray-800">
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">ID</th>

//                 {/* ADDED: Customer column */}
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Customer</th>

//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Status</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Duration</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">User Input</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Phone</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Date</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Start</th>
//                 <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">End</th>
//                 <th className="p-3 text-right font-medium text-xs text-gray-600 dark:text-gray-300">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               {calls.length > 0 ? (
//                 calls.map((c) => (
//                   <tr
//                     key={c.id}
//                     className="bg-white dark:bg-gray-900 hover:shadow-md transition-shadow duration-150"
//                   >
//                     <td className="p-3">{c.id}</td>

//                     {/* ADDED: show cust_name, truncate long names and show title */}
//                     <td className="p-3 max-w-xs truncate" title={c.cust_name || c.customer_name || ""}>
//                       {c.cust_name || c.customer_name || "-"}
//                     </td>

//                     <td className="p-3">
//                       <span
//                         className={`
//                           inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
//                           ${
//                             String(c.status).toLowerCase() === "completed"
//                               ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//                               : String(c.status).toLowerCase() === "initiated"
//                               ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
//                               : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
//                           }
//                         `}
//                       >
//                         {String(c.status || "-").toUpperCase()}
//                       </span>
//                     </td>

//                     <td className="p-3">{c.call_duration ?? "-"}</td>
//                     <td className="p-3 max-w-xs truncate" title={c.user_input || ""}>
//                       {c.user_input || "-"}
//                     </td>
//                     <td className="p-3">{c.phone_number || "-"}</td>
//                     <td className="p-3">{formatDate(c.created_at)}</td>
//                     <td className="p-3">{formatTime(c.call_start_time)}</td>
//                     <td className="p-3">{formatTime(c.call_end_time)}</td>

//                     <td className="p-3 text-right">
//                       <div className="inline-flex items-center gap-2">
//                         <button
//                           title="View details"
//                           onClick={() => openModal(c)}
//                           className="
//                             inline-flex items-center gap-2 px-3 py-1 rounded-lg
//                             bg-indigo-600 text-white text-xs font-medium
//                             hover:bg-indigo-700 shadow-sm transition
//                           "
//                         >
//                           <Eye size={14} />
//                           View
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="10" className="text-center p-8 text-gray-500 dark:text-gray-400">
//                     No call records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between mt-6">
//           <div>
//             <button
//               onClick={handlePrev}
//               disabled={filters.offset === 0}
//               className={`px-4 py-2 rounded-lg font-medium transition ${
//                 filters.offset === 0
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800"
//                   : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm dark:bg-gray-800 dark:text-gray-200"
//               }`}
//             >
//               ← Previous
//             </button>
//           </div>

//           <div className="text-sm text-gray-600 dark:text-gray-300">
//             Showing <b>{filters.offset + 1}</b>–<b>{filters.offset + calls.length}</b>
//           </div>

//           <div>
//             <button
//               onClick={handleNext}
//               disabled={calls.length < filters.limit}
//               className={`px-4 py-2 rounded-lg font-medium transition ${
//                 calls.length < filters.limit
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800"
//                   : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
//               }`}
//             >
//               Next →
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isOpen && selectedCall && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           role="dialog"
//           aria-modal="true"
//         >
//           {/* backdrop */}
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             onClick={closeModal}
//           />

//           {/* panel */}
//           <div
//             className="
//               relative z-10 w-full max-w-2xl mx-4
//               transform transition-all duration-200
//               bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-700
//             "
//             style={{ animation: "200ms ease-out 0s 1 normal none running scaleIn" }}
//           >
//             {/* header */}
//             <div className="flex items-start justify-between p-5 border-b dark:border-gray-800">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                   Call Details — ID #{selectedCall.id}
//                 </h3>
//                 <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                   {/* show customer name first if present */}
//                   {selectedCall.cust_name || selectedCall.customer_name || selectedCall.phone_number || "-"} · {selectedCall.status?.toUpperCase() || "-"}
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={handleCopy}
//                   title="Copy JSON"
//                   className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm"
//                 >
//                   <Copy size={14} />
//                   {copyStatus === "copied" ? "Copied" : "Copy"}
//                 </button>

//                 <button
//                   onClick={handleDownload}
//                   title="Download JSON"
//                   className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm"
//                 >
//                   <Download size={14} />
//                   Download
//                 </button>

//                 <button
//                   onClick={closeModal}
//                   title="Close"
//                   className="p-2 rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* body */}
//             <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <div className="text-xs text-gray-500">Customer</div>
//                   <div className="font-medium">{selectedCall.cust_name || selectedCall.customer_name || "-"}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">Phone</div>
//                   <div className="font-medium">{selectedCall.phone_number || "-"}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">Status</div>
//                   <div className="font-medium capitalize">{selectedCall.status || "-"}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">Duration (s)</div>
//                   <div className="font-medium">{selectedCall.call_duration ?? "-"}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">User Input</div>
//                   <div className="font-medium">{selectedCall.user_input || "-"}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">Date</div>
//                   <div className="font-medium">{formatDate(selectedCall.created_at)}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">Start Time</div>
//                   <div className="font-medium">{formatTime(selectedCall.call_start_time)}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">End Time</div>
//                   <div className="font-medium">{formatTime(selectedCall.call_end_time)}</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-500">ID</div>
//                   <div className="font-medium">{selectedCall.id}</div>
//                 </div>
//               </div>

//               {/* Raw JSON collapsible */}
//               <details className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border dark:border-gray-700">
//                 <summary className="cursor-pointer font-medium">Show raw JSON</summary>
//                 <pre className="mt-2 max-h-60 overflow-auto text-xs bg-transparent p-2">
//                   {JSON.stringify(selectedCall, null, 2)}
//                 </pre>
//               </details>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* small inline animation CSS (scoped, tailwind can't do keyframes inline) */}
//       <style>{`
//         @keyframes scaleIn {
//           0% { transform: translateY(6px) scale(.985); opacity: 0; }
//           100% { transform: translateY(0) scale(1); opacity: 1; }
//         }
//         .scaleIn { animation: scaleIn 200ms ease-out both; }
//       `}</style>
//     </>
//   );
// }


// src/components/dashboard/CallsTable.jsx
import React, { useState, useEffect } from "react";
import { Eye, X, Copy, Download } from "lucide-react";

/**
 * CallsTable
 * - Export CSV button moved to header (upper-right)
 * - Shows cust_name, modal, pagination, JSON download etc.
 */

export default function CallsTable({ calls = [], filters, setFilters, fetchCalls }) {
  const [selectedCall, setSelectedCall] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  // ---------- Export CSV ----------
  const exportToCSV = (rows) => {
    if (!rows || rows.length === 0) return;

    // header: put cust_name first if present
    const headerSet = new Set(Object.keys(rows[0] || {}));
    const header = [];
    if (headerSet.has("cust_name")) header.push("cust_name");
    else if (headerSet.has("customer_name")) header.push("customer_name");
    Object.keys(rows[0]).forEach((k) => {
      if (!header.includes(k)) header.push(k);
    });

    const replacer = (key, value) => (value === null || value === undefined ? "" : value);
    const csv = [
      header.join(","),
      ...rows.map((row) =>
        header
          .map((field) => {
            let v = row[field];
            if (typeof v === "string") v = v.replace(/"/g, '""').replace(/\n/g, " ");
            return `"${String(replacer(field, v)).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `call-logs-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const openModal = (call) => {
    setSelectedCall(call);
    setIsOpen(true);
    setCopyStatus("");
    try {
      const blob = new Blob([JSON.stringify(call, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch {
      setDownloadUrl(null);
    }
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCall(null);
    setCopyStatus("");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && closeModal();
    if (isOpen) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen]);

  const handleCopy = async () => {
    if (!selectedCall) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(selectedCall, null, 2));
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus(""), 1800);
    } catch {
      setCopyStatus("fail");
      setTimeout(() => setCopyStatus(""), 1800);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `call-${selectedCall?.id || "data"}.json`;
    a.click();
  };

  const handleNext = async () => {
    setFilters((p) => ({ ...p, offset: p.offset + p.limit }));
    await fetchCalls();
  };

  const handlePrev = async () => {
    setFilters((p) => ({ ...p, offset: Math.max(0, p.offset - p.limit) }));
    await fetchCalls();
  };

  return (
    <>
      <div
        className="
          mt-10 rounded-3xl p-6 
          bg-white/80 dark:bg-gray-900/60 
          backdrop-blur-md shadow-[0_10px_30px_rgba(2,6,23,0.08)]
          border border-white/50 dark:border-gray-700/40
        "
      >
        {/* Header: title + Export (upper-right) + showing */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">📞 Recent Calls</h3>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Showing <span className="font-medium">{filters.offset + 1}</span> –
              <span className="font-medium"> {filters.offset + calls.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportToCSV(calls)}
              disabled={!calls || calls.length === 0}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                ${!calls || calls.length === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700 shadow-sm"}
                transition
              `}
              title="Download current table as CSV"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">ID</th>
                <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Customer</th>
                <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Status</th>
                <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Duration</th>
                <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">User Input</th>
                <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Phone</th>
                <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Date</th>
                <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">Start</th>
                <th className="p-3 text-left font-medium text-xs text-gray-600 dark:text-gray-300">End</th>
                <th className="p-3 text-right font-medium text-xs text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {calls.length > 0 ? (
                calls.map((c) => (
                  <tr key={c.id} className="bg-white dark:bg-gray-900 hover:shadow-md transition-shadow duration-150">
                    <td className="p-3">{c.id}</td>

                    <td className="p-3 max-w-xs truncate" title={c.cust_name || c.customer_name || ""}>
                      {c.cust_name || c.customer_name || "-"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`
                          inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            (c.status || "").toLowerCase() === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : (c.status || "").toLowerCase() === "initiated"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }
                        `}
                      >
                        {(c.status || "-").toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3">{c.call_duration ?? "-"}</td>
                    <td className="p-3 max-w-xs truncate" title={c.user_input || ""}>{c.user_input || "-"}</td>
                    <td className="p-3">{c.phone_number || "-"}</td>
                    <td className="p-3">{formatDate(c.created_at)}</td>
                    <td className="p-3">{formatTime(c.call_start_time)}</td>
                    <td className="p-3">{formatTime(c.call_end_time)}</td>

                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => openModal(c)} className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg shadow hover:bg-indigo-700 transition">
                          <Eye size={14} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center p-8 text-gray-500 dark:text-gray-400">No call records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <button onClick={handlePrev} disabled={filters.offset === 0} className={`px-4 py-2 rounded-lg font-medium transition ${filters.offset === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border shadow hover:bg-gray-50"}`}>
              ← Previous
            </button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing <b>{filters.offset + 1}</b> – <b>{filters.offset + calls.length}</b>
          </div>

          <div>
            <button onClick={handleNext} disabled={calls.length < filters.limit} className={`px-4 py-2 rounded-lg font-medium transition ${calls.length < filters.limit ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"}`}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-2xl mx-4 transform transition-all duration-200 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-700" style={{ animation: "200ms ease-out 0s 1 normal none running scaleIn" }}>
            <div className="flex items-start justify-between p-5 border-b dark:border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Call Details — ID #{selectedCall.id}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedCall.cust_name || selectedCall.customer_name || selectedCall.phone_number || "-"} · {selectedCall.status?.toUpperCase() || "-"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm">
                  <Copy size={14} /> {copyStatus === "copied" ? "Copied" : "Copy"}
                </button>

                <button onClick={handleDownload} className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm">
                  <Download size={14} /> JSON
                </button>

                <button onClick={closeModal} className="p-2 rounded-md hover:bg-gray-100"><X size={18} /></button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Customer</div>
                  <div className="font-medium">{selectedCall.cust_name || selectedCall.customer_name || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="font-medium">{selectedCall.phone_number || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-medium capitalize">{selectedCall.status || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Duration (s)</div>
                  <div className="font-medium">{selectedCall.call_duration ?? "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">User Input</div>
                  <div className="font-medium">{selectedCall.user_input || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="font-medium">{formatDate(selectedCall.created_at)}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Start Time</div>
                  <div className="font-medium">{formatTime(selectedCall.call_start_time)}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">End Time</div>
                  <div className="font-medium">{formatTime(selectedCall.call_end_time)}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">ID</div>
                  <div className="font-medium">{selectedCall.id}</div>
                </div>
              </div>

              <details className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border dark:border-gray-700">
                <summary className="cursor-pointer font-medium">Show raw JSON</summary>
                <pre className="mt-2 max-h-60 overflow-auto text-xs bg-transparent p-2">{JSON.stringify(selectedCall, null, 2)}</pre>
              </details>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          0% { transform: translateY(6px) scale(.985); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .scaleIn { animation: scaleIn 200ms ease-out both; }
      `}</style>
    </>
  );
}



