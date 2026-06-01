import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const DownloadsCard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [chartData, setChartData] = useState([]);

  const API_URL = "http://localhost:3001";

  // GET TOTAL USERS
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch(
          `${API_URL}/egovph/total-registered-users`
        );

        const data = await res.json();
        setTotalUsers(data.total || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTotal();
  }, []);

  // GET CHART DATA (BY PROVINCE)
  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await fetch(
          `${API_URL}/egovph/chart/by-province`
        );

        const data = await res.json();

        const formatted = data.map((item) => ({
          name: item._id,
          value: item.value,
        }));

        setChartData(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChart();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-[#070B1A] px-5 py-4 shadow-[0_0_40px_rgba(168,85,247,0.08)]">

      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_55%)]" />
      <div className="absolute -bottom-20 left-0 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10">

        {/* HEADER */}
        <h2 className="text-[22px] font-semibold text-[#E879F9]">
          Downloads
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          As of {today}
        </p>

        {/* TOTAL */}
        <h1 className="mt-1 text-6xl font-bold text-[#E879F9] drop-shadow-[0_0_12px_rgba(232,121,249,0.45)]">
          {totalUsers.toLocaleString()}
        </h1>

        <p className="text-sm text-purple-200/80">
          Total eGovPH Downloads
        </p>

        {/* CHART */}
        <div className="h-[140px] w-full mt-2 outline-none">
          <ResponsiveContainer width="100%" height="100%" className="outline-none">
            <AreaChart data={chartData} className="outline-none">

              <defs>
                <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>

                <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* <XAxis dataKey="name" tick={{ fill: "#aaa", fontSize: 10 }} /> */}
              <YAxis hide />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                stroke="url(#colorLine)"
                fill="url(#colorFill)"
                strokeWidth={3}
              />

            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PROVINCE BREAKDOWN */}
        <div className="mt-3 space-y-1">

          {chartData.length === 0 ? (
            <p className="text-xs text-gray-400">Loading data...</p>
          ) : (
            chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between border-b border-white/5 pb-2 text-xs"
              >
                <span className="text-gray-300">{item.name}</span>

                <span className="text-white font-semibold">
                  {Number(item.value).toLocaleString()}
                </span>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default DownloadsCard;