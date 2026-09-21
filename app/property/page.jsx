"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Barcode from "react-barcode";

import Sidebar from "../components/Sidebar";

import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
  Search,
  Plus,
  X,
  Eye,
  Edit3,
  Trash2,
  Filter,
  Barcode as BarcodeIcon,
  ChevronDown,
} from "lucide-react";

export default function PropertiesPage() {
  const router = useRouter();

  // =====================================================
  // AUTH / UI
  // =====================================================

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================================
  // MODALS
  // =====================================================

  const [showPropertyModal, setShowPropertyModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showBarcodeModal, setShowBarcodeModal] =
    useState(false);

  const [editingProperty, setEditingProperty] =
    useState(null);

  const [selectedProperty, setSelectedProperty] =
    useState(null);

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  // =====================================================
  // FORM
  // =====================================================

  const emptyForm = {
    name: "",
    category: "",
    serial: "",
    description: "",
    acquisitionDate: "",
    acquisitionCost: "",
    supplier: "",
    location: "",
    status: "Available",
  };

  const [form, setForm] = useState({
    ...emptyForm,
  });

  const [formError, setFormError] = useState("");

  // =====================================================
  // DEFAULT DATA
  // =====================================================

  const defaultProperties = [
    {
      id: "PIMS-00001",
      name: "Sony PXW-Z150 Camera",
      category: "Camera",
      serial: "SN-001234",
      description:
        "Professional 4K handheld camcorder.",
      acquisitionDate: "2026-01-15",
      acquisitionCost: "250000",
      supplier: "Sony Philippines",
      location: "Main Office",
      status: "Available",
      createdAt: new Date().toISOString(),
    },
    {
      id: "PIMS-00002",
      name: "MacBook Pro 16-inch",
      category: "Computer / Laptop",
      serial: "SN-002345",
      description:
        "MacBook Pro assigned for production and development.",
      acquisitionDate: "2026-02-10",
      acquisitionCost: "180000",
      supplier: "Apple",
      location: "Warehouse",
      status: "Issued",
      createdAt: new Date().toISOString(),
    },
  ];

  // =====================================================
  // PROPERTY DATA
  // =====================================================

  const [properties, setProperties] = useState([]);
  const [propertiesLoaded, setPropertiesLoaded] =
    useState(false);

  // =====================================================
  // AUTH CHECK
  // =====================================================

  useEffect(() => {
    const authenticated =
      sessionStorage.getItem("pimsAuthenticated");

    const storedUser =
      sessionStorage.getItem("pimsUser");

    if (authenticated !== "true") {
      router.replace("/");
      return;
    }

    if (!storedUser) {
      router.replace("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error(
        "Failed to read user session:",
        error
      );

      sessionStorage.removeItem(
        "pimsAuthenticated"
      );

      sessionStorage.removeItem("pimsUser");

      router.replace("/");
    }
  }, [router]);

  // =====================================================
  // LOAD PROPERTIES
  // =====================================================

  useEffect(() => {
    try {
      const storedProperties =
        localStorage.getItem("pimsProperties");

      if (storedProperties) {
        const parsedProperties =
          JSON.parse(storedProperties);

        if (Array.isArray(parsedProperties)) {
          setProperties(parsedProperties);
        } else {
          setProperties(defaultProperties);

          localStorage.setItem(
            "pimsProperties",
            JSON.stringify(defaultProperties)
          );
        }
      } else {
        setProperties(defaultProperties);

        localStorage.setItem(
          "pimsProperties",
          JSON.stringify(defaultProperties)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load properties:",
        error
      );

      setProperties(defaultProperties);
    } finally {
      setPropertiesLoaded(true);
    }
  }, []);

  // =====================================================
  // SAVE PROPERTIES
  // =====================================================

  useEffect(() => {
    if (!propertiesLoaded) return;

    try {
      localStorage.setItem(
        "pimsProperties",
        JSON.stringify(properties)
      );
    } catch (error) {
      console.error(
        "Failed to save properties:",
        error
      );
    }
  }, [properties, propertiesLoaded]);

  // =====================================================
  // ADD PROPERTY
  // =====================================================

  function openAddModal() {
    setEditingProperty(null);

    setForm({
      ...emptyForm,
    });

    setFormError("");
    setShowPropertyModal(true);
  }

  // =====================================================
  // EDIT PROPERTY
  // =====================================================

  function openEditModal(property) {
    setEditingProperty(property);

    setForm({
      name: property.name || "",
      category: property.category || "",
      serial: property.serial || "",
      description: property.description || "",
      acquisitionDate:
        property.acquisitionDate || "",
      acquisitionCost:
        property.acquisitionCost || "",
      supplier: property.supplier || "",
      location: property.location || "",
      status:
        property.status || "Available",
    });

    setFormError("");
    setShowPropertyModal(true);
  }

  // =====================================================
  // CLOSE PROPERTY MODAL
  // =====================================================

  function closePropertyModal() {
    setShowPropertyModal(false);
    setEditingProperty(null);

    setForm({
      ...emptyForm,
    });

    setFormError("");
  }

  // =====================================================
  // GENERATE PROPERTY CODE
  // =====================================================

  function generatePropertyCode() {
    if (properties.length === 0) {
      return "PIMS-00001";
    }

    const numbers = properties
      .map((property) => {
        const match = String(
          property.id || ""
        ).match(/^PIMS-(\d+)$/);

        return match ? Number(match[1]) : 0;
      })
      .filter(
        (number) =>
          !Number.isNaN(number)
      );

    const highest =
      numbers.length > 0
        ? Math.max(...numbers)
        : 0;

    return `PIMS-${String(
      highest + 1
    ).padStart(5, "0")}`;
  }

  // =====================================================
  // SAVE PROPERTY
  // =====================================================

  function handleSaveProperty(e) {
    e.preventDefault();

    setFormError("");

    if (!form.name.trim()) {
      setFormError(
        "Please enter the property name."
      );
      return;
    }

    if (!form.category) {
      setFormError(
        "Please select a property category."
      );
      return;
    }

    // EDIT
    if (editingProperty) {
      setProperties((current) =>
        current.map((property) =>
          property.id === editingProperty.id
            ? {
                ...property,
                ...form,
                name: form.name.trim(),
                serial:
                  form.serial.trim() ||
                  "Not provided",
                description:
                  form.description.trim(),
                supplier:
                  form.supplier.trim(),
                location:
                  form.location.trim(),
              }
            : property
        )
      );

      closePropertyModal();
      return;
    }

    // ADD
    const newProperty = {
      id: generatePropertyCode(),
      name: form.name.trim(),
      category: form.category,
      serial:
        form.serial.trim() ||
        "Not provided",
      description:
        form.description.trim(),
      acquisitionDate:
        form.acquisitionDate,
      acquisitionCost:
        form.acquisitionCost,
      supplier:
        form.supplier.trim(),
      location:
        form.location.trim(),
      status:
        form.status,
      createdAt:
        new Date().toISOString(),
    };

    setProperties((current) => [
      ...current,
      newProperty,
    ]);

    closePropertyModal();
  }

  // =====================================================
  // VIEW
  // =====================================================

  function openViewModal(property) {
    setSelectedProperty(property);
    setShowViewModal(true);
  }

  // =====================================================
  // BARCODE
  // =====================================================

  function openBarcodeModal(property) {
    setSelectedProperty(property);
    setShowBarcodeModal(true);
  }

  // =====================================================
  // DELETE
  // =====================================================

  function handleDeleteProperty(id) {
    const property = properties.find(
      (item) => item.id === id
    );

    if (!property) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.name}"?`
    );

    if (!confirmed) return;

    setProperties((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
      setShowViewModal(false);
      setShowBarcodeModal(false);
    }
  }

  // =====================================================
  // FILTER
  // =====================================================

  const filteredProperties =
    properties.filter((property) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        String(property.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(property.id || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(property.category || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(property.serial || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        property.category ===
          categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        property.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalProperties =
    properties.length;

  const availableProperties =
    properties.filter(
      (property) =>
        property.status === "Available"
    ).length;

  const issuedProperties =
    properties.filter(
      (property) =>
        property.status === "Issued"
    ).length;

  const maintenanceProperties =
    properties.filter(
      (property) =>
        property.status ===
        "Under Maintenance"
    ).length;

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    ...new Set(
      properties
        .map(
          (property) =>
            property.category
        )
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (!user || !propertiesLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090909] text-gray-500">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#a70000]" />

          <p className="text-xs">
            Loading PIMS...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

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
          SHARED SIDEBAR
          IMPORTANT:
          DO NOT CREATE ANOTHER SIDEBAR HERE.
      ===================================================== */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative min-h-screen lg:ml-64">

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
              className="text-gray-500 transition hover:text-white lg:hidden"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line
                  x1="4"
                  y1="6"
                  x2="20"
                  y2="6"
                />
                <line
                  x1="4"
                  y1="12"
                  x2="20"
                  y2="12"
                />
                <line
                  x1="4"
                  y1="18"
                  x2="20"
                  y2="18"
                />
              </svg>
            </button>

            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-gray-700">
                PIMS Module
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Property Inventory
              </h2>
            </div>

          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-[#a70000] px-4 py-3 text-[10px] font-semibold shadow-[0_0_25px_rgba(167,0,0,0.18)] transition duration-200 hover:bg-[#8f0000] hover:shadow-[0_0_30px_rgba(167,0,0,0.3)]"
          >
            <Plus size={15} />

            <span className="hidden sm:inline">
              Add Property
            </span>
          </button>

        </header>

        {/* =====================================================
            PROPERTY BODY
        ===================================================== */}

        <div className="p-5 sm:p-7"> 

          {/* PAGE TITLE */}

          <div className="mt-15 mb-7">

            <div className="mb-2 flex items-center gap-2">

              <Package
                size={14}
                className="text-[#a70000]"
              />

              <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600">
                Property Management
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-600">
              Register, monitor, and manage company properties and equipment.
            </p>

          </div>

          {/* =====================================================
              STAT CARDS
          ===================================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <PropertyStat
              title="Total Properties"
              value={totalProperties}
              description="All registered properties"
              icon={Package}
            />

            <PropertyStat
              title="Available"
              value={availableProperties}
              description="Ready for use"
              icon={ArrowDownToLine}
            />

            <PropertyStat
              title="Issued"
              value={issuedProperties}
              description="Currently issued"
              icon={ArrowUpFromLine}
            />

            <PropertyStat
              title="Maintenance"
              value={maintenanceProperties}
              description="Requires attention"
              icon={Settings}
            />

          </div>

          {/* =====================================================
              SEARCH / FILTER
          ===================================================== */}

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">

                <Search
                  size={15}
                  className="text-gray-700"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search property, code, category, or serial number..."
                  className="w-full bg-transparent text-[10px] text-gray-300 outline-none placeholder:text-gray-700"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="text-gray-700 transition hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    !showFilters
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-[10px] text-gray-500 transition hover:bg-white/[0.05] hover:text-white"
              >
                <Filter size={14} />

                Filters

                <ChevronDown
                  size={13}
                  className={
                    showFilters
                      ? "rotate-180 transition"
                      : "transition"
                  }
                />
              </button>

            </div>

            {showFilters && (
              <div className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-[8px] uppercase tracking-wider text-gray-600">
                    Category
                  </label>

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-[10px] text-gray-300 outline-none focus:border-[#a70000]/50"
                  >
                    <option value="All">
                      All Categories
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[8px] uppercase tracking-wider text-gray-600">
                    Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-[10px] text-gray-300 outline-none focus:border-[#a70000]/50"
                  >
                    <option value="All">
                      All Status
                    </option>

                    <option value="Available">
                      Available
                    </option>

                    <option value="Issued">
                      Issued
                    </option>

                    <option value="Under Maintenance">
                      Under Maintenance
                    </option>

                    <option value="Disposed">
                      Disposed
                    </option>
                  </select>
                </div>

              </div>
            )}

          </div>

          {/* =====================================================
              TABLE
          ===================================================== */}

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">

            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

              <div>
                <h3 className="text-sm font-semibold">
                  Property Records
                </h3>

                <p className="mt-1 text-[9px] text-gray-600">
                  {filteredProperties.length}{" "}
                  record
                  {filteredProperties.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  displayed
                </p>
              </div>

              {(search ||
                categoryFilter !== "All" ||
                statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter(
                      "All"
                    );
                    setStatusFilter(
                      "All"
                    );
                  }}
                  className="text-[9px] text-[#a70000] transition hover:text-red-400"
                >
                  Clear Filters
                </button>
              )}

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="border-b border-white/[0.06] text-left">

                    <th className="px-5 py-4 text-[8px] uppercase tracking-wider text-gray-700">
                      Property Code
                    </th>

                    <th className="px-5 py-4 text-[8px] uppercase tracking-wider text-gray-700">
                      Property
                    </th>

                    <th className="px-5 py-4 text-[8px] uppercase tracking-wider text-gray-700">
                      Category
                    </th>

                    <th className="px-5 py-4 text-[8px] uppercase tracking-wider text-gray-700">
                      Serial Number
                    </th>

                    <th className="px-5 py-4 text-[8px] uppercase tracking-wider text-gray-700">
                      Location
                    </th>

                    <th className="px-5 py-4 text-[8px] uppercase tracking-wider text-gray-700">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[8px] uppercase tracking-wider text-gray-700">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredProperties.map(
                    (property) => (
                      <tr
                        key={property.id}
                        className="border-b border-white/[0.04] transition hover:bg-white/[0.025]"
                      >

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              openBarcodeModal(
                                property
                              )
                            }
                            className="font-mono text-[10px] text-[#a70000] transition hover:text-red-400"
                          >
                            {property.id}
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-[10px] font-semibold text-gray-300">
                            {property.name}
                          </p>

                          {property.description && (
                            <p className="mt-1 max-w-[220px] truncate text-[8px] text-gray-700">
                              {
                                property.description
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-[10px] text-gray-500">
                          {property.category}
                        </td>

                        <td className="px-5 py-4 font-mono text-[9px] text-gray-600">
                          {property.serial}
                        </td>

                        <td className="px-5 py-4 text-[9px] text-gray-600">
                          {property.location ||
                            "—"}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              property.status
                            }
                          />
                        </td>

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <ActionButton
                              title="View property"
                              onClick={() =>
                                openViewModal(
                                  property
                                )
                              }
                            >
                              <Eye size={13} />
                            </ActionButton>

                            <ActionButton
                              title="View barcode"
                              onClick={() =>
                                openBarcodeModal(
                                  property
                                )
                              }
                            >
                              <BarcodeIcon
                                size={13}
                              />
                            </ActionButton>

                            <ActionButton
                              title="Edit property"
                              onClick={() =>
                                openEditModal(
                                  property
                                )
                              }
                            >
                              <Edit3 size={13} />
                            </ActionButton>

                            <ActionButton
                              danger
                              title="Delete property"
                              onClick={() =>
                                handleDeleteProperty(
                                  property.id
                                )
                              }
                            >
                              <Trash2
                                size={13}
                              />
                            </ActionButton>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {filteredProperties.length ===
              0 && (
              <div className="p-12 text-center">

                <Package
                  size={32}
                  className="mx-auto text-gray-700"
                />

                <p className="mt-4 text-xs text-gray-500">
                  No properties found.
                </p>

                <p className="mt-1 text-[9px] text-gray-700">
                  Try changing your search or filters.
                </p>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showPropertyModal && (
        <ModalOverlay
          onClose={
            closePropertyModal
          }
        >

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.8)]">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#111111] px-6 py-5">

              <div>
                <h2 className="text-sm font-semibold">
                  {editingProperty
                    ? "Edit Property"
                    : "Add Property"}
                </h2>

                <p className="mt-1 text-[9px] text-gray-600">
                  {editingProperty
                    ? "Update property information."
                    : "Register a new company property."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closePropertyModal
                }
                className="text-gray-600 transition hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={
                handleSaveProperty
              }
              className="space-y-5 p-6"
            >

              {formError && (
                <div className="rounded-xl border border-[#a70000]/30 bg-[#a70000]/10 px-4 py-3">
                  <p className="text-[9px] text-red-300">
                    {formError}
                  </p>
                </div>
              )}

              {editingProperty && (
                <div className="rounded-xl border border-[#a70000]/15 bg-[#a70000]/5 p-4">

                  <p className="text-[8px] uppercase tracking-wider text-gray-600">
                    Property Code
                  </p>

                  <p className="mt-1 font-mono text-sm font-semibold text-[#a70000]">
                    {editingProperty.id}
                  </p>

                  <p className="mt-1 text-[8px] text-gray-700">
                    Property code and barcode cannot be changed.
                  </p>

                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">

                <FormInput
                  label="Property Name"
                  placeholder="e.g. Sony PXW-Z150 Camera"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <FormSelect
                  label="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category:
                        e.target.value,
                    })
                  }
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Camera">
                    Camera
                  </option>

                  <option value="Audio Equipment">
                    Audio Equipment
                  </option>

                  <option value="Computer / Laptop">
                    Computer / Laptop
                  </option>

                  <option value="Lighting Equipment">
                    Lighting Equipment
                  </option>

                  <option value="Camera Accessories">
                    Camera Accessories
                  </option>

                  <option value="Production Equipment">
                    Production Equipment
                  </option>

                  <option value="Office Equipment">
                    Office Equipment
                  </option>

                  <option value="Furniture">
                    Furniture
                  </option>

                  <option value="Vehicle">
                    Vehicle
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </FormSelect>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <FormInput
                  label="Serial Number"
                  placeholder="Enter serial number"
                  value={form.serial}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      serial:
                        e.target.value,
                    })
                  }
                />

                <FormInput
                  label="Current Location"
                  placeholder="e.g. Main Office"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
                    Acquisition Date
                  </label>

                  <input
                    type="date"
                    value={
                      form.acquisitionDate
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        acquisitionDate:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-gray-300 outline-none focus:border-[#a70000]/50"
                  />
                </div>

                <FormInput
                  label="Acquisition Cost"
                  placeholder="e.g. 250000"
                  value={
                    form.acquisitionCost
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      acquisitionCost:
                        e.target.value,
                    })
                  }
                />

              </div>

              <FormInput
                label="Supplier / Vendor"
                placeholder="Enter supplier or vendor"
                value={form.supplier}
                onChange={(e) =>
                  setForm({
                    ...form,
                    supplier:
                      e.target.value,
                  })
                }
              />

              <FormSelect
                label="Status"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status:
                      e.target.value,
                  })
                }
              >
                <option value="Available">
                  Available
                </option>

                <option value="Issued">
                  Issued
                </option>

                <option value="Under Maintenance">
                  Under Maintenance
                </option>

                <option value="Disposed">
                  Disposed
                </option>
              </FormSelect>

              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Enter additional property information..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#a70000]/50 focus:ring-1 focus:ring-[#a70000]/20"
                />
              </div>

              {!editingProperty && (
                <div className="rounded-xl border border-[#a70000]/15 bg-[#a70000]/5 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#a70000]/10 text-[#a70000]">
                      <BarcodeIcon size={17} />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold text-gray-300">
                        Automatic Barcode Generation
                      </p>

                      <p className="mt-1 text-[8px] leading-4 text-gray-600">
                        A unique PIMS property code and barcode will be automatically generated when this property is saved.
                      </p>
                    </div>

                  </div>

                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">

                <button
                  type="button"
                  onClick={
                    closePropertyModal
                  }
                  className="rounded-xl border border-white/10 px-5 py-3 text-[10px] text-gray-500 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#a70000] px-6 py-3 text-[10px] font-semibold transition hover:bg-[#8f0000] hover:shadow-[0_0_25px_rgba(167,0,0,0.2)]"
                >
                  {editingProperty
                    ? "Save Changes"
                    : "Add Property"}
                </button>

              </div>

            </form>

          </div>

        </ModalOverlay>
      )}

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {showViewModal &&
        selectedProperty && (
          <ModalOverlay
            onClose={() =>
              setShowViewModal(false)
            }
          >

            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.8)]">

              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">

                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-700">
                    Property Details
                  </p>

                  <h2 className="mt-1 text-sm font-semibold">
                    {selectedProperty.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                  className="text-gray-600 transition hover:text-white"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="space-y-4 p-6">

                <div className="rounded-xl border border-[#a70000]/15 bg-[#a70000]/5 p-4">

                  <p className="text-[8px] uppercase tracking-wider text-gray-600">
                    Property Code
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-3">

                    <p className="font-mono text-sm font-semibold text-[#a70000]">
                      {selectedProperty.id}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setShowViewModal(
                          false
                        );

                        openBarcodeModal(
                          selectedProperty
                        );
                      }}
                      className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-[9px] text-gray-500 transition hover:bg-white/5 hover:text-white"
                    >
                      <BarcodeIcon size={13} />
                      Barcode
                    </button>

                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <DetailItem
                    label="Property Name"
                    value={
                      selectedProperty.name
                    }
                  />

                  <DetailItem
                    label="Category"
                    value={
                      selectedProperty.category
                    }
                  />

                  <DetailItem
                    label="Serial Number"
                    value={
                      selectedProperty.serial
                    }
                  />

                  <DetailItem
                    label="Location"
                    value={
                      selectedProperty.location ||
                      "—"
                    }
                  />

                  <DetailItem
                    label="Acquisition Date"
                    value={
                      selectedProperty.acquisitionDate ||
                      "—"
                    }
                  />

                  <DetailItem
                    label="Acquisition Cost"
                    value={
                      selectedProperty.acquisitionCost
                        ? `₱${Number(
                            selectedProperty.acquisitionCost
                          ).toLocaleString()}`
                        : "—"
                    }
                  />

                  <DetailItem
                    label="Supplier / Vendor"
                    value={
                      selectedProperty.supplier ||
                      "—"
                    }
                  />

                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-gray-700">
                      Status
                    </p>

                    <div className="mt-2">
                      <StatusBadge
                        status={
                          selectedProperty.status
                        }
                      />
                    </div>
                  </div>

                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">

                  <p className="text-[8px] uppercase tracking-wider text-gray-700">
                    Description
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-gray-500">
                    {selectedProperty.description ||
                      "No description provided."}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                  className="w-full rounded-xl border border-white/10 px-4 py-3 text-[10px] text-gray-500 transition hover:bg-white/5 hover:text-white"
                >
                  Close
                </button>

              </div>

            </div>

          </ModalOverlay>
        )}

      {/* =====================================================
          BARCODE MODAL
      ===================================================== */}

      {showBarcodeModal &&
        selectedProperty && (
          <ModalOverlay
            onClose={() =>
              setShowBarcodeModal(false)
            }
          >

            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.8)]">

              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">

                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-700">
                    Property Identification
                  </p>

                  <h2 className="mt-1 text-sm font-semibold">
                    Barcode
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowBarcodeModal(false)
                  }
                  className="text-gray-600 transition hover:text-white"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="p-6">

                <div className="rounded-xl bg-white p-5">

                  <Barcode
                    value={
                      selectedProperty.id
                    }
                    format="CODE128"
                    width={2}
                    height={75}
                    displayValue
                    fontSize={14}
                    margin={10}
                  />

                </div>

                <div className="mt-5">

                  <p className="text-center text-[9px] text-gray-600">
                    {selectedProperty.name}
                  </p>

                  <p className="mt-1 text-center font-mono text-[10px] text-[#a70000]">
                    {selectedProperty.id}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowBarcodeModal(false)
                  }
                  className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 text-[10px] text-gray-500 transition hover:bg-white/5 hover:text-white"
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

// =====================================================
// FORM INPUT
// =====================================================

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] uppercase tracking-wider text-gray-500">
        {label}
        {required && " *"}
      </label>

      <input
        type="text"
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
  children,
  required = false,
}) {
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
        {children}
      </select>
    </div>
  );
}

// =====================================================
// ACTION BUTTON
// =====================================================

function ActionButton({
  children,
  onClick,
  title,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg border p-2 transition ${
        danger
          ? "border-[#a70000]/10 text-gray-600 hover:bg-[#a70000]/10 hover:text-red-400"
          : "border-white/[0.06] text-gray-600 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// =====================================================
// PROPERTY STAT
// =====================================================

function PropertyStat({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#a70000]/30 hover:bg-white/[0.04] hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]">

      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#a70000]/0 blur-3xl transition duration-300 group-hover:bg-[#a70000]/10" />

      <div className="relative">

        <div className="flex items-start justify-between">

          <p className="text-[9px] uppercase tracking-wider text-gray-600">
            {title}
          </p>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-500 transition-all duration-300 group-hover:scale-110 group-hover:border-[#ff1a1a]/40
           group-hover:bg-[#a70000]/15 group-hover:text-[#ff2a2a] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.45)]">

            <Icon
              size={19}
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_7px_rgba(255,0,0,0.85)]"
            />

          </div>

        </div>

        <p className="mt-3 text-2xl font-bold tracking-tight">
          {value}
        </p>

        <p className="mt-2 text-[8px] text-gray-700">
          {description}
        </p>

      </div>

    </div>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
  status,
}) {
  const styles = {
    Available:
      "bg-green-500/10 text-green-400",

    Issued:
      "bg-[#a70000]/10 text-red-300",

    "Under Maintenance":
      "bg-yellow-500/10 text-yellow-400",

    Disposed:
      "bg-gray-500/10 text-gray-500",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[8px] ${
        styles[status] ||
        "bg-gray-500/10 text-gray-500"
      }`}
    >
      {status}
    </span>
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
    <div>
      <p className="text-[8px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="mt-2 break-words text-[10px] text-gray-400">
        {value}
      </p>
    </div>
  );
}