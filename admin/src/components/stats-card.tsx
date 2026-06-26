interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export default function StatsCard({ title, value, subtitle, color = "text-primary" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className={`text-3xl font-extrabold mt-1 ${color}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
