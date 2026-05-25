export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <i className="ri-line-chart-line text-white text-xl"></i>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">ExpenseIQ</span>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Take control of<br />your finances.
            </h1>
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">
              Track expenses, manage budgets, and gain insights into your spending habits — all in one place.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "ri-pie-chart-2-line", text: "Visual spending breakdowns" },
              { icon: "ri-wallet-3-line", text: "Budget tracking & alerts" },
              { icon: "ri-bar-chart-2-line", text: "Monthly income vs expense reports" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`${item.icon} text-blue-400 text-sm`}></i>
                </div>
                <span className="text-slate-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-sm">© 2026 ExpenseIQ. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        {children}
      </div>
    </div>
  );
}
