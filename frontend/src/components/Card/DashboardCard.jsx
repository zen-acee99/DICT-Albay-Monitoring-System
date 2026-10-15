import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  Tooltip,
} from "recharts";

const DownloadsCard = () => {
  const [totalUsers, setTotalUsers] = useState(992406);
  const [provinceData, setProvinceData] = useState([
    { name: "Albay", value: 37308 },
    { name: "Camarines Norte", value: 16318 },
    { name: "Camarines Sur", value: 52490 },
    { name: "Catanduanes", value: 9399 },
    { name: "Sorsogon", value: 21222 },
  ]);

  const waveChartData = [
    { x: 1, val: 3200 },
    { x: 2, val: 6800 },
    { x: 3, val: 5100 },
    { x: 4, val: 8900 },
    { x: 5, val: 7200 },
    { x: 6, val: 11400 },
    { x: 7, val: 9800 },
    { x: 8, val: 14200 },
    { x: 9, val: 12500 },
    { x: 10, val: 17800 },
    { x: 11, val: 16200 },
    { x: 12, val: 21000 },
  ];

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch(`${API_URL}/egovph/total-registered-users`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.total) setTotalUsers(data.total);
      } catch (err) {}
    };

    const fetchChart = async () => {
      try {
        const res = await fetch(`${API_URL}/egovph/chart/by-province`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item) => ({
            name: item._id || item.name,
            value: item.value || item.users || 0,
          }));
          setProvinceData(formatted);
        }
      } catch (err) {}
    };

    fetchTotal();
    fetchChart();
  }, [API_URL]);

  return (
    <div className="w-full h-full min-h-[380px] rounded-3xl border border-white/[0.06] bg-[#0c1322] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white tracking-wide">
            Downloads
          </h2>
          <span className="text-xs text-slate-400 font-medium">As of May 2026</span>
        </div>

        {/* Total Number - Minimalist */}
        <div className="mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {totalUsers.toLocaleString()}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Total eGovPH Downloads
          </p>
        </div>

        {/* Minimalist Area Chart */}
        <div className="h-20 w-full mt-3 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waveChartData}>
              <defs>
                <linearGradient id="minimalArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
              <Tooltip cursor={false} content={<></>} />
              <Area
                type="monotone"
                dataKey="val"
                stroke="#818cf8"
                strokeWidth={2}
                fill="url(#minimalArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Province Breakdown List - Clean Bento style */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
        {provinceData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-slate-400 font-medium">
              {item.name}
            </span>
            <span className="font-semibold text-slate-200">
              {Number(item.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadsCard;