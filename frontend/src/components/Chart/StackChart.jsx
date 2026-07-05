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
  Legend,
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

        // Remove duplicates
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

    const interval = setInterval(fetchOperationalData, 5000);

    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
    const grouped = {};

    operationalData.forEach((item) => {
      // Province is the last part after the comma
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

    return Object.values(grouped).sort((a, b) =>
      a.province.localeCompare(b.province)
    );
  }, [operationalData]);

  return (
    <ResponsiveContainer width="100%" height={350} className="border border-[#1d2942] outline-none bg-[#091121] rounded-xl shadow p-4">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
  dataKey="province"
  interval={0}
  angle={-38}
  textAnchor="end"
  height={90}
/>

        <YAxis allowDecimals={false} />

        <Tooltip />

        {/* <Legend /> */}

        <Bar dataKey="LIVE" stackId="status" fill="#22c55e" />
        <Bar dataKey="BUILDUP" stackId="status" fill="#3b82f6" />
        <Bar dataKey="UAT" stackId="status" fill="#f59e0b" />
        <Bar dataKey="OWN" stackId="status" fill="#8b5cf6" />
        <Bar dataKey="TECH" stackId="status" fill="#ec4899" />
        <Bar dataKey="INACTIVE" stackId="status" fill="#ef4444" />
        <Bar dataKey="NOSYS" stackId="status" fill="#6b7280" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;