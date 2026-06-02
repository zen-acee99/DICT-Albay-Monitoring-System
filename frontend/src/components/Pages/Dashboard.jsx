import React, { useState, useEffect, useMemo } from 'react'

import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";


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

import {
  MapContainer,
  TileLayer,
  CircleMarker
} from "react-leaflet";

import DashboardCard from '../Card/DashboardCard';
import EGovPH from '../Card/EGovPH';
import EgovPromotional from '../Card/EgovPromotional';

const Dashboard = () => {

  const [liveLgus, setLiveLgus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLGU, setSelectedLGU] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState([]);
  const [statShow, setStatShow] = useState(null);

  // const API_URL = 'http://localhost:3001';
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const [stats, setStats] = useState({
    live: 0,
    uat: 0,
    training: 0,
    inactive: 0,
    thirdParty: 0,
    total: 0
  });

  useEffect(() => {

    const fetchOperationalData = async () => {

      try {

        const response = await axios.get(`${VITE_API_URL}/operational`);

        const data = response.data;

        const normalized = data.map(item => ({
          ...item,
          status: item.status?.trim().toUpperCase(),
        }));

        setLiveLgus(normalized);

        console.log(
          normalized.map(item => ({
            name: item.name,
            status: item.status
          }))
        );

        const uniqueMap = new Map();

        // data.forEach(item => {
        //   uniqueMap.set(item.name, item);
        // });

        normalized.forEach(item => {
          uniqueMap.set(item.name, item);
        });

        const uniqueData = Array.from(uniqueMap.values());

        const live = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'LIVE'
        ).length;

        const uat = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'UAT'
        ).length;

        const training = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'Training'
        ).length;

        const inactive = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'NO SYSTEM'
        ).length;

        const thirdParty = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'OWN SYSTEM'
        ).length;

        setStats({
          live,
          uat,
          training,
          inactive,
          thirdParty,
          total: uniqueData.length
        });

      } catch (err) {

        console.error("Fetch Error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchOperationalData();

    const interval = setInterval(() => {
      fetchOperationalData();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const getColor = (status) => {
    switch (status) {
      case 'LIVE':
        return '#22c55e';

      case 'UAT':
        return '#eab308';

      case 'TRAINING':
        return '#f97316';

      case 'NO SYSTEM':
        return '#ef4444';

      case 'OWN SYSTEM':
        return '#3b82f6';

      default:
        return '#6b7280';
    }
  };

  const fetchAdditionalInfo = async (location) => {

    console.log("Sending location:", location);
  try {

    const response = await axios.get(
      `${VITE_API_URL}/additionaldescription/location/${encodeURIComponent(location)}`
      
    );

    setAdditionalInfo(response.data || []);

  } catch (error) {
console.log(response.data);
    console.error("Additional Info Error:", error);

    setAdditionalInfo([]);
  }
  

};

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: "LGU Name",
      cell: (info) => (
        <span className="text-white">{info.getValue()}</span>
      ),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const val = info.getValue();

        const color =
          val === "LIVE"
            ? "text-green-400"
            : val === "UAT"
            ? "text-yellow-400"
            : val === "Training"
            ? "text-orange-400"
            : val === "NO SYSTEM"
            ? "text-red-400"
            : "text-blue-400";

        return <span className={color}>{val}</span>;
      },
    }),
  ];

  const filteredData = useMemo(() => {
  if (!statShow) return liveLgus;

  // 1. Get the target status from config
  const targetStatus = statusConfig[statShow]?.status;
  
  if (!targetStatus) return liveLgus;

  // 2. Filter by comparing Uppercase + Trimmed values
  return liveLgus.filter(item => {
    const itemStatus = item.status?.trim().toUpperCase();
    const compareStatus = targetStatus.trim().toUpperCase();
    return itemStatus === compareStatus;
  });

}, [statShow, liveLgus]);

  const table = useReactTable({
    data: filteredData, // IMPORTANT: Pass filtered data here
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // const table = useReactTable({
  //   data: liveLgus,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  // });


  // const table = useReactTable({
  //   data: filteredData,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  // });

  const statusConfig = {
    live: { title: "LIVE eLGUs", color: "text-green-400", status: "LIVE" },
    uat: { title: "UAT eLGUs", color: "text-yellow-400", status: "UAT" },
    training: { title: "Admin Training", color: "text-orange-400", status: "TRAINING" }, // FIX: "TRAINING"
    inactive: { title: "Inactive / No eLGU", color: "text-red-400", status: "NO SYSTEM" },
    thirdParty: { title: "OWN / 3rd Party", color: "text-blue-400", status: "OWN SYSTEM" },
  };

  const current = statusConfig[statShow];


  if (loading) {

    return (

      <div className='flex min-h-screen bg-[#050816] text-white items-center justify-center'>

        <div className='flex flex-col items-center gap-4'>

          <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>

          <div className='text-2xl'>
            Loading...
          </div>

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
          {/* <div className='relative w-full md:w-auto'>

            <IoSearch className='absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 text-lg' />

            <input
              type="text"
              placeholder="Search LGU..."
              className='bg-[#091121] border border-[#1d2942] pl-10 py-3 rounded-xl outline-none w-full md:w-80 text-sm focus:border-blue-500 transition'
            />

          </div> */}

        </div>

        {/* CARDS */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 py-6'>

          {/* LIVE */}
          <button 
            onClick={() => setStatShow("live")}
            className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-[#071b12] to-[#041018] p-5 shadow-[0_0_25px_rgba(0,255,128,0.08)]'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center'>
                <TbRadar2 className='text-4xl text-green-400' />
              </div>

              <div>

                <h1 className='text-green-300 text-xs font-medium'>
                  LIVE <br /> eLGUs
                </h1>

                <h2 className='text-5xl font-bold text-green-400 leading-none mt-1'>
                  {stats.live}
                </h2>

              </div>

            </div>

          </button>

          {/* UAT */}
          <button 
            onClick={() => setStatShow("uat")}
            className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-[#1a1405] to-[#100b03] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center'>
                <HiOutlineDocumentSearch className='text-4xl text-yellow-400' />
              </div>

              <div>

                <h1 className='text-yellow-300 text-sm font-medium'>
                  UAT eLGUs
                </h1>

                <h2 className='text-5xl font-bold text-yellow-400 leading-none mt-1'>
                  {stats.uat}
                </h2>

              </div>

            </div>

          </button>

          {/* TRAINING */}
          <button 
            onClick={() => setStatShow("training")}
            className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-[#1b1007] to-[#120803] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center'>
                <FaChalkboardTeacher className='text-4xl text-orange-400' />
              </div>

              <div>

                <h1 className='text-orange-300 text-sm font-medium'>
                  Admin Training
                </h1>

                <h2 className='text-5xl font-bold text-orange-400 leading-none mt-1'>
                  {stats.training}
                </h2>

              </div>

            </div>

          </button>

          {/* INACTIVE */}
          <button 
            onClick={() => setStatShow("inactive")}
            className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-[#1a0707] to-[#100303] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center'>
                <FaBan className='text-4xl text-red-400' />
              </div>

              <div>

                <h1 className='text-red-300 text-sm font-medium'>
                  Inactive / No eLGU
                </h1>

                <h2 className='text-5xl font-bold text-red-400 leading-none mt-1'>
                  {stats.inactive}
                </h2>

              </div>

            </div>

          </button>

          {/* THIRD PARTY */}
          <button 
            onClick={() => setStatShow("thirdParty")}
            className='relative hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#07101f] to-[#040916] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center'>
                <FaCogs className='text-4xl text-blue-400' />
              </div>

              <div>

                <h1 className='text-blue-300 text-sm font-medium'>
                  OWN / 3rd Party
                </h1>

                <h2 className='text-5xl font-bold text-blue-400 leading-none mt-1'>
                  {stats.thirdParty}
                </h2>

              </div>

            </div>

          </button>

          {/* EXPORT */}
          <div className='rounded-2xl p-5 flex flex-col justify-between'>

            <div>

              <p className='text-gray-500 text-sm'>
                Last Updated
              </p>

              <h2 className='text-white text-md font-medium mt-1'>
                May 25, 2026
              </h2>

            </div>

            <button className='mt-5 border border-blue-500/30 hover:bg-blue-500/10 transition rounded-xl py-3 flex items-center justify-center gap-2 text-blue-300 font-medium'>

              <HiOutlineDownload className='text-lg' />

              Export Report

            </button>

          </div>

        </div>

        {/* modal for stat start */}

        {statShow && (
          <div
            className="fixed inset-0 p-4 bg-black/10 flex items-center justify-center z-[9999]"
            onClick={() => setStatShow(false)}
          >
            <div
              className="bg-gray-900 p-6 rounded-xl w-[600px] max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setStatShow(false)}
                className="float-right text-white"
              >
                ✕
              </button>

              {/* <h2 className={`${current.color} text-2xl font-bold`}>
                {current.title}
              </h2> */}
              <h2>ACE POGI</h2>
              {/* <p className="text-white">
                Rows: {filteredData.length}
              </p> */}
              <p>TEST 123</p>

              <div className="max-h-[400px] overflow-y-auto rounded-lg">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-900 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="text-left py-3 px-4 text-slate-400 border-b border-white/10"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b border-white/10">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-3 px-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* modal for stat end */}

        {/* DASHBOARD GRID */}
        <div className='grid grid-cols-1 xl:grid-cols-4 gap-5'>

          {/* MAP */}
          <div className='border border-[#1d2942] bg-[#091121] min-h-[400px] xl:col-span-2 p-5 rounded-2xl overflow-hidden'>

            <div className='flex items-center justify-between mb-5'>

              <h1 className='font-semibold text-lg'>
                eLGU Overview
              </h1>

            </div>

            <div className="w-full h-[700px] rounded-xl overflow-hidden border border-[#1d2942]">

              <MapContainer
                center={[13.3, 123.5]}
                zoom={9}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >

                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {liveLgus.map((lgu, i) => (

                  <CircleMarker
                    key={i}
                    center={[
                      lgu.coordinates[1],
                      lgu.coordinates[0]
                    ]}
                    radius={
                      selectedLGU?.name === lgu.name
                        ? 14
                        : 8
                    }
                    pathOptions={{
                      color: getColor(lgu.status),
                      fillColor: getColor(lgu.status),
                      fillOpacity: 0.8,
                      weight: 2
                    }}
                    //
                    eventHandlers={{
                      click: async () => {

                        setSelectedLGU(lgu);

                        await fetchAdditionalInfo(lgu.name);

                        setShowMapModal(true);

                      }
                    }}
                  />

                ))}

              </MapContainer>

            </div>

          </div>

          {/* CARDS */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5'>

            <DashboardCard />

            <EgovPromotional />

          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5'>

            <EGovPH />

          </div>

        </div>

      </div>

      {/* FULLSCREEN MAP MODAL */}
      {showMapModal && selectedLGU && (

        <div className='fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex'>

          {/* LEFT SIDE */}
          <div className='flex-1 relative'>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowMapModal(false)}
              className='absolute top-5 right-5 z-[99999] bg-red-500 hover:bg-red-600 transition w-12 h-12 rounded-full text-white text-2xl'
            >
              ✕
            </button>

            {/* FULLSCREEN MAP */}
            <MapContainer
              center={[
                selectedLGU.coordinates[1],
                selectedLGU.coordinates[0]
              ]}
              zoom={12}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >

              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {liveLgus.map((lgu, i) => (

                <CircleMarker
                  className='animate-pulse'
                  key={i}
                  center={[
                    lgu.coordinates[1],
                    lgu.coordinates[0]
                  ]}
                  radius={
                    selectedLGU.name === lgu.name
                      ? 15
                      : 9
                  }
                  pathOptions={{
                    color: getColor(lgu.status),
                    fillColor: getColor(lgu.status),
                    fillOpacity: 0.9,
                    weight: 3
                  }}
                  eventHandlers={{
                    click: async () => {

                      setSelectedLGU(lgu);

                      await fetchAdditionalInfo(lgu.name);

                    }
                  }}
                />

              ))}

            </MapContainer>

          </div>

          {/* RIGHT PANEL */}
          <div className='w-[420px] bg-[#091121] border-l border-[#1d2942] p-6 overflow-y-auto'>

            {/* TITLE */}
            <div className='mb-6'>

              <h1 className='text-3xl font-bold text-white'>
                {selectedLGU.name}
              </h1>

              <p className='text-gray-400 mt-2'>
                LGU Information Details
              </p>

            </div>

            {/* STATUS CARD */}
            <div className='bg-[#111827] rounded-2xl border border-[#1d2942] p-5 mb-5'>

              <p className='text-gray-400 text-sm mb-3'>
                Current Status
              </p>

              <div
                className='inline-flex px-5 py-2 rounded-xl text-white font-semibold'
                style={{
                  backgroundColor: getColor(selectedLGU.status)
                }}
              >
                {selectedLGU.status}
              </div>

            </div>

            {/* LGU DETAILS */}
            <div className='bg-[#111827] rounded-2xl border border-[#1d2942] p-5 mb-5'>

              <h2 className='text-xl font-semibold mb-5'>
                Municipality Details
              </h2>

              <div className='space-y-3 text-sm'>

                <div>
                  <p className='text-gray-400'>
                    Municipality
                  </p>

                  <p className='text-white text-lg'>
                    {selectedLGU.name}
                  </p>
                </div>

                <div>
                  <p className='text-gray-400'>
                    eLGU Version
                  </p>

                  <p className='text-white'>
                    {selectedLGU.version || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className='text-gray-400'>
                    Region
                  </p>

                  <p className='text-white'>
                    Region V - Bicol Region
                  </p>
                </div>

                <div>
                  <p className='text-gray-400'>
                    Province
                  </p>

                  <p className='text-white'>
                    {selectedLGU.name.split(',')[1]?.trim() || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className='text-gray-400'>
                    Coordinates
                  </p>

                  <p className='text-white'>
                    {selectedLGU.coordinates[1]},
                    {" "}
                    {selectedLGU.coordinates[0]}
                  </p>
                </div>

              </div>

            </div>
            
            {/* EXTRA CARD */}
            <div className='bg-[#111827] rounded-2xl border border-[#1d2942] p-5'>

              <h2 className='text-xl font-semibold mb-5'>
                Avail of Other LGU Services
              </h2>

              {/* <div className='space-y-4 text-sm'>

                <div className='flex justify-between'>
                  <span className='text-gray-400'>
                    Transactions
                  </span>

                  <span className='text-white'>
                    5,281
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-400'>
                    Online Services
                  </span>

                  <span className='text-white'>
                    12 Services
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-400'>
                    Registered Offices
                  </span>

                  <span className='text-white'>
                    8 Offices
                  </span>
                </div>

              </div> */}
              {additionalInfo.length > 0 ? (

                <div className='space-y-4'>

                  {additionalInfo.map((item, index) => (

                    <div
                      key={index}
                      className='bg-[#0f172a] border border-[#1d2942] rounded-xl p-4'
                    >

                      <div className='mb-4'>

                        <p className='text-xs text-gray-400 mb-1'>
                          Agency Name
                        </p>

                        <p className='text-white font-medium'>
                          {item.AgencyName}
                        </p>

                      </div>

                      <div>

                        <p className='text-xs text-gray-400 mb-2'>
                          Available Services
                        </p>

                        <div className='flex grid-cols-1 gap-2'>

                            <span
                              className='w-auto px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium'
                            >
                              {item.services}
                            </span>
                            <span
                              className='w-auto px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium'
                            >
                              {item.eventName}
                            </span>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className='text-center py-8'>

                  <p className='text-gray-500'>
                    No additional information available
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>

  )

}

export default Dashboard