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
  const [open, setOpen] = useState(true)

  return (
    <div className="w-full h-screen bg-[#050816] text-white px-4 py-5 border-r border-[#1b2440] flex flex-col">

      {/* Logo */}
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20'>
          <span className='font-bold text-lg'>⌘</span>
        </div>

        <h1 className='text-2xl font-semibold tracking-wide'>
          DigiGOV <span className='text-gray-400 text-lg'>v2</span>
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
              <ul className='pl-6 pt-3 space-y-3 text-gray-300'>

                <Link to="/#" className='hover:text-white transition cursor-pointer'>
                  Albay
                </Link>

                <Link to="/#" className='hover:text-white transition cursor-pointer'>
                  Region
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
          <Link to="/administrator" className='flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#0d1325] transition cursor-pointer text-gray-300 hover:text-white'>
            <LuSettings className='text-2xl' />
            <span className='text-lg'>Administration</span>
          </Link>
        </ul>
      </div>

      {/* Bottom Card */}
      <div className='relative mt-6 rounded-[30px] overflow-hidden border border-[#1a3d80] bg-gradient-to-b from-[#07152d] to-[#020817] p-6 min-h-[240px] flex flex-col justify-end'>

        {/* Glow */}
        <div className='absolute w-[300px] h-[300px] bg-blue-700/30 rounded-full blur-3xl -bottom-28 left-1/2 -translate-x-1/2'></div>

        {/* Circle Effect */}
        <div className='absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.6),transparent_60%)]'></div>

        <div className='relative z-10 text-center'>
          
          <h1 className='text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent'>
            eLGU
          </h1>

          <h2 className='text-3xl font-bold text-blue-400 mt-1'>
            eGOV<span className='text-white text-lg'>PH</span>
          </h2>

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