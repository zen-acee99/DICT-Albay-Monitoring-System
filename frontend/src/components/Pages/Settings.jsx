import React from 'react'
import Navbar from '../Layout/Navbar'

const Settings = () => {
  return (
    <div className='h-screen bg-[#050816] text-white flex'>
        <div className="hidden lg:block w-[250px] fixed h-screen">
            <Navbar />
        </div>
        
        <div className='flex-1 overflow-y-auto'>
            settings
        </div>
    </div>
  )
}

export default Settings