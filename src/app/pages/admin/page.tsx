export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Users",
      count: "1,250",
      color: "bg-blue-500",
    },
    {
      label: "Total Posts",
      count: "5,840",
      color: "bg-green-500",
    },
    { label: "Reports", count: "12", color: "bg-red-500" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Ritgram Admin Panel
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} p-6 rounded-xl text-white shadow-lg`}
          >
            <p className="text-sm uppercase font-semibold opacity-80">
              {item.label}
            </p>
            <p className="text-3xl font-bold">{item.count}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Recent Users</h2>
        <p className="text-gray-500 text-sm">
          Manage your community members here.
        </p>
        {/* এখানে ইউজার লিস্টের টেবিল হবে */}
      </div>
    </div>
  );
}