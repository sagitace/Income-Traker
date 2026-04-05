import { useState, useEffect } from "react";
import { incomeService, settingsService } from "../services/api";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { formatPeso } from "../utils/currency";

export default function IncomePage() {
  const today = new Date();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    source: "Salary",
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [settings, setSettings] = useState({
    savings_percentage: 20,
    emergency_percentage: 10,
  });
  const [calculatedValues, setCalculatedValues] = useState({
    savings: 0,
    emergency: 0,
  });

  useEffect(() => {
    // Fetch settings on mount
    const fetchSettings = async () => {
      try {
        const response = await settingsService.get();
        setSettings({
          savings_percentage: response.data.savings_percentage,
          emergency_percentage: response.data.emergency_percentage,
        });
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calculate savings and emergency in real-time when amount changes
    if (name === "amount" && value) {
      const amount = parseFloat(value);
      const savings = (amount * settings.savings_percentage) / 100;
      const emergency = (amount * settings.emergency_percentage) / 100;
      setCalculatedValues({ savings, emergency });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const date = new Date(
        formData.year,
        formData.month - 1,
        formData.day,
      ).toISOString();

      const response = await incomeService.create({
        amount: parseFloat(formData.amount),
        source: formData.source,
        year: parseInt(formData.year),
        month: parseInt(formData.month),
        day: parseInt(formData.day),
        date: date,
        notes: formData.notes,
      });

      setMessage(
        `✅ Income added! Savings: ${formatPeso(response.data.savings_amount)}, Emergency: ${formatPeso(response.data.emergency_amount)}`,
      );

      // Reset form
      setFormData({
        amount: "",
        source: "Salary",
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        notes: "",
      });
      setCalculatedValues({ savings: 0, emergency: 0 });
      setSuccessSubmitted(true);
    } catch (err) {
      setMessage(
        `❌ Error: ${err.response?.data?.detail || "Failed to add income"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = getDaysInMonth(formData.year, formData.month);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Add Income Entry
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Record your income and automatically calculate savings
          </p>

          {message && (
            <div
              className={`${message.includes("✅") ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"} border px-4 py-3 rounded mb-6 text-sm`}
            >
              {message}
            </div>
          )}

          {successSubmitted ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <p className="text-2xl font-bold text-green-600 mb-2">
                  ✅ Success!
                </p>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  Your income has been recorded and saved.
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition w-full sm:w-auto"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Amount & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="5000.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source *
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                    required
                  >
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Business">Business</option>
                    <option value="Investment">Investment</option>
                    <option value="Bonus">Bonus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Real-time Calculation Display */}
              {formData.amount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-blue-800 font-semibold">
                    Automatic Calculation:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs text-blue-600">Income Amount</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-900">
                        {formatPeso(parseFloat(formData.amount) || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">
                        Savings ({settings.savings_percentage}%)
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-green-700">
                        {formatPeso(calculatedValues.savings)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-600">
                        Emergency ({settings.emergency_percentage}%)
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-orange-700">
                        {formatPeso(calculatedValues.emergency)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Date Selection - Year, Month, Day */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {[2024, 2025, 2026, 2027, 2028].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Month *
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Day *
                  </label>
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                      (d) => (
                        <option key={d} value={d}>
                          {String(d).padStart(2, "0")}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* Date Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs sm:text-sm text-blue-800">
                  📅 Selected Date:{" "}
                  <strong>
                    {formData.year}-{String(formData.month).padStart(2, "0")}-
                    {String(formData.day).padStart(2, "0")}
                  </strong>
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-base sm:text-lg"
              >
                {loading ? "Adding Income..." : "Add Income Entry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
