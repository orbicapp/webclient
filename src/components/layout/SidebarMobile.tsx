import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { navCategories, NavItem } from "./sidebar-data";

export function SidebarMobile() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around">
        {navCategories
          .reduce((acc: NavItem[], category) => acc.concat(category.items), [])
          .filter((item) => item.mobile)
          .map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-3 ${
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-text-secondary dark:text-gray-400"
                }`}
              >
                {item.icon}

                {isActive && (
                  <span className="text-xs mt-1 h-2">{item.name}</span>
                )}

                {isActive && (
                  <motion.span
                    layoutId="mobileActiveNavIndicator"
                    className="absolute top-0 w-10 h-1 rounded-full bg-primary-600 dark:bg-primary-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
