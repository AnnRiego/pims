"use client";

import { useEffect, useMemo, useState } from "react";
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
  Search,
  Bell,
  Menu,
  X,
  UserCircle,
  Printer,
  FileDown,
  CalendarDays,
  FileText as ReportIcon,
  CheckCircle2,
  AlertTriangle,
  Clock3,
} from "lucide-react";

// =====================================================
// STORAGE KEY
// =====================================================

const MOVEMENTS_STORAGE_KEY = "pimsCheckInMovements";

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

export default function ReportsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // ===================================================
  // USER / UI
  // ===================================================

  const [user, setUser] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  // ===================================================
  // MOVEMENT DATA
  // ===================================================

  const [movements, setMovements] = useState([]);

  // ===================================================
  // REPORT FILTERS
  // ===================================================

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // ===================================================
  // GENERATED REPORT
  // ===================================================

  const [reportData, setReportData] = useState([]);

  const [reportGenerated, setReportGenerated] =
    useState(false);

  const [reportError, setReportError] = useState("");

  // ===================================================
  // AUTHENTICATION
  // ===================================================

  useEffect(() => {
    const authenticated =
      sessionStorage.getItem("pimsAuthenticated");

    const storedUser =
      sessionStorage.getItem("pimsUser");

    if (authenticated !== "true") {
      router.replace("/");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        sessionStorage.removeItem(
          "pimsAuthenticated"
        );

        sessionStorage.removeItem("pimsUser");

        router.replace("/");
      }
    }
  }, [router]);

  // ===================================================
  // LOAD MOVEMENT RECORDS
  // ===================================================

  useEffect(() => {
    const stored =
      localStorage.getItem(
        MOVEMENTS_STORAGE_KEY
      );

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setMovements(parsed);
        } else {
          setMovements([]);
        }
      } catch {
        setMovements([]);
      }
    }
  }, []);

  // ===================================================
  // NAVIGATION
  // ===================================================

  function navigateTo(route) {
    setSidebarOpen(false);
    setNotificationOpen(false);

    router.push(route);
  }

  // ===================================================
  // LOGOUT
  // ===================================================

  function handleLogout() {
    sessionStorage.removeItem(
      "pimsAuthenticated"
    );

    sessionStorage.removeItem("pimsUser");

    router.replace("/");
  }

  // ===================================================
  // SEARCH PREVIEW
  // ===================================================

  const searchableMovements = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return movements;
    }

    return movements.filter((item) => {
      return (
        String(item.id || "")
          .toLowerCase()
          .includes(search) ||
        String(item.propertyName || "")
          .toLowerCase()
          .includes(search) ||
        String(item.propertyId || "")
          .toLowerCase()
          .includes(search) ||
        String(item.employee || "")
          .toLowerCase()
          .includes(search) ||
        String(item.purpose || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [movements, searchTerm]);

  // ===================================================
  // GENERATE REPORT
  // ===================================================

  function handleGenerateReport() {
    setReportError("");

    // -----------------------------------------------
    // DATE VALIDATION
    // -----------------------------------------------

    if (startDate && endDate) {
      if (startDate > endDate) {
        setReportError(
          "Start Date cannot be later than End Date."
        );

        return;
      }
    }

    // -----------------------------------------------
    // FILTER RECORDS
    // -----------------------------------------------

    const filtered = searchableMovements.filter(
      (item) => {
        const recordDate =
          item.dateOut || item.dateReturned || "";

        // Start date
        if (
          startDate &&
          recordDate < startDate
        ) {
          return false;
        }

        // End date
        if (
          endDate &&
          recordDate > endDate
        ) {
          return false;
        }

        return true;
      }
    );

    // -----------------------------------------------
    // SAVE REPORT DATA
    // -----------------------------------------------

    setReportData(filtered);

    setReportGenerated(true);

    // Scroll to generated report
    setTimeout(() => {
      const report =
        document.getElementById(
          "generated-report"
        );

      if (report) {
        report.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }

  // ===================================================
  // CLEAR FILTER
  // ===================================================

  function handleClearFilter() {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setReportData([]);
    setReportGenerated(false);
    setReportError("");
  }

  // ===================================================
  // PRINT REPORT
  // ===================================================

  function handlePrint() {
    window.print();
  }

  // ===================================================
  // REPORT DATE DISPLAY
  // ===================================================

  function formatReportDate(date) {
    if (!date) {
      return "All Records";
    }

    const parsed =
      new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }

  // ===================================================
  // REPORT PERIOD
  // ===================================================

  const reportPeriod =
    startDate || endDate
      ? `${formatReportDate(
          startDate
        )} — ${formatReportDate(endDate)}`
      : "All Property Movement Records";

  // ===================================================
  // REPORT STATISTICS
  // ===================================================

  const totalRecords =
    reportData.length;

  const returnedRecords =
    reportData.filter(
      (item) =>
        item.status === "Returned"
    ).length;

  const attentionRecords =
    reportData.filter(
      (item) =>
        item.condition &&
        item.condition !== "Good"
    ).length;

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
    <main className="min-h-screen bg-[#090909] text-white print:bg-white print:text-black">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat print:hidden"
        style={{
          backgroundImage:
            "url('/images/pims.png')",
        }}
      />

      <div className="pointer-events-none fixed inset-0 bg-[#090909]/90 print:hidden" />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(167,0,0,0.16),transparent_40%)] print:hidden" />

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden print:hidden"
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

        <div className="flex h-18 items-center justify-between border-b border-white/[0.06] px-5">
          <div className="flex items-top gap-3">
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

        {/* MENU */}

        <nav className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-[8px] uppercase tracking-[0.2em] text-gray-700">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.route;

              return (
                <button
                  key={item.route}
                  onClick={() =>
                    navigateTo(item.route)
                  }
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-300 ${
                    isActive
                      ? "border border-[#a70000]/20 bg-[#a70000]/10 text-white shadow-[0_0_18px_rgba(167,0,0,0.06)]"
                      : "border border-transparent text-gray-600 hover:border-[#a70000]/20 hover:bg-[#a70000]/[0.04] hover:text-gray-300"
                  }`}
                >
                  <Icon
                    size={17}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-[#ff2a2a] drop-shadow-[0_0_8px_rgba(255,0,0,0.7)]"
                        : "text-gray-700 group-hover:text-[#ff1a1a] group-hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]"
                    }`}
                  />

                  <span className="text-[10px] font-medium">
                    {item.name}
                  </span>

                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#a70000] shadow-[0_0_8px_#a70000]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* USER */}

        <div className="border-t border-white/[0.06] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#a70000]/10 text-[#a70000]">
              <UserCircle size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-gray-300">
                {user.name}
              </p>

              <p className="truncate text-[8px] text-gray-600">
                {user.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-gray-600 transition-all duration-300 hover:bg-[#a70000]/10 hover:text-red-300"
          >
            <LogOut size={16} />

            <span className="text-[10px]">
              Logout
            </span>
          </button>
        </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <section className="relative z-10 min-h-screen lg:ml-64 print:hidden">

      {/* =====================================================
            TOP BAR
        ===================================================== */}

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
                Reports
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 sm:flex">
              <Search
                size={14}
                className="text-gray-700"
              />

              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                className="w-28 bg-transparent text-[10px] text-gray-300 outline-none placeholder:text-gray-700"
              />
            </div>

            <div className="relative">
              <button
                onClick={() =>
                  setNotificationOpen(
                    !notificationOpen
                  )
                }
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-gray-500 transition-all duration-300 hover:border-[#a70000]/30 hover:text-[#ff2222]"
              >
                <Bell size={16} />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#a70000]" />
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
                      title="Reports"
                      description="Generate property movement reports using a selected date range."
                    />

                    <NotificationItem
                      title="Movement Records"
                      description={`${movements.length} movement records available.`}
                    />

                    <NotificationItem
                      title="Report Status"
                      description={
                        reportGenerated
                          ? `${reportData.length} records included in the current report.`
                          : "No report has been generated yet."
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =================================================
            PAGE BODY
        ================================================= */}

        <div className="p-5 sm:p-7">
          {/* PAGE HEADER */}

          <div className="mb-7">
            <div className="mb-2 flex items-center gap-2">
              <ReportIcon
                size={14}
                className="text-[#a70000]"
              />

              <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600">
                Property Movement Reports
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-600">
              Generate a printable property movement
              report based on the selected reporting
              period.
            </p>
          </div>

          {/* =================================================
              REPORT FILTER CARD
          ================================================= */}

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a70000]/10 text-[#a70000]">
                <CalendarDays size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Generate Property Movement Report
                </h3>

                <p className="mt-1 text-[9px] text-gray-600">
                  Select a date range to include
                  property movement records.
                </p>
              </div>
            </div>

            {/* FILTERS */}

            <div className="grid gap-4 md:grid-cols-3">
              {/* START DATE */}

              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white outline-none transition-all focus:border-[#a70000]/50 focus:ring-1 focus:ring-[#a70000]/20"
                />
              </div>

              {/* END DATE */}

              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white outline-none transition-all focus:border-[#a70000]/50 focus:ring-1 focus:ring-[#a70000]/20"
                />
              </div>

              {/* SEARCH */}

              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
                  Search
                </label>

                <div className="flex items-center rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <Search
                    size={14}
                    className="mr-2 text-gray-700"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Property, employee, purpose..."
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* ERROR */}

            {reportError && (
              <div className="mt-4 rounded-xl border border-red-500/10 bg-red-500/[0.05] px-4 py-3">
                <p className="text-[9px] text-red-300">
                  {reportError}
                </p>
              </div>
            )}

            {/* ACTIONS */}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClearFilter}
                className="rounded-xl border border-white/10 px-5 py-3 text-[10px] text-gray-500 transition-all hover:border-[#a70000]/20 hover:bg-white/[0.04] hover:text-white"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleGenerateReport}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#a70000] px-5 py-3 text-[10px] font-semibold shadow-[0_0_25px_rgba(167,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#c00000] hover:shadow-[0_0_30px_rgba(220,0,0,0.3)]"
              >
                <FileText size={14} />

                Generate Report
              </button>
            </div>
          </div>

          {/* =================================================
              QUICK STATISTICS
          ================================================= */}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <ReportStat
              title="Available Records"
              value={movements.length}
              icon={FileText}
            />

            <ReportStat
              title="Generated Records"
              value={
                reportGenerated
                  ? reportData.length
                  : 0
              }
              icon={CheckCircle2}
            />

            <ReportStat
              title="Needs Attention"
              value={
                reportGenerated
                  ? attentionRecords
                  : 0
              }
              icon={AlertTriangle}
              danger
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          GENERATED REPORT
      ===================================================== */}

      {reportGenerated && (
        <div
          id="generated-report"
          className="relative z-[60] min-h-screen bg-[#d8d8d8] px-3 py-8 sm:px-6 print:min-h-0 print:bg-white print:p-0"
        >
          {/* REPORT TOOLBAR */}

          <div className="mx-auto mb-6 flex w-full max-w-[210mm] items-center justify-between rounded-2xl border border-black/10 bg-[#111111] p-3 shadow-xl print:hidden">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-500">
                Generated Report
              </p>

              <p className="mt-1 text-xs font-semibold text-white">
                Property Movement Report
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl bg-[#a70000] px-4 py-2.5 text-[10px] font-semibold transition hover:bg-[#c00000]"
              >
                <Printer size={14} />

                Print / Save as PDF
              </button>

              <button
                type="button"
                onClick={() =>
                  setReportGenerated(false)
                }
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-[10px] text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={14} />

                Close
              </button>
            </div>
          </div>

          {/* =================================================
              A4 REPORT
          ================================================= */}

          <div
            id="printable-report"
            className="mx-auto w-full max-w-[210mm] bg-white text-black shadow-2xl print:max-w-none print:shadow-none"
            style={{
              minHeight: "297mm",
            }}
          >
            <div className="p-[15mm]">
              {/* =================================================
                  REPORT HEADER
              ================================================= */}

              <div className="border-b-2 border-[#1e5aa8] pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#1e5aa8]">
                      PROPERTY INVENTORY &
                      MANAGEMENT SYSTEM
                    </p>

                    <h1 className="mt-2 text-xl font-bold text-[#1e5aa8]">
                      PROPERTY MOVEMENT REPORT
                    </h1>

                    <p className="mt-1 text-[9px] text-gray-600">
                      Property Check-Out and
                      Check-In Monitoring
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[8px] uppercase text-gray-500">
                      Report Date
                    </p>

                    <p className="mt-1 text-[9px] font-semibold">
                      {new Date().toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  REPORT INFORMATION
              ================================================= */}

              <div className="mt-5 grid grid-cols-2 gap-4 border-b border-gray-300 pb-5">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-500">
                    Reporting Period
                  </p>

                  <p className="mt-1 text-[10px] font-semibold">
                    {reportPeriod}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-500">
                    Total Records
                  </p>

                  <p className="mt-1 text-[10px] font-semibold">
                    {totalRecords}
                  </p>
                </div>
              </div>

              {/* =================================================
                  SUMMARY
              ================================================= */}

              <div className="mt-5 grid grid-cols-3 border border-gray-300">
                <ReportSummaryBox
                  label="Total Records"
                  value={totalRecords}
                />

                <ReportSummaryBox
                  label="Returned"
                  value={returnedRecords}
                />

                <ReportSummaryBox
                  label="Needs Attention"
                  value={attentionRecords}
                />
              </div>

              {/* =================================================
                  TABLE TITLE
              ================================================= */}

              <div className="mt-7">
                <h2 className="text-[11px] font-bold text-[#1e5aa8]">
                  PROPERTY MOVEMENT DETAILS
                </h2>

                <div className="mt-2 h-[2px] bg-[#1e5aa8]" />
              </div>

              {/* =================================================
                  TABLE
              ================================================= */}

              <div className="mt-3 overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#eaf1f8]">
                      <th className="border border-gray-400 px-2 py-2 text-left text-[7px] font-bold uppercase text-[#1e5aa8]">
                        Equipment
                      </th>

                      <th className="border border-gray-400 px-2 py-2 text-left text-[7px] font-bold uppercase text-[#1e5aa8]">
                        Production / Gig
                      </th>

                      <th className="border border-gray-400 px-2 py-2 text-left text-[7px] font-bold uppercase text-[#1e5aa8]">
                        Venue
                      </th>

                      <th className="border border-gray-400 px-2 py-2 text-left text-[7px] font-bold uppercase text-[#1e5aa8]">
                        Assigned Personnel
                      </th>

                      <th className="border border-gray-400 px-2 py-2 text-left text-[7px] font-bold uppercase text-[#1e5aa8]">
                        Check-Out
                      </th>

                      <th className="border border-gray-400 px-2 py-2 text-left text-[7px] font-bold uppercase text-[#1e5aa8]">
                        Status
                      </th>

                      <th className="border border-gray-400 px-2 py-2 text-left text-[7px] font-bold uppercase text-[#1e5aa8]">
                        Check-In
                      </th>

                      <th className="border border-gray-400 px-2 py-2 text-left text-[7px] font-bold uppercase text-[#1e5aa8]">
                        Return Condition
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportData.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="border border-gray-400 px-3 py-10 text-center text-[9px] text-gray-500"
                        >
                          No property movement
                          records found for the
                          selected date range.
                        </td>
                      </tr>
                    ) : (
                      reportData.map(
                        (item, index) => (
                          <tr
                            key={
                              item.id ||
                              index
                            }
                            className="align-top"
                          >
                            <td className="border border-gray-400 px-2 py-2">
                              <p className="text-[8px] font-semibold">
                                {item.propertyName ||
                                  "—"}
                              </p>

                              <p className="mt-1 text-[7px] text-gray-500">
                                {item.propertyId ||
                                  "—"}
                              </p>
                            </td>

                            <td className="border border-gray-400 px-2 py-2 text-[8px]">
                              {item.purpose ||
                                "—"}
                            </td>

                            <td className="border border-gray-400 px-2 py-2 text-[8px]">
                              {item.venue ||
                                "—"}
                            </td>

                            <td className="border border-gray-400 px-2 py-2 text-[8px]">
                              {item.employee ||
                                "—"}
                            </td>

                            <td className="border border-gray-400 px-2 py-2">
                              <p className="text-[8px]">
                                {item.dateOut ||
                                  "—"}
                              </p>

                              <p className="mt-1 text-[7px] text-gray-500">
                                {item.timeOut ||
                                  "—"}
                              </p>
                            </td>

                            <td className="border border-gray-400 px-2 py-2 text-[8px]">
                              {item.status ||
                                "—"}
                            </td>

                            <td className="border border-gray-400 px-2 py-2">
                              <p className="text-[8px]">
                                {item.dateReturned ||
                                  "—"}
                              </p>

                              <p className="mt-1 text-[7px] text-gray-500">
                                {item.timeReturned ||
                                  "—"}
                              </p>
                            </td>

                            <td className="border border-gray-400 px-2 py-2 text-[8px]">
                              {item.condition ||
                                "—"}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  REMARKS
              ================================================= */}

              <div className="mt-6">
                <h2 className="text-[10px] font-bold text-[#1e5aa8]">
                  REMARKS
                </h2>

                <div className="mt-2 border border-gray-300 p-3">
                  {reportData.length ===
                  0 ? (
                    <p className="text-[8px] text-gray-500">
                      No records included in
                      this report.
                    </p>
                  ) : (
                    reportData.map(
                      (item, index) => (
                        <div
                          key={
                            item.id ||
                            index
                          }
                          className="mb-2 last:mb-0"
                        >
                          <p className="text-[8px]">
                            <span className="font-semibold">
                              {item.propertyName ||
                                "Property"}
                              :
                            </span>{" "}
                            {item.remarks ||
                              "No remarks provided."}
                          </p>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>

              {/* =================================================
                  CERTIFICATION
              ================================================= */}

              <div className="mt-7">
                <p className="text-[9px] leading-5 text-gray-700">
                  This report summarizes the property
                  movement records captured in the
                  Property Inventory & Management
                  System for the reporting period
                  indicated above. The information
                  presented is based on the records
                  available in the system at the time
                  of report generation.
                </p>
              </div>

              {/* =================================================
                  APPROVAL
              ================================================= */}

              <div className="mt-12">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#1e5aa8]">
                  APPROVAL
                </p>

                <p className="mt-2 text-[9px] text-gray-600">
                  Reviewed and approved by:
                </p>

                <div className="mt-10 grid grid-cols-2 gap-16">
                  {/* MANAGER */}

                  <div>
                    <div className="border-b border-black pb-1" />

                    <p className="mt-2 text-[9px] font-bold uppercase">
                      Manager / Approving Officer
                    </p>

                    <p className="mt-1 text-[8px] text-gray-500">
                      Signature over Printed Name
                    </p>
                  </div>

                  {/* DATE */}

                  <div>
                    <div className="border-b border-black pb-1" />

                    <p className="mt-2 text-[9px] font-bold uppercase">
                      Date Approved
                    </p>

                    <p className="mt-1 text-[8px] text-gray-500">
                      Date
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="mt-16 border-t border-gray-300 pt-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[7px] font-semibold text-[#1e5aa8]">
                      PIMS — Property Inventory &
                      Management System
                    </p>

                    <p className="mt-1 text-[7px] text-gray-500">
                      Property Movement Report
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[7px] text-gray-500">
                      Generated by
                    </p>

                    <p className="mt-1 text-[7px] font-semibold">
                      {user.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// =====================================================
// REPORT STAT
// =====================================================

function ReportStat({
  title,
  value,
  icon: Icon,
  danger = false,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#a70000]/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-gray-600">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            danger
              ? "bg-orange-500/10 text-orange-400"
              : "bg-[#a70000]/10 text-[#a70000]"
          }`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// REPORT SUMMARY BOX
// =====================================================

function ReportSummaryBox({
  label,
  value,
}) {
  return (
    <div className="border-r border-gray-300 p-3 text-center last:border-r-0">
      <p className="text-[7px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#1e5aa8]">
        {value}
      </p>
    </div>
  );
}

// =====================================================
// NOTIFICATION
// =====================================================

function NotificationItem({
  title,
  description,
}) {
  return (
    <div className="flex gap-3 rounded-xl p-3 transition hover:bg-white/[0.025]">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a70000]" />

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