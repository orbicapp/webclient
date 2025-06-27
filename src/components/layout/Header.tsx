import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore } from "@/stores/settings-store";
import {
  ChevronDownIcon,
  MoonIcon,
  RocketIcon,
  SearchIcon,
  SunIcon,
  UsersIcon,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import ProgressRing from "../ui/ProgressRing";

export function Header() {
  const { theme, toggleTheme } = useSettingsStore();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile logo and menu button */}
          <div className="flex items-center md:hidden">
            <RocketIcon className="w-7 h-7 text-primary-600" />
            <span className="text-xl font-bold ml-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Orbic
            </span>
          </div>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mr-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search courses, topics..."
                className="block w-full rounded-xl pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5 text-gray-400 dark:text-gray-300" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            {/*  <NotificationDropdown /> */}

            {/* Social sidebar toggle */}
            <button
              onClick={() => {}}
              className="hidden md:flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <UsersIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Mobile profile dropdown */}
            <div className="relative md:hidden">
              <button className="flex items-center space-x-3 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Avatar
                  src={user?.avatarId}
                  alt={user?.displayName}
                  size="sm"
                />
                <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Desktop user profile */}
            <div className="hidden md:flex items-center">
              <ProgressRing progress={35} size={40} strokeWidth={4}>
                <span className="text-xs font-bold dark:text-white">1</span>
              </ProgressRing>

              <div className="ml-4">
                <p className="text-sm font-medium dark:text-white">
                  {user?.displayName}
                </p>
                <p className="text-xs text-text-muted dark:text-gray-400">
                  {user?.username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
