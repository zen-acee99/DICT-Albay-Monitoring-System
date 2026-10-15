import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaGlobeAsia,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaClock,
  FaCog,
  FaWifi,
  FaKey,
  FaDatabase,
  FaQrcode
} from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { signOut } from "firebase/auth";
import { auth } from "../Pages/firebase";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-[260px] h-screen bg-[#090d18] text-white px-4 py-5 border-r border-white/[0.06] flex flex-col justify-between select-none overflow-y-auto custom-scrollbar">
      <div>
        {/* Brand Logo - Bento style rounded */}
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#10172a] border border-white/10 flex items-center justify-center shadow-sm">
            <img src="/DictLOGO.png" alt="DICT" className="w-7 h-7 object-contain" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              DigiGOV
            </h1>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Monitoring System</p>
          </div>
        </div>

        {/* Navigation Links - Rounded bento style */}
        <nav className="space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FaGlobeAsia className="text-base text-slate-400" />
            <span>Region</span>
          </Link>

          <Link
            to="/albay"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/albay")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FaMapMarkedAlt className="text-base text-slate-400" />
            <span>Albay</span>
          </Link>

          <Link
            to="/calendar"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/calendar")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FaCalendarAlt className="text-base text-slate-400" />
            <span>Calendar</span>
          </Link>

          <Link
            to="/DailyTimeRecord"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/DailyTimeRecord")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FaClock className="text-base text-slate-400" />
            <span>Daily Time Record</span>
          </Link>

          <Link
            to="/albay-urlShortener"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/albay-urlShortener")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FaQrcode className="text-base text-slate-400" />
            <span>URL Shortener</span>
          </Link>

          {/* Section Divider */}
          <div className="pt-4 pb-2 px-3">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Settings</span>
          </div>

          <Link
            to="/settings/elgu"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/settings/elgu")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FaCog className="text-base text-slate-400" />
            <span>eLGU</span>
          </Link>

          <Link
            to="/settings/wifi"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/settings/wifi")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FaWifi className="text-base text-slate-400" />
            <span>WIFI</span>
          </Link>

          <Link
            to="/settings/pnpki"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/settings/pnpki")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FaKey className="text-base text-slate-400" />
            <span>PNPKI</span>
          </Link>

          <Link
            to="/settings/ilcdb"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/settings/ilcdb")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FaDatabase className="text-base text-slate-400" />
            <span>ILCDB</span>
          </Link>

          <Link
            to="/settings/egov"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              isActive("/settings/egov")
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <span className="w-4 text-center text-xs font-bold text-slate-400">e</span>
            <span>eGOVPH</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-left"
          >
            <BiLogOut className="text-base" />
            <span>Log out</span>
          </button>
        </nav>
      </div>

      {/* Bottom Card - Rounded Bento Box */}
      <div className="relative mt-6 rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0d1424] p-5 text-center shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/1.png" alt="" className="h-6 object-contain opacity-80" onError={(e) => e.target.style.display = 'none'} />
          <img src="/eGOV.png" alt="" className="h-6 object-contain opacity-80" onError={(e) => e.target.style.display = 'none'} />
        </div>
        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
          Build. Empower. Transform.
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          eGovPH Ecosystem
        </p>
      </div>
    </aside>
  )
}

export default Navbar