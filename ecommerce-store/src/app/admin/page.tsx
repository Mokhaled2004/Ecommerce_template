export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3B1A26]">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-[#FDF6F8] p-6 rounded-xl shadow-sm border border-pink-100">
          <p className="text-sm text-[#888] font-medium">Total Revenue</p>
          <h3 className="text-2xl font-bold text-[#3B1A26] mt-1">$0.00</h3>
          <div className="mt-3 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-[#C8547A] to-[#E8A0B0]"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-[#FDF6F8] p-6 rounded-xl shadow-sm border border-pink-100">
          <p className="text-sm text-[#888] font-medium">Total Orders</p>
          <h3 className="text-2xl font-bold text-[#3B1A26] mt-1">0</h3>
          <div className="mt-3 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-[#C8547A] to-[#E8A0B0]"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-[#FDF6F8] p-6 rounded-xl shadow-sm border border-pink-100">
          <p className="text-sm text-[#888] font-medium">Products</p>
          <h3 className="text-2xl font-bold text-[#3B1A26] mt-1">0</h3>
          <div className="mt-3 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-[#C8547A] to-[#E8A0B0]"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-[#FDF6F8] p-6 rounded-xl shadow-sm border border-pink-100">
          <p className="text-sm text-[#888] font-medium">Active Offers</p>
          <h3 className="text-2xl font-bold text-[#3B1A26] mt-1">0</h3>
          <div className="mt-3 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-[#C8547A] to-[#E8A0B0]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}