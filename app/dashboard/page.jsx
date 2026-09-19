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
  Search,
  Plus,
  Bell,
  Menu,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  UserCircle,
  Trash2,
  Edit3,
  FileBarChart,
} from "lucide-react";

// =====================================================
// DASHBOARD
// =====================================================

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  // =====================================================
  // AUTH / UI STATE
  // =====================================================

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [showAddPropertyModal, setShowAddPropertyModal] =
    useState(false);

  const [showUsersModal, setShowUsersModal] = useState(false);

  const [showCheckoutModal, setShowCheckoutModal] =
    useState(false);

  const [showCheckinModal, setShowCheckinModal] =
    useState(false);

  const [showReportModal, setShowReportModal] =
    useState(false);

  // =====================================================
  // PROPERTY STATE
  // =====================================================

  const [properties, setProperties] = useState([
    {
      id: "PIMS-00001",
      name: "Sony PXW-Z150 Camera",
      category: "Camera",
      serial: "SN-001234",
      status: "Available",
    },
    {
      id: "PIMS-00002",
      name: "MacBook Pro 16-inch",
      category: "Computer / Laptop",
      serial: "SN-002345",
      status: "Issued",
    },
    {
      id: "PIMS-00003",
      name: "DJI RS 3 Pro Gimbal",
      category: "Camera Accessories",
      serial: "SN-003456",
      status: "Available",
    },
    {
      id: "PIMS-00004",
      name: "Allen & Heath Mixer",
      category: "Audio Equipment",
      serial: "SN-004567",
      status: "Available",
    },
  ]);

  // =====================================================
  // USER STATE
  // =====================================================

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "System Administrator",
      username: "admin",
      role: "Super Admin",
      status: "Active",
    },
  ]);

  // =====================================================
  // FORM STATE
  // =====================================================

  const [propertyForm, setPropertyForm] = useState({
    name: "",
    category: "",
    code: "",
    serial: "",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    username: "",
    role: "Admin Staff",
  });

  const [checkoutForm, setCheckoutForm] = useState({
    propertyId: "",
    employee: "",
    date: "",
    time: "",
    purpose: "",
    remarks: "",
  });

  const [checkinForm, setCheckinForm] = useState({
    propertyId: "",
    employee: "",
    date: "",
    time: "",
    condition: "Good",
    remarks: "",
  });

  const [reportForm, setReportForm] = useState({
    reportType: "Property Inventory Report",
    dateFrom: "",
    dateTo: "",
  });

  const [formError, setFormError] = useState("");

  // =====================================================
  // CHECK LOGIN
  // =====================================================

  useEffect(() => {
    const authenticated = sessionStorage.getItem(
      "pimsAuthenticated"
    );

    const storedUser = sessionStorage.getItem("pimsUser");

    if (authenticated !== "true") {
      router.replace("/");
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

  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {
    sessionStorage.removeItem("pimsAuthenticated");
    sessionStorage.removeItem("pimsUser");

    router.replace("/");
  }

  // =====================================================
  // NAVIGATION
  // =====================================================

  function navigateTo(route) {
    setSidebarOpen(false);
    setNotificationOpen(false);
    router.push(route);
  }

  // =====================================================
  // ADD PROPERTY
  // =====================================================

  function openAddPropertyModal() {
    setFormError("");

    setPropertyForm({
      name: "",
      category: "",
      code: "",
      serial: "",
    });

    setShowAddPropertyModal(true);
  }

  function handleAddProperty(e) {
    e.preventDefault();

    setFormError("");

    if (
      !propertyForm.name.trim() ||
      !propertyForm.category ||
      !propertyForm.code.trim()
    ) {
      setFormError(
        "Please complete all required fields."
      );
      return;
    }

    const duplicate = properties.some(
      (property) =>
        property.id.toLowerCase() ===
        propertyForm.code.trim().toLowerCase()
    );

    if (duplicate) {
      setFormError("Property code already exists.");
      return;
    }

    const newProperty = {
      id: propertyForm.code.trim(),
      name: propertyForm.name.trim(),
      category: propertyForm.category,
      serial:
        propertyForm.serial.trim() || "Not provided",
      status: "Available",
    };

    setProperties((current) => [
      ...current,
      newProperty,
    ]);

    setShowAddPropertyModal(false);

    setPropertyForm({
      name: "",
      category: "",
      code: "",
      serial: "",
    });
  }

  // =====================================================
  // MANAGE USERS
  // =====================================================

  function openUsersModal() {
    setFormError("");

    setUserForm({
      name: "",
      username: "",
      role: "Admin Staff",
    });

    setShowUsersModal(true);
  }

  function handleAddUser(e) {
    e.preventDefault();

    setFormError("");

    if (
      !userForm.name.trim() ||
      !userForm.username.trim()
    ) {
      setFormError(
        "Please enter the user's name and username."
      );
      return;
    }

    const duplicate = users.some(
      (item) =>
        item.username.toLowerCase() ===
        userForm.username.trim().toLowerCase()
    );

    if (duplicate) {
      setFormError("Username already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: userForm.name.trim(),
      username: userForm.username.trim(),
      role: userForm.role,
      status: "Active",
    };

    setUsers((current) => [
      ...current,
      newUser,
    ]);

    setUserForm({
      name: "",
      username: "",
      role: "Admin Staff",
    });

    setFormError("");
  }

  function handleDeleteUser(id) {
    setUsers((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  // =====================================================
  // CHECK-OUT
  // =====================================================

  function openCheckoutModal() {
    setFormError("");

    const now = new Date();

    setCheckoutForm({
      propertyId: "",
      employee: "",
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      purpose: "",
      remarks: "",
    });

    setShowCheckoutModal(true);
  }

  function handleCheckout(e) {
    e.preventDefault();

    setFormError("");

    if (
      !checkoutForm.propertyId ||
      !checkoutForm.employee.trim() ||
      !checkoutForm.date ||
      !checkoutForm.time
    ) {
      setFormError(
        "Please complete all required fields."
      );
      return;
    }

    const property = properties.find(
      (item) =>
        item.id === checkoutForm.propertyId
    );

    if (!property) {
      setFormError(
        "Selected property was not found."
      );
      return;
    }

    if (property.status !== "Available") {
      setFormError(
        "This property is currently not available for check-out."
      );
      return;
    }

    setProperties((current) =>
      current.map((item) =>
        item.id === checkoutForm.propertyId
          ? {
              ...item,
              status: "Issued",
            }
          : item
      )
    );

    setShowCheckoutModal(false);

    setCheckoutForm({
      propertyId: "",
      employee: "",
      date: "",
      time: "",
      purpose: "",
      remarks: "",
    });
  }

  // =====================================================
  // CHECK-IN
  // =====================================================

  function openCheckinModal() {
    setFormError("");

    const now = new Date();

    setCheckinForm({
      propertyId: "",
      employee: "",
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      condition: "Good",
      remarks: "",
    });

    setShowCheckinModal(true);
  }

  function handleCheckin(e) {
    e.preventDefault();

    setFormError("");

    if (
      !checkinForm.propertyId ||
      !checkinForm.employee.trim() ||
      !checkinForm.date ||
      !checkinForm.time
    ) {
      setFormError(
        "Please complete all required fields."
      );
      return;
    }

    const property = property.find(
      (item) =>
        item.id === checkinForm.propertyId
    );

    if (!property) {
      setFormError(
        "Selected property was not found."
      );
      return;
    }

    if (property.status !== "Issued") {
      setFormError(
        "This property is not currently checked out."
      );
      return;
    }

    setProperties((current) =>
      current.map((item) =>
        item.id === checkinForm.propertyId
          ? {
              ...item,
              status: "Available",
            }
          : item
      )
    );

    setShowCheckinModal(false);

    setCheckinForm({
      propertyId: "",
      employee: "",
      date: "",
      time: "",
      condition: "Good",
      remarks: "",
    });
  }

  // =====================================================
  // REPORT
  // =====================================================

  function openReportModal() {
    setFormError("");

    setReportForm({
      reportType: "Property Inventory Report",
      dateFrom: "",
      dateTo: "",
    });

    setShowReportModal(true);
  }

  function handleGenerateReport(e) {
    e.preventDefault();

    setFormError("");

    if (
      reportForm.reportType ===
        "Transaction Report" &&
      (!reportForm.dateFrom ||
        !reportForm.dateTo)
    ) {
      setFormError(
        "Please select the date range for the transaction report."
      );
      return;
    }

    setShowReportModal(false);

    alert(
      `Generating ${reportForm.reportType}...`
    );
  }

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
      name: "Equipment",
      route: "/property",
      icon: Package,
    },
    {
      name: "Check-Out",
      route: "/check-out",
      icon: ArrowUpFromLine,
    },
    {
      name: "Check-In",
      route: "/check-in",
      icon: ArrowDownToLine,
    },
    {
      name: "Assignments",
      route: "/assignments",
      icon: FileText,
    },
    {
      name: "Reports",
      route: "/reports",
      icon: FileBarChart,
    },
    {
      name: "Settings",
      route: "/settings",
      icon: Settings,
    },
  ];

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalProperties = properties.length;

  const availableProperties =
    properties.filter(
      (item) => item.status === "Available"
    ).length;

  const issuedProperties =
    properties.filter(
      (item) => item.status === "Issued"
    ).length;

  const attentionNeeded = 18;

  // =====================================================
  // TRANSACTIONS
  // =====================================================

  const transactions = [
    {
      property: "Sony PXW-Z150 Camera",
      employee: "Juan Dela Cruz",
      action: "Checked Out",
      time: "10 minutes ago",
      status: "Out",
    },
    {
      property: "MacBook Pro 16-inch",
      employee: "Maria Santos",
      action: "Checked In",
      time: "35 minutes ago",
      status: "In",
    },
    {
      property: "DJI RS 3 Pro Gimbal",
      employee: "Mark Reyes",
      action: "Checked Out",
      time: "1 hour ago",
      status: "Out",
    },
    {
      property: "Allen & Heath Mixer",
      employee: "Carlo Mendoza",
      action: "Checked In",
      time: "2 hours ago",
      status: "In",
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090909] text-gray-500">
        <div className="text-center">
          <Package
            size={30}
            className="mx-auto mb-3 animate-pulse text-[#a70000]"
          />
          <p className="text-xs">
            Loading PIMS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/pims.png')",
        }}
      />

      <div className="pointer-events-none fixed inset-0 bg-[#090909]/88" />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(167,0,0,0.16),transparent_40%)]" />

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}


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
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="text-gray-600 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

            <Sidebar
               sidebarOpen={sidebarOpen}
               setSidebarOpen={setSidebarOpen}
            />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative z-10 min-h-screen lg:ml-70">
       
       {/* =====================================================
            TOP BAR
        ===================================================== */}

        <header className="fixed left-0 right-0 top-0 z-30 flex h-18 items-center justify-between border-b
         border-white/[0.06] bg-[#090909]/80 px-5 backdrop-blur-2xl sm:px-7 lg:left-64">

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="text-gray-500 hover:text-white lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-gray-700">
                Property Inventory & Management
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setNotificationOpen(
                    (current) => !current
                  )
                }
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-gray-500 hover:text-white"
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
                      title="System Operational"
                      description="All PIMS services are running normally."
                    />

                    <NotificationItem
                      title="Inventory Review"
                      description={`${attentionNeeded} properties require attention.`}
                    />

                    <NotificationItem
                      title="Security"
                      description="You are logged in as Super Admin."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =====================================================
            DASHBOARD BODY
        ===================================================== */}
    <div className="p-2 sm:p-2">

          {/* WELCOME */}

        <div className="mb-2 flex items-center gap-2">

            <ShieldCheck
            size={14}
            className="text-[#a70000]"/>

           <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600">
            Super Admin Portal
           </span>

        </div>

        <h1 className="text-2xl font-bold">
         Welcome back,{" "}
         <span className="text-[#a70000]">
        {user.name}
          </span>
        </h1>

        

           <p className="mt-2 text-xs text-gray-600">
           Here's an overview of your property inventory.
          </p>
      </div>

        
          {/* STATISTICS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Properties"
              value={totalProperties}
              description="Registered company assets"
              icon={Package}
              trend="Inventory"
            />

            <StatCard
              title="Currently In"
              value={availableProperties}
              description="Available on company premises"
              icon={CheckCircle2}
              trend="Available"
            />

            <StatCard
              title="Currently Out"
              value={issuedProperties}
              description="Equipment currently issued"
              icon={ArrowUpFromLine}
              trend="Issued"
            />

            <StatCard
              title="Attention Needed"
              value={attentionNeeded}
              description="Items requiring review"
              icon={AlertTriangle}
              trend="Needs action"
            />
          </div>

          {/* LOWER CONTENT */}

          <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_340px]">
            {/* RECENT TRANSACTIONS */}

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">
                    Recent Transactions
                  </h3>

                  <p className="mt-1 text-[9px] text-gray-600">
                    Latest property movements
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigateTo("/reports")
                  }
                  className="text-[9px] text-[#a70000] hover:text-red-400"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left">
                      <th className="pb-3 text-[8px] uppercase text-gray-700">
                        Property
                      </th>

                      <th className="pb-3 text-[8px] uppercase text-gray-700">
                        Employee
                      </th>

                      <th className="pb-3 text-[8px] uppercase text-gray-700">
                        Action
                      </th>

                      <th className="pb-3 text-[8px] uppercase text-gray-700">
                        Time
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map(
                      (transaction, index) => (
                        <tr
                          key={`${transaction.property}-${index}`}
                          className="border-b border-white/[0.04] hover:bg-white/[0.025]"
                        >
                          <td className="py-4 text-[10px] text-gray-300">
                            {transaction.property}
                          </td>

                          <td className="py-4 text-[10px] text-gray-600">
                            {transaction.employee}
                          </td>

                          <td className="py-4">
                            <span
                              className={`rounded-full px-2 py-1 text-[8px] ${
                                transaction.status ===
                                "Out"
                                  ? "border border-[#a70000]/20 bg-[#a70000]/10 text-red-300"
                                  : "border border-green-500/10 bg-green-500/10 text-green-400"
                              }`}
                            >
                              {transaction.action}
                            </span>
                          </td>

                          <td className="py-4 text-[9px] text-gray-700">
                            {transaction.time}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QUICK ACTIONS */}

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl">
              <h3 className="text-sm font-semibold">
                Quick Actions
              </h3>

              <p className="mt-1 text-[9px] text-gray-600">
                Frequently used functions
              </p>

              <div className="mt-5 space-y-2">
                <QuickAction
                  icon={ArrowUpFromLine}
                  title="Check-Out Equipment"
                  description="Record equipment release"
                  onClick={openCheckoutModal}
                />

                <QuickAction
                  icon={ArrowDownToLine}
                  title="Check-In Equipment"
                  description="Record returned equipment"
                  onClick={openCheckinModal}
                />

                <QuickAction
                  icon={Users}
                  title="Manage Users"
                  description="Manage system accounts"
                  onClick={openUsersModal}
                />

                <QuickAction  
                  icon={FileText}
                  title="Generate Report"
                  description="Generate inventory reports"
                  onClick={openReportModal}
                />
              </div>

              <div className="mt-5 rounded-xl border border-green-500/10 bg-green-500/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <p className="text-[9px] font-semibold text-green-400">
                    System Operational
                  </p>
                </div>

                <p className="mt-2 text-[8px] leading-4 text-gray-700">
                  All PIMS services are currently
                  running normally.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              PIMS MODULES
              These are NOT part of the sidebar.
          ===================================================== */}

          <div className="mt-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold">
                PIMS Modules
              </h3>

              <p className="mt-1 text-[9px] text-gray-600">
                Access the main property management
                functions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ModuleCard
                icon={Package}
                title="Property Inventory"
                description="Register, monitor and manage company properties."
                onClick={() =>
                  navigateTo("/property")
                }
              />

              <ModuleCard
                icon={ArrowDownToLine}
                title="Equipment Check-In"
                description="Record equipment returned by employees."
                onClick={() =>
                  navigateTo("/check-in")
                }
              />

              <ModuleCard
                icon={ArrowUpFromLine}
                title="Equipment Check-Out"
                description="Track equipment issued to employees."
                onClick={() =>
                  navigateTo("/check-out")
                }
              />

              <ModuleCard
                icon={Users}
                title="User Management"
                description="Manage system users and access permissions."
                onClick={openUsersModal}
              />

              <ModuleCard
                icon={FileText}
                title="Reports"
                description="View and generate property management reports."
                onClick={() =>
                  navigateTo("/reports")
                }
              />

              <ModuleCard
                icon={Settings}
                title="System Settings"
                description="Configure system preferences and controls."
                onClick={() =>
                  navigateTo("/settings")
                }
              />
            </div>
          </div>
      </section>

      {/* =====================================================
          ADD PROPERTY MODAL
      ===================================================== */}

      {showAddPropertyModal && (
        <ModalOverlay
          onClose={() =>
            setShowAddPropertyModal(false)
          }
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            <ModalHeader
              title="Add Property"
              description="Register a new company property."
              onClose={() =>
                setShowAddPropertyModal(false)
              }
            />

            <form
              onSubmit={handleAddProperty}
              className="space-y-5 p-6"
            >
              {formError && (
                <ErrorMessage
                  message={formError}
                />
              )}

              <FormInput
                label="Property Name"
                placeholder="e.g. Sony PXW-Z150 Camera"
                value={propertyForm.name}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    name: e.target.value,
                  })
                }
                required
              />

              <FormSelect
                label="Property Category"
                value={propertyForm.category}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    category: e.target.value,
                  })
                }
                required
                options={[
                  "Camera",
                  "Audio Equipment",
                  "Computer / Laptop",
                  "Lighting Equipment",
                  "Camera Accessories",
                  "Production Equipment",
                  "Office Equipment",
                  "Other",
                ]}
              />

              <FormInput
                label="Property Code"
                placeholder="e.g. PIMS-00005"
                value={propertyForm.code}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    code: e.target.value,
                  })
                }
                required
              />

              <FormInput
                label="Serial Number"
                placeholder="Enter serial number"
                value={propertyForm.serial}
                onChange={(e) =>
                  setPropertyForm({
                    ...propertyForm,
                    serial: e.target.value,
                  })
                }
              />

              <ModalButtons
                onCancel={() =>
                  setShowAddPropertyModal(false)
                }
                submitText="Add Property"
                submitIcon={<Plus size={14} />}
              />
            </form>
          </div>
        </ModalOverlay>
      )}

      {/* =====================================================
          CHECK-OUT MODAL
      ===================================================== */}

      {showCheckoutModal && (
        <ModalOverlay
          onClose={() =>
            setShowCheckoutModal(false)
          }
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            <ModalHeader
              title="Check-Out Equipment"
              description="Record the release of equipment to an employee."
              onClose={() =>
                setShowCheckoutModal(false)
              }
            />

            <form
              onSubmit={handleCheckout}
              className="space-y-5 p-6"
            >
              {formError && (
                <ErrorMessage
                  message={formError}
                />
              )}

              <FormSelect
                label="Equipment"
                value={checkoutForm.propertyId}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    propertyId:
                      e.target.value,
                  })
                }
                required
                options={properties
                  .filter(
                    (item) =>
                      item.status ===
                      "Available"
                  )
                  .map(
                    (item) =>
                      `${item.id} — ${item.name}`
                  )}
                optionValues={properties
                  .filter(
                    (item) =>
                      item.status ===
                      "Available"
                  )
                  .map(
                    (item) => item.id
                  )}
                placeholder="Select available equipment"
              />

              <FormInput
                label="Employee / Borrower"
                placeholder="Enter employee name"
                value={checkoutForm.employee}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    employee:
                      e.target.value,
                  })
                }
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Check-Out Date"
                  type="date"
                  value={checkoutForm.date}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      date: e.target.value,
                    })
                  }
                  required
                />

                <FormInput
                  label="Check-Out Time"
                  type="time"
                  value={checkoutForm.time}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      time: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <FormInput
                label="Purpose"
                placeholder="e.g. Field production / event"
                value={checkoutForm.purpose}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    purpose:
                      e.target.value,
                  })
                }
              />

              <FormTextarea
                label="Remarks"
                placeholder="Additional remarks"
                value={checkoutForm.remarks}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    remarks:
                      e.target.value,
                  })
                }
              />

              <ModalButtons
                onCancel={() =>
                  setShowCheckoutModal(
                    false
                  )
                }
                submitText="Confirm Check-Out"
                submitIcon={
                  <ArrowUpFromLine
                    size={14}
                  />
                }
              />
            </form>
          </div>
        </ModalOverlay>
      )}

      {/* =====================================================
          CHECK-IN MODAL
      ===================================================== */}

      {showCheckinModal && (
        <ModalOverlay
          onClose={() =>
            setShowCheckinModal(false)
          }
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            <ModalHeader
              title="Check-In Equipment"
              description="Record equipment returned by an employee."
              onClose={() =>
                setShowCheckinModal(false)
              }
            />

            <form
              onSubmit={handleCheckin}
              className="space-y-5 p-6"
            >
              {formError && (
                <ErrorMessage
                  message={formError}
                />
              )}

              <FormSelect
                label="Equipment"
                value={checkinForm.propertyId}
                onChange={(e) =>
                  setCheckinForm({
                    ...checkinForm,
                    propertyId:
                      e.target.value,
                  })
                }
                required
                options={properties
                  .filter(
                    (item) =>
                      item.status ===
                      "Issued"
                  )
                  .map(
                    (item) =>
                      `${item.id} — ${item.name}`
                  )}
                optionValues={properties
                  .filter(
                    (item) =>
                      item.status ===
                      "Issued"
                  )
                  .map(
                    (item) => item.id
                  )}
                placeholder="Select issued equipment"
              />

              <FormInput
                label="Employee / Borrower"
                placeholder="Enter employee name"
                value={checkinForm.employee}
                onChange={(e) =>
                  setCheckinForm({
                    ...checkinForm,
                    employee:
                      e.target.value,
                  })
                }
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Check-In Date"
                  type="date"
                  value={checkinForm.date}
                  onChange={(e) =>
                    setCheckinForm({
                      ...checkinForm,
                      date: e.target.value,
                    })
                  }
                  required
                />

                <FormInput
                  label="Check-In Time"
                  type="time"
                  value={checkinForm.time}
                  onChange={(e) =>
                    setCheckinForm({
                      ...checkinForm,
                      time: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <FormSelect
                label="Equipment Condition"
                value={checkinForm.condition}
                onChange={(e) =>
                  setCheckinForm({
                    ...checkinForm,
                    condition:
                      e.target.value,
                  })
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
                placeholder="Enter condition details or other remarks"
                value={checkinForm.remarks}
                onChange={(e) =>
                  setCheckinForm({
                    ...checkinForm,
                    remarks:
                      e.target.value,
                  })
                }
              />

              <ModalButtons
                onCancel={() =>
                  setShowCheckinModal(false)
                }
                submitText="Confirm Check-In"
                submitIcon={
                  <ArrowDownToLine
                    size={14}
                  />
                }
              />
            </form>
          </div>
        </ModalOverlay>
      )}

      {/* =====================================================
          MANAGE USERS MODAL
      ===================================================== */}

      {showUsersModal && (
        <ModalOverlay
          onClose={() =>
            setShowUsersModal(false)
          }
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            <ModalHeader
              title="Manage Users"
              description="Manage PIMS system access."
              onClose={() =>
                setShowUsersModal(false)
              }
            />

            <div className="p-6">
              {formError && (
                <ErrorMessage
                  message={formError}
                />
              )}

              <form
                onSubmit={handleAddUser}
                className="grid gap-3 md:grid-cols-4"
              >
                <input
                  type="text"
                  placeholder="Full name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      name: e.target.value,
                    })
                  }
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-[10px] text-white outline-none placeholder:text-gray-700 focus:border-[#a70000]/50"
                />

                <input
                  type="text"
                  placeholder="Username"
                  value={userForm.username}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      username:
                        e.target.value,
                    })
                  }
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-[10px] text-white outline-none placeholder:text-gray-700 focus:border-[#a70000]/50"
                />

                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      role: e.target.value,
                    })
                  }
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-[10px] text-gray-300 outline-none focus:border-[#a70000]/50"
                >
                  <option value="Admin Staff">
                    Admin Staff
                  </option>

                  <option value="Super Admin">
                    Super Admin
                  </option>
                </select>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#a70000] px-4 py-3 text-[10px] font-semibold hover:bg-[#8f0000]"
                >
                  <Plus size={14} />

                  Add User
                </button>
              </form>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[550px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left">
                      <th className="pb-3 text-[8px] uppercase text-gray-700">
                        User
                      </th>

                      <th className="pb-3 text-[8px] uppercase text-gray-700">
                        Username
                      </th>

                      <th className="pb-3 text-[8px] uppercase text-gray-700">
                        Role
                      </th>

                      <th className="pb-3 text-[8px] uppercase text-gray-700">
                        Status
                      </th>

                      <th className="pb-3 text-right text-[8px] uppercase text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/[0.04]"
                      >
                        <td className="py-3 text-[10px] text-gray-300">
                          {item.name}
                        </td>

                        <td className="py-3 text-[10px] text-gray-600">
                          {item.username}
                        </td>

                        <td className="py-3 text-[10px] text-gray-500">
                          {item.role}
                        </td>

                        <td className="py-3">
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-[8px] text-green-400">
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              className="rounded-lg border border-white/5 p-2 text-gray-600 hover:text-white"
                              title="Edit user"
                            >
                              <Edit3 size={13} />
                            </button>

                            {item.username !==
                              "admin" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteUser(
                                    item.id
                                  )
                                }
                                className="rounded-lg border border-[#a70000]/10 p-2 text-gray-600 hover:bg-[#a70000]/10 hover:text-red-400"
                                title="Delete user"
                              >
                                <Trash2
                                  size={13}
                                />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* =====================================================
          REPORT MODAL
      ===================================================== */}

      {showReportModal && (
        <ModalOverlay
          onClose={() =>
            setShowReportModal(false)
          }
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            <ModalHeader
              title="Generate Report"
              description="Select the report you want to generate."
              onClose={() =>
                setShowReportModal(false)
              }
            />

            <form
              onSubmit={handleGenerateReport}
              className="space-y-5 p-6"
            >
              {formError && (
                <ErrorMessage
                  message={formError}
                />
              )}

              <FormSelect
                label="Report Type"
                value={reportForm.reportType}
                onChange={(e) =>
                  setReportForm({
                    ...reportForm,
                    reportType:
                      e.target.value,
                  })
                }
                options={[
                  "Property Inventory Report",
                  "Transaction Report",
                  "Currently Issued Equipment",
                  "Available Equipment",
                ]}
              />

              {reportForm.reportType ===
                "Transaction Report" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Date From"
                    type="date"
                    value={
                      reportForm.dateFrom
                    }
                    onChange={(e) =>
                      setReportForm({
                        ...reportForm,
                        dateFrom:
                          e.target.value,
                      })
                    }
                    required
                  />

                  <FormInput
                    label="Date To"
                    type="date"
                    value={reportForm.dateTo}
                    onChange={(e) =>
                      setReportForm({
                        ...reportForm,
                        dateTo:
                          e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#a70000]/10 text-[#a70000]">
                    <FileBarChart size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-medium text-gray-300">
                      Report Preview
                    </p>

                    <p className="mt-1 text-[8px] text-gray-700">
                      The selected report will
                      use the current PIMS
                      inventory data.
                    </p>
                  </div>
                </div>
              </div>

              <ModalButtons
                onCancel={() =>
                  setShowReportModal(false)
                }
                submitText="Generate Report"
                submitIcon={
                  <FileText size={14} />
                }
              />
            </form>
          </div>
        </ModalOverlay>
      )}
    </main>
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}

<ModalOverlay
  onClose={() => setShowUserModal(false)}
>
  <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.8)]">

    {/* YOUR EXISTING USER FORM */}

  </div>
</ModalOverlay>

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
        className="text-gray-600 hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// =====================================================
// ERROR MESSAGE
// =====================================================

function ErrorMessage({ message }) {
  return (
    <div className="rounded-xl border border-red-500/10 bg-red-500/[0.05] px-4 py-3">
      <p className="text-[9px] text-red-300">
        {message}
      </p>
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
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#a70000]/50 focus:ring-1 focus:ring-[#a70000]/20"
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
  optionValues,
  placeholder = "Select an option",
  required = false,
}) {
  const values = optionValues || options;

  return (
    <div>
      <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
        {label}
        {required && " *"}
      </label>

      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-gray-300 outline-none focus:border-[#a70000]/50"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option, index) => (
          <option
            key={
              values[index] ||
              `${option}-${index}`
            }
            value={values[index] || option}
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
        className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#a70000]/50 focus:ring-1 focus:ring-[#a70000]/20"
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
        className="rounded-xl border border-white/10 px-4 py-3 text-[10px] text-gray-500 hover:bg-white/5 hover:text-white"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="flex items-center gap-2 rounded-xl bg-[#a70000] px-5 py-3 text-[10px] font-semibold hover:bg-[#8f0000]"
      >
        {submitIcon}

        {submitText}
      </button>
    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]
     hover:border-[#a70000]/30 hover:bg-[#a70000]/[0.04] hover:shadow-[0_10px_35px_rgba(167,0,0,0.16)]">     
     <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-gray-600">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-500 transition-all duration-300 group-hover:scale-110 group-hover:border-[#ff1a1a]/40 group-hover:bg-[#a70000]/15 group-hover:text-[#ff2a2a] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.45)]">
  <Icon
    size={19}
    className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,40,40,0.9)]"
  />
</div>
      </div>

      <p className="mt-4 text-[9px] text-gray-600">
        {description}
      </p>

      <div className="mt-2 flex items-center gap-1 text-[8px] text-[#a70000]">
        <TrendingUp size={10} />

        {trend}
      </div>
    </div>
  );
}

// =====================================================
// QUICK ACTION
// =====================================================

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      >
      
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-gray-300">
          {title}
        </p>

        <p className="mt-1 truncate text-[8px] text-gray-700">
          {description}
        </p>
      </div>

     
    </button>
  );
}

// =====================================================
// MODULE CARD
// =====================================================

function ModuleCard({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-[#a70000]/20 hover:bg-white/[0.04]"
    >
      <div className="absolute left-0 top-0 h-full w-0.5 bg-[#a70000] opacity-40 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-500 transition-all duration-300 group-hover:border-[#ff1a1a]/40 group-hover:bg-[#a70000]/15 group-hover:text-[#ff2a2a] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.45)] group-hover:scale-110">
  <Icon
    size={20}
    className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,40,40,0.9)]"
  />
</div>

        <span className="text-gray-700 group-hover:text-[#a70000]">
          →
        </span>
      </div>

      <h4 className="mt-5 text-xs font-semibold text-gray-300">
        {title}
      </h4>

      <p className="mt-2 text-[9px] leading-5 text-gray-600">
        {description}
      </p>
    </button>
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
    <div className="flex gap-3 rounded-xl p-3 hover:bg-white/[0.025]">
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