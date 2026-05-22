import React, { useState, useEffect } from 'react'
import Navbar from '../Layout/Navbar'
import axios from 'axios'

import { IoSearch } from "react-icons/io5";
import { TbRadar2 } from "react-icons/tb";

import {
  HiOutlineDownload,
  HiOutlineDocumentSearch
} from "react-icons/hi";

import {
  FaChalkboardTeacher,
  FaBan,
  FaCogs
} from "react-icons/fa";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";


const Dashboard = () => {
  const [operationalData, setOperationalData] = useState([]);
  const [liveLgus, setLiveLgus] = useState([]);
  const [stats, setStats] = useState({ live: 0, uat: 0, training: 0, inactive: 0, ownSystem: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchOperationalData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/operational/live');

        console.log(response.data);

        setLiveLgus(response.data);

      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOperationalData();
  }, []);


  const getColor = (status) => {
    switch (status) {
      case 'LIVE': return '#22c55e';
      case 'UAT': return '#eab308';
      case 'Training': return '#f97316';
      case 'Inactive': return '#ef4444';
      case '3rd Party': return '#3b82f6';
      default: return '#6b7280';
    }
  };


  if (loading) {
    return (
      <div className='flex min-h-screen bg-[#050816] text-white items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          <div className='text-2xl'>Loading...</div>
        </div>
      </div>
    );
  }

  return (

    <div className='flex min-h-screen overflow-x-hidden bg-[#050816] text-white'>

      {/* SIDEBAR */}
      <div className='hidden lg:block lg:w-[250px] lg:shrink-0'>

        <div className='fixed top-0 left-0 h-screen w-[250px] z-50'>
          <Navbar />
        </div>

      </div>

      {/* MAIN */}
      <div className='flex flex-col w-full p-4 sm:p-6'>

        {/* HEADER */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>

          <div>

            <h1 className='tracking-wide font-semibold text-2xl'>
              DigiGOV Dashboard
            </h1>

            <span className='text-sm text-gray-400'>
              Region V - Bicol Region
            </span>

          </div>

          {/* SEARCH */}
          <div className='relative w-full md:w-auto'>

            <IoSearch className='absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 text-lg' />

            <input
              type="text"
              placeholder="Search LGU..."
              className='bg-[#091121] border border-[#1d2942] pl-10 py-3 rounded-xl outline-none w-full md:w-80 text-sm focus:border-blue-500 transition'
            />

          </div>

        </div>

        {/* CARDS */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 py-6'>

          {/* LIVE */}
          <div className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-[#071b12] to-[#041018] p-5 shadow-[0_0_25px_rgba(0,255,128,0.08)]'>

            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.15),transparent_45%)]'></div>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]'>
                <TbRadar2 className='text-4xl text-green-400' />
              </div>

              <div>

                <h1 className='text-green-300 text-xs font-medium'>
                  LIVE eLGUs
                </h1>

                <h2 className='text-5xl font-bold text-green-400 leading-none mt-1'>
                  {stats.live}
                </h2>

                <p className='text-green-400 text-sm mt-2'>
                  +12%
                  <span className='text-gray-400 ml-1'>
                    vs last month
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* UAT */}
          <div className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-[#1a1405] to-[#100b03] p-5 shadow-[0_0_25px_rgba(255,196,0,0.08)]'>

            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.15),transparent_45%)]'></div>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]'>
                <HiOutlineDocumentSearch className='text-4xl text-yellow-400' />
              </div>

              <div>

                <h1 className='text-yellow-300 text-sm font-medium'>
                  UAT eLGUs
                </h1>

                <h2 className='text-5xl font-bold text-yellow-400 leading-none mt-1'>
                  {stats.uat}
                </h2>

                <p className='text-green-400 text-sm mt-2'>
                  +3%
                  <span className='text-gray-400 ml-1'>
                    vs last month
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* TRAINING */}
          <div className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-[#1b1007] to-[#120803] p-5 shadow-[0_0_25px_rgba(255,115,0,0.08)]'>

            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_45%)]'></div>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]'>
                <FaChalkboardTeacher className='text-4xl text-orange-400' />
              </div>

              <div>

                <h1 className='text-orange-300 text-sm font-medium'>
                  Admin Training
                </h1>

                <h2 className='text-5xl font-bold text-orange-400 leading-none mt-1'>
                  {stats.training}
                </h2>

                <p className='text-green-400 text-sm mt-2'>
                  +6%
                  <span className='text-gray-400 ml-1'>
                    vs last month
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* INACTIVE */}
          <div className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-[#1a0707] to-[#100303] p-5 shadow-[0_0_25px_rgba(255,0,0,0.08)]'>

            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.15),transparent_45%)]'></div>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]'>
                <FaBan className='text-4xl text-red-400' />
              </div>

              <div>

                <h1 className='text-red-300 text-sm font-medium'>
                  Inactive / No eLGU
                </h1>

                <h2 className='text-5xl font-bold text-red-400 leading-none mt-1'>
                  {stats.inactive}
                </h2>

                <p className='text-red-400 text-sm mt-2'>
                  -2%
                  <span className='text-gray-400 ml-1'>
                    vs last month
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* 3RD PARTY */}
          <div className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#07101f] to-[#040916] p-5 shadow-[0_0_25px_rgba(59,130,246,0.08)]'>

            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_45%)]'></div>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
                <FaCogs className='text-4xl text-blue-400' />
              </div>

              <div>

                <h1 className='text-blue-300 text-sm font-medium'>
                  With OWN / 3rd Party
                </h1>

                <h2 className='text-5xl font-bold text-blue-400 leading-none mt-1'>
                  {stats.thirdParty}
                </h2>

                <p className='text-green-400 text-sm mt-2'>
                  +5%
                  <span className='text-gray-400 ml-1'>
                    vs last month
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* EXPORT */}
          <div className='rounded-2xl hover:scale-105 transition-all duration-300 p-5 flex flex-col justify-between'>

            <div>

              <p className='text-gray-500 text-sm'>
                Last Updated:
              </p>

              <h2 className='text-white text-md font-medium mt-1 leading-relaxed'>
                May 13, 2026 04:23 PM
              </h2>

            </div>

            <button className='mt-5 border border-blue-500/30 hover:bg-blue-500/10 transition rounded-xl py-3 flex items-center justify-center gap-2 text-blue-300 font-medium'>

              <HiOutlineDownload className='text-lg' />

              Export Report

            </button>

          </div>

        </div>

        {/* DASHBOARD GRID */}
        <div className='grid grid-cols-1 xl:grid-cols-4 gap-5'>

          {/* MAP */}
          <div className='border border-[#1d2942] bg-[#091121] min-h-[400px] xl:col-span-2 p-5 rounded-2xl overflow-hidden'>

            {/* MAP HEADER */}
            <div className='flex items-center justify-between mb-5'>

              <h1 className='font-semibold text-lg'>
                eLGU Overview
              </h1>

            </div>

            <div className="w-full h-[350px] rounded-xl overflow-hidden border border-[#1d2942]">

              <MapContainer
                center={[13.3, 123.5]}
                zoom={9}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                

                <TileLayer
                  //attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {liveLgus.map((lgu, i) => (
                  <CircleMarker
                    key={i}
                    center={[lgu.coordinates[1], lgu.coordinates[0]]}
                    radius={8}
                    pathOptions={{
                      color: getColor(lgu.status),
                      fillColor: getColor(lgu.status),
                      fillOpacity: 0.8,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div>
                        <h3>{lgu.name}</h3>
                        <p>Status: {lgu.status}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

              </MapContainer>

            </div>

          </div>

          {/* MIDDLE */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5'>

            <div className='border border-[#1d2942] bg-[#091121] min-h-[220px] p-5 rounded-2xl'>
              Analytics Widget
            </div>

            <div className='border border-[#1d2942] bg-[#091121] min-h-[220px] p-5 rounded-2xl'>
              LGU Statistics
            </div>

          </div>

          {/* RIGHT */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5'>

            <div className='border border-[#1d2942] bg-[#091121] min-h-[220px] p-5 rounded-2xl'>
              Heatmap
            </div>

            <div className='border border-[#1d2942] bg-[#091121] min-h-[220px] p-5 rounded-2xl'>
              Activity Logs
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard