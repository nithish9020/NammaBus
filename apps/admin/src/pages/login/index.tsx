import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@nammabus/shared/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if actually already logged in
  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await authApi.getSession();
      if (!res.data || res.error) {
        throw new Error(res.error || "No session");
      }
      return res.data;
    },
    retry: false
  });

  useEffect(() => {
    if (sessionData && sessionData.user) {
      navigate('/', { replace: true });
    }
  }, [sessionData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: apiError } = await authApi.signIn({ email, password });

      if (apiError) {
        throw new Error(apiError);
      }

      if (data?.user) {
        // Logged in successfully, invalidate session to force refresh in layout
        await queryClient.invalidateQueries({ queryKey: ["session"] });
        navigate('/', { replace: true });
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionLoading || (sessionData && sessionData.user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-between p-14 relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M3 11l19-9-9 19-2-8-8-2z" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">NammaBus</span>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <h1 className="text-white text-5xl font-bold leading-tight">
            Transit<br />Control<br />Centre
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            Manage routes, monitor live buses, and coordinate drivers — all from one unified dashboard.
          </p>

          {/* Quick stats */}
          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-white text-3xl font-bold">120+</div>
              <div className="text-blue-200 text-sm mt-1">Active Routes</div>
            </div>
            <div>
              <div className="text-white text-3xl font-bold">400+</div>
              <div className="text-blue-200 text-sm mt-1">Daily Trips</div>
            </div>
            <div>
              <div className="text-white text-3xl font-bold">24/7</div>
              <div className="text-blue-200 text-sm mt-1">Live Tracking</div>
            </div>
          </div>
        </div>

        <div className="relative text-blue-200 text-sm">
          © 2026 NammaBus Transit Management
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative z-10 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M3 11l19-9-9 19-2-8-8-2z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">NammaBus</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2">Sign in to your admin account</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-slate-700 font-medium block">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@nammabus.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500 focus-visible:border-blue-500"
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-slate-700 font-medium block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500 focus-visible:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
