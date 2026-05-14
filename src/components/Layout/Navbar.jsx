import React, { useState } from 'react'
import { BiHomeAlt2, BiChevronDown } from 'react-icons/bi';
import { LuSettings } from "react-icons/lu";

const Navbar = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-52 h-screen border border-orange-400">
        <div>
          <h1>
            DigiGOV v2
          </h1>
        </div>

        <div className='flex justify-center text-lg'>
          <ul>
            <li>
              <button onClick={() => setOpen(!open)} className='flex items-center gap-2'>
                <BiHomeAlt2 /> 
                <span>Overview</span>
                <BiChevronDown className={`transition-transform ${open ? 'rotate-180':''}`} />
              </button>
              {/* dropdown */}
              {
                open && (
                  <ul className='flex flex-col pl-5'>
                    <button>
                      Albay
                    </button>
                    <button>
                      Region
                    </button>
                  </ul>
                )
              }

            </li>
            <li className='flex items-center gap-2'>
              <LuSettings /> <span>Settings</span>
            </li>
          </ul>
        </div>
    </div>
  )
}

export default Navbar