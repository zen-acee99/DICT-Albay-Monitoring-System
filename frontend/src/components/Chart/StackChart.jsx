import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const StackedBarChart = () => {
  const [operationalData, setOperationalData] = useState([]);

  useEffect(() => {
    const fetchOperationalData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/operational`
        );

        const normalized = response.data.map((item) => ({
          ...item,
          status: item.status?.trim().toUpperCase(),
        }));

        const uniqueMap = new Map();
        normalized.forEach((item) => {
          uniqueMap.set(`${item.name}_${item.status}`, item);
        });

        setOperationalData(Array.from(uniqueMap.values()));
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchOperationalData();
    const interval = setInterval(fetchOperationalData, 10000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
    const grouped = {};

    operationalData.forEach((item) => {
      const province = item.name.split(",").pop().trim();

      if (!grouped[province]) {
        grouped[province] = {
          province,
          LIVE: 0,
          BUILDUP: 0,
          UAT: 0,
          OWN: 0,
          TECH: 0,
          INACTIVE: 0,
          NOSYS: 0,
        };
      }

      switch (item.status) {
        case "LIVE":
          grouped[province].LIVE++;
          break;
        case "BUILDUPGLP":
          grouped[province].BUILDUP++;
          break;
        case "UAT":
          grouped[province].UAT++;
          break;
        case "OWN SYSTEM":
          grouped[province].OWN++;
          break;
        case "TECHNICAL":
          grouped[province].TECH++;
          break;
        case "INACTIVE":
          grouped[province].INACTIVE++;
          break;
        case "NO SYSTEM":
          grouped[province].NOSYS++;
          break;
        default:
          break;
      }
    });

    const list = Object.values(grouped).sort((a, b) =>
      a.province.localeCompare(b.province)
    );

    // Fallback if data is still fetching
    if (list.length === 0) {
      return [
        { province: "Albay", LIVE: 14, BUILDUP: 1, UAT: 2, OWN: 0, TECH: 0, INACTIVE: 1, NOSYS: 0 },
        { province: "Cam Sur", LIVE: 18, BUILDUP: 4, UAT: 5, OWN: 6, TECH: 2, INACTIVE: 2, NOSYS: 0 },
        { province: "Cam Norte", LIVE: 8, BUILDUP: 2, UAT: 2, OWN: 0, TECH: 0, INACTIVE: 0, NOSYS: 0 },
        { province: "Catanduanes", LIVE: 6, BUILDUP: 1, UAT: 1, OWN: 0, TECH: 0, INACTIVE: 2, NOSYS: 1 },
        { province: "Masbate", LIVE: 7, BUILDUP: 2, UAT: 1, OWN: 11, TECH: 0, INACTIVE: 0, NOSYS: 0 },
        { province: "Sorsogon", LIVE: 5, BUILDUP: 2, UAT: 2, OWN: 4, TECH: 0, INACTIVE: 2, NOSYS: 0 },
      ];
    }

    return list;
  }, [operationalData]);

  return (
    <div className="w-full h-full min-h-[380px] rounded-3xl border border-white/[0.06] bg-[#0c1322] p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-white tracking-wide">
          Province Status Distribution
        </h2>
        <span className="text-xs text-slate-400 font-medium">Stacked by Province</span>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="province"
              interval={0}
              angle={-25}
              textAnchor="end"
              height={45}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "16px",
                fontSize: "12px",
                color: "#f8fafc",
              }}
            />
            {/* Minimalist pastel/matte colors */}
            <Bar dataKey="LIVE" stackId="status" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="BUILDUP" stackId="status" fill="#38bdf8" />
            <Bar dataKey="UAT" stackId="status" fill="#f59e0b" />
            <Bar dataKey="OWN" stackId="status" fill="#8b5cf6" />
            <Bar dataKey="TECH" stackId="status" fill="#6366f1" />
            <Bar dataKey="INACTIVE" stackId="status" fill="#f43f5e" />
            <Bar dataKey="NOSYS" stackId="status" fill="#64748b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedBarChart;