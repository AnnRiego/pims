"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  Bell,
  Shield,
  Save,
  RotateCcw,
  Monitor,
  Lock,
  KeyRound,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Database,
  Clock3,
} from "lucide-react";

// =====================================================
// STORAGE KEY
// =====================================================

const SETTINGS_STORAGE_KEY = "pimsSettings";

// =====================================================
// DEFAULT SETTINGS
// =====================================================

const defaultSettings = {
  notifications: {
    systemNotifications: true,
    returnNotifications: true,
    maintenanceNotifications: true,
  },

  appearance: {
    compactMode: false,
  },

  security: {
    sessionTimeout: "30",
  },
};

// =====================================================
// SIDEBAR MENU
// =====================================================

const menuItems = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Properties",
    route: "/property",
    icon: Package,
  },
  {
    name: "Check-In",
    route: "/check-in",
    icon: ArrowDownToLine,
  },
  {
    name: "Check-Out",
    route: "/check-out",
    icon: ArrowUpFromLine,
  },
  {
    name: "Manage Users",
    route: "/users",
    icon: Users,
  },
  {
    name: "Reports",
    route: "/reports",
    icon: FileText,
  },
  {
    name: "Settings",
    route: "/settings",
    icon: Settings,
  },
];

// =====================================================
// MAIN PAGE
// =====================================================

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // ===================================================
  // AUTH
  // ===================================================

  const [user, setUser] = useState(null);

  // ===================================================
  // UI
  // ===================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  // ===================================================
  // SETTINGS
  // ===================================================

  const [settings, setSettings] =
    useState(defaultSettings);

  // ===================================================
  // ACCOUNT FORM
  // ===================================================

  const [accountForm, setAccountForm] = useState({
    name: "",
    role: "",
    email: "",
  });

  // ===================================================
  // AUTHENTICATION
  // ===================================================

  useEffect(() => {
    const authenticated =
      sessionStorage.getItem(
        "pimsAuthenticated"
      );

    const storedUser =
      sessionStorage.getItem("pimsUser");

    if (authenticated !== "true") {
      router.replace("/");
      return;
    }

    if (storedUser) {
      try {
        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);

        setAccountForm({
          name: parsedUser.name || "",
          role: parsedUser.role || "",
          email: parsedUser.email || "",
        });
      } catch {
        sessionStorage.removeItem(
          "pimsAuthenticated"
        );

        sessionStorage.removeItem(
          "pimsUser"
        );

        router.replace("/");
      }
    }
  }, [router]);

  // ===================================================
  // LOAD SETTINGS
  // ===================================================

  useEffect(() => {
    const stored =
      localStorage.getItem(
        SETTINGS_STORAGE_KEY
      );

    if (!stored) {
      return;
    }

    try {
      const parsed =
        JSON.parse(stored);

      setSettings({
        ...defaultSettings,
        ...parsed,
        notifications: {
          ...defaultSettings.notifications,
          ...(parsed.notifications || {}),
        },
        appearance: {
          ...defaultSettings.appearance,
          ...(parsed.appearance || {}),
        },
        security: {
          ...defaultSettings.security,
          ...(parsed.security || {}),
        },
      });
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  // ===================================================
  // LOGOUT
  // ===================================================

  function handleLogout() {
    sessionStorage.removeItem(
      "pimsAuthenticated"
    );

    sessionStorage.removeItem(
      "pimsUser"
    );

    router.replace("/");
  }

  // ===================================================
  // NAVIGATION
  // ===================================================

  function navigateTo(route) {
    setSidebarOpen(false);
    setNotificationOpen(false);

    router.push(route);
  }

  // ===================================================
  // UPDATE SETTINGS
  // ===================================================

  function updateNotification(
    field,
    value
  ) {
    setSettings((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [field]: value,
      },
    }));
  }

  function updateAppearance(
    field,
    value
  ) {
    setSettings((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        [field]: value,
      },
    }));
  }

  function updateSecurity(
    field,
    value
  ) {
    setSettings((current) => ({
      ...current,
      security: {
        ...current.security,
        [field]: value,
      },
    }));
  }

  // ===================================================
  // ACCOUNT FORM
  // ===================================================

  function updateAccount(field, value) {
    setAccountForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ===================================================
  // SAVE SETTINGS
  // ===================================================

  function handleSave() {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(settings)
    );

    // Update stored user information
    if (user) {
      const updatedUser = {
        ...user,
        name: accountForm.name,
        role: accountForm.role,
        email: accountForm.email,
      };

      sessionStorage.setItem(
        "pimsUser",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);
    }

    setSaveMessage(
      "Settings saved successfully."
    );

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  }

  // ===================================================
  // RESET SETTINGS
  // ===================================================

  function handleReset() {
    const confirmed =
      window.confirm(
        "Reset all settings to their default values?"
      );

    if (!confirmed) return;

    setSettings(defaultSettings);

    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(defaultSettings)
    );

    setSaveMessage(
      "Settings have been reset to default."
    );

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090909] text-gray-500">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#a70000] border-t-transparent" />

          <p className="text-xs">
            Loading PIMS...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <main className="min-h-screen bg-[#090909] text-white">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/pims.png')",
        }}
      />

      <div className="pointer-events-none fixed inset-0 bg-[#090909]/90" />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(167,0,0,0.16),transparent_40%)]" />

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          />
        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b border-white/[0.06] px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a70000] shadow-[0_0_30px_rgba(167,0,0,0.25)]">
              <Package size={20} />
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-[0.15em]">
                PIMS
              </h1>

              <p className="text-[7px] uppercase tracking-[0.2em] text-gray-600">
                Property Management
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="text-gray-600 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>

        </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <section className="relative z-10 min-h-screen lg:ml-64">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="fixed left-0 right-0 top-0 z-30 flex h-18 items-center justify-between border-b
         border-white/[0.06] bg-[#090909]/80 px-5 backdrop-blur-2xl sm:px-7 lg:left-64">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="text-gray-500 transition hover:text-white lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>

              <p className="text-[8px] uppercase tracking-[0.2em] text-gray-700">
                Property Inventory & Management
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                System Settings
              </h2>

            </div>

          </div>

          {/* NOTIFICATION */}

          <div className="relative">

            <button
              onClick={() =>
                setNotificationOpen(
                  !notificationOpen
                )
              }
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-gray-500 transition-all duration-300 hover:border-[#a70000]/30 hover:text-[#ff2222] hover:shadow-[0_0_18px_rgba(167,0,0,0.12)]"
            >
              <Bell size={16} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#a70000] shadow-[0_0_6px_#a70000]" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">

                <div className="border-b border-white/[0.06] p-4">

                  <p className="text-[11px] font-semibold">
                    Notifications
                  </p>

                  <p className="mt-1 text-[8px] text-gray-600">
                    Recent system activities
                  </p>

                </div>

                <div className="p-2">

                  <NotificationItem
                    title="System Settings"
                    description="Review your PIMS preferences."
                  />

                  <NotificationItem
                    title="Security"
                    description="Your account session is active."
                  />

                </div>

              </div>
            )}

          </div>

        </header>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="p-5 sm:p-7">

          {/* PAGE HEADER */}

          <div className="mb-7">

            <div className="mb-2 flex items-center gap-2">

              <Settings
                size={14}
                className="text-[#a70000]"
              />

              <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600">
                System Configuration
              </span>

            </div>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-600">
              Manage your PIMS account, notification
              preferences, security settings, and
              system preferences.
            </p>

          </div>

          {/* =================================================
              SAVE MESSAGE
          ================================================= */}

          {saveMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/10 bg-green-500/[0.05] px-4 py-3">

              <CheckCircle2
                size={16}
                className="text-green-400"
              />

              <p className="text-[10px] text-green-300">
                {saveMessage}
              </p>

            </div>
          )}

          {/* =================================================
              SETTINGS GRID
          ================================================= */}

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">

            {/* =================================================
                ACCOUNT
            ================================================= */}

            <SettingsSection
              icon={UserCircle}
              title="Account Information"
              description="Manage the information associated with your PIMS account."
            >

              <div className="grid gap-4 sm:grid-cols-2">

                <SettingsInput
                  label="Full Name"
                  value={accountForm.name}
                  onChange={(e) =>
                    updateAccount(
                      "name",
                      e.target.value
                    )
                  }
                />

                <SettingsInput
                  label="Role"
                  value={accountForm.role}
                  onChange={(e) =>
                    updateAccount(
                      "role",
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="mt-4">

                <SettingsInput
                  label="Email Address"
                  value={accountForm.email}
                  onChange={(e) =>
                    updateAccount(
                      "email",
                      e.target.value
                    )
                  }
                  type="email"
                />

              </div>

            </SettingsSection>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <SettingsSection
              icon={Bell}
              title="Notifications"
              description="Choose which system notifications you want to receive."
            >

              <ToggleSetting
                icon={Bell}
                title="System Notifications"
                description="Receive important system updates."
                checked={
                  settings.notifications
                    .systemNotifications
                }
                onChange={(value) =>
                  updateNotification(
                    "systemNotifications",
                    value
                  )
                }
              />

              <ToggleSetting
                icon={ArrowDownToLine}
                title="Return Notifications"
                description="Receive notifications about returned properties."
                checked={
                  settings.notifications
                    .returnNotifications
                }
                onChange={(value) =>
                  updateNotification(
                    "returnNotifications",
                    value
                  )
                }
              />

              <ToggleSetting
                icon={AlertTriangle}
                title="Maintenance Notifications"
                description="Receive alerts for properties requiring attention."
                checked={
                  settings.notifications
                    .maintenanceNotifications
                }
                onChange={(value) =>
                  updateNotification(
                    "maintenanceNotifications",
                    value
                  )
                }
              />

            </SettingsSection>

            {/* =================================================
                APPEARANCE
            ================================================= */}

            <SettingsSection
              icon={Monitor}
              title="Appearance"
              description="Customize how PIMS is displayed on your device."
            >

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#a70000]/10 text-[#a70000]">
                      <Monitor size={16} />
                    </div>

                    <div>

                      <p className="text-[10px] font-medium text-gray-300">
                        Interface Theme
                      </p>

                      <p className="mt-1 text-[8px] text-gray-600">
                        PIMS currently uses the dark interface.
                      </p>

                    </div>

                  </div>

                  <span className="rounded-full border border-[#a70000]/15 bg-[#a70000]/10 px-3 py-1 text-[8px] text-[#ff2a2a]">
                    Dark
                  </span>

                </div>

              </div>

              <div className="mt-3">

                <ToggleSetting
                  icon={Monitor}
                  title="Compact Mode"
                  description="Reduce spacing in tables and system panels."
                  checked={
                    settings.appearance
                      .compactMode
                  }
                  onChange={(value) =>
                    updateAppearance(
                      "compactMode",
                      value
                    )
                  }
                />

              </div>

            </SettingsSection>

            {/* =================================================
                SECURITY
            ================================================= */}

            <SettingsSection
              icon={Shield}
              title="Security & Session"
              description="Manage basic security and session preferences."
            >

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#a70000]/10 text-[#a70000]">
                    <Lock size={16} />
                  </div>

                  <div className="flex-1">

                    <p className="text-[10px] font-medium text-gray-300">
                      Session Timeout
                    </p>

                    <p className="mt-1 text-[8px] text-gray-600">
                      Set how long an inactive session remains active.
                    </p>

                  </div>

                  <select
                    value={
                      settings.security
                        .sessionTimeout
                    }
                    onChange={(e) =>
                      updateSecurity(
                        "sessionTimeout",
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-white/[0.07] bg-black/30 px-3 py-2 text-[9px] text-gray-400 outline-none focus:border-[#a70000]/40"
                  >

                    <option value="15">
                      15 min
                    </option>

                    <option value="30">
                      30 min
                    </option>

                    <option value="60">
                      1 hour
                    </option>

                    <option value="120">
                      2 hours
                    </option>

                  </select>

                </div>

              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">

                <SecurityAction
                  icon={KeyRound}
                  title="Change Password"
                  description="Update account password."
                  onClick={() =>
                    alert(
                      "Password change functionality can be connected here."
                    )
                  }
                />

                <SecurityAction
                  icon={Database}
                  title="Session Information"
                  description="View current system session."
                  onClick={() =>
                    alert(
                      "Current session is active."
                    )
                  }
                />

              </div>

            </SettingsSection>

          </div>

          {/* =================================================
              SYSTEM INFORMATION
          ================================================= */}

          <div className="mt-6">

            <SettingsSection
              icon={Info}
              title="System Information"
              description="Basic information about the current PIMS installation."
            >

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <InfoCard
                  icon={Database}
                  label="System"
                  value="PIMS"
                />

                <InfoCard
                  icon={Clock3}
                  label="Session"
                  value="Active"
                />

                <InfoCard
                  icon={Shield}
                  label="Security"
                  value="Authenticated"
                />

                <InfoCard
                  icon={Settings}
                  label="Environment"
                  value="Local / Demo"
                />

              </div>

            </SettingsSection>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row">

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-[10px] text-gray-500 transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/[0.05] hover:text-red-300"
            >

              <RotateCcw size={14} />

              Reset Settings

            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#a70000] px-6 py-3 text-[10px] font-semibold shadow-[0_0_25px_rgba(167,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c00000] hover:shadow-[0_0_30px_rgba(220,0,0,0.3)]"
            >

              <Save size={14} />

              Save Changes

            </button>

          </div>

        </div>

      </section>

    </main>
  );
}

// =====================================================
// SETTINGS SECTION
// =====================================================

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl transition-all duration-300 hover:border-[#a70000]/20 hover:shadow-[0_10px_40px_rgba(167,0,0,0.06)]">

      <div className="mb-5 flex items-start gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#a70000]/15 bg-[#a70000]/10 text-[#a70000]">
          <Icon size={18} />
        </div>

        <div>

          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-[9px] leading-4 text-gray-600">
            {description}
          </p>

        </div>

      </div>

      {children}

    </div>
  );
}

// =====================================================
// SETTINGS INPUT
// =====================================================

function SettingsInput({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>

      <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-[#a70000]/50 focus:ring-1 focus:ring-[#a70000]/20"
      />

    </div>
  );
}

// =====================================================
// TOGGLE SETTING
// =====================================================

function ToggleSetting({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-[#a70000]/15 hover:bg-[#a70000]/[0.025]">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600">
          <Icon size={15} />
        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-medium text-gray-300">
            {title}
          </p>

          <p className="mt-1 text-[8px] leading-4 text-gray-600">
            {description}
          </p>

        </div>

      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!checked)
        }
        aria-pressed={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-all duration-300 ${
          checked
            ? "border-[#a70000] bg-[#a70000] shadow-[0_0_15px_rgba(167,0,0,0.25)]"
            : "border-white/10 bg-white/[0.05]"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}

// =====================================================
// SECURITY ACTION
// =====================================================

function SecurityAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all duration-300 hover:border-[#a70000]/20 hover:bg-[#a70000]/[0.035]"
    >

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600 transition-all group-hover:bg-[#a70000]/10 group-hover:text-[#a70000]">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-[10px] font-medium text-gray-300">
          {title}
        </p>

        <p className="mt-1 text-[8px] text-gray-600">
          {description}
        </p>

      </div>

      <ChevronRight
        size={14}
        className="text-gray-700 transition-all group-hover:translate-x-1 group-hover:text-[#a70000]"
      />

    </button>
  );
}

// =====================================================
// INFORMATION CARD
// =====================================================

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#a70000]/10 text-[#a70000]">
        <Icon size={14} />
      </div>

      <p className="text-[8px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="mt-1 text-[10px] font-medium text-gray-400">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// NOTIFICATION ITEM
// =====================================================

function NotificationItem({
  title,
  description,
}) {
  return (
    <div className="flex gap-3 rounded-xl p-3 transition hover:bg-white/[0.025]">

      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a70000] shadow-[0_0_7px_#a70000]" />

      <div>

        <p className="text-[9px] font-medium text-gray-300">
          {title}
        </p>

        <p className="mt-1 text-[8px] leading-4 text-gray-600">
          {description}
        </p>

      </div>

    </div>
  );
}