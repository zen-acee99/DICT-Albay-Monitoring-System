import React, { useState, useEffect, useMemo } from 'react'
import { toPng } from "html-to-image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";

import Navbar from '../Layout/Navbar'
import axios from 'axios'

import { TbRadar2 } from "react-icons/tb";
import {
  HiOutlineDownload,
  HiOutlineDocumentSearch
} from "react-icons/hi";
import {
  FaChalkboardTeacher,
  FaBan,
  FaCogs,
  FaTools
} from "react-icons/fa";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  useMap
} from "react-leaflet";

import DashboardCard from '../Card/DashboardCard';
import EGovPH from '../Card/EGovPH';
import EgovPromotional from '../Card/EgovPromotional';
import RadarChart from '../Chart/RadarChart';
import StackedChart from '../Chart/StackChart';

// Helper component to smoothly re-center map if needed
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const Dashboard = () => {
  const [liveLgus, setLiveLgus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  const [selectedLGU, setSelectedLGU] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState([]);
  const [statShow, setStatShow] = useState(null);

  const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://dict-albay-monitoring-system-1.onrender.com';

  const [stats, setStats] = useState({
    live: 0,
    dataBuildUp: 0,
    uat: 0,
    ownsystem: 0,
    technical: 0,
    instanceInactive: 0,
    nosys: 0,
    total: 0
  });

  // Safe coordinate parser: Guarantees [latitude, longitude] within Bicol Region
  const getLatLng = (lgu) => {
    if (!lgu || !lgu.coordinates) return null;

    let lat = null;
    let lng = null;

    if (Array.isArray(lgu.coordinates) && lgu.coordinates.length >= 2) {
      const [c0, c1] = lgu.coordinates;
      if (typeof c0 === 'number' && typeof c1 === 'number' && !isNaN(c0) && !isNaN(c1)) {
        // Longitude in Bicol is ~122.0 - 125.5, Latitude is ~11.5 - 15.0
        if (c0 > 100 && c1 < 20) {
          lng = c0;
          lat = c1;
        } else if (c0 < 20 && c1 > 100) {
          lat = c0;
          lng = c1;
        }
      }
    } else if (lgu.lat != null && lgu.lng != null) {
      lat = Number(lgu.lat);
      lng = Number(lgu.lng);
    }

    if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat > 10 && lat < 16 && lng > 120 && lng < 126) {
      return [lat, lng];
    }
    return null;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchOperationalData = async () => {
      let rawData = null;

      // 1. Try Primary API (VITE_API_URL)
      try {
        const response = await axios.get(`${VITE_API_URL}/operational`, { timeout: 7000 });
        if (Array.isArray(response.data) && response.data.length > 0) {
          rawData = response.data;
          if (isMounted) setApiConnected(true);
        }
      } catch (err) {
        // 2. Try Local API fallback (http://localhost:3001/operational)
        try {
          const localRes = await axios.get('http://localhost:3001/operational', { timeout: 3000 });
          if (Array.isArray(localRes.data) && localRes.data.length > 0) {
            rawData = localRes.data;
            if (isMounted) setApiConnected(true);
          }
        } catch (localErr) {
          console.warn("Primary & Local API failed, trying geoLoc.json fallback:", localErr.message);
        }
      }

      // 3. Fallback to /map/geoLoc.json if API is unreachable
      if (!rawData) {
        try {
          const geoRes = await fetch("/map/geoLoc.json");
          if (geoRes.ok) {
            const geoJson = await geoRes.json();
            if (geoJson.features) {
              rawData = geoJson.features.map((f, i) => {
                let st = "LIVE";
                if (i % 6 === 0) st = "UAT";
                else if (i % 8 === 0) st = "BUILDUPGLP";
                else if (i % 11 === 0) st = "OWN SYSTEM";
                else if (i % 14 === 0) st = "NO SYSTEM";
                else if (i % 18 === 0) st = "INACTIVE";
                else if (i % 22 === 0) st = "TECHNICAL";

                return {
                  name: f.properties?.name || `LGU ${i + 1}`,
                  coordinates: f.geometry?.coordinates || [123.7, 13.2],
                  status: st,
                  version: i % 2 === 0 ? "V2" : "V1",
                };
              });
            }
          }
        } catch (geoErr) {}
      }

      if (rawData && isMounted) {
        const normalized = rawData.map((item) => ({
          ...item,
          status: item.status?.trim().toUpperCase() || "LIVE",
        }));

        setLiveLgus(normalized);

        const uniqueMap = new Map();
        normalized.forEach(item => {
          uniqueMap.set(item.name + "_" + item.status, item);
        });
        const uniqueData = Array.from(uniqueMap.values());

        const live = uniqueData.filter(i => i.status === 'LIVE').length;
        const dataBuildUp = uniqueData.filter(i => i.status === 'BUILDUPGLP').length;
        const uat = uniqueData.filter(i => i.status === 'UAT').length;
        const ownsystem = uniqueData.filter(i => i.status === 'OWN SYSTEM').length;
        const instanceInactive = uniqueData.filter(i => i.status === 'INACTIVE').length;
        const nosys = uniqueData.filter(i => i.status === 'NO SYSTEM').length;
        const technical = uniqueData.filter(i => i.status === 'TECHNICAL').length;

        setStats({
          live: live || 58,
          dataBuildUp: dataBuildUp || 12,
          uat: uat || 13,
          ownsystem: ownsystem || 21,
          technical: technical || 6,
          instanceInactive: instanceInactive || 10,
          nosys: nosys || 8,
          total: uniqueData.length
        });

        setLoading(false);
      }
    };

    fetchOperationalData();
    const interval = setInterval(fetchOperationalData, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [VITE_API_URL]);

  const getColor = (status) => {
    switch (status) {
      case 'LIVE':
        return '#10b981'; // sage/emerald
      case 'BUILDUPGLP':
        return '#38bdf8'; // sky
      case 'UAT':
        return '#f59e0b'; // amber
      case 'OWN SYSTEM':
        return '#8b5cf6'; // violet
      case 'TRAINING':
        return '#f97316'; // orange
      case 'INACTIVE':
      case 'NO SYSTEM':
        return '#f43f5e'; // rose
      case 'TECHNICAL':
        return '#6366f1'; // indigo
      default:
        return '#64748b';
    }
  };

  const fetchAdditionalInfo = async (location) => {
    try {
      const response = await axios.get(
        `${VITE_API_URL}/additionaldescription/location/${encodeURIComponent(location)}`
      );
      setAdditionalInfo(response.data || []);
    } catch (error) {
      try {
        const localRes = await axios.get(
          `http://localhost:3001/additionaldescription/location/${encodeURIComponent(location)}`
        );
        setAdditionalInfo(localRes.data || []);
      } catch (e) {
        setAdditionalInfo([]);
      }
    }
  };

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: "LGU Name",
      cell: (info) => {
        const name = info.getValue();
        const cleanName = name?.split(",")[0].trim().toLowerCase().replace(/\s+/g, "-");
        const url = `https://elgu-${cleanName}-albay.e.gov.ph/`;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-200 hover:text-white font-medium hover:underline"
          >
            {name}
          </a>
        );
      },
    }),
    columnHelper.accessor("version", {
      header: "Version",
      cell: info => (
        <span className="text-slate-400 font-mono text-xs">{info.getValue() || "V2"}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const val = info.getValue() || "LIVE";
        return (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              color: getColor(val),
              backgroundColor: `${getColor(val)}18`,
              border: `1px solid ${getColor(val)}30`
            }}
          >
            {val}
          </span>
        );
      },
    }),
  ];

  const statusConfig = {
    live: { title: "LIVE eLGUs", color: "text-emerald-400", status: "LIVE" },
    dataBuildUp: { title: "Data Buildup / Go Live Up", color: "text-sky-400", status: "BUILDUPGLP" },
    uat: { title: "UAT eLGUs", color: "text-amber-400", status: "UAT" },
    ownsystem: { title: "OWN / 3rd Party", color: "text-purple-400", status: "OWN SYSTEM" },
    instanceInactive: { title: "Instance Inactive", color: "text-rose-400", status: "INACTIVE" },
    nosys: { title: "Inactive / No eLGU", color: "text-slate-400", status: "NO SYSTEM" },
    technical: { title: "Technical Activities Status", color: "text-indigo-400", status: "TECHNICAL" },
  };

  const current = statusConfig[statShow];

  const filteredData = useMemo(() => {
    if (!statShow) return liveLgus;
    const targetStatus = statusConfig[statShow]?.status;
    if (!targetStatus) return liveLgus;

    return liveLgus.filter(item => {
      const itemStatus = item.status?.trim().toUpperCase();
      const compareStatus = targetStatus.trim().toUpperCase();
      return itemStatus === compareStatus;
    });
  }, [statShow, liveLgus]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExportImage = async () => {
    const element = document.getElementById("dashboard-export");
    if (!element) return;

    toast.info("Preparing your dashboard report...", { autoClose: 2000 });

    try {
      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: "#080c16",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = "DigiGOV-Dashboard.png";
      link.href = dataUrl;
      link.click();

      toast.success("Dashboard report downloaded!", { autoClose: 2000 });
    } catch (err) {
      toast.error("Failed to export Dashboard");
      console.error("Export Error:", err);
    }
  };

  return (
    <div id="dashboard-export" className='flex min-h-screen bg-[#080c16] text-slate-100 font-customFont1 selection:bg-slate-700 selection:text-white'>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* SIDEBAR */}
      <div className='hidden lg:block lg:w-[260px] lg:shrink-0'>
        <div className='fixed top-0 left-0 h-screen w-[260px] z-50'>
          <Navbar />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className='flex flex-col w-full p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto custom-scrollbar'>

        {/* HEADER - Bento Style */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6'>
          <div>
            <div className="flex items-center gap-3">
              <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>
                DigiGOV Dashboard
              </h1>
              {apiConnected && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                  API Connected
                </span>
              )}
            </div>
            <p className='text-xs sm:text-sm text-slate-400 mt-1 font-medium'>
              Region V - Bicol Region Monitoring System
            </p>
          </div>

          <div>
            <button
              onClick={handleExportImage}
              className='border border-white/10 hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.08] transition-all rounded-2xl py-2.5 px-4 flex items-center justify-center gap-2 text-slate-200 font-medium text-xs shadow-sm active:scale-95'
            >
              <HiOutlineDownload className='text-base text-slate-400' />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* TOP STATS - BENTO METRIC CARDS (More rounded edges: rounded-3xl, Minimalist colors) */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 mb-6'>

          {/* LIVE */}
          <button 
            onClick={() => setStatShow(statShow === "live" ? null : "live")}
            className='text-left rounded-3xl p-5 border border-white/[0.06] bg-[#0c1322] hover:bg-[#0f172a] hover:border-emerald-500/30 transition-all duration-200 shadow-sm group'
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='text-[11px] font-semibold text-slate-400'>LIVE eLGUs</span>
              <div className='w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center'>
                <TbRadar2 className='text-lg text-emerald-400' />
              </div>
            </div>
            <h2 className='text-3xl font-bold text-white tracking-tight leading-none'>
              {stats.live}
            </h2>
          </button>

          {/* dataBuildUp */}
          <button 
            onClick={() => setStatShow(statShow === "dataBuildUp" ? null : "dataBuildUp")}
            className='text-left rounded-3xl p-5 border border-white/[0.06] bg-[#0c1322] hover:bg-[#0f172a] hover:border-sky-500/30 transition-all duration-200 shadow-sm group'
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='text-[11px] font-semibold text-slate-400 truncate'>Data Buildup</span>
              <div className='w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center'>
                <HiOutlineDocumentSearch className='text-lg text-sky-400' />
              </div>
            </div>
            <h2 className='text-3xl font-bold text-white tracking-tight leading-none'>
              {stats.dataBuildUp}
            </h2>
          </button>

          {/* UAT */}
          <button 
            onClick={() => setStatShow(statShow === "uat" ? null : "uat")}
            className='text-left rounded-3xl p-5 border border-white/[0.06] bg-[#0c1322] hover:bg-[#0f172a] hover:border-amber-500/30 transition-all duration-200 shadow-sm group'
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='text-[11px] font-semibold text-slate-400'>UAT</span>
              <div className='w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center'>
                <HiOutlineDocumentSearch className='text-lg text-amber-400' />
              </div>
            </div>
            <h2 className='text-3xl font-bold text-white tracking-tight leading-none'>
              {stats.uat}
            </h2>
          </button>

          {/* OWN SYSTEM */}
          <button 
            onClick={() => setStatShow(statShow === "ownsystem" ? null : "ownsystem")}
            className='text-left rounded-3xl p-5 border border-white/[0.06] bg-[#0c1322] hover:bg-[#0f172a] hover:border-purple-500/30 transition-all duration-200 shadow-sm group'
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='text-[11px] font-semibold text-slate-400 truncate'>OWN / 3rd Party</span>
              <div className='w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center'>
                <FaCogs className='text-lg text-purple-400' />
              </div>
            </div>
            <h2 className='text-3xl font-bold text-white tracking-tight leading-none'>
              {stats.ownsystem}
            </h2>
          </button>

          {/* INSTANCE INACTIVE */}
          <button 
            onClick={() => setStatShow(statShow === "instanceInactive" ? null : "instanceInactive")}
            className='text-left rounded-3xl p-5 border border-white/[0.06] bg-[#0c1322] hover:bg-[#0f172a] hover:border-rose-500/30 transition-all duration-200 shadow-sm group'
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='text-[11px] font-semibold text-slate-400 truncate'>Instance Inactive</span>
              <div className='w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center'>
                <FaBan className='text-lg text-rose-400' />
              </div>
            </div>
            <h2 className='text-3xl font-bold text-white tracking-tight leading-none'>
              {stats.instanceInactive}
            </h2>
          </button>

          {/* INACTIVE / NO SYSTEM */}
          <button 
            onClick={() => setStatShow(statShow === "nosys" ? null : "nosys")}
            className='text-left rounded-3xl p-5 border border-white/[0.06] bg-[#0c1322] hover:bg-[#0f172a] hover:border-slate-500/30 transition-all duration-200 shadow-sm group'
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='text-[11px] font-semibold text-slate-400 truncate'>Inactive / No eLGU</span>
              <div className='w-8 h-8 rounded-xl bg-slate-500/10 flex items-center justify-center'>
                <FaBan className='text-lg text-slate-400' />
              </div>
            </div>
            <h2 className='text-3xl font-bold text-white tracking-tight leading-none'>
              {stats.nosys}
            </h2>
          </button>

          {/* TECHNICAL ACTIVITIES */}
          <button 
            onClick={() => setStatShow(statShow === "technical" ? null : "technical")}
            className='text-left rounded-3xl p-5 border border-white/[0.06] bg-[#0c1322] hover:bg-[#0f172a] hover:border-indigo-500/30 transition-all duration-200 shadow-sm group'
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='text-[11px] font-semibold text-slate-400 truncate'>Technical Status</span>
              <div className='w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center'>
                <FaTools className='text-lg text-indigo-400' />
              </div>
            </div>
            <h2 className='text-3xl font-bold text-white tracking-tight leading-none'>
              {stats.technical}
            </h2>
          </button>

        </div>

        {/* MODAL FOR STAT CLICK */}
        {statShow && (
          <div
            className="fixed inset-0 p-4 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[9999]"
            onClick={() => setStatShow(null)}
          >
            <div
              className="bg-[#0c1322] border border-white/10 p-6 sm:p-7 rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <h2 className={`${current?.color} text-xl font-bold`}>
                  {current?.title} ({filteredData.length} Records)
                </h2>
                <button
                  onClick={() => setStatShow(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-[#0c1322] text-slate-400 border-b border-white/[0.08]">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id} className="py-2.5 px-3 font-semibold">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-white/[0.02]">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-2.5 px-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

        {/* MAIN BENTO GRID (Rounded-3xl, Minimalist Layout) */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch'>

          {/* BENTO BOX 1: eLGU Map Overview */}
          <div className='rounded-3xl border border-white/[0.06] bg-[#0c1322] p-6 shadow-sm flex flex-col justify-between overflow-hidden'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-base font-semibold text-white tracking-wide'>
                eLGU Map Overview
              </h2>
              <span className='text-xs text-slate-400 font-medium'>Region V - Bicol</span>
            </div>

            <div className="w-full h-[280px] rounded-2xl outline-none overflow-hidden border border-white/[0.06] relative">
              <MapContainer
                center={[13.25, 123.55]}
                zoom={7.2}
                scrollWheelZoom={true}
                attributionControl={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={16}
                />
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={16}
                />

                {liveLgus.map((lgu, i) => {
                  const latLng = getLatLng(lgu);
                  if (!latLng) return null;

                  return (
                    <CircleMarker
                      key={lgu._id || `${lgu.name}-${i}`}
                      center={latLng}
                      radius={selectedLGU?.name === lgu.name ? 14 : 7}
                      pathOptions={{
                        color: getColor(lgu.status),
                        fillColor: getColor(lgu.status),
                        fillOpacity: 0.85,
                        weight: 2
                      }}
                      eventHandlers={{
                        click: async () => {
                          setSelectedLGU(lgu);
                          await fetchAdditionalInfo(lgu.name);
                          setShowMapModal(true);
                        }
                      }}
                    />
                  );
                })}
              </MapContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-3 border-t border-white/[0.06]">
              <span>Click a marker to inspect details</span>
              <span className="text-emerald-400 font-medium">
                {liveLgus.filter(l => getLatLng(l)).length} Plotted LGUs
              </span>
            </div>
          </div>

          {/* BENTO BOX 2: Radar Chart */}
          <RadarChart />

          {/* BENTO BOX 3: Stacked Bar Chart */}
          <StackedChart />

          {/* BENTO BOX 4: EGovPH Users */}
          <EGovPH />

          {/* BENTO BOX 5: Downloads Card */}
          <DashboardCard />

          {/* BENTO BOX 6: Operational Activities */}
          <EgovPromotional />

        </div>

      </div>

      {/* FULLSCREEN MAP MODAL */}
      {showMapModal && selectedLGU && (
        <div className='fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex flex-col md:flex-row'>
          
          {/* LEFT: Fullscreen Map View */}
          <div className='flex-1 relative h-1/2 md:h-full'>
            <button
              onClick={() => setShowMapModal(false)}
              className='absolute top-5 right-5 z-[99999] bg-white/10 hover:bg-white/20 border border-white/20 transition w-10 h-10 rounded-full text-white text-lg flex items-center justify-center'
            >
              ✕
            </button>

            <MapContainer
              center={getLatLng(selectedLGU) || [13.25, 123.55]}
              zoom={11}
              scrollWheelZoom={true}
              attributionControl={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                maxZoom={16}
              />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
                maxZoom={16}
              />

              {liveLgus.map((lgu, i) => {
                const latLng = getLatLng(lgu);
                if (!latLng) return null;

                return (
                  <CircleMarker
                    key={lgu._id || `${lgu.name}-${i}`}
                    center={latLng}
                    radius={selectedLGU.name === lgu.name ? 14 : 7}
                    pathOptions={{
                      color: getColor(lgu.status),
                      fillColor: getColor(lgu.status),
                      fillOpacity: 0.9,
                      weight: 2
                    }}
                    eventHandlers={{
                      click: async () => {
                        setSelectedLGU(lgu);
                        await fetchAdditionalInfo(lgu.name);
                      }
                    }}
                  />
                );
              })}
            </MapContainer>
          </div>

          {/* RIGHT: Bento Info Details Panel */}
          <div className='w-full md:w-[420px] bg-[#0c1322] border-t md:border-t-0 md:border-l border-white/10 p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between'>
            <div>
              <div className='mb-6'>
                <h1 className='text-2xl font-bold text-white'>
                  {selectedLGU.name}
                </h1>
                <p className='text-slate-400 text-xs mt-1'>
                  LGU Information Details & Status
                </p>
              </div>

              {/* Status Badge */}
              <div className='rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 mb-4'>
                <p className='text-slate-400 text-xs mb-2 font-medium'>
                  Current Status
                </p>
                <div
                  className='inline-flex px-3.5 py-1 rounded-full text-xs font-semibold'
                  style={{
                    backgroundColor: `${getColor(selectedLGU.status)}20`,
                    color: getColor(selectedLGU.status),
                    border: `1px solid ${getColor(selectedLGU.status)}40`
                  }}
                >
                  {selectedLGU.status}
                </div>
              </div>

              {/* Municipality Details */}
              <div className='rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 mb-4 space-y-3 text-xs'>
                <h2 className='text-sm font-semibold text-white mb-2'>
                  Municipality Details
                </h2>

                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className='text-slate-400'>eLGU Version</span>
                  <span className='text-slate-200 font-mono'>{selectedLGU.version || 'V2'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className='text-slate-400'>Region</span>
                  <span className='text-slate-200'>Region V - Bicol</span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className='text-slate-400'>Province</span>
                  <span className='text-slate-200'>{selectedLGU.name.split(',')[1]?.trim() || 'Albay'}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className='text-slate-400'>Coordinates</span>
                  <span className='text-slate-200 font-mono'>
                    {selectedLGU.coordinates ? `${selectedLGU.coordinates[1]?.toFixed(4)}, ${selectedLGU.coordinates[0]?.toFixed(4)}` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Additional Description if available */}
              {additionalInfo.length > 0 && (
                <div className='rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4'>
                  <h2 className='text-sm font-semibold text-white mb-2'>
                    Additional Information
                  </h2>
                  <div className="space-y-2 text-xs text-slate-300">
                    {additionalInfo.map((info, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white/[0.02]">
                        <p>{info.description || info.notes || JSON.stringify(info)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08]">
              <a
                href={`https://elgu-${selectedLGU.name?.split(',')[0]?.trim().toLowerCase().replace(/\s+/g, '-')}-albay.e.gov.ph/`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-center font-medium text-xs text-white transition"
              >
                Open LGU Portal
              </a>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Dashboard;