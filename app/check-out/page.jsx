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
  Plus,
  Bell,
  Menu,
  X,
  UserCircle,
  Eye,
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Clock3,
  History,
  AlertTriangle,
  ChevronRight,
  Save,
} from "lucide-react";

// =====================================================
// STORAGE KEY
// =====================================================

const MOVEMENTS_STORAGE_KEY = "pimsCheckOutMovements";

// =====================================================
// DEFAULT CHECK-OUT DATA
// =====================================================

const defaultMovements = [
  {
    id: "CO-00001",
    propertyId: "PIMS-00002",
    propertyName: "MacBook Pro 16-inch",
    category: "Computer / Laptop",
    employee: "Maria Santos",
    purpose: "Field Activity",
    dateOut: "2026-08-08",
    timeOut: "08:30",
    expectedReturn: "2026-08-08",
    status: "On Loan",
    condition: "Good",
    remarks: "For field documentation.",
  },
  {
    id: "CO-00002",
    propertyId: "PIMS-00004",
    propertyName: "Allen & Heath Mixer",
    category: "Audio Equipment",
    employee: "Carlo Mendoza",
    purpose: "Event Production",
    dateOut: "2026-08-07",
    timeOut: "09:00",
    expectedReturn: "2026-08-07",
    status: "Returned",
    condition: "Good",
    remarks: "Returned after event production.",
  },
];

// =====================================================
// SIDEBAR
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

export default function CheckOutPage() {
  const router = useRouter();
  const pathname = usePathname();

  // ===================================================
  // AUTH / UI
  // ===================================================

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // ===================================================
  // MOVEMENT STATE
  // ===================================================

  const [movements, setMovements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ===================================================
  // MODAL STATE
  // ===================================================

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingMovement, setEditingMovement] = useState(null);
  const [selectedMovement, setSelectedMovement] = useState(null);

  // ===================================================
  // FORM
  // ===================================================

  const emptyForm = {
    propertyId: "",
    propertyName: "",
    category: "",
    employee: "",
    purpose: "",
    dateOut: "",
    timeOut: "",
    expectedReturn: "",
    condition: "Good",
    remarks: "",
    status: "On Loan",
  };

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  // ===================================================
  // AUTHENTICATION
  // ===================================================

  useEffect(() => {
    const authenticated =
      sessionStorage.getItem("pimsAuthenticated");

    const storedUser =
      sessionStorage.getItem("pimsUser");

    if (authenticated !== "true") {
      router.replace("/login");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        sessionStorage.removeItem("pimsAuthenticated");
        sessionStorage.removeItem("pimsUser");
        router.replace("/");
      }
    }
  }, [router]);

  // ===================================================
  // LOAD MOVEMENTS
  // ===================================================

  useEffect(() => {
    const stored = localStorage.getItem(
      MOVEMENTS_STORAGE_KEY
    );

    if (stored) {
      try {
        setMovements(JSON.parse(stored));
      } catch {
        setMovements(defaultMovements);
      }
    } else {
      setMovements(defaultMovements);

      localStorage.setItem(
        MOVEMENTS_STORAGE_KEY,
        JSON.stringify(defaultMovements)
      );
    }
  }, []);

  // ===================================================
  // SAVE MOVEMENTS
  // ===================================================

  useEffect(() => {
    if (movements.length > 0) {
      localStorage.setItem(
        MOVEMENTS_STORAGE_KEY,
        JSON.stringify(movements)
      );
    }
  }, [movements]);

  // ===================================================
  // LOGOUT
  // ===================================================

  function handleLogout() {
    sessionStorage.removeItem("pimsAuthenticated");
    sessionStorage.removeItem("pimsUser");

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
  // OPEN ADD MODAL
  // ===================================================

  function openAddModal() {
    setEditingMovement(null);
    setFormError("");

    const now = new Date();

    const today =
      now.toISOString().split("T")[0];

    const currentTime =
      now.toTimeString().slice(0, 5);

    setForm({
      ...emptyForm,
      dateOut: today,
      timeOut: currentTime,
      status: "On Loan",
    });

    setShowModal(true);
  }

  // ===================================================
  // OPEN EDIT MODAL
  // ===================================================

  function openEditModal(movement) {
    setEditingMovement(movement);
    setFormError("");

    setForm({
      propertyId: movement.propertyId,
      propertyName: movement.propertyName,
      category: movement.category,
      employee: movement.employee,
      purpose: movement.purpose,
      dateOut: movement.dateOut,
      timeOut: movement.timeOut,
      expectedReturn: movement.expectedReturn,
      condition: movement.condition,
      remarks: movement.remarks,
      status: movement.status,
    });

    setShowModal(true);
  }

  // ===================================================
  // OPEN VIEW MODAL
  // ===================================================

  function openViewModal(movement) {
    setSelectedMovement(movement);
    setShowViewModal(true);
  }

  // ===================================================
  // FORM CHANGE
  // ===================================================

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  function handleSubmit(e) {
    e.preventDefault();

    setFormError("");

    if (
      !form.propertyId ||
      !form.propertyName ||
      !form.employee ||
      !form.dateOut ||
      !form.timeOut
    ) {
      setFormError(
        "Please complete all required fields."
      );

      return;
    }

    if (
      form.expectedReturn &&
      form.expectedReturn < form.dateOut
    ) {
      setFormError(
        "Expected return date cannot be earlier than the date out."
      );

      return;
    }

    // =================================================
    // EDIT
    // =================================================

    if (editingMovement) {
      setMovements((current) =>
        current.map((item) =>
          item.id === editingMovement.id
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );

      setShowModal(false);
      setEditingMovement(null);
      setForm(emptyForm);

      return;
    }

    // =================================================
    // CREATE
    // =================================================

    const newId =
      `CO-${String(
        movements.length + 1
      ).padStart(5, "0")}`;

    const newMovement = {
      id: newId,
      ...form,
    };

    setMovements((current) => [
      newMovement,
      ...current,
    ]);

    setShowModal(false);
    setForm(emptyForm);
  }

  // ===================================================
  // DELETE
  // ===================================================

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this check-out record?"
    );

    if (!confirmed) return;

    setMovements((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  // ===================================================
  // MARK AS RETURNED
  // ===================================================

  function handleMarkReturned(movement) {
    const confirmed = window.confirm(
      `Mark ${movement.propertyName} as returned?`
    );

    if (!confirmed) return;

    setMovements((current) =>
      current.map((item) =>
        item.id === movement.id
          ? {
              ...item,
              status: "Returned",
            }
          : item
      )
    );
  }

  // ===================================================
  // FILTER
  // ===================================================

  const filteredMovements = useMemo(() => {
    return movements.filter((item) => {
      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        item.id
          .toLowerCase()
          .includes(search) ||
        item.propertyId
          .toLowerCase()
          .includes(search) ||
        item.propertyName
          .toLowerCase()
          .includes(search) ||
        item.employee
          .toLowerCase()
          .includes(search) ||
        item.purpose
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    movements,
    searchTerm,
    statusFilter,
  ]);

  // ===================================================
  // STATISTICS
  // ===================================================

  const totalCheckedOut =
    movements.length;

  const currentlyOut =
    movements.filter(
      (item) => item.status === "On Loan"
    ).length;

  const returned =
    movements.filter(
      (item) => item.status === "Returned"
    ).length;

  const needsAttention =
    movements.filter(
      (item) =>
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
    <main className="min-h-screen bg-[#090909] text-white">

      {/* BACKGROUND */}

      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/pims.png')",
        }}
      />

      <div className="pointer-events-none fixed inset-0 bg-[#090909]/90" />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(167,0,0,0.16),transparent_40%)]" />

      {/* MOBILE OVERLAY */}

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

      <section className="relative z-10 min-h-screen lg:ml-64">

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
                Property Check-Out
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
                      title="Check-Out Module"
                      description="Property release records are ready."
                    />

                    <NotificationItem
                      title="Currently Out"
                      description={`${currentlyOut} properties are currently outside the office.`}
                    />

                    <NotificationItem
                      title="Attention"
                      description={`${needsAttention} property records require inspection.`}
                    />

                  </div>

                </div>
              )}

            </div>

          </div>

        </header>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="p-5 sm:p-7">

          {/* PAGE HEADER */}

          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <ArrowUpFromLine
                  size={14}
                  className="text-[#a70000]"
                />

                <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600">
                  Property Movement Records
                </span>

              </div>


              <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-600">
                Record and monitor properties
                released from the office for
                authorized activities, field work,
                events, meetings, and other purposes.
              </p>

            </div>

            <button
              onClick={openAddModal}
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#a70000] px-4 py-3 text-[10px] font-semibold shadow-[0_0_25px_rgba(167,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-[#c00000] hover:shadow-[0_0_30px_rgba(220,0,0,0.3)]"
            >

              <Plus
                size={15}
                className="transition-all duration-300 group-hover:rotate-90 group-hover:drop-shadow-[0_0_7px_rgba(255,255,255,0.8)]"
              />

              Record Check-Out

            </button>

          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              title="Total Checked-Out"
              value={totalCheckedOut}
              description="Recorded property releases"
              icon={History}
            />

            <SummaryCard
              title="Currently Out"
              value={currentlyOut}
              description="Properties currently on loan"
              icon={ArrowUpFromLine}
            />

            <SummaryCard
              title="Returned"
              value={returned}
              description="Properties already returned"
              icon={CheckCircle2}
            />

            <SummaryCard
              title="Needs Attention"
              value={needsAttention}
              description="Requires inspection"
              icon={AlertTriangle}
              danger
            />

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl transition-all duration-300 hover:border-[#a70000]/20 hover:shadow-[0_10px_40px_rgba(167,0,0,0.07)]">

            {/* TABLE HEADER */}

            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

              <div>

                <h3 className="text-sm font-semibold">
                  Property Check-Out Records
                </h3>

                <p className="mt-1 text-[9px] text-gray-600">
                  History of properties released
                  from the office.
                </p>

              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2 sm:hidden">

                  <Search
                    size={14}
                    className="text-gray-700"
                  />

                  <input
                    type="text"
                    placeholder="Search movement..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    className="w-full bg-transparent text-[10px] text-gray-300 outline-none placeholder:text-gray-700"
                  />

                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-gray-400 outline-none transition focus:border-[#a70000]/40"
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="On Loan">
                    On Loan
                  </option>

                  <option value="Returned">
                    Returned
                  </option>
                </select>

              </div>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1150px]">

                <thead>

                  <tr className="border-b border-white/[0.06] text-left">

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Property
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Borrower
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Date Out
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Expected Return
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Purpose
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Status
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Condition
                    </th>

                    <th className="pb-3 text-right text-[8px] uppercase tracking-wider text-gray-700">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredMovements.length === 0 ? (

                    <tr>

                      <td
                        colSpan={8}
                        className="py-16 text-center"
                      >

                        <div className="mx-auto flex max-w-xs flex-col items-center">

                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-gray-700">
                            <History size={20} />
                          </div>

                          <p className="text-xs text-gray-500">
                            No check-out records found.
                          </p>

                          <p className="mt-1 text-[9px] text-gray-700">
                            Try another search or record
                            a new property check-out.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredMovements.map(
                      (movement) => (

                        <CheckOutRow
                          key={movement.id}
                          movement={movement}
                          onView={
                            openViewModal
                          }
                          onEdit={
                            openEditModal
                          }
                          onDelete={
                            handleDelete
                          }
                          onReturn={
                            handleMarkReturned
                          }
                        />

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

            {/* FOOTER */}

            <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4">

              <p className="text-[8px] text-gray-700">

                Showing{" "}

                <span className="text-gray-500">
                  {filteredMovements.length}
                </span>{" "}

                of{" "}

                <span className="text-gray-500">
                  {movements.length}
                </span>{" "}

                records

              </p>

              <div className="flex items-center gap-2 text-[8px] text-gray-700">

                <Clock3 size={11} />

                Check-out history

              </div>

            </div>

          </div>

          {/* =================================================
              INFORMATION CARD
          ================================================= */}

          <div className="mt-6 rounded-2xl border border-[#a70000]/10 bg-[#a70000]/[0.025] p-5 transition-all duration-300 hover:border-[#a70000]/25 hover:shadow-[0_10px_35px_rgba(167,0,0,0.08)]">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#a70000]/10 text-[#a70000]">
                <ArrowUpFromLine size={18} />
              </div>

              <div>

                <h4 className="text-xs font-semibold text-gray-300">
                  About Property Check-Out
                </h4>

                <p className="mt-2 max-w-3xl text-[9px] leading-5 text-gray-600">
                  This module records the release
                  of company properties from the
                  office for field activities, events,
                  production work, meetings, or other
                  authorized purposes. Each check-out
                  record identifies the property,
                  borrower, purpose, date and time
                  released, expected return date,
                  condition, and current status.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          RECORD CHECK-OUT MODAL
      ================================================= */}

      {showModal && (

        <ModalOverlay
          onClose={() =>
            setShowModal(false)
          }
        >

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">

            <ModalHeader
              title={
                editingMovement
                  ? "Edit Check-Out Record"
                  : "Record Property Check-Out"
              }
              description={
                editingMovement
                  ? "Update the property release record."
                  : "Record the release of a property from the office."
              }
              onClose={() =>
                setShowModal(false)
              }
            />

            <form
              onSubmit={handleSubmit}
              className="max-h-[80vh] space-y-5 overflow-y-auto p-6"
            >

              {formError && (

                <div className="rounded-xl border border-red-500/10 bg-red-500/[0.05] px-4 py-3">

                  <p className="text-[9px] text-red-300">
                    {formError}
                  </p>

                </div>

              )}

              {/* PROPERTY */}

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                <div className="mb-4 flex items-center gap-2">

                  <Package
                    size={14}
                    className="text-[#a70000]"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                    Property Information
                  </p>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <FormInput
                    label="Property Code"
                    placeholder="e.g. PIMS-00005"
                    value={form.propertyId}
                    onChange={(e) =>
                      updateForm(
                        "propertyId",
                        e.target.value
                      )
                    }
                    required
                  />

                  <FormInput
                    label="Property Name"
                    placeholder="e.g. Sony PXW-Z150 Camera"
                    value={form.propertyName}
                    onChange={(e) =>
                      updateForm(
                        "propertyName",
                        e.target.value
                      )
                    }
                    required
                  />

                  <FormInput
                    label="Category"
                    placeholder="e.g. Camera"
                    value={form.category}
                    onChange={(e) =>
                      updateForm(
                        "category",
                        e.target.value
                      )
                    }
                  />

                  <FormInput
                    label="Borrower / Employee"
                    placeholder="Employee name"
                    value={form.employee}
                    onChange={(e) =>
                      updateForm(
                        "employee",
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

              {/* MOVEMENT */}

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                <div className="mb-4 flex items-center gap-2">

                  <History
                    size={14}
                    className="text-[#a70000]"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                    Check-Out Details
                  </p>

                </div>

                <div className="space-y-4">

                  <FormInput
                    label="Purpose / Activity"
                    placeholder="e.g. Field production, event, meeting"
                    value={form.purpose}
                    onChange={(e) =>
                      updateForm(
                        "purpose",
                        e.target.value
                      )
                    }
                  />

                  <div className="grid gap-4 sm:grid-cols-2">

                    <FormInput
                      label="Date Out"
                      type="date"
                      value={form.dateOut}
                      onChange={(e) =>
                        updateForm(
                          "dateOut",
                          e.target.value
                        )
                      }
                      required
                    />

                    <FormInput
                      label="Time Out"
                      type="time"
                      value={form.timeOut}
                      onChange={(e) =>
                        updateForm(
                          "timeOut",
                          e.target.value
                        )
                      }
                      required
                    />

                    <FormInput
                      label="Expected Return"
                      type="date"
                      value={form.expectedReturn}
                      onChange={(e) =>
                        updateForm(
                          "expectedReturn",
                          e.target.value
                        )
                      }
                    />

                    <FormSelect
                      label="Status"
                      value={form.status}
                      onChange={(e) =>
                        updateForm(
                          "status",
                          e.target.value
                        )
                      }
                      options={[
                        "On Loan",
                        "Returned",
                      ]}
                    />

                  </div>

                </div>

              </div>

              {/* CONDITION */}

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                <div className="mb-4 flex items-center gap-2">

                  <CheckCircle2
                    size={14}
                    className="text-[#a70000]"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                    Property Condition
                  </p>

                </div>

                <div className="space-y-4">

                  <FormSelect
                    label="Condition Upon Release"
                    value={form.condition}
                    onChange={(e) =>
                      updateForm(
                        "condition",
                        e.target.value
                      )
                    }
                    options={[
                      "Good",
                      "Minor Damage",
                      "Needs Repair",
                      "Damaged",
                      "Missing Parts",
                    ]}
                  />

                  <FormTextarea
                    label="Remarks"
                    placeholder="Enter details about the property or activity."
                    value={form.remarks}
                    onChange={(e) =>
                      updateForm(
                        "remarks",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <ModalButtons
                onCancel={() =>
                  setShowModal(false)
                }
                submitText={
                  editingMovement
                    ? "Save Changes"
                    : "Record Check-Out"
                }
                submitIcon={
                  editingMovement ? (
                    <Save size={14} />
                  ) : (
                    <ArrowUpFromLine
                      size={14}
                    />
                  )
                }
              />

            </form>

          </div>

        </ModalOverlay>

      )}

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {showViewModal &&
        selectedMovement && (

          <ModalOverlay
            onClose={() =>
              setShowViewModal(false)
            }
          >

            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">

              <ModalHeader
                title="Check-Out Details"
                description={`Movement record ${selectedMovement.id}`}
                onClose={() =>
                  setShowViewModal(false)
                }
              />

              <div className="space-y-5 p-6">

                {/* PROPERTY HEADER */}

                <div className="flex items-center gap-4 rounded-xl border border-[#a70000]/10 bg-[#a70000]/[0.035] p-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#a70000]/10 text-[#a70000]">
                    <Package size={21} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[8px] uppercase tracking-wider text-gray-700">
                      Property
                    </p>

                    <h3 className="mt-1 truncate text-sm font-semibold text-gray-200">
                      {selectedMovement.propertyName}
                    </h3>

                    <p className="mt-1 text-[9px] text-gray-600">
                      {selectedMovement.propertyId}
                      {" • "}
                      {selectedMovement.category ||
                        "Uncategorized"}
                    </p>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="grid gap-3 sm:grid-cols-2">

                  <DetailItem
                    label="Borrower / Employee"
                    value={
                      selectedMovement.employee
                    }
                  />

                  <DetailItem
                    label="Purpose"
                    value={
                      selectedMovement.purpose ||
                      "Not specified"
                    }
                  />

                  <DetailItem
                    label="Date Out"
                    value={`${selectedMovement.dateOut} ${selectedMovement.timeOut}`}
                  />

                  <DetailItem
                    label="Expected Return"
                    value={
                      selectedMovement.expectedReturn ||
                      "Not specified"
                    }
                  />

                  <DetailItem
                    label="Condition"
                    value={
                      selectedMovement.condition
                    }
                  />

                  <DetailItem
                    label="Status"
                    value={
                      selectedMovement.status
                    }
                  />

                </div>

                {/* REMARKS */}

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                  <p className="text-[8px] uppercase tracking-wider text-gray-700">
                    Remarks
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-gray-400">
                    {selectedMovement.remarks ||
                      "No remarks provided."}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                  className="w-full rounded-xl border border-white/10 px-4 py-3 text-[10px] text-gray-500 transition-all duration-300 hover:border-[#a70000]/30 hover:bg-[#a70000]/[0.04] hover:text-white"
                >
                  Close
                </button>

              </div>

            </div>

          </ModalOverlay>

        )}

    </main>
  );
}

// =====================================================
// CHECK-OUT ROW
// =====================================================

function CheckOutRow({
  movement,
  onView,
  onEdit,
  onDelete,
  onReturn,
}) {
  const isAttention =
    movement.condition !== "Good";

  const isReturned =
    movement.status === "Returned";

  return (
    <tr className="group border-b border-white/[0.04] transition-all duration-300 hover:bg-[#a70000]/[0.035]">

      {/* PROPERTY */}

      <td className="py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#a70000]/10 bg-[#a70000]/[0.06] text-gray-600 transition-all duration-300 group-hover:scale-110 group-hover:border-[#a70000]/30 group-hover:bg-[#a70000]/15 group-hover:text-[#ff1f1f] group-hover:shadow-[0_0_15px_rgba(255,0,0,0.16)]">

            <Package size={15} />

          </div>

          <div>

            <p className="text-[10px] font-medium text-gray-300 transition-colors duration-300 group-hover:text-white">
              {movement.propertyName}
            </p>

            <p className="mt-1 text-[8px] text-gray-700">
              {movement.propertyId}
            </p>

          </div>

        </div>

      </td>

      {/* BORROWER */}

      <td className="py-4 text-[10px] text-gray-500">
        {movement.employee}
      </td>

      {/* DATE OUT */}

      <td className="py-4">

        <div className="text-[9px] text-gray-500">
          {movement.dateOut}
        </div>

        <div className="mt-1 text-[8px] text-gray-700">
          {movement.timeOut}
        </div>

      </td>

      {/* EXPECTED RETURN */}

      <td className="py-4">

        <div className="text-[9px] text-gray-500">
          {movement.expectedReturn ||
            "Not specified"}
        </div>

      </td>

      {/* PURPOSE */}

      <td className="max-w-[180px] py-4">

        <p className="truncate text-[9px] text-gray-500">
          {movement.purpose ||
            "Not specified"}
        </p>

      </td>

      {/* STATUS */}

      <td className="py-4">

        <span
          className={`inline-flex rounded-full px-2 py-1 text-[8px] ${
            isReturned
              ? "border border-green-500/10 bg-green-500/10 text-green-400"
              : "border border-blue-500/10 bg-blue-500/10 text-blue-300"
          }`}
        >
          {movement.status}
        </span>

      </td>

      {/* CONDITION */}

      <td className="py-4">

        <span
          className={`inline-flex rounded-full px-2 py-1 text-[8px] ${
            isAttention
              ? "border border-orange-500/10 bg-orange-500/10 text-orange-300"
              : "border border-green-500/10 bg-green-500/10 text-green-400"
          }`}
        >
          {movement.condition}
        </span>

      </td>

      {/* ACTION */}

      <td className="py-4">

        <div className="flex justify-end gap-1">

          <IconButton
            icon={Eye}
            title="View"
            onClick={() =>
              onView(movement)
            }
          />

          <IconButton
            icon={Edit3}
            title="Edit"
            onClick={() =>
              onEdit(movement)
            }
          />

          {!isReturned && (
            <IconButton
              icon={ArrowDownToLine}
              title="Mark as Returned"
              onClick={() =>
                onReturn(movement)
              }
            />
          )}

          <IconButton
            icon={Trash2}
            title="Delete"
            danger
            onClick={() =>
              onDelete(movement.id)
            }
          />

          <ChevronRight
            size={13}
            className="ml-1 text-gray-800 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#a70000]"
          />

        </div>

      </td>

    </tr>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  danger = false,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-[#a70000]/30 hover:bg-[#a70000]/[0.04] hover:shadow-[0_10px_35px_rgba(167,0,0,0.16)]">

      <div className="absolute left-0 top-0 h-full w-0.5 bg-[#a70000] opacity-30 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_12px_#a70000]" />

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[9px] uppercase tracking-wider text-gray-600">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:border-[#ff1f1f]/40 group-hover:bg-[#a70000]/20 group-hover:text-[#ff2424] group-hover:shadow-[0_0_18px_rgba(255,0,0,0.28)] ${
            danger
              ? "border-orange-500/15 bg-orange-500/10 text-orange-400"
              : "border-[#a70000]/15 bg-[#a70000]/10 text-[#a70000]"
          }`}
        >

          <Icon
            size={19}
            className="transition-all duration-300 group-hover:drop-shadow-[0_0_7px_rgba(255,0,0,0.85)]"
          />

        </div>

      </div>

      <p className="mt-4 text-[9px] text-gray-600">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// ICON BUTTON
// =====================================================

function IconButton({
  icon: Icon,
  title,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg border p-2 transition-all duration-300 ${
        danger
          ? "border-[#a70000]/10 text-gray-700 hover:border-red-500/20 hover:bg-[#a70000]/10 hover:text-red-400 hover:shadow-[0_0_12px_rgba(255,0,0,0.12)]"
          : "border-white/[0.05] text-gray-700 hover:border-[#a70000]/20 hover:bg-[#a70000]/10 hover:text-[#ff2222] hover:shadow-[0_0_12px_rgba(255,0,0,0.1)]"
      }`}
    >
      <Icon
        size={13}
        className="transition-all duration-300 hover:drop-shadow-[0_0_6px_rgba(255,0,0,0.9)]"
      />
    </button>
  );
}

// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

      <p className="text-[8px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="mt-2 text-[10px] text-gray-400">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// MODAL OVERLAY
// =====================================================

function ModalOverlay({
  children,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}

// =====================================================
// MODAL HEADER
// =====================================================

function ModalHeader({
  title,
  description,
  onClose,
}) {
  return (
    <div className="flex items-start justify-between border-b border-white/[0.06] p-6">

      <div>

        <h2 className="text-sm font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-[9px] text-gray-600">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1 text-gray-600 transition-all duration-300 hover:bg-[#a70000]/10 hover:text-[#ff2222] hover:shadow-[0_0_12px_rgba(167,0,0,0.15)]"
      >
        <X size={18} />
      </button>

    </div>
  );
}

// =====================================================
// FORM INPUT
// =====================================================

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}) {
  return (
    <div>

      <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
        {label}
        {required && " *"}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 transition-all duration-300 focus:border-[#a70000]/50 focus:ring-1 focus:ring-[#a70000]/20"
      />

    </div>
  );
}

// =====================================================
// FORM SELECT
// =====================================================

function FormSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-gray-300 outline-none transition-all duration-300 focus:border-[#a70000]/50 focus:ring-1 focus:ring-[#a70000]/20"
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

// =====================================================
// FORM TEXTAREA
// =====================================================

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
        {label}
      </label>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 transition-all duration-300 focus:border-[#a70000]/50 focus:ring-1 focus:ring-[#a70000]/20"
      />

    </div>
  );
}

// =====================================================
// MODAL BUTTONS
// =====================================================

function ModalButtons({
  onCancel,
  submitText,
  submitIcon,
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">

      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-white/10 px-4 py-3 text-[10px] text-gray-500 transition-all duration-300 hover:border-[#a70000]/20 hover:bg-white/5 hover:text-white"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="flex items-center gap-2 rounded-xl bg-[#a70000] px-5 py-3 text-[10px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c00000] hover:shadow-[0_0_22px_rgba(220,0,0,0.28)]"
      >
        {submitIcon}

        {submitText}
      </button>

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