export default function StatCard({ label, value, icon, bgColor = 'bg-indigo-100' }) {
  return (
    <div className={`${bgColor} rounded-xl p-5 flex items-center gap-4 shadow-sm`}>
      <div className="text-3xl select-none">{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}