import React, {useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const UsersCard = () => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    const [data, setData] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
    const fetchData = async () => {
      try {
        // Get total users
        const totalRes = await fetch(`${VITE_API_URL}/egovph/total-registered-users`);
        const totalData = await totalRes.json();
        setTotalUsers(totalData.total);

        // Get municipality data
        const chartRes = await fetch(`${VITE_API_URL}/egovph/user-per-municipality`);
        const chartData = await chartRes.json();

        if (Array.isArray(chartData)) {
          // Group by province and sum users
          const groupedData = chartData.reduce((acc, item) => {
            const { provinceName, registeredUsers } = item;
            
            if (!acc[provinceName]) {
              acc[provinceName] = {
                name: provinceName,
                users: 0,
              };
            }
            
            acc[provinceName].users += registeredUsers;
            return acc;
          }, {});

          // Convert to array and sort by users descending
          const formattedData = Object.values(groupedData).sort(
            (a, b) => b.users - a.users
          );

          setData(formattedData);
        } else {
          console.error("Unexpected API response format:", chartData);
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="relative overflow-hidden rounded-3xl h-96 border border-blue-500/20 bg-[#070B1A] p-4 shadow-[0_0_40px_rgba(59,130,246,0.08)]">

      {/* BLUE GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_45%)]"></div>

      {/* BLUR EFFECT */}
      <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-[20px] font-semibold tracking-wide text-white">
              eGOV PH - Users
            </h2>

          </div>

          {/* DROPDOWN */}
          {/* <select className="rounded-xl border border-white/10 bg-[#0D1323] px-4 py-2 text-sm text-gray-300 outline-none">

            <option>
              All eLGUs
            </option>

            <option>
              Albay
            </option>

            <option>
              Cam Norte
            </option>

          </select> */}

        </div>

        {/* TOTAL USERS */}
        <div className="flex flex-col gap-2">

          <div>

            {/* <p className="text-sm text-gray-400">
              Total Users
            </p> */}
{/* 
            <h1 className="mt-1 text-5xl font-bold tracking-tight text-white">
              {totalUsers.toLocaleString()}
            </h1> */}

          </div>

          {/* <p className="text-xs font-medium text-green-400">
            +8.4%
            <span className="ml-1 text-gray-400">
              vs last month
            </span>
          </p> */}

        </div>

        {/* BAR CHART */}
        <div className="mt-1 h-[300px] w-full">

          <ResponsiveContainer width="100%" height="100%" className='outline-none'>

            <BarChart
              data={data}
              barCategoryGap={5}
            >

              {/* GRID */}
              <CartesianGrid
                vertical={false}
                stroke="#1E293B"
                strokeDasharray="0"
              />

              {/* X AXIS */}
                <XAxis
                    dataKey="name"
                    tick={{
                        fill: "#64748B",
                        fontSize: 11,
                        angle: -30,
                        textAnchor: "end"
                    }}
                    interval={0}
                    height={60}
                    axisLine={false}
                    tickLine={false}
                />

              {/* Y AXIS */}
              <YAxis
                tick={{
                  fill: "#64748B",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value / 1000}K`}
              />

              {/* TOOLTIP */}
              <Tooltip
                cursor={{
                  fill: "rgba(59,130,246,0.08)",
                }}
                contentStyle={{
                  background: "#0F172A",
                  border: "1px solid rgba(59,130,246,0.2)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              {/* BAR */}
              <Bar
                dataKey="users"
                radius={[8, 8, 0, 0]}
                fill="url(#barGradient)"
              />

              {/* BAR GRADIENT */}
              <defs>

                <linearGradient
                  id="barGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#6366F1"
                  />

                  <stop
                    offset="100%"
                    stopColor="#8B5CF6"
                  />

                </linearGradient>

              </defs>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default UsersCard;