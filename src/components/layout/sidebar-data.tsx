import {
  BookOpenIcon,
  CompassIcon,
  HomeIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
  TrophyIcon,
  StarIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  mobile?: boolean;
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}

export const navCategories: NavCategory[] = [
  {
    title: "Main",
    items: [
      {
        name: "Overview",
        path: "/",
        icon: <HomeIcon className="w-5 h-5" />,
        mobile: true,
      },
      {
        name: "My Courses",
        path: "/my-courses",
        icon: <BookOpenIcon className="w-5 h-5" />,
        mobile: true,
      },
      {
        name: "Achievements",
        path: "/achievements",
        icon: <TrophyIcon className="w-5 h-5" />,
        mobile: false,
      },
    ],
  },
  {
    title: "Learning",
    items: [
      {
        name: "Explore",
        path: "/courses",
        icon: <CompassIcon className="w-5 h-5" />,
        mobile: true,
      },
      {
        name: "Create",
        path: "/courses/create",
        icon: <PlusCircleIcon className="w-5 h-5" />,
        mobile: false,
      },
      {
        name: "Leaderboard",
        path: "/leaderboard",
        icon: <StarIcon className="w-5 h-5" />,
        mobile: false,
      },
    ],
  },
  {
    title: "Social",
    items: [
      {
        name: "Friends",
        path: "/friends",
        icon: <UsersIcon className="w-5 h-5" />,
        mobile: false,
      },
      {
        name: "Groups",
        path: "/groups",
        icon: <UsersIcon className="w-5 h-5" />,
        mobile: false,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        name: "Profile",
        path: "/profile",
        icon: <UserIcon className="w-5 h-5" />,
        mobile: true,
      },
      {
        name: "Settings",
        path: "/settings",
        icon: <SettingsIcon className="w-5 h-5" />,
        mobile: true,
      },
      {
        name: "Logout",
        path: "/logout",
        icon: <LogOutIcon className="w-5 h-5" />,
        mobile: false,
      },
    ],
  },
];
