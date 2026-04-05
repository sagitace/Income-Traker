import { useState, useEffect } from "react";
import { dashboardService } from "../services/api";
import Navigation from "../components/Navigation";
import { formatPeso } from "../utils/currency";

export default function YearlyPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [summary, setSummary] = useState(null);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
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
    fetchYearlyData();
  }, [year]);

  const fetchYearlyData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await dashboardService.getYearly(year);
      setSummary(response.data.summary);
      setMonthlyBreakdown(response.data.monthly_breakdown || []);
    } catch (err) {
      setError(
        `Failed to load data: ${err.response?.data?.detail || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousYear = () => setYear(year - 1);
  const handleNextYear = () => setYear(year + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="w-full px-4 py-6 sm:py-8">
        {/* Year Selector */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePreviousYear}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition text-sm sm:text-base w-full sm:w-auto"
            >
              ← Previous Year
            </button>

            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {year}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Yearly Report
              </p>
            </div>

            <button
              onClick={handleNextYear}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition text-sm sm:text-base w-full sm:w-auto"
            >
              Next Year →
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
            <p className="text-gray-600">Loading yearly data...</p>
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
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Avg: {formatPeso(summary.total_income / 12)}/mo
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Total Savings
                </p>
                <p className="text-lg sm:text-3xl font-bold text-green-600 mt-2">
                  {formatPeso(summary.total_savings)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(
                    (summary.total_savings / summary.total_income) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Emergency Fund
                </p>
                <p className="text-lg sm:text-3xl font-bold text-orange-600 mt-2">
                  {formatPeso(summary.total_emergency)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(
                    (summary.total_emergency / summary.total_income) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Total Entries
                </p>
                <p className="text-lg sm:text-3xl font-bold text-purple-600 mt-2">
                  {summary.entry_count}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: {(summary.entry_count / 12).toFixed(1)}/mo
                </p>
              </div>
            </div>

            {/* Monthly Breakdown Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Monthly Breakdown
                </h2>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Month
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
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900">
                        Entries
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900">
                        Avg Entry
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthlyBreakdown.map((month) => (
                      <tr key={month.month} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                          {monthNames[month.month - 1]}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right text-gray-900">
                          {formatPeso(month.total_income)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right text-green-600">
                          {formatPeso(month.total_savings)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right text-orange-600">
                          {formatPeso(month.total_emergency)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right text-purple-600 font-medium">
                          {month.entry_count}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right text-gray-600">
                          {formatPeso(
                            month.total_income / month.entry_count || 0,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-gray-200">
                {monthlyBreakdown.map((month) => (
                  <div
                    key={month.month}
                    className="p-4 hover:bg-gray-50 space-y-2"
                  >
                    <div className="font-semibold text-gray-900 text-sm mb-3">
                      {monthNames[month.month - 1]}
                    </div>
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-medium text-gray-600">Income:</span>
                      <span className="text-gray-900 font-semibold">
                        {formatPeso(month.total_income)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-medium text-gray-600">
                        Savings:
                      </span>
                      <span className="text-green-600 font-semibold">
                        {formatPeso(month.total_savings)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-medium text-gray-600">
                        Emergency:
                      </span>
                      <span className="text-orange-600 font-semibold">
                        {formatPeso(month.total_emergency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start text-xs pt-2 border-t border-gray-100">
                      <span className="font-medium text-gray-600">
                        Entries:
                      </span>
                      <span className="text-purple-600 font-semibold">
                        {month.entry_count}
                      </span>
                    </div>
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-medium text-gray-600">
                        Avg Entry:
                      </span>
                      <span className="text-gray-600">
                        {formatPeso(
                          month.total_income / month.entry_count || 0,
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
