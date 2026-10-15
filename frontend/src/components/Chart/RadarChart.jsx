import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts"

import React, { useState, useEffect, useMemo } from "react"
import axios from "axios"

export default function RadarCharts() {
  const [stats, setStats] = useState({
    live: 0,
    dataBuildUp: 0,
    uat: 0,
    ownsystem: 0,
    technical: 0,
    instanceInactive: 0,
    nosys: 0,
  })

  useEffect(() => {
    const fetchOperationalData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/operational`
        )

        const data = response.data

        const normalized = data.map(item => ({
          ...item,
          status: item.status?.trim().toUpperCase(),
        }))

        const uniqueMap = new Map()
        normalized.forEach(item => {
          uniqueMap.set(item.name + "_" + item.status, item)
        })

        const uniqueData = Array.from(uniqueMap.values())

        const live = uniqueData.filter(i => i.status === "LIVE").length
        const dataBuildUp = uniqueData.filter(i => i.status === "BUILDUPGLP").length
        const uat = uniqueData.filter(i => i.status === "UAT").length
        const ownsystem = uniqueData.filter(i => i.status === "OWN SYSTEM").length
        const technical = uniqueData.filter(i => i.status === "TECHNICAL").length
        const instanceInactive = uniqueData.filter(i => i.status === "INACTIVE").length
        const nosys = uniqueData.filter(i => i.status === "NO SYSTEM").length

        setStats({
          live,
          dataBuildUp,
          uat,
          ownsystem,
          technical,
          instanceInactive,
          nosys,
        })
      } catch (err) {
        console.error("Fetch Error:", err)
      }
    }

    fetchOperationalData()
    const interval = setInterval(fetchOperationalData, 10000)
    return () => clearInterval(interval)
  }, [])

  // convert stats → recharts format
  const chartData = useMemo(
    () => [
      { subject: "LIVE", value: stats.live || 58 },
      { subject: "BUILDUP", value: stats.dataBuildUp || 12 },
      { subject: "UAT", value: stats.uat || 13 },
      { subject: "OWN", value: stats.ownsystem || 21 },
      { subject: "TECH", value: stats.technical || 6 },
      { subject: "INACTIVE", value: stats.instanceInactive || 10 },
      { subject: "NO SYS", value: stats.nosys || 8 },
    ],
    [stats]
  )

  return (
    <div className="w-full h-full min-h-[380px] rounded-3xl border border-white/[0.06] bg-[#0c1322] p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-white tracking-wide">
          Operational Status Overview
        </h2>
        <span className="text-xs text-slate-400 font-medium">Radar Distribution</span>
      </div>

      <div className="w-full h-[280px] outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis 
              dataKey="subject"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <Radar
              dataKey="value"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.25}
              dot={{ r: 3, fill: "#38bdf8" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}