import React, { useState } from 'react'
import {
  BiHomeAlt2,
  BiChevronDown,
  BiMap,
  BiUser,
  BiDownload,
  BiCalendar,
  BiCreditCard,
} from 'react-icons/bi'

import { LuSettings } from "react-icons/lu"
import { TbBuildingCommunity } from "react-icons/tb"
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)

  return (
    <div className="w-full h-screen bg-[#050816] text-white px-4 py-5 border-r border-[#1b2440] flex flex-col">

      {/* Logo */}
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20'>
          <img src="/DictLOGO.png" alt="" />
        </div>

        <h1 className='text-2xl font-semibold tracking-wide'>
          DigiGOV
        </h1>
      </div>


      {/* Navigation */}
      <div className='flex-1 overflow-y-auto'>

        <ul className='space-y-2'>

          {/* Overview */}
          <li>
            <button
              onClick={() => setOpen(!open)}
              className='w-full flex items-center justify-between px-4 py-4 rounded-2xl bg-gradient-to-r from-[#0d2f88] to-[#2d0f57] border border-blue-500/40 shadow-lg shadow-blue-900/20'
            >
              <div className='flex items-center gap-3'>
                <BiHomeAlt2 className='text-2xl' />

                <span className='font-medium text-lg'>
                  Overview
                </span>
              </div>

              <BiChevronDown
                className={`text-xl transition-transform duration-300 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <ul className='flex flex-col pl-6 pt-3 space-y-3 text-gray-300'>

                <Link to="/" className='hover:text-white transition cursor-pointer'>
                  Region
                </Link>
                <Link to="/albay" className='hover:text-white transition cursor-pointer'>
                  Albay
                </Link>
                <Link to="/sorsogon" className='hover:text-white transition cursor-pointer'>
                  Sorsogon
                </Link>
                <Link to="/camnorte" className='hover:text-white transition cursor-pointer'>
                  Cam Norte
                </Link>
                <Link to="/camsur" className='hover:text-white transition cursor-pointer'>
                  Cam Sur
                </Link>
                <Link to="/masbate" className='hover:text-white transition cursor-pointer'>
                  Masbate
                </Link>
                <Link to="/catanduanes" className='hover:text-white transition cursor-pointer'>
                  Catanduanes
                </Link>
              </ul>
            )}
          </li>

{/* 
          <li className='flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#0d1325] transition cursor-pointer text-gray-300 hover:text-white'>
            <BiUser className='text-2xl' />
            <span className='text-lg'>Users</span>
          </li>

          <li className='flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#0d1325] transition cursor-pointer text-gray-300 hover:text-white'>
            <TbBuildingCommunity className='text-2xl' />
            <span className='text-lg'>eLGU Operations</span>
          </li>

          <li className='flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#0d1325] transition cursor-pointer text-gray-300 hover:text-white'>
            <BiDownload className='text-2xl' />
            <span className='text-lg'>Downloads</span>
          </li>

          <li className='flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#0d1325] transition cursor-pointer text-gray-300 hover:text-white'>
            <BiCalendar className='text-2xl' />
            <span className='text-lg'>Events & Activities</span>
          </li>

          <li className='flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#0d1325] transition cursor-pointer text-gray-300 hover:text-white'>
            <BiCreditCard className='text-2xl' />
            <span className='text-lg'>Payments</span>
          </li> */}

          {/* Administration */}
            <button
              onClick={() => setOpenSettings(!openSettings)}
              className='w-full flex items-center justify-between px-1 py-2 rounded-2xl bg-gradient-to-r '
            >
              <div className='flex items-center gap-3'>
                <LuSettings className={`text-xl transition-transform duration-300 ${
                  openSettings ? 'rotate-180' : ''
                }`} />

                <span className='font-medium text-lg'>
                  Settings
                </span>
              </div>
              
              <BiChevronDown
                className={`text-xl transition-transform duration-300 ${
                  openSettings ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSettings && (
              <ul className='flex flex-col pl-6 pt-3 space-y-3 text-gray-300'>
                <Link to="/settings/user" className='hover:text-white transition cursor-pointer'>
                  USERS
                </Link>
                <Link to="/settings/elgu" className='hover:text-white transition cursor-pointer'>
                  eLGU
                </Link>
                <Link to="/settings/wifi" className='hover:text-white transition cursor-pointer'>
                  WIFI
                </Link>
                <Link to="/settings/pnpki" className='hover:text-white transition cursor-pointer'>
                  PNPKI
                </Link>
                <Link to="/settings/ilcdb" className='hover:text-white transition cursor-pointer'>
                  ILCDB
                </Link>
                <Link to="/settings/cybersecurity" className='hover:text-white transition cursor-pointer'>
                  CYBERSECURITY
                </Link>
                <Link to="/settings/egov" className='hover:text-white transition cursor-pointer'>
                  eGOVPH
                </Link>
              </ul>
            )}
        </ul>
      </div>

      {/* Bottom Card */}
      <div className='relative mt-6 rounded-[30px] overflow-hidden border border-[#1a3d80] bg-gradient-to-b from-[#07152d] to-[#020817] p-6 min-h-[240px] flex flex-col justify-end'>

        {/* Glow */}
        <div className='absolute w-[300px] h-[300px] bg-blue-700/30 rounded-full blur-3xl -bottom-28 left-1/2 -translate-x-1/2'></div>

        {/* Circle Effect */}
        <div className='absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.6),transparent_60%)]'></div>

        <div className='relative z-0 text-center'>
          
          <img src="/eLGU.png" alt="" />

          <img src="/eGOV.png" alt="" />

          <p className='text-sm text-gray-300 mt-4 leading-relaxed'>
            Build. Empower. Transform.
            <br />
            eGovPH Ecosystem
          </p>
        </div>
      </div>
    </div>
  )
}

export default Navbar