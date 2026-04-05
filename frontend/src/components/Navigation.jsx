import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function Navigation() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          💰 <span className="hidden sm:inline">Income Tracker</span>
          <span className="sm:hidden">Tracker</span>
        </h1>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1 p-2 hover:bg-blue-700 rounded"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-0.5 bg-white transition-all"></div>
          <div className="w-6 h-0.5 bg-white transition-all"></div>
          <div className="w-6 h-0.5 bg-white transition-all"></div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
          <a
            href="/dashboard"
            className="hover:bg-blue-700 px-3 py-2 rounded text-sm lg:text-base transition"
          >
            Dashboard
          </a>
          <a
            href="/income"
            className="hover:bg-blue-700 px-3 py-2 rounded text-sm lg:text-base transition"
          >
            Add Income
          </a>
          <a
            href="/monthly"
            className="hover:bg-blue-700 px-3 py-2 rounded text-sm lg:text-base transition"
          >
            Monthly
          </a>
          <a
            href="/yearly"
            className="hover:bg-blue-700 px-3 py-2 rounded text-sm lg:text-base transition"
          >
            Yearly
          </a>
          <a
            href="/settings"
            className="hover:bg-blue-700 px-3 py-2 rounded text-sm lg:text-base transition"
          >
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-sm lg:text-base font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500">
          <div className="px-4 py-2 space-y-2 flex flex-col">
            <a
              href="/dashboard"
              onClick={handleLinkClick}
              className="hover:bg-blue-800 px-4 py-3 rounded text-base font-medium transition block"
            >
              Dashboard
            </a>
            <a
              href="/income"
              onClick={handleLinkClick}
              className="hover:bg-blue-800 px-4 py-3 rounded text-base font-medium transition block"
            >
              Add Income
            </a>
            <a
              href="/monthly"
              onClick={handleLinkClick}
              className="hover:bg-blue-800 px-4 py-3 rounded text-base font-medium transition block"
            >
              Monthly
            </a>
            <a
              href="/yearly"
              onClick={handleLinkClick}
              className="hover:bg-blue-800 px-4 py-3 rounded text-base font-medium transition block"
            >
              Yearly
            </a>
            <a
              href="/settings"
              onClick={handleLinkClick}
              className="hover:bg-blue-800 px-4 py-3 rounded text-base font-medium transition block"
            >
              Settings
            </a>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded text-base font-semibold transition w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
