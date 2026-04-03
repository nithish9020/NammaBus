import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@nammabus/shared/api";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/routes": "Routes",
  "/stops": "Stops",
  "/drivers": "Drivers & Conductors",
  "/buses": "Buses",
  "/settings": "Settings",
};

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await authApi.getSession();
      // If unauthorized, react-query should know it's an error/null state
      if (!res.data || res.error) {
        throw new Error(res.error || "No session");
      }
      return res.data;
    },
    retry: false, // Do not retry if unauthorized
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Handle null session (unauthorized) or fetch error
  if (isError || !data || !data.session) {
    // Force a microtask delay before navigating to avoid state updates during render
    queueMicrotask(() => {
      navigate("/login", { replace: true });
    });
    return null;
  }

  const handleSignOut = async () => {
    try {
      await authApi.signOut();
    } catch {
      // ignore
    } finally {
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  };

  const currentPath = location.pathname;
  const activeTitle =
    Object.entries(PAGE_TITLES).find(([path]) => currentPath.startsWith(path))?.[1] ||
    "Dashboard";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={data.user.name} onSignOut={handleSignOut} />

      <div className="flex flex-1 flex-col pl-[240px]">
        <Header title={activeTitle} userEmail={data.user.email} />
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
