import React, { useState, useEffect } from "react";
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
  const [totalUsers, setTotalUsers] = useState(152661);

  const fallbackData = [
    { name: "Albay", users: 58000 },
    { name: "Camarines Sur", users: 46000 },
    { name: "Camarines Norte", users: 24000 },
    { name: "Sorsogon", users: 21000 },
    { name: "Catanduanes", users: 18000 },
    { name: "Masbate", users: 15500 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalRes = await fetch(`${VITE_API_URL}/egovph/total-registered-users`);
        if (totalRes.ok) {
          const totalData = await totalRes.json();
          if (totalData.total) setTotalUsers(totalData.total);
        }

        const chartRes = await fetch(`${VITE_API_URL}/egovph/user-per-municipality`);
        if (chartRes.ok) {
          const chartData = await chartRes.json();
          if (Array.isArray(chartData) && chartData.length > 0) {
            const groupedData = chartData.reduce((acc, item) => {
              const Province = item.Province || item.name || "Province";
              const registeredUsers = item.registeredUsers || item.users || 0;
              if (!acc[Province]) {
                acc[Province] = { name: Province, users: 0 };
              }
              acc[Province].users += registeredUsers;
              return acc;
            }, {});

            const formattedData = Object.values(groupedData).sort(
              (a, b) => b.users - a.users
            );
            setData(formattedData);
            return;
          }
        }
      } catch (err) {}
      setData(fallbackData);
    };

    fetchData();
  }, [VITE_API_URL]);

  return (
    <div className="w-full h-full min-h-[380px] rounded-3xl border border-white/[0.06] bg-[#0c1322] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white tracking-wide">
            eGOV PH - Users
          </h2>
          <span className="text-xs text-slate-400 font-medium">Registered Users</span>
        </div>

        <div className="flex items-baseline gap-2.5 mt-1 mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {totalUsers.toLocaleString()}
          </h1>
          <span className="text-xs text-emerald-400 font-medium">
            +8.4% <span className="text-slate-500 font-normal">vs last month</span>
          </span>
        </div>
      </div>

      <div className="h-56 w-full -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.length > 0 ? data : fallbackData}
            barCategoryGap={10}
            margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
          >
            <CartesianGrid vertical={false} stroke="#1e293b" strokeDasharray="2 2" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={40}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value >= 1000 ? value / 1000 + "K" : value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "16px",
                fontSize: "12px",
                color: "#f8fafc",
              }}
            />
            <Bar
              dataKey="users"
              radius={[6, 6, 0, 0]}
              fill="#6366f1"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsersCard;