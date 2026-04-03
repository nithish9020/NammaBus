import { useAuth, AuthProvider } from './context/AuthContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';

function Dashboard() {
  return (
    <Layout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-1">Monitor and manage your transit network</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Active Routes', value: '24', change: '+2 today', icon: '🗺️', color: 'bg-blue-50 text-blue-600' },
          { label: 'Buses On Road', value: '18', change: '6 idle', icon: '🚌', color: 'bg-green-50 text-green-600' },
          { label: 'Active Drivers', value: '21', change: '3 on break', icon: '👤', color: 'bg-purple-50 text-purple-600' },
          { label: 'Live Watchers', value: '142', change: 'Real-time', icon: '📡', color: 'bg-orange-50 text-orange-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center text-base`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-400 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            title: 'Live Tracking',
            desc: 'Monitor all active buses and drivers in real-time across the city network.',
            icon: '📍',
            action: 'Open Map',
          },
          {
            title: 'Route Management',
            desc: 'Create, update, and manage bus stop sequences and route timings instantly.',
            icon: '🛤️',
            action: 'Manage Routes',
          },
          {
            title: 'Driver Management',
            desc: 'View driver profiles, performance history, and assign active shifts.',
            icon: '🪪',
            action: 'View Drivers',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="text-3xl mb-4">{card.icon}</div>
            <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {card.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">{card.desc}</p>
            <button className="text-sm text-blue-600 font-medium hover:underline">{card.action} →</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-slate-500 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
