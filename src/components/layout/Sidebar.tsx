import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, RocketIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore } from "@/stores/settings-store";
import { navCategories } from "./sidebar-data";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useSettingsStore();
  const { logout } = useAuth();

  return (
    <motion.aside
      className={`hidden md:flex flex-col fixed inset-y-0 z-50 shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 ${
        sidebarOpen ? "md:w-64 lg:w-72" : "md:w-20"
      }`}
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Collapse button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-4 top-6 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        {sidebarOpen ? (
          <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Logo */}
      <div
        className={`flex items-center px-6 py-6 border-b border-gray-100 dark:border-gray-700 ${
          sidebarOpen ? "" : "justify-center"
        }`}
      >
        <RocketIcon className="w-8 h-8 text-primary-600" />
        {sidebarOpen && (
          <span className="text-2xl font-bold ml-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Orbic
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navCategories.map((category, index) => (
          <div key={category.title} className={index !== 0 ? "mt-6" : ""}>
            {sidebarOpen && (
              <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {category.title}
              </h3>
            )}

            <ul className="space-y-1 px-3">
              {category.items.map((item) => {
                const isActive = location.pathname === item.path;
                const isLogout = item.name === "Logout";

                return (
                  <li key={item.path}>
                    {isLogout ? (
                      <button
                        onClick={() => logout()}
                        className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          sidebarOpen ? "" : "justify-center"
                        } text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50`}
                      >
                        <span className={sidebarOpen ? "mr-3" : ""}>
                          {item.icon}
                        </span>
                        {sidebarOpen && item.name}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                            : "text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        } ${!sidebarOpen ? "justify-center" : ""}`}
                      >
                        <span className={!sidebarOpen ? "" : "mr-3"}>
                          {item.icon}
                        </span>
                        {sidebarOpen && item.name}
                        {isActive && sidebarOpen && (
                          <motion.span
                            layoutId="activeNavIndicator"
                            className="ml-auto w-1.5 h-5 rounded-full bg-primary-600 dark:bg-primary-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}
