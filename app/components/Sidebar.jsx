"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  LogOut,
  UserCircle,
  ClipboardCheck,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react";

import UserProfile from "./UserProfile";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("pimsUser");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser({
          name: "System Administrator",
          username: "admin",
          role: "Super Admin",
          status: "Active",
        });
      }
    } catch (error) {
      console.error("Unable to load user:", error);

      setUser({
        name: "System Administrator",
        username: "admin",
        role: "Super Admin",
        status: "Active",
      });
    }
  }, []);

  // =====================================================
  // MENU
  // =====================================================

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Property",
      path: "/property",
      icon: Package,
    },
    {
      label: "Check-Out",
      path: "/check-out",
      icon: ClipboardList,
    },
    {
      label: "Check-In",
      path: "/check-in",
      icon: ClipboardCheck,
    },
    {
      label: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      label: "Users",
      path: "/users",
      icon: Users,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  // =====================================================
  // NAVIGATION
  // =====================================================

  function handleNavigation(path) {
    router.push(path);

    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {
    sessionStorage.removeItem("pimsAuthenticated");
    sessionStorage.removeItem("pimsUser");

    router.push("/");
  }

  // =====================================================
  // PROFILE
  // =====================================================

  function handleOpenProfile() {
    setProfileOpen(true);
  }

  function handleCloseProfile() {
    setProfileOpen(false);
  }

  // =====================================================
  // ACTIVE MENU
  // =====================================================

  function isActive(path) {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  }

  // =====================================================
  // SIDEBAR
  // =====================================================

  return (
    <>
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[250px]
          flex-col
          border-r
          border-white/[0.06]
          bg-[#111111]
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            LOGO / BRAND
        ================================================= */}

        <div className="flex h-[72px] shrink-0 items-center border-b border-white/[0.06] px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a70000] shadow-[0_0_20px_rgba(167,0,0,0.25)]">
              <Package
                size={21}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">
                PIMS
              </h1>

              <p className="mt-0.5 text-[7px] uppercase tracking-[0.2em] text-gray-600">
                Property Management
              </p>
            </div>

          </div>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">

          <p className="mb-3 px-3 text-[8px] font-semibold uppercase tracking-[0.2em] text-gray-700">
            Main Menu
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    transition-all
                    duration-200
                    ${
                      active
                        ? "bg-[#a70000]/10 text-white shadow-[inset_3px_0_0_#a70000]"
                        : "text-gray-500 hover:bg-white/[0.03] hover:text-gray-200"
                    }
                  `}
                >
                  <Icon
                    size={16}
                    className={
                      active
                        ? "text-[#ff2222]"
                        : "text-gray-600 group-hover:text-gray-300"
                    }
                  />

                  <span className="flex-1 text-[10px] font-medium">
                    {item.label}
                  </span>

                  {active && (
                    <ChevronRight
                      size={12}
                      className="text-[#a70000]"
                    />
                  )}
                </button>
              );
            })}

          </div>

        </nav>

        {/* =================================================
            BOTTOM SECTION
        ================================================= */}

        <div className="shrink-0 border-t border-white/[0.06] p-3">

          {/* =================================================
              USER PROFILE BUTTON
              IMPORTANT:
              ONLY THE BUTTON IS INSIDE THE SIDEBAR
          ================================================= */}

          <button
            type="button"
            onClick={handleOpenProfile}
            className="group mb-3 flex w-full items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3 text-left transition-all duration-300 hover:border-[#a70000]/30 hover:bg-[#a70000]/[0.06] hover:shadow-[0_0_20px_rgba(167,0,0,0.08)]"
          >

            {/* PROFILE ICON */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#a70000]/10 text-[#a70000] transition group-hover:bg-[#a70000]/20 group-hover:text-[#ff2222]">
              <UserCircle size={20} />
            </div>

            {/* USER INFORMATION */}

            <div className="min-w-0 flex-1">

              <p className="truncate text-[10px] font-semibold text-gray-300 group-hover:text-white">
                {user?.name ||
                  "System Administrator"}
              </p>

              <p className="truncate text-[8px] text-gray-600">
                {user?.role || "Super Admin"}
              </p>

            </div>

            <span className="text-[9px] text-gray-700 transition group-hover:text-[#a70000]">
              View
            </span>

          </button>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-gray-600 transition-all hover:bg-red-500/[0.05] hover:text-red-400"
          >
            <LogOut
              size={15}
              className="transition group-hover:text-red-400"
            />

            <span className="text-[10px] font-medium">
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          USER PROFILE MODAL

          VERY IMPORTANT:

          THIS IS OUTSIDE THE <aside>.

          Therefore the fixed overlay is relative to the
          ENTIRE BROWSER VIEWPORT, not the sidebar.
      ===================================================== */}

      {profileOpen && (
        <UserProfile
          user={user}
          onClose={handleCloseProfile}
        />
      )}
    </>
  );
}