"use client";

import { useState } from "react";
import {
  X,
  UserCircle,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

export default function UserProfile({ user, onClose }) {
  const [activeTab, setActiveTab] = useState("profile");

  const [fullName, setFullName] = useState(
    user?.name || ""
  );

  const [username, setUsername] = useState(
    user?.username || ""
  );

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  function handleSaveProfile(e) {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: fullName,
      username: username,
    };

    sessionStorage.setItem(
      "pimsUser",
      JSON.stringify(updatedUser)
    );

    setMessage("Profile updated successfully.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  function handleChangePassword(e) {
    e.preventDefault();

    setMessage("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setMessage(
        "Please complete all password fields."
      );
      return;
    }

    if (newPassword.length < 8) {
      setMessage(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(
        "New password and confirmation do not match."
      );
      return;
    }

    setMessage("Password updated successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  // =====================================================
  // CLOSE
  // =====================================================

  function handleClose() {
    setMessage("");
    onClose();
  }

  if (!user) {
    return null;
  }

  // =====================================================
  // FULL SCREEN PROFILE MODAL
  // =====================================================

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* =================================================
          CENTERED PROFILE BOX
      ================================================= */}

      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
        onMouseDown={(e) => e.stopPropagation()}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a70000]/10 text-[#ff2222]">
              <UserCircle size={19} />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-white">
                Manage Profile
              </h2>

              <p className="mt-1 text-[8px] text-gray-600">
                Manage your PIMS account
              </p>

            </div>

          </div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-[#a70000]/10 hover:text-red-400"
          >
            <X size={17} />
          </button>

        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="flex border-b border-white/[0.06] px-5">

          {/* PROFILE */}

          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setMessage("");
            }}
            className={`relative px-4 py-3 text-[9px] font-medium transition ${
              activeTab === "profile"
                ? "text-white"
                : "text-gray-600 hover:text-gray-300"
            }`}
          >
            Profile

            {activeTab === "profile" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a70000]" />
            )}
          </button>

          {/* CHANGE PASSWORD */}

          <button
            type="button"
            onClick={() => {
              setActiveTab("password");
              setMessage("");
            }}
            className={`relative flex items-center gap-1.5 px-4 py-3 text-[9px] font-medium transition ${
              activeTab === "password"
                ? "text-white"
                : "text-gray-600 hover:text-gray-300"
            }`}
          >
            <LockKeyhole size={11} />

            Change Password

            {activeTab === "password" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a70000]" />
            )}
          </button>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-5">

          {/* =================================================
              PROFILE TAB
          ================================================= */}

          {activeTab === "profile" && (
            <form
              onSubmit={handleSaveProfile}
              className="space-y-4"
            >

              {/* USER INFORMATION */}

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#a70000]/30 bg-[#a70000]/10 text-[#ff2222]">
                  <UserCircle size={27} />
                </div>

                <div className="min-w-0">

                  <h3 className="truncate text-[11px] font-semibold text-white">
                    {user.name}
                  </h3>

                  <p className="mt-1 truncate text-[8px] text-gray-600">
                    @{user.username}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5">

                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                    <span className="text-[8px] text-green-400">
                      {user.status || "Active"}
                    </span>

                  </div>

                </div>

              </div>

              {/* FULL NAME */}

              <div>

                <label className="mb-1.5 block text-[8px] font-medium uppercase tracking-wider text-gray-500">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[9px] text-white outline-none transition placeholder:text-gray-700 focus:border-[#a70000]/50"
                />

              </div>

              {/* USERNAME */}

              <div>

                <label className="mb-1.5 block text-[8px] font-medium uppercase tracking-wider text-gray-500">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[9px] text-white outline-none transition placeholder:text-gray-700 focus:border-[#a70000]/50"
                />

              </div>

              {/* ROLE */}

              <div>

                <label className="mb-1.5 block text-[8px] font-medium uppercase tracking-wider text-gray-500">
                  Role
                </label>

                <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">

                  <ShieldCheck
                    size={14}
                    className="text-[#a70000]"
                  />

                  <span className="text-[9px] text-gray-400">
                    {user.role || "Super Admin"}
                  </span>

                </div>

              </div>

              {/* MESSAGE */}

              {message && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2.5 text-[8px] text-green-400">
                  {message}
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex justify-end gap-2 pt-1">

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-[9px] text-gray-500 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#a70000] px-4 py-2.5 text-[9px] font-medium text-white transition hover:bg-[#c00000]"
                >
                  <Save size={12} />
                  Save Changes
                </button>

              </div>

            </form>
          )}

          {/* =================================================
              PASSWORD TAB
          ================================================= */}

          {activeTab === "password" && (
            <form
              onSubmit={handleChangePassword}
              className="space-y-3.5"
            >

              {/* INFO */}

              <div className="rounded-xl border border-[#a70000]/10 bg-[#a70000]/[0.04] p-3">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#a70000]/10 text-[#ff2222]">
                    <LockKeyhole size={15} />
                  </div>

                  <div>

                    <p className="text-[9px] font-medium text-white">
                      Update Password
                    </p>

                    <p className="mt-1 text-[7px] text-gray-600">
                      Use a strong password to keep your account secure.
                    </p>

                  </div>

                </div>

              </div>

              {/* CURRENT PASSWORD */}

              <PasswordInput
                label="Current Password"
                value={currentPassword}
                setValue={setCurrentPassword}
                showPassword={showCurrentPassword}
                setShowPassword={
                  setShowCurrentPassword
                }
              />

              {/* NEW PASSWORD */}

              <PasswordInput
                label="New Password"
                value={newPassword}
                setValue={setNewPassword}
                showPassword={showNewPassword}
                setShowPassword={
                  setShowNewPassword
                }
              />

              {/* CONFIRM PASSWORD */}

              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                showPassword={showConfirmPassword}
                setShowPassword={
                  setShowConfirmPassword
                }
              />

              {/* REQUIREMENTS */}

              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5">

                <p className="text-[7px] font-medium text-gray-500">
                  Password Requirements
                </p>

                <p className="mt-1.5 text-[7px] text-gray-700">
                  • Minimum of 8 characters
                </p>

                <p className="text-[7px] text-gray-700">
                  • Use letters and numbers
                </p>

              </div>

              {/* MESSAGE */}

              {message && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2.5 text-[8px] text-green-400">
                  {message}
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex justify-end gap-2 pt-1">

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-[9px] text-gray-500 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#a70000] px-4 py-2.5 text-[9px] font-medium text-white transition hover:bg-[#c00000]"
                >
                  <LockKeyhole size={12} />
                  Update Password
                </button>

              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}


/* =====================================================
   PASSWORD INPUT
===================================================== */

function PasswordInput({
  label,
  value,
  setValue,
  showPassword,
  setShowPassword,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[8px] font-medium uppercase tracking-wider text-gray-500">
        {label}
      </label>

      <div className="relative">

        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 pr-10 text-[9px] text-white outline-none transition placeholder:text-gray-700 focus:border-[#a70000]/50"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-gray-300"
        >
          {showPassword ? (
            <EyeOff size={14} />
          ) : (
            <Eye size={14} />
          )}
        </button>

      </div>

    </div>
  );
}