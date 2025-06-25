import {
  BookOpenIcon,
  CompassIcon,
  FileTextIcon,
  HelpCircleIcon,
  HomeIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
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
    title: "Dashboard",
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
        name: "Profile",
        path: "/profile",
        icon: <UserIcon className="w-5 h-5" />,
        mobile: true,
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
      },
      {
        name: "Resources",
        path: "/resources",
        icon: <FileTextIcon className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        name: "Groups & Family",
        path: "/social",
        icon: <UsersIcon className="w-5 h-5" />,
      },
      {
        name: "Settings",
        path: "/settings",
        icon: <SettingsIcon className="w-5 h-5" />,
        mobile: true,
      },
      {
        name: "Help",
        path: "/help",
        icon: <HelpCircleIcon className="w-5 h-5" />,
      },
      {
        name: "Logout",
        path: "/logout",
        icon: <LogOutIcon className="w-5 h-5" />,
      },
    ],
  },
];
