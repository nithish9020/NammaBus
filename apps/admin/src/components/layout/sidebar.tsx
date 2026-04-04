import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userName: string;
  onSignOut: () => void;
}

export function Sidebar({ userName, onSignOut }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Routes", path: "/routes" },
    { name: "Stops", path: "/stops" },
    { name: "Drivers & Conductors", path: "/drivers" },
    { name: "Buses", path: "/buses" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r flex flex-col z-50">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold tracking-tight text-blue-600">NammaBus Admin</h1>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "block py-2.5 px-5 my-0.5 text-sm font-medium transition-colors border-l-[4px]",
                isActive
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t mt-auto">
        <div className="text-sm font-medium text-slate-900 truncate mb-4">
          {userName}
        </div>
        <button
          onClick={onSignOut}
          className="w-full text-left text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
