import React, { useEffect, useState } from "react";

const OperationalActivities = () => {
  const [data, setData] = useState([
    { label: "Promotional Activities", value: 0, icon: "📍" },
    { label: "Conducted Orientation", value: 0, icon: "👥" },
    { label: "Technical Assistance", value: 0, icon: "🛠️" },
  ]);

  const VITE_API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promoRes, actRes] = await Promise.all([
          fetch(`${VITE_API_URL}/egovpro/summary`),
          fetch(`${VITE_API_URL}/egovact/summary`),
        ]);

        const promo = await promoRes.json();
        const act = await actRes.json();

        setData([
          {
            label: "Promotional Activities",
            value: promo.PromotionalActivities || 0,
            icon: "📍",
          },
          // {
          //   label: "Conducted Orientation",
          //   value: act.ConductedActivities || 0,
          //   icon: "👥",
          // },
          {
            label: "Technical Assistance",
            value: act.TechnicalAssistance || 0,
            icon: "🛠️",
          },
        ]);
      } catch (error) {
        console.error("Error fetching operational data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-72 p-5 rounded-2xl bg-[#0f1024]/80 backdrop-blur-md shadow-xl border border-white/10 text-white">
      <h2 className="text-lg font-semibold text-purple-300 mb-4">
        Operational Activities
      </h2>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-500/20 text-lg">
              {item.icon}
            </div>

            <div className="flex-1 ml-3">
              <div className="text-sm">{item.label}</div>
              <div className="text-xs text-white/50">This Month</div>
            </div>

            <div className="text-lg font-bold text-purple-300">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationalActivities;