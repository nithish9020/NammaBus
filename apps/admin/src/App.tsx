import { useState } from 'react';
import { Login } from './components/Login';

function Dashboard({ userEmail, onLogout }: { userEmail: string; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M3 11l19-9-9 19-2-8-8-2z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">NammaBus</span>
            <span className="text-slate-300 mx-2">|</span>
            <span className="text-sm text-slate-500 font-medium">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xs">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden sm:block">{userEmail}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
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
      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  return <Dashboard userEmail={userEmail} onLogout={() => setIsLoggedIn(false)} />;
}

export default App;
