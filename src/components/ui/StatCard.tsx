type Props = {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
};

export default function StatCard({ title, value, change, changePositive, icon, iconBg, iconColor }: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${iconBg}`}>
          <i className={`${icon} text-xl ${iconColor}`}></i>
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-1">
          <div className={`w-4 h-4 flex items-center justify-center ${changePositive ? "text-emerald-500" : "text-red-500"}`}>
            <i className={`${changePositive ? "ri-arrow-up-line" : "ri-arrow-down-line"} text-sm`}></i>
          </div>
          <span className={`text-sm font-medium ${changePositive ? "text-emerald-500" : "text-red-500"}`}>{change}</span>
          <span className="text-sm text-slate-400 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
}
