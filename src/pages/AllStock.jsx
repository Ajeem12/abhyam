// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Breadcrumbs from "../components/Breadcrumbs";
// import { fetchStockList } from "../redux/slices/stockEntrySlice";
// import { IndianRupee } from "lucide-react";

// const AllStock = () => {
//   const dispatch = useDispatch();
//   const { stockList, stockListLoading, stockListError } = useSelector(
//     (state) => state.stock
//   );

//   const [searchTerm, setSearchTerm] = useState("");
//   const [projectId, setProjectId] = useState(null);

//   // Get project_id from localStorage
//   useEffect(() => {
//     const storedProjectId = localStorage.getItem("site_id");
//     if (storedProjectId) {
//       setProjectId(storedProjectId);
//     }
//   }, []);

//   // Fetch stock list
//   useEffect(() => {
//     if (projectId) {
//       const payload = { project_id: projectId };
//       dispatch(fetchStockList(payload));
//     }
//   }, [dispatch, projectId]);

//   // Search filter (frontend only)
//   const filteredStock = stockList.filter((item) => {
//     const term = searchTerm.toLowerCase();

//     return (
//       item.amount.toString().toLowerCase().includes(term) ||
//       item.vendor_id.toString().toLowerCase().includes(term) ||
//       item.material_name.toLowerCase().includes(term) ||
//       item.remark.toLowerCase().includes(term)
//     );
//   });

//   let ImgUrl = import.meta.env.VITE_IMAGE_BASE_URL


//   return (
//     <div className="min-h-screen bg-white">
//       <Breadcrumbs />

//       <div className="w-full">
//         {/* Header */}
//         <div className="mb-3">
//           <h1 className="text-xl text-center font-bold text-gray-800">
//             All Stock
//           </h1>
//         </div>

//         {/* Search */}
//         <div className="flex mb-3">
//           <div className="flex-1 mr-2">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Loading */}
//         {stockListLoading && (
//           <div className="text-center py-4">Loading stock data...</div>
//         )}

//         {/* Error */}
//         {stockListError && (
//           <div className="text-center py-4 text-red-500">
//             Error: {stockListError}
//           </div>
//         )}

//         {/* Stock Data */}
//         {!stockListLoading && !stockListError && (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden md:block bg-white">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm border">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="px-2 py-2 text-left text-xs text-gray-600">Material</th>
//                       <th className="px-2 py-2 text-left text-xs text-gray-600">Qty</th>
//                       <th className="px-2 py-2 text-left text-xs text-gray-600">Amount</th>
//                       <th className="px-2 py-2 text-left text-xs text-gray-600">Date</th>
//                       <th className="px-2 py-2 text-left text-xs text-gray-600">Vendor</th>
//                       <th className="px-2 py-2 text-left text-xs text-gray-600">Remark</th>
//                       <th className="px-2 py-2 text-left text-xs text-gray-600">Bill</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {filteredStock.length > 0 ? (
//                       filteredStock.map((item) => (
//                         <tr key={item.id} className="hover:bg-gray-50">
//                           <td className="px-2 py-2 font-medium">{item.material_name}</td>
//                           <td className="px-2 py-2">{item.qty}</td>
//                           <td className="px-2 py-2 flex items-center gap-1">
//                             <IndianRupee size={12} /> {item.amount}
//                           </td>
//                           <td className="px-2 py-2">{item.date}</td>
//                           <td className="px-2 py-2">Vendor #{item.vendor_id}</td>
//                           <td className="px-2 py-2">{item.remark}</td>
//                           <td className="px-2 py-2">
//                             {item.upload_bill ? (
//                               <a
//                                 href={`${ImgUrl}/bill/${item.upload_bill}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 text-xs underline"
//                               >
//                                 View
//                               </a>
//                             ) : (
//                               "-"
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="7" className="px-2 py-4 text-center">
//                           No stock entries found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Mobile Cards */}
//             <div className="md:hidden space-y-3 mb-20">
//               {filteredStock.length > 0 ? (
//                 filteredStock.map((item) => (
//                   <div
//                     key={item.id}
//                     className="border rounded-lg p-3 shadow-sm bg-white"
//                   >
//                     <div className="font-semibold text-gray-900">
//                       {item.material_name}
//                     </div>
//                     <div className="text-xs text-gray-500 mb-2">
//                       Vendor #{item.vendor_id}
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Qty:</span>
//                       <span className="font-medium">{item.qty}</span>
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Amount:</span>
//                       <span className="flex items-center gap-1 font-medium">
//                         <IndianRupee size={12} /> {item.amount}
//                       </span>
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Date:</span>
//                       <span>{item.date}</span>
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Remark:</span>
//                       <span>{item.remark}</span>
//                     </div>

//                     {item.upload_bill && (
//                       <div className="mt-2">
//                         <a
//                           href={`${ImgUrl}/bill/${item.upload_bill}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 text-xs underline"
//                         >
//                           View Bill
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-4 text-gray-500">
//                   No stock entries found
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllStock;


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../components/Breadcrumbs";
import { fetchStockList } from "../redux/slices/stockEntrySlice";
import { IndianRupee, Search, Calendar, FileText, User, Package, AlertCircle, Filter, Download } from "lucide-react";
import { Link } from "react-router-dom";

const AllStock = () => {
  const dispatch = useDispatch();
  const { stockList, stockListLoading, stockListError } = useSelector(
    (state) => state.stock
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Get project_id from localStorage
  useEffect(() => {
    const storedProjectId = localStorage.getItem("site_id");
    if (storedProjectId) {
      setProjectId(storedProjectId);
    }
  }, []);

  // Fetch stock list
  useEffect(() => {
    if (projectId) {
      const payload = { project_id: projectId };
      dispatch(fetchStockList(payload));
    }
  }, [dispatch, projectId]);

  // Apply filters and sorting
  const filteredAndSortedStock = React.useMemo(() => {
    let result = [...stockList];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return (
          item.amount.toString().toLowerCase().includes(term) ||
          item.vendor_id.toString().toLowerCase().includes(term) ||
          item.material_name.toLowerCase().includes(term) ||
          item.remark.toLowerCase().includes(term)
        );
      });
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date();
      result = result.filter((item) => {
        const itemDate = new Date(item.date);
        switch (dateFilter) {
          case "today":
            return itemDate.toDateString() === today.toDateString();
          case "week":
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            return itemDate >= oneWeekAgo;
          case "month":
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);
            return itemDate >= oneMonthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "material":
          aValue = a.material_name.toLowerCase();
          bValue = b.material_name.toLowerCase();
          break;
        case "amount":
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "vendor":
          aValue = a.vendor_id.toString();
          bValue = b.vendor_id.toString();
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return result;
  }, [stockList, searchTerm, dateFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const totalValue = filteredAndSortedStock.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalItems = filteredAndSortedStock.length;



  return (
    <div className="min-h-screen ">
      <div className="mx-auto sm:px-6 lg:px-8 mb-20">
        <Breadcrumbs />


        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by material, vendor, amount or remark..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>

            </div>
          </div>

          {/* Expanded Filters */}
          {filterOpen && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Filter</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "All Dates" },
                    { value: "today", label: "Today" },
                    { value: "week", label: "This Week" },
                    { value: "month", label: "This Month" }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setDateFilter(option.value)}
                      className={`px-3 py-1 text-sm rounded-full ${dateFilter === option.value
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="date">Date</option>
                  <option value="material">Material</option>
                  <option value="amount">Amount</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder("asc")}
                    className={`px-3 py-1 text-sm rounded-full ${sortOrder === "asc"
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    Ascending
                  </button>
                  <button
                    onClick={() => setSortOrder("desc")}
                    className={`px-3 py-1 text-sm rounded-full ${sortOrder === "desc"
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    Descending
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {stockListLoading && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {stockListError && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading stock data</h3>
                <div className="mt-2 text-sm text-red-700">{stockListError}</div>
              </div>
            </div>
          </div>
        )}

        {/* Stock Data */}
        {!stockListLoading && !stockListError && (
          <>
            {/* Summary Bar */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredAndSortedStock.length} of {stockList.length} entries
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("material")}
                      >
                        <div className="flex items-center">
                          Material {getSortIcon("material")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center">
                          Amount {getSortIcon("amount")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center">
                          Date {getSortIcon("date")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("vendor")}
                      >
                        <div className="flex items-center">
                          Vendor {getSortIcon("vendor")}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remark
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bill
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedStock.length > 0 ? (
                      filteredAndSortedStock.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.material_name}</div>
                                <div className="text-sm text-gray-500">Qty: {item.qty}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <IndianRupee size={14} className="mr-1" /> {parseFloat(item.amount).toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <User className="h-4 w-4 mr-1 text-gray-400" />
                              Vendor #{item.vendor_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.remark || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {item.images ? (
                              <Link
                                // href={`${ImgUrl}/bill/${item.upload_bill}`}
                                to="/bill-detail" state={item}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs rounded-full font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                View Bill
                              </Link>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Package className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-sm font-medium text-gray-500">No stock entries found</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Table */}
            <div className="md:hidden mb-8">
              {filteredAndSortedStock.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-10 gap-1 px-2 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
                    <div className="col-span-4">Material</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-3 text-center">Amount</div>
                    <div className="col-span-1 text-center">Bill</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-gray-200">
                    {filteredAndSortedStock.map((item) => (
                      <div key={item.id} className="px-2 py-2 hover:bg-gray-50">
                        <div className="grid grid-cols-10 gap-1 items-center">
                          {/* Material Column */}
                          <div className="col-span-4">
                            <div className="font-medium text-xs text-gray-900 truncate">
                              {item.material_name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {new Date(item.date).toLocaleDateString('en-GB')}
                            </div>
                          </div>

                          {/* Quantity Column */}
                          <div className="col-span-2 text-center">
                            <span className="text-xs font-medium text-gray-900">
                              {item.qty}
                            </span>
                          </div>

                          {/* Amount Column */}
                          <div className="col-span-3 text-center">
                            <div className="flex items-center justify-center text-xs font-medium text-gray-900">
                              <IndianRupee size={10} className="mr-1" />
                              {item.amount}
                            </div>
                          </div>

                          {/* Bill Column */}
                          <div className="col-span-1 text-center">
                            {item.images ? (
                              <Link
                                // href={`${ImgUrl}/bill/${item.images}`}
                                to="/bill-detail" state={item}
                                className="inline-flex text-xs items-center justify-center  text-blue-400 hover:text-blue-600 transition-colors"
                                title="View Bill"
                              >
                                View Bill
                              </Link>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </div>
                        </div>

                        {/* Additional info row */}
                        {/* <div className="grid grid-cols-10 gap-1 mt-1">
                          <div className="col-span-10">
                            <div className="text-xs text-gray-500">
                              Vendor #{item.vendor_id}
                              {item.remark && ` • ${item.remark}`}
                            </div>
                          </div>
                        </div> */}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">No stock entries found</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div >
  );
};

export default AllStock;