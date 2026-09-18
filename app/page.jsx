"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  User,
  LogIn,
  ShieldCheck,
  Package,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
  
    setError("");
  
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
  
    setLoading(true);
  
    // TEMPORARY DEVELOPMENT LOGIN
    sessionStorage.setItem(
      "pimsAuthenticated",
      "true"
    );
    
    sessionStorage.setItem(
      "pimsUser",
      JSON.stringify({
        username: username,
        name: username,
        role: "Super Admin",
      })
    );
    
  
    // Redirect to dashboard
    router.replace("/dashboard");
  }


  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] px-4 text-white">

      {/* BACKGROUND */}
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/pims2.png')",
        }}
      />

      {/* DARK OVERLAY */}
      <div className="pointer-events-none fixed inset-0 bg-[#090909]/85" />

      {/* RED GLOW */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(167,0,0,0.16),transparent_40%)]" />

      {/* LOGIN */}
      <div className="relative z-10 w-full max-w-md">

        {/* LOGO */}
        <div className="mb-7 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#a70000] shadow-[0_0_35px_rgba(167,0,0,0.3)]">

            <Package size={30} />

          </div>

          <h1 className="text-2xl font-bold tracking-[0.18em]">
            PIMS
          </h1>

          <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-gray-600">
            Property Inventory & Management System
          </p>

        </div>

        {/* LOGIN CARD */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">

          <div className="h-0.5 w-full bg-[#a70000] shadow-[0_0_12px_#a70000]" />

          <div className="p-7 sm:p-8">

            <div className="mb-7">

              <div className="mb-3 flex items-center gap-2">

                <ShieldCheck
                  size={15}
                  className="text-[#a70000]"
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                  Secure Access
                </span>

              </div>

              <h2 className="text-xl font-semibold">
                Welcome Back
              </h2>

              <p className="mt-2 text-xs leading-5 text-gray-600">
                Sign in to access the PIMS management portal.
              </p>

            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-xl border border-[#a70000]/30 bg-[#a70000]/10 px-4 py-3">

                <p className="text-[10px] text-red-300">
                  {error}
                </p>

              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* USERNAME */}
              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-wider text-gray-500">
                  Username
                </label>

                <div className="relative">

                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="Enter your username"
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#a70000]/60 focus:ring-1 focus:ring-[#a70000]/20"
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-wider text-gray-500">
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-11 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#a70000]/60 focus:ring-1 focus:ring-[#a70000]/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>

              {/* REMEMBER */}
              <div className="flex items-center">

                <label className="flex cursor-pointer items-center gap-2">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                    className="h-3.5 w-3.5 accent-[#a70000]"
                  />

                  <span className="text-[10px] text-gray-600">
                    Remember me
                  </span>

                </label>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a70000] py-3.5 text-xs font-semibold shadow-[0_0_25px_rgba(167,0,0,0.18)] transition hover:bg-[#8f0000] hover:shadow-[0_0_35px_rgba(167,0,0,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={15} />
                    Sign In
                  </>
                )}

              </button>

            </form>

            {/* SECURITY NOTICE */}
            <div className="mt-7 flex gap-3 rounded-xl border border-white/5 bg-black/10 p-3.5">

              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0 text-[#a70000]"
              />

              <div>

                <p className="text-[9px] font-medium text-gray-400">
                  Authorized Access Only
                </p>

                <p className="mt-1 text-[8px] leading-4 text-gray-700">
                  This system is intended for authorized company personnel.
                </p>

              </div>

            </div>

          </div>

        </div>

        <p className="mt-6 text-center text-[9px] text-gray-700">
          PIMS • Internal Company System
        </p>

      </div>

    </main>
  );
}