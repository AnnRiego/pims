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
  UserCheck,
  UserX,
  ShieldCheck,
  Mail,
  Phone,
  Save,
  ChevronRight,
} from "lucide-react";

// =====================================================
// STORAGE
// =====================================================

const USERS_STORAGE_KEY = "pimsUsers";

// =====================================================
// DEFAULT USERS
// =====================================================

const defaultUsers = [
  {
    id: "USR-00001",
    firstName: "Juan",
    lastName: "Dela Cruz",
    username: "juan.delacruz",
    email: "juan.delacruz@pims.com",
    phone: "09171234567",
    role: "Manager",
    department: "Property Management",
    status: "Active",
    password: "password123",
    dateCreated: "2026-08-01",
  },
  {
    id: "USR-00002",
    firstName: "Maria",
    lastName: "Santos",
    username: "maria.santos",
    email: "maria.santos@pims.com",
    phone: "09181234567",
    role: "Staff",
    department: "Property Management",
    status: "Active",
    password: "password123",
    dateCreated: "2026-08-03",
  },
  {
    id: "USR-00003",
    firstName: "Carlo",
    lastName: "Mendoza",
    username: "carlo.mendoza",
    email: "carlo.mendoza@pims.com",
    phone: "09191234567",
    role: "Staff",
    department: "Administrative",
    status: "Inactive",
    password: "password123",
    dateCreated: "2026-08-05",
  },
];

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

export default function ManageUsersPage() {
  const router = useRouter();
  const pathname = usePathname();

  // ===================================================
  // AUTH
  // ===================================================

  const [user, setUser] = useState(null);

  // ===================================================
  // UI
  // ===================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  // ===================================================
  // USERS
  // ===================================================

  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // ===================================================
  // MODALS
  // ===================================================

  const [showModal, setShowModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [selectedUser, setSelectedUser] =
    useState(null);

  // ===================================================
  // FORM
  // ===================================================

  const emptyForm = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    role: "Staff",
    department: "",
    status: "Active",
    password: "",
  };

  const [form, setForm] =
    useState(emptyForm);

  const [formError, setFormError] =
    useState("");

  // ===================================================
  // AUTHENTICATION
  // ===================================================

  useEffect(() => {
    const authenticated =
      sessionStorage.getItem(
        "pimsAuthenticated"
      );

    const storedUser =
      sessionStorage.getItem(
        "pimsUser"
      );

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

        sessionStorage.removeItem(
          "pimsUser"
        );

        router.replace("/");
      }
    }
  }, [router]);

  // ===================================================
  // LOAD USERS
  // ===================================================

  useEffect(() => {
    const stored =
      localStorage.getItem(
        USERS_STORAGE_KEY
      );

    if (stored) {
      try {
        setUsers(JSON.parse(stored));
      } catch {
        setUsers(defaultUsers);
      }
    } else {
      setUsers(defaultUsers);

      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(defaultUsers)
      );
    }
  }, []);

  // ===================================================
  // SAVE USERS
  // ===================================================

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(users)
      );
    }
  }, [users]);

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
  // OPEN ADD USER
  // ===================================================

  function openAddUser() {
    setEditingUser(null);
    setFormError("");
    setForm(emptyForm);
    setShowModal(true);
  }

  // ===================================================
  // OPEN EDIT USER
  // ===================================================

  function openEditUser(selected) {
    setEditingUser(selected);
    setFormError("");

    setForm({
      firstName: selected.firstName,
      lastName: selected.lastName,
      username: selected.username,
      email: selected.email,
      phone: selected.phone,
      role: selected.role,
      department: selected.department,
      status: selected.status,
      password: selected.password,
    });

    setShowModal(true);
  }

  // ===================================================
  // OPEN VIEW
  // ===================================================

  function openViewUser(selected) {
    setSelectedUser(selected);
    setShowViewModal(true);
  }

  // ===================================================
  // UPDATE FORM
  // ===================================================

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ===================================================
  // SUBMIT USER
  // ===================================================

  function handleSubmit(e) {
    e.preventDefault();

    setFormError("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.username ||
      !form.email ||
      !form.role
    ) {
      setFormError(
        "Please complete all required fields."
      );

      return;
    }

    // Check duplicate username
    const duplicateUsername =
      users.some(
        (item) =>
          item.username.toLowerCase() ===
            form.username.toLowerCase() &&
          item.id !==
            editingUser?.id
      );

    if (duplicateUsername) {
      setFormError(
        "Username already exists. Please use another username."
      );

      return;
    }

    // =================================================
    // EDIT
    // =================================================

    if (editingUser) {
      setUsers((current) =>
        current.map((item) =>
          item.id === editingUser.id
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );

      setShowModal(false);
      setEditingUser(null);
      setForm(emptyForm);

      return;
    }

    // =================================================
    // CREATE
    // =================================================

    const newId =
      `USR-${String(
        users.length + 1
      ).padStart(5, "0")}`;

    const newUser = {
      id: newId,
      ...form,
      dateCreated:
        new Date()
          .toISOString()
          .split("T")[0],
    };

    setUsers((current) => [
      newUser,
      ...current,
    ]);

    setShowModal(false);
    setForm(emptyForm);
  }

  // ===================================================
  // DELETE USER
  // ===================================================

  function handleDelete(id) {
    const targetUser =
      users.find(
        (item) => item.id === id
      );

    if (!targetUser) return;

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${targetUser.firstName} ${targetUser.lastName}?`
      );

    if (!confirmed) return;

    setUsers((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  // ===================================================
  // TOGGLE STATUS
  // ===================================================

  function toggleStatus(selected) {
    const newStatus =
      selected.status === "Active"
        ? "Inactive"
        : "Active";

    setUsers((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );
  }

  // ===================================================
  // FILTER USERS
  // ===================================================

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const search =
        searchTerm.toLowerCase();

      const fullName =
        `${item.firstName} ${item.lastName}`
          .toLowerCase();

      const matchesSearch =
        fullName.includes(search) ||
        item.username
          .toLowerCase()
          .includes(search) ||
        item.email
          .toLowerCase()
          .includes(search) ||
        item.id
          .toLowerCase()
          .includes(search) ||
        item.department
          .toLowerCase()
          .includes(search);

      const matchesRole =
        roleFilter === "All" ||
        item.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    searchTerm,
    roleFilter,
    statusFilter,
  ]);

  // ===================================================
  // STATISTICS
  // ===================================================

  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      (item) =>
        item.status === "Active"
    ).length;

  const managerUsers =
    users.filter(
      (item) =>
        item.role === "Manager"
    ).length;

  const staffUsers =
    users.filter(
      (item) =>
        item.role === "Staff"
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
                        : "text-gray-700 group-hover:text-[#ff1a1a]"
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
                User Management
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

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#a70000] shadow-[0_0_6px_#a70000]" />

              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">

                  <div className="border-b border-white/[0.06] p-4">

                    <p className="text-[11px] font-semibold">
                      Notifications
                    </p>

                    <p className="mt-1 text-[8px] text-gray-600">
                      User management activities
                    </p>

                  </div>

                  <div className="p-2">

                    <NotificationItem
                      title="User Management"
                      description={`${totalUsers} user accounts are registered.`}
                    />

                    <NotificationItem
                      title="Active Accounts"
                      description={`${activeUsers} users currently have active accounts.`}
                    />

                    <NotificationItem
                      title="Manager Accounts"
                      description={`${managerUsers} manager account${managerUsers === 1 ? "" : "s"} registered.`}
                    />

                  </div>

                </div>
              )}

            </div>

          </div>

        </header>

        {/* BODY */}

        <div className="p-5 sm:p-7">

          {/* PAGE TITLE */}

          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <Users
                  size={14}
                  className="text-[#a70000]"
                />

                <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600">
                  Account Administration
                </span>

              </div>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-600">
                Manage PIMS user accounts,
                assigned roles, departments,
                account status, and access information.
              </p>

            </div>

            <button
              onClick={openAddUser}
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#a70000] px-4 py-3 text-[10px] font-semibold shadow-[0_0_25px_rgba(167,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#c00000] hover:shadow-[0_0_30px_rgba(220,0,0,0.3)]"
            >

              <Plus
                size={15}
                className="transition-all duration-300 group-hover:rotate-90"
              />

              Add User

            </button>

          </div>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              title="Total Users"
              value={totalUsers}
              description="Registered user accounts"
              icon={Users}
            />

            <SummaryCard
              title="Active Users"
              value={activeUsers}
              description="Currently active accounts"
              icon={UserCheck}
            />

            <SummaryCard
              title="Managers"
              value={managerUsers}
              description="Manager-level accounts"
              icon={ShieldCheck}
            />

            <SummaryCard
              title="Staff"
              value={staffUsers}
              description="Staff-level accounts"
              icon={UserCircle}
            />

          </div>

          {/* =================================================
              USER TABLE
          ================================================= */}

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl transition-all duration-300 hover:border-[#a70000]/20">

            {/* TABLE HEADER */}

            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

              <div>

                <h3 className="text-sm font-semibold">
                  User Accounts
                </h3>

                <p className="mt-1 text-[9px] text-gray-600">
                  Manage registered PIMS users.
                </p>

              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                {/* MOBILE SEARCH */}

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2 sm:hidden">

                  <Search
                    size={14}
                    className="text-gray-700"
                  />

                  <input
                    type="text"
                    placeholder="Search user..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    className="w-full bg-transparent text-[10px] text-gray-300 outline-none placeholder:text-gray-700"
                  />

                </div>

                {/* ROLE */}

                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-gray-400 outline-none focus:border-[#a70000]/40"
                >

                  <option value="All">
                    All Roles
                  </option>

                  <option value="Manager">
                    Manager
                  </option>

                  <option value="Staff">
                    Staff
                  </option>

                  <option value="Admin">
                    Admin
                  </option>

                </select>

                {/* STATUS */}

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-gray-400 outline-none focus:border-[#a70000]/40"
                >

                  <option value="All">
                    All Status
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead>

                  <tr className="border-b border-white/[0.06] text-left">

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      User
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Username
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Contact
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Role
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Department
                    </th>

                    <th className="pb-3 text-[8px] uppercase tracking-wider text-gray-700">
                      Status
                    </th>

                    <th className="pb-3 text-right text-[8px] uppercase tracking-wider text-gray-700">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="py-16 text-center"
                      >

                        <div className="mx-auto flex max-w-xs flex-col items-center">

                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-gray-700">

                            <Users size={20} />

                          </div>

                          <p className="text-xs text-gray-500">
                            No users found.
                          </p>

                          <p className="mt-1 text-[9px] text-gray-700">
                            Try changing your search
                            or filter.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredUsers.map(
                      (item) => (

                        <UserRow
                          key={item.id}
                          user={item}
                          onView={
                            openViewUser
                          }
                          onEdit={
                            openEditUser
                          }
                          onDelete={
                            handleDelete
                          }
                          onToggleStatus={
                            toggleStatus
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
                  {filteredUsers.length}
                </span>{" "}

                of{" "}

                <span className="text-gray-500">
                  {users.length}
                </span>{" "}

                users

              </p>

              <p className="text-[8px] text-gray-700">
                PIMS User Management
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <ModalOverlay
          onClose={() =>
            setShowModal(false)
          }
        >

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl">

            <ModalHeader
              title={
                editingUser
                  ? "Edit User"
                  : "Add New User"
              }
              description={
                editingUser
                  ? "Update user account information."
                  : "Create a new PIMS user account."
              }
              onClose={() =>
                setShowModal(false)
              }
            />

            <form
              onSubmit={handleSubmit}
              className="max-h-[80vh] space-y-5 overflow-y-auto p-6"
            >

              {/* ERROR */}

              {formError && (

                <div className="rounded-xl border border-red-500/10 bg-red-500/[0.05] px-4 py-3">

                  <p className="text-[9px] text-red-300">
                    {formError}
                  </p>

                </div>

              )}

              {/* PERSONAL INFORMATION */}

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                <div className="mb-4 flex items-center gap-2">

                  <UserCircle
                    size={14}
                    className="text-[#a70000]"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                    Personal Information
                  </p>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <FormInput
                    label="First Name"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) =>
                      updateForm(
                        "firstName",
                        e.target.value
                      )
                    }
                    required
                  />

                  <FormInput
                    label="Last Name"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) =>
                      updateForm(
                        "lastName",
                        e.target.value
                      )
                    }
                    required
                  />

                  <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) =>
                      updateForm(
                        "email",
                        e.target.value
                      )
                    }
                    required
                  />

                  <FormInput
                    label="Phone Number"
                    placeholder="09XXXXXXXXX"
                    value={form.phone}
                    onChange={(e) =>
                      updateForm(
                        "phone",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              {/* ACCOUNT */}

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                <div className="mb-4 flex items-center gap-2">

                  <ShieldCheck
                    size={14}
                    className="text-[#a70000]"
                  />

                  <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                    Account Information
                  </p>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <FormInput
                    label="Username"
                    placeholder="username"
                    value={form.username}
                    onChange={(e) =>
                      updateForm(
                        "username",
                        e.target.value
                      )
                    }
                    required
                  />

                  <FormInput
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) =>
                      updateForm(
                        "password",
                        e.target.value
                      )
                    }
                  />

                  <FormSelect
                    label="Role"
                    value={form.role}
                    onChange={(e) =>
                      updateForm(
                        "role",
                        e.target.value
                      )
                    }
                    options={[
                      "Staff",
                      "Manager",
                      "Admin",
                    ]}
                  />

                  <FormSelect
                    label="Account Status"
                    value={form.status}
                    onChange={(e) =>
                      updateForm(
                        "status",
                        e.target.value
                      )
                    }
                    options={[
                      "Active",
                      "Inactive",
                    ]}
                  />

                  <div className="sm:col-span-2">

                    <FormInput
                      label="Department"
                      placeholder="e.g. Property Management"
                      value={form.department}
                      onChange={(e) =>
                        updateForm(
                          "department",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-xl border border-white/10 px-4 py-3 text-[10px] text-gray-500 transition-all duration-300 hover:border-[#a70000]/20 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#a70000] px-5 py-3 text-[10px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c00000] hover:shadow-[0_0_22px_rgba(220,0,0,0.28)]"
                >

                  <Save size={14} />

                  {editingUser
                    ? "Save Changes"
                    : "Create User"}

                </button>

              </div>

            </form>

          </div>

        </ModalOverlay>

      )}

      {/* =================================================
          VIEW USER MODAL
      ================================================= */}

      {showViewModal &&
        selectedUser && (

          <ModalOverlay
            onClose={() =>
              setShowViewModal(false)
            }
          >

            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl">

              <ModalHeader
                title="User Details"
                description={`Account ${selectedUser.id}`}
                onClose={() =>
                  setShowViewModal(false)
                }
              />

              <div className="space-y-5 p-6">

                {/* USER HEADER */}

                <div className="flex items-center gap-4 rounded-xl border border-[#a70000]/10 bg-[#a70000]/[0.035] p-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#a70000]/10 text-[#a70000]">

                    <UserCircle
                      size={30}
                    />

                  </div>

                  <div className="min-w-0">

                    <h3 className="text-sm font-semibold text-gray-200">

                      {selectedUser.firstName}{" "}
                      {selectedUser.lastName}

                    </h3>

                    <p className="mt-1 text-[9px] text-gray-600">
                      @{selectedUser.username}
                    </p>

                    <div className="mt-2">

                      <StatusBadge
                        status={
                          selectedUser.status
                        }
                      />

                    </div>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="grid gap-3 sm:grid-cols-2">

                  <DetailItem
                    label="User ID"
                    value={
                      selectedUser.id
                    }
                  />

                  <DetailItem
                    label="Role"
                    value={
                      selectedUser.role
                    }
                  />

                  <DetailItem
                    label="Department"
                    value={
                      selectedUser.department ||
                      "Not specified"
                    }
                  />

                  <DetailItem
                    label="Email"
                    value={
                      selectedUser.email
                    }
                  />

                  <DetailItem
                    label="Phone"
                    value={
                      selectedUser.phone ||
                      "Not specified"
                    }
                  />

                  <DetailItem
                    label="Date Created"
                    value={
                      selectedUser.dateCreated
                    }
                  />

                </div>

                {/* SECURITY */}

                <div className="rounded-xl border border-[#a70000]/10 bg-[#a70000]/[0.025] p-4">

                  <div className="flex gap-3">

                    <ShieldCheck
                      size={16}
                      className="mt-0.5 text-[#a70000]"
                    />

                    <div>

                      <p className="text-[9px] font-semibold text-gray-400">
                        Account Access
                      </p>

                      <p className="mt-1 text-[8px] leading-4 text-gray-700">
                        Role-based access should
                        determine which PIMS modules
                        this user can access.
                      </p>

                    </div>

                  </div>

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
// USER ROW
// =====================================================

function UserRow({
  user,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const fullName =
    `${user.firstName} ${user.lastName}`;

  return (
    <tr className="group border-b border-white/[0.04] transition-all duration-300 hover:bg-[#a70000]/[0.035]">

      {/* USER */}

      <td className="py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#a70000]/10 bg-[#a70000]/[0.06] text-[#a70000] transition-all duration-300 group-hover:scale-110 group-hover:border-[#a70000]/30 group-hover:bg-[#a70000]/15">

            <UserCircle size={18} />

          </div>

          <div>

            <p className="text-[10px] font-medium text-gray-300 group-hover:text-white">
              {fullName}
            </p>

            <p className="mt-1 text-[8px] text-gray-700">
              {user.id}
            </p>

          </div>

        </div>

      </td>

      {/* USERNAME */}

      <td className="py-4">

        <span className="text-[9px] text-gray-500">
          @{user.username}
        </span>

      </td>

      {/* CONTACT */}

      <td className="py-4">

        <div className="space-y-1">

          <div className="flex items-center gap-1.5">

            <Mail
              size={10}
              className="text-gray-700"
            />

            <span className="text-[8px] text-gray-500">
              {user.email}
            </span>

          </div>

          {user.phone && (
            <div className="flex items-center gap-1.5">

              <Phone
                size={10}
                className="text-gray-700"
              />

              <span className="text-[8px] text-gray-600">
                {user.phone}
              </span>

            </div>
          )}

        </div>

      </td>

      {/* ROLE */}

      <td className="py-4">

        <RoleBadge
          role={user.role}
        />

      </td>

      {/* DEPARTMENT */}

      <td className="py-4">

        <span className="text-[9px] text-gray-500">
          {user.department ||
            "Not specified"}
        </span>

      </td>

      {/* STATUS */}

      <td className="py-4">

        <StatusBadge
          status={user.status}
        />

      </td>

      {/* ACTION */}

      <td className="py-4">

        <div className="flex justify-end gap-1">

          <IconButton
            icon={Eye}
            title="View User"
            onClick={() =>
              onView(user)
            }
          />

          <IconButton
            icon={Edit3}
            title="Edit User"
            onClick={() =>
              onEdit(user)
            }
          />

          <IconButton
            icon={
              user.status === "Active"
                ? UserX
                : UserCheck
            }
            title={
              user.status === "Active"
                ? "Deactivate"
                : "Activate"
            }
            onClick={() =>
              onToggleStatus(user)
            }
          />

          <IconButton
            icon={Trash2}
            title="Delete User"
            danger
            onClick={() =>
              onDelete(user.id)
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

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#a70000]/15 bg-[#a70000]/10 text-[#a70000] transition-all duration-300 group-hover:scale-110 group-hover:border-[#ff1f1f]/40 group-hover:bg-[#a70000]/20 group-hover:text-[#ff2424] group-hover:shadow-[0_0_18px_rgba(255,0,0,0.28)]">

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
// ROLE BADGE
// =====================================================

function RoleBadge({ role }) {
  const styles = {
    Admin:
      "border-red-500/10 bg-red-500/10 text-red-300",

    Manager:
      "border-purple-500/10 bg-purple-500/10 text-purple-300",

    Staff:
      "border-blue-500/10 bg-blue-500/10 text-blue-300",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-[8px] ${
        styles[role] ||
        "border-white/10 bg-white/5 text-gray-400"
      }`}
    >
      {role}
    </span>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-[8px] ${
        status === "Active"
          ? "border-green-500/10 bg-green-500/10 text-green-400"
          : "border-gray-500/10 bg-gray-500/10 text-gray-500"
      }`}
    >
      {status}
    </span>
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
          ? "border-[#a70000]/10 text-gray-700 hover:border-red-500/20 hover:bg-[#a70000]/10 hover:text-red-400"
          : "border-white/[0.05] text-gray-700 hover:border-[#a70000]/20 hover:bg-[#a70000]/10 hover:text-[#ff2222]"
      }`}
    >

      <Icon size={13} />

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

      <p className="mt-2 break-words text-[10px] text-gray-400">
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
        className="rounded-lg p-1 text-gray-600 transition-all duration-300 hover:bg-[#a70000]/10 hover:text-[#ff2222]"
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