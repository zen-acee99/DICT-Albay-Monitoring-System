import React, { useEffect, useState } from "react";
import { HiOutlineUserGroup, HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { IoMegaphoneOutline } from "react-icons/io5";

const OperationalActivities = () => {
  const [data, setData] = useState([
    {
      label: "Promotional Activities",
      value: 10,
      icon: <IoMegaphoneOutline className="text-lg text-slate-300" />
    },
    {
      label: "Conducted Orientation",
      value: 6,
      icon: <HiOutlineUserGroup className="text-lg text-slate-300" />
    },
    {
      label: "Technical Assistance",
      value: 12,
      icon: <HiOutlineWrenchScrewdriver className="text-lg text-slate-300" />
    },
  ]);

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promoRes, actRes] = await Promise.allSettled([
          fetch(`${VITE_API_URL}/egovpro/summary`),
          fetch(`${VITE_API_URL}/egovact/summary`),
        ]);

        let promoVal = 10;
        let actVal = 6;
        let techVal = 12;

        if (promoRes.status === "fulfilled" && promoRes.value.ok) {
          const promo = await promoRes.value.json();
          if (promo.PromotionalActivities) promoVal = promo.PromotionalActivities;
        }

        if (actRes.status === "fulfilled" && actRes.value.ok) {
          const act = await actRes.value.json();
          if (act.ConductedActivities) actVal = act.ConductedActivities;
          if (act.TechnicalAssistance) techVal = act.TechnicalAssistance;
        }

        setData([
          {
            label: "Promotional Activities",
            value: promoVal,
            icon: <IoMegaphoneOutline className="text-lg text-slate-300" />
          },
          {
            label: "Conducted Orientation",
            value: actVal,
            icon: <HiOutlineUserGroup className="text-lg text-slate-300" />
          },
          {
            label: "Technical Assistance",
            value: techVal,
            icon: <HiOutlineWrenchScrewdriver className="text-lg text-slate-300" />
          },
        ]);
      } catch (error) {}
    };

    fetchData();
  }, [VITE_API_URL]);

  return (
    <div className="w-full h-full min-h-[380px] rounded-3xl border border-white/[0.06] bg-[#0c1322] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white tracking-wide">
            Operational Activities
          </h2>
          <span className="text-xs text-slate-400 font-medium">Monthly Status</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Summary of promotional, technical, and orientation engagements.
        </p>
      </div>

      <div className="space-y-3 mt-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.05] shrink-0">
              {item.icon}
            </div>

            <div className="flex-1 ml-3.5 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">{item.label}</div>
              <div className="text-[10px] text-slate-400">This Month</div>
            </div>

            <div className="text-xl font-bold text-white tracking-tight ml-2">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationalActivities;