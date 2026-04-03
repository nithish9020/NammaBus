import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@nammabus/shared/api";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/routes": "Routes",
  "/stops": "Stops",
  "/drivers": "Drivers & Conductors",
  "/buses": "Buses",
  "/settings": "Settings",
};

export function DashboardLayout() {
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await authApi.getSession();
      if (!res.data || res.error) {
        throw new Error(res.error || "No session");
      }
      return res.data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !data || !data.session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const handleSignOut = async () => {
    try {
      await authApi.signOut();
    } catch {
      // ignore
    } finally {
      queryClient.clear();
      // force reload or navigate
      window.location.href = "/login";
    }
  };

  const currentPath = location.pathname;
  const activeTitle =
    Object.entries(PAGE_TITLES).find(([path]) => path === '/' ? currentPath === '/' : currentPath.startsWith(path))?.[1] ||
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
