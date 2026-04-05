import { useState, useEffect } from "react";
import { dashboardService } from "../services/api";
import Navigation from "../components/Navigation";
import { formatPeso } from "../utils/currency";

export default function MonthlyPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [summary, setSummary] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetchMonthlyData();
  }, [year, month]);

  const fetchMonthlyData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await dashboardService.getMonthly(year, month);
      setSummary(response.data.summary);
      setEntries(response.data.entries || []);
    } catch (err) {
      setError(
        `Failed to load data: ${err.response?.data?.detail || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="w-full px-4 py-6 sm:py-8">
        {/* Month Selector */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePreviousMonth}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition text-sm sm:text-base w-full sm:w-auto"
            >
              ← Previous
            </button>

            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {monthNames[month - 1]} {year}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Monthly Report
              </p>
            </div>

            <button
              onClick={handleNextMonth}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition text-sm sm:text-base w-full sm:w-auto"
            >
              Next →
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading monthly data...</p>
          </div>
        ) : summary ? (
          <div className="max-w-6xl mx-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Total Income
                </p>
                <p className="text-lg sm:text-3xl font-bold text-blue-600 mt-2">
                  {formatPeso(summary.total_income)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Savings
                </p>
                <p className="text-lg sm:text-3xl font-bold text-green-600 mt-2">
                  {formatPeso(summary.total_savings)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Emergency Fund
                </p>
                <p className="text-lg sm:text-3xl font-bold text-orange-600 mt-2">
                  {formatPeso(summary.total_emergency)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Entries
                </p>
                <p className="text-lg sm:text-3xl font-bold text-purple-600 mt-2">
                  {summary.entry_count}
                </p>
              </div>
            </div>

            {/* Entries Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Income Entries
                </h2>
              </div>

              {entries.length === 0 ? (
                <div className="p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">
                  No income entries for {monthNames[month - 1]} {year}
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                            Date
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                            Source
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900">
                            Income
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900">
                            Savings
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900">
                            Emergency
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {entries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                              {entry.year}-
                              {String(entry.month).padStart(2, "0")}-
                              {String(entry.day).padStart(2, "0")}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                              {entry.source}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right font-medium text-gray-900">
                              {formatPeso(entry.amount)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right text-green-600">
                              {formatPeso(entry.savings_amount)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right text-orange-600">
                              {formatPeso(entry.emergency_amount)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                              {entry.notes || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="sm:hidden divide-y divide-gray-200">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 hover:bg-gray-50 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900 text-xs">
                            Date:
                          </span>
                          <span className="text-gray-900 font-semibold text-xs">
                            {entry.year}-{String(entry.month).padStart(2, "0")}-
                            {String(entry.day).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-500 text-xs">
                            Source:
                          </span>
                          <span className="text-gray-900 font-semibold text-xs">
                            {entry.source}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-500 text-xs">
                            Income:
                          </span>
                          <span className="text-gray-900 font-semibold text-xs">
                            {formatPeso(entry.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-500 text-xs">
                            Savings:
                          </span>
                          <span className="text-green-600 font-semibold text-xs">
                            {formatPeso(entry.savings_amount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-500 text-xs">
                            Emergency:
                          </span>
                          <span className="text-orange-600 font-semibold text-xs">
                            {formatPeso(entry.emergency_amount)}
                          </span>
                        </div>
                        {entry.notes && (
                          <div className="flex justify-between items-start pt-1 border-t border-gray-100">
                            <span className="font-medium text-gray-500 text-xs">
                              Notes:
                            </span>
                            <span className="text-gray-600 text-xs text-right">
                              {entry.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
