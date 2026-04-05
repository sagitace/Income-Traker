import { useState, useEffect } from "react";
import { dashboardService, incomeService, authService } from "../services/api";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { formatPeso } from "../utils/currency";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, summaryRes, incomesRes] = await Promise.all([
        authService.getMe(),
        dashboardService.getSummary(),
        incomeService.getAll(),
      ]);
      setUser(userRes.data);
      setSummary(summaryRes.data);
      setIncomes(incomesRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Welcome back, {user?.first_name || user?.username}!
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
              Total Income
            </h3>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
              {formatPeso(summary.total_income)}
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
              Total Savings
            </h3>
            <p className="text-lg sm:text-2xl font-bold text-green-600 mt-1">
              {formatPeso(summary.total_savings)}
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
              Emergency Fund
            </h3>
            <p className="text-lg sm:text-2xl font-bold text-blue-600 mt-1">
              {formatPeso(summary.total_emergency)}
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium">
              Entries
            </h3>
            <p className="text-lg sm:text-2xl font-bold text-purple-600 mt-1">
              {summary.entry_count}
            </p>
          </div>
        </div>
      )}

      {/* Income List */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-4 sm:py-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Recent Income
            </h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Source
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Savings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {incomes.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 sm:px-6 py-4 text-center text-gray-500"
                    >
                      No income entries yet.{" "}
                      <a
                        href="/income"
                        className="text-blue-600 hover:underline"
                      >
                        Add one
                      </a>
                    </td>
                  </tr>
                ) : (
                  incomes.map((income) => (
                    <tr key={income.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                        {income.source}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                        {formatPeso(income.amount)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                        {income.year}-{String(income.month).padStart(2, "0")}-
                        {String(income.day).padStart(2, "0")}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-green-600">
                        {formatPeso(income.savings_amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-gray-200">
            {incomes.length === 0 ? (
              <div className="px-4 py-4 text-center text-gray-500">
                No income entries yet.{" "}
                <a
                  href="/income"
                  className="text-blue-600 hover:underline block mt-2"
                >
                  Add one
                </a>
              </div>
            ) : (
              incomes.map((income) => (
                <div
                  key={income.id}
                  className="px-4 py-4 flex flex-col gap-2 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-900 text-sm">
                      Source:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {income.source}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-500 text-sm">
                      Amount:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {formatPeso(income.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-500 text-sm">
                      Date:
                    </span>
                    <span className="text-gray-500 text-sm">
                      {income.year}-{String(income.month).padStart(2, "0")}-
                      {String(income.day).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-500 text-sm">
                      Savings:
                    </span>
                    <span className="text-green-600 font-semibold text-sm">
                      {formatPeso(income.savings_amount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
