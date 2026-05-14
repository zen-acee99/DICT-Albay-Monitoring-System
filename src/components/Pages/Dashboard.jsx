import React from 'react'
import Navbar from '../Layout/Navbar'
import { IoSearch } from "react-icons/io5";
import { TbRadar2 } from "react-icons/tb";

const Dashboard = () => {
  return (
    <div className='flex '>
        <Navbar />
        <div className='flex flex-col p-5 border w-screen'>
          {/* content */}
            <div className='flex gap-5 items-center'>
              <div>
                <h1 className='tracking-wider font-semibold text-xl'>
                  DigiGOV Dashboard
                </h1>
                <span className='text-sm'>
                  Region 5
                </span>
              </div>

              <div>
                <IoSearch className='absolute text-gray-500 ml-3 mt-2' />
                <input type="text" placeholder="Search..." 
                className='bg-transparent border border-gray-700 pl-10 py-1 rounded-md outline-none'/> 
              </div>
            </div>

            {/* cards */}
          <div className='flex gap-5 py-2 border border-white'>
            <div className='flex items-center justify-center w-56 h-28 border border-orange-500 rounded-lg'>
              {/* icon */}
              <TbRadar2 className='text-4xl text-green-500 mx-auto mt-3' />
              <div>
                <h1>
                  LIVE eLGUs
                </h1>
                <span>
                  58
                </span>
              </div>
            </div>
            <div className='flex items-center justify-center w-56 h-28 border border-orange-500 rounded-lg'>
              {/* icon */}
              <TbRadar2 className='text-4xl text-green-500 mx-auto mt-3' />
              <div>
                <h1>
                  UAT eLGUs
                </h1>
                <span>
                  58
                </span>
              </div>
            </div>
            <div className='flex items-center justify-center w-56 h-28 border border-orange-500 rounded-lg'>
              {/* icon */}
              <TbRadar2 className='text-4xl text-green-500 mx-auto mt-3' />
              <div>
                <h1>
                  Admin Trainings
                </h1>
                <span>
                  58
                </span>
              </div>
            </div>
            <div className='flex items-center justify-center w-56 h-28 border border-orange-500 rounded-lg'>
              {/* icon */}
              <TbRadar2 className='text-4xl text-green-500 mx-auto mt-3' />
              <div>
                <h1>
                  Inactive / No eLGUs
                </h1>
                <span>
                  58
                </span>
              </div>
            </div>
            <div className='flex items-center justify-center w-56 h-28 border border-orange-500 rounded-lg'>
              {/* icon */}
              <TbRadar2 className='text-4xl text-green-500 mx-auto mt-3' />
              <div>
                <h1>
                  With Own/ 3rd Party System
                </h1>
                <span>
                  58
                </span>
              </div>
            </div>
            <div className='flex items-center justify-center w-56 h-28 border border-orange-500 rounded-lg'>
              {/* icon */}
              <TbRadar2 className='text-4xl text-green-500 mx-auto mt-3' />
              <div>
                <h1>
                  UAT eLGUs
                </h1>
                <span>
                  58
                </span>
              </div>
            </div>
          </div>

          {/* end cards */}

          <div className='grid grid-cols-4 gap-5 py-5 border'>
            <div className='border border-orange-400 h-[500px] col-span-2'>
              <h1>
                eLGU Bubble Map
              </h1>
            </div>
            <div className='grid grid-rows-[1.5fr_1fr] gap-2'>
              <div className=' border border-green-400 w-full h-full'>
                1
              </div>
              <div className='border border-green-400 w-full h-full'>
                1
              </div>
            </div>
            <div className='grid grid-rows-[2fr_1fr] gap-2'>
              <div className='border border-green-400 w-full h-full'>
                1
              </div>
              <div className='border border-green-400 w-full h-full'>
                1
              </div>
            </div>
            <div className='grid grid-rows-2 w-96 gap-2 border border-orange-300'>
              {/* product that NGa avails */}
              products
            </div>
          </div>

        </div>
    </div>
  )
}

export default Dashboard