function App() {
  return (
    <div className="min-h-screen bg-neutral-900 border-t-4 border-purple-500 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          NammaBus Admin
        </h1>
        
        <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto">
          Manage routes, drivers, and real-time transit data from one dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition-colors font-semibold text-white shadow-lg shadow-purple-500/30">
            Sign In
          </button>
          <button className="px-8 py-3 rounded-full bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-colors font-semibold text-white">
            View Documentation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-purple-500/50 transition-colors text-left">
            <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
            <p className="text-neutral-400">Monitor all active buses and drivers in real-time across the city.</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-purple-500/50 transition-colors text-left">
            <h3 className="text-xl font-semibold mb-2">Route Management</h3>
            <p className="text-neutral-400">Update stops, timings, and route paths instantly.</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-purple-500/50 transition-colors text-left">
            <h3 className="text-xl font-semibold mb-2">Driver Analytics</h3>
            <p className="text-neutral-400">View driver performance, active hours, and assigned shifts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
