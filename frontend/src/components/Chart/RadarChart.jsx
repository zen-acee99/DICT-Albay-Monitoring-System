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

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOperationalData = async () => {
      try {
        setLoading(true)

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
      } finally {
        setLoading(false)
      }
    }

    fetchOperationalData()

    const interval = setInterval(fetchOperationalData, 5000)

    return () => clearInterval(interval)
  }, [])

  // convert stats → recharts format
  const chartData = useMemo(
    () => [
      { subject: "LIVE", value: stats.live },
      { subject: "BUILDUP", value: stats.dataBuildUp },
      { subject: "UAT", value: stats.uat },
      { subject: "OWN", value: stats.ownsystem },
      { subject: "TECH", value: stats.technical },
      { subject: "INACTIVE", value: stats.instanceInactive },
      { subject: "NO SYS", value: stats.nosys },
    ],
    [stats]
  )

  return (
    <div className="w-96 h-[350px] border border-[#1d2942] outline-none bg-[#091121] rounded-xl shadow p-4">
      <h2>
        Operational Status Overview
      </h2>
      <ResponsiveContainer width="100%" height="100%" className="outline-none">
        <RadarChart data={chartData} className="outline-none">
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="subject"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
          />

          <Radar
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            dot={{ r: 4, fill: "#3b82f6" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}