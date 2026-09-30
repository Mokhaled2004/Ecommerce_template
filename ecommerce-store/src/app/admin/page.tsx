export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">$0.00</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">0</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Products</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">0</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Active Offers</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">0</h3>
        </div>
      </div>
    </div>
  );
}