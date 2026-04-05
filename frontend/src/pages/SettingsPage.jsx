import { useState, useEffect } from "react";
import { settingsService } from "../services/api";
import Navigation from "../components/Navigation";
import { formatPeso } from "../utils/currency";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    savings_percentage: 20,
    emergency_percentage: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.get();
      setSettings({
        savings_percentage: response.data.savings_percentage,
        emergency_percentage: response.data.emergency_percentage,
      });
    } catch (err) {
      setMessage(
        `❌ Error loading settings: ${err.response?.data?.detail || "Failed to load"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    if (numValue >= 0 && numValue <= 100) {
      setSettings({ ...settings, [name]: numValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const totalPercentage =
        settings.savings_percentage + settings.emergency_percentage;
      if (totalPercentage > 100) {
        setMessage("❌ Savings + Emergency cannot exceed 100%");
        setSaving(false);
        return;
      }

      await settingsService.update(settings);
      setMessage("✅ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(
        `❌ Error: ${err.response?.data?.detail || "Failed to save settings"}`,
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const totalUsed = settings.savings_percentage + settings.emergency_percentage;
  const remaining = 100 - totalUsed;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Configure how your income is allocated
          </p>

          {message && (
            <div
              className={`${
                message.includes("✅")
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              } border px-4 py-3 rounded mb-6 text-sm`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Savings Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Savings Percentage (%)
              </label>
              <input
                type="number"
                name="savings_percentage"
                value={settings.savings_percentage}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2 text-base"
              />
              <p className="text-xs sm:text-sm text-gray-600">
                💎 Per ₱100 income:{" "}
                <strong>
                  {formatPeso((100 * settings.savings_percentage) / 100)}
                </strong>{" "}
                goes to savings
              </p>
            </div>

            {/* Emergency Fund Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Fund Percentage (%)
              </label>
              <input
                type="number"
                name="emergency_percentage"
                value={settings.emergency_percentage}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2 text-base"
              />
              <p className="text-xs sm:text-sm text-gray-600">
                🛡️ Per ₱100 income:{" "}
                <strong>
                  {formatPeso((100 * settings.emergency_percentage) / 100)}
                </strong>{" "}
                goes to emergency fund
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                Allocation Summary
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>💎 Savings:</span>
                  <span className="font-medium">
                    {settings.savings_percentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🛡️ Emergency Fund:</span>
                  <span className="font-medium">
                    {settings.emergency_percentage}%
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span>💰 Personal Use:</span>
                  <span
                    className={`font-medium ${remaining < 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {remaining}%
                  </span>
                </div>
              </div>
              {remaining < 0 && (
                <p className="text-red-600 text-xs sm:text-sm mt-2">
                  ❌ Total exceeds 100%
                </p>
              )}
              {remaining >= 0 && (
                <p className="text-green-600 text-xs sm:text-sm mt-2">
                  ✅ Valid allocation
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving || remaining < 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 text-base sm:text-lg"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 How This Works
            </h3>
            <p className="text-sm text-blue-800">
              When you add an income entry, the system automatically calculates
              savings and emergency fund amounts based on your configured
              percentages. The remaining amount is available for personal use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
