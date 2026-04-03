import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@nammabus/shared/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ["session"],
  });

  // Depending on how authApi.getSession() wraps the response, handle data unpacking
  const user = session?.data?.user || session?.user || session;

  const handleSignOut = async () => {
    try {
      await authApi.signOut();
    } catch (e) {
      console.error("Sign out error", e);
    } finally {
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            View your account profile and manage your session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={user?.name || ""}
              readOnly
              className="bg-slate-50 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ""}
              readOnly
              className="bg-slate-50 cursor-not-allowed"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 bg-slate-50/50">
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
