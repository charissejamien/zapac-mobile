"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/reports", label: "Reports", icon: "🚩" },
  { href: "/analytics/screens", label: "Screen Analytics", icon: "📱" },
  { href: "/analytics/users", label: "User Analytics", icon: "👥" },
  { href: "/users", label: "Users", icon: "🗂️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-3">
        <h1 className="text-xl font-extrabold text-primary">Zapac Admin</h1>
        <p className="text-xs text-gray-400 mt-1">Zap Around Cebu</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100 px-3">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="text-sm text-gray-400 hover:text-danger transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
