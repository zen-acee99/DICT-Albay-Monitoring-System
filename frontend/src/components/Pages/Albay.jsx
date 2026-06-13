import React, { useState, useEffect, useMemo } from 'react'
import { toPng } from "html-to-image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";


import Navbar from '../Layout/Navbar'
import axios from 'axios'

import { IoSearch } from "react-icons/io5";
import { TbRadar2 } from "react-icons/tb";

import {
  HiOutlineDownload,
  HiOutlineDocumentSearch
} from "react-icons/hi";

import {
  FaChalkboardTeacher,
  FaBan,
  FaCogs,
  FaShieldAlt,
  FaGlobe
} from "react-icons/fa";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker
} from "react-leaflet";

import DashboardCard from '../Card/DashboardCard';
import EGovPH from '../Card/EGovPH';
import EgovPromotional from '../Card/EgovPromotional';

const Albay = () => {

  const [liveLgus, setLiveLgus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLGU, setSelectedLGU] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState([]);
  const [statShow, setStatShow] = useState(null);

//#region API_URL
  // const API_URL = 'http://localhost:3001';
  const VITE_API_URL = import.meta.env.VITE_API_URL;

//#endregion  


// 1. HELPERS FIRST
  const normalizeMunicipality = (value = "") =>
    value
      .toLowerCase()
      .replace(/^city of\s+/i, "")
      .replace(/\scity$/i, "")
      .replace(/^municipality of\s+/i, "")
      .trim();

//#region LGU
  const [stats, setStats] = useState({
    live: 0,
    uat: 0,
    training: 0,
    inactive: 0,
    thirdParty: 0,
    total: 0
  });

  useEffect(() => {

    const fetchOperationalData = async () => {

      try {

        const response = await axios.get(`${VITE_API_URL}/operational`);

        const data = response.data;

        const normalized = data
        .filter(item => {
          const parts = item.name?.split(",").map(s => s.trim().toLowerCase());
          return parts?.[1] === "albay";
        })
        .map(item => ({
          ...item,
          status: item.status?.trim().toUpperCase(),
        }));

        const uniqueMap = new Map();

        // data.forEach(item => {
        //   uniqueMap.set(item.name, item);
        // });

        normalized.forEach(item => {
          uniqueMap.set(item.name + "_" + item.status, item);
          // uniqueMap.set(item._id, item);
        });

        setLiveLgus(normalized)

        const uniqueData = Array.from(uniqueMap.values());

        const live = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'LIVE'
        ).length;

        const DATA = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'BUILDUP - GLP'
        ).length;

        const uat = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'UAT'
        ).length;

        const training = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'Training'
        ).length;

        const nosystem = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'NO SYSTEM'
        ).length;
        const inactive = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'INACTIVE'
        ).length;

        const thirdParty = uniqueData.filter(
          item => item.status?.trim().toUpperCase() === 'OWN SYSTEM'
        ).length;

        setStats({
          live,
          DATA,
          uat,
          training,
          inactive,
          nosystem,
          thirdParty,
          total: uniqueData.length
        });

      } catch (err) {

        console.error("Fetch Error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchOperationalData();

    const interval = setInterval(() => {
      fetchOperationalData();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const getColor = (status) => {
    switch (status) {
      case 'LIVE':
        return '#22c55e';

      case 'UAT':
        return '#eab308';

      case 'TRAINING':
        return '#f97316';

      case 'NO SYSTEM':
        return '#ef4444';

      case 'OWN SYSTEM':
        return '#3b82f6';

      default:
        return '#6b7280';
    }
  };

  const fetchAdditionalInfo = async (location) => {

    console.log("Sending location:", location);
  try {

    const response = await axios.get(
      `${VITE_API_URL}/additionaldescription/location/${encodeURIComponent(location)}`
      
    );

    setAdditionalInfo(response.data || []);

  } catch (error) {
console.log(response.data);
    console.error("Additional Info Error:", error);

    setAdditionalInfo([]);
  }
  

};

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: "LGU Name",
      cell: (info) => (
        <span className="text-white">{info.getValue()}</span>
      ),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const val = info.getValue();

        const color =
          val === "LIVE"
            ? "text-green-400"
            : val === "UAT"
            ? "text-yellow-400"
            : val === "Training"
            ? "text-orange-400"
            : val === "NO SYSTEM"
            ? "text-red-400"
            : "text-blue-400";

        return <span className={color}>{val}</span>;
      },
    }),
  ];

  const statusConfig = {
    live: { title: "LIVE eLGUs", color: "text-green-400", status: "LIVE" },
    uat: { title: "UAT eLGUs", color: "text-yellow-400", status: "UAT" },
    training: { title: "Admin Training", color: "text-orange-400", status: "TRAINING" }, // FIX: "TRAINING"
    inactive: { title: "Inactive / No eLGU", color: "text-red-400", status: "NO SYSTEM" },
    thirdParty: { title: "OWN / 3rd Party", color: "text-blue-400", status: "OWN SYSTEM" },
    DATA: {
    title: "BUILDUP - GLP",
    color: "text-cyan-400",
    status: "BUILDUP - GLP",
  },
  nosystem: {
    title: "No System",
    color: "text-red-400",
    status: "NO SYSTEM",
  }
  };

  const current = statusConfig[statShow];

  const filteredData = useMemo(() => {
    if (!statShow) return liveLgus;

    // 1. Get the target status from config
    const targetStatus = statusConfig[statShow]?.status;
    
    if (!targetStatus) return liveLgus;

    // 2. Filter by comparing Uppercase + Trimmed values
    return liveLgus.filter(item => {
      const itemStatus = item.status?.trim().toUpperCase();
      const compareStatus = targetStatus.trim().toUpperCase();
      return itemStatus === compareStatus;
    });

  }, [statShow, liveLgus]);

  const table = useReactTable({
    data: filteredData, // IMPORTANT: Pass filtered data here
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

//#endregion




//#region WIFI

  const wifiIcon = L.icon({
    iconUrl: "/wifiLogo.png", // public/images/wifi-logo.png
    iconSize: [30, 30],
    iconAnchor: [14, 14],
    popupAnchor: [20, 14],
  });

  const [liveWIFI, setLiveWIFI] = useState([]);
  const [selectedWIFI, setSelectedWIFI] = useState(null);
  const [showMapModalWIFI, setShowMapModalWIFI] = useState(false);
  const [additionalInfoWIFI, setAdditionalInfoWIFI] = useState([]);
  const [statShowWIFI, setStatShowWIFI] = useState(null);

  const [statsWIFI, setStatsWIFI] = useState({
      Province: 0
    });

  useEffect(() => {

    const fetchWIFIData = async () => {

      try {

        const response = await axios.get(`${VITE_API_URL}/wifiData`);

        const dataWIFI = response.data;

        const normalizedWIFI = dataWIFI
        .filter(item => item.Province?.trim().toLowerCase() === "albay")
        .map(item => ({
          ...item,
          Province: item.Province?.trim().toUpperCase(),
        }));

        const uniqueMapWIFI = new Map();
        // data.forEach(item => {
        //   uniqueMap.set(item.name, item);
        // });

        normalizedWIFI.forEach(item => {
          // uniqueMap.set(item.name + "_" + item.status, item);
          uniqueMapWIFI.set(item._id, item);
        });

        setLiveWIFI(normalizedWIFI)

        const uniqueDataWIFI = Array.from(uniqueMapWIFI.values());

        const WIFI = uniqueDataWIFI.filter(
          item => item.Province?.trim().toUpperCase() === 'ALBAY'
        ).length;

        setStatsWIFI({
          liveWIFI: WIFI,
          total: uniqueDataWIFI.length
        });

      } catch (err) {

        console.error("Fetch Error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchWIFIData();

    const interval = setInterval(() => {
      fetchWIFIData();
    }, 5000);

    // console.log("statShowWIFI =", statShowWIFI);
    // console.log("currentWIFI =", currentWIFI);

    return () => clearInterval(interval);

  }, []);

  const getColorWIFI = (Province) => {
    switch (Province) {
      case 'Province':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const columnHelperWIFI = createColumnHelper();
    const columnsWIFI = [

      columnHelperWIFI.accessor("SiteType", {
        header: "Site Type",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("LocationName", {
        header: "Location",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("fundSource", {
        header: "fund Source",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("ProjectName", {
        header: "Project Name",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("Contact", {
        header: "Contact",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("LinkType", {
        header: "Link Type",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("ApCount", {
        header: "Ap Count",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("Coordinates", {
        header: "Coordinates",
        cell: (info) => {
          const coords = info.getValue();

          if (!coords || coords.length < 2) return <span>-</span>;

          return (
            <span className="text-white">
              {coords[1]}, {coords[0]}
            </span>
          );
        },
      }),
      columnHelperWIFI.accessor("LocationCode", {
        header: "Location Code",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("Barangay", {
        header: "Barangay",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("Municipality", {
        header: "Municipality",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("Province", {
        header: "Province",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("Remarks", {
        header: "Remarks",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),
      columnHelperWIFI.accessor("NationWideID", {
        header: "NationWide ID",
        cell: info => (
          <span className="text-white">{info.getValue()}</span>
        ),
      }),

      
      columnHelperWIFI.accessor("Province", {
        header: "Province",
        cell: (info) => {
          const val = info.getValue();
    
          const colorWIFI =
            val === "ALBAY"
              ? "text-green-400": ""
    
          return <span className={colorWIFI}>{val}</span>;
        },
      })
  ];


  const statusConfigWIFI = {
    Province: {
      title: "LIVE WIFI ALBAY",
      colorWIFI: "text-blue-400",
      Province: "ALBAY"
    },
  };

  const currentWIFI = statusConfigWIFI[statShowWIFI];

  const filteredDataWIFI = useMemo(() => {
    if (!statShowWIFI) return liveWIFI;

    // 1. Get the target status from config
    const targetStatusWIFI = statusConfigWIFI[statShowWIFI]?.Province;
    
    if (!targetStatusWIFI) return liveWIFI;

    // 2. Filter by comparing Uppercase + Trimmed values
    return liveWIFI.filter(item => {
      const itemStatusWIFI = item.Province?.trim().toUpperCase();
      const compareStatusWIFI = targetStatusWIFI.trim().toUpperCase();
      return itemStatusWIFI === compareStatusWIFI;
    });

  }, [statShowWIFI, liveWIFI]);

  const tableWIFI = useReactTable({
    data: filteredDataWIFI, // IMPORTANT: Pass filtered data here
    columns: columnsWIFI,
    getCoreRowModel: getCoreRowModel(),
  });

  const cleanCity = (text = "") =>
  text
    .toLowerCase()
    .replace(/city of|municipality of/g, "")
    .split(",")[0]
    .replace(/\s+/g, " ")
    .trim();

  const wifiNearSelectedLGU = useMemo(() => {
    if (!selectedLGU) return [];

    const lguMunicipality = cleanCity(selectedLGU.name);

    return liveWIFI.filter((wifi) => {
      const wifiMunicipality = cleanCity(wifi.Municipality);

      return wifiMunicipality.includes(lguMunicipality);
    });
  }, [selectedLGU, liveWIFI]);




//#endregion




//#region PNPKI

const pnpkiIcon = L.icon({
    iconUrl: "/logopnpki.png", // public/images/wifi-logo.png
    iconSize: [30, 30],
    iconAnchor: [14, 14],
    popupAnchor: [20, 14],
  });

const [livePNPKI, setLivePNPKI] = useState([]);
const [selectedPNPKI, setSelectedPNPKI] = useState(null);
const [showMapModalPNPKI, setShowMapModalPNPKI] = useState(false);
const [additionalInfoPNPKI, setAdditionalInfoPNPKI] = useState([]);
const [statShowPNPKI, setStatShowPNPKI] = useState(null);

const [statsPNPKI, setStatsPNPKI] = useState({
  Province: 0
});

useEffect(() => {

  const fetchPNPKIData = async () => {

    try {

      const response = await axios.get(`${VITE_API_URL}/pnpki`);

      const dataPNPKI = response.data;

      const normalizedPNPKI = dataPNPKI
        .filter(item => item.Province?.trim().toLowerCase() === "albay")
        .map(item => ({
          ...item,
          Province: item.Province?.trim().toUpperCase(),
        }));

      const uniqueMapPNPKI = new Map();

      normalizedPNPKI.forEach(item => {
        uniqueMapPNPKI.set(item._id, item);
      });

      setLivePNPKI(normalizedPNPKI);

      const uniqueDataPNPKI = Array.from(uniqueMapPNPKI.values());

      const PNPKI = uniqueDataPNPKI.filter(
        item => item.Province?.trim().toUpperCase() === "ALBAY"
      ).length;

      setStatsPNPKI({
        livePNPKI: PNPKI,
        total: uniqueDataPNPKI.length
      });

    } catch (err) {

      console.error("Fetch Error:", err);

    } finally {

      setLoading(false);

    }

  };

  fetchPNPKIData();

  const interval = setInterval(() => {
    fetchPNPKIData();
  }, 5000);

  console.log("statShowPNPKI =", statShowPNPKI);
  console.log("currentPNPKI =", currentPNPKI);

  return () => clearInterval(interval);

}, []);

const getColorPNPKI = (Address) => {
  switch (Address) {
    case "Address":
      return "#22c55e";
    default:
      return "#6b7280";
  }
};

const columnHelperPNPKI = createColumnHelper();

const columnsPNPKI = [

  columnHelperPNPKI.accessor("Province", {
    header: "Province",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("Date", {
    header: "Date",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("Raa", {
    header: "Raa",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("Region", {
    header: "Region",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("fullName", {
    header: "fullName",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("EmailAddress", {
    header: "Email Address",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("ContactNumber", {
    header: "Ap Count",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("Address", {
    header: "Ap Count",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("CongressionalDistrict", {
    header: "Ap Count",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("AgencyName", {
    header: "Ap Count",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("followS_NConvention", {
    header: "Ap Count",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("Tax", {
    header: "Ap Count",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),
  columnHelperPNPKI.accessor("Status", {
    header: "Ap Count",
    cell: info => (
      <span className="text-white">{info.getValue()}</span>
    ),
  }),

  columnHelperPNPKI.accessor("Coordinates", {
    header: "Coordinates",
    cell: (info) => {
      const coords = info.getValue();

      if (!coords || coords.length < 2) return <span>-</span>;

      return (
        <span className="text-white">
          {coords[1]}, {coords[0]}
        </span>
      );
    },
  }),

  columnHelperPNPKI.accessor("Province", {
    header: "Province",
    cell: (info) => {
      const val = info.getValue();

      const colorPNPKI =
        val === "ALBAY"
          ? "text-green-400"
          : "";

      return <span className={colorPNPKI}>{val}</span>;
    },
  }),
];

const statusConfigPNPKI = {
  Province: {
    title: "LIVE PNPKI ALBAY",
    colorPNPKI: "text-blue-400",
    Province: "ALBAY",
  },
};

const currentPNPKI = statusConfigPNPKI[statShowPNPKI];

const filteredDataPNPKI = useMemo(() => {
  if (!statShowPNPKI) return livePNPKI;

  const targetStatusPNPKI =
    statusConfigPNPKI[statShowPNPKI]?.Address;

  if (!targetStatusPNPKI) return livePNPKI;

  return livePNPKI.filter(item => {
    const itemStatusPNPKI = item.Address?.trim().toUpperCase();
    const compareStatusPNPKI = targetStatusPNPKI.trim().toUpperCase();

    return itemStatusPNPKI === compareStatusPNPKI;
  });

}, [statShowPNPKI, livePNPKI]);

const tablePNPKI = useReactTable({
  data: filteredDataPNPKI,
  columns: columnsPNPKI,
  getCoreRowModel: getCoreRowModel(),
});

// const cleanCity = (text = "") =>
//   text
//     .toLowerCase()
//     .replace(/city of|municipality of/g, "")
//     .split(",")[0]
//     .replace(/\s+/g, " ")
//     .trim();

const pnpkiNearSelectedLGU = useMemo(() => {
  if (!selectedLGU) return [];

  const lguMunicipality = cleanCity(selectedLGU.name);

  return livePNPKI.filter((pnpki) => {
    const pnpkiMunicipality = cleanCity(pnpki.Municipality);

    return pnpkiMunicipality.includes(lguMunicipality);
  });
}, [selectedLGU, livePNPKI]);

// const pnpkiNearSelectedLGU = useMemo(() => {
//   if (!selectedLGU) return [];

//   // Extract province from LGU name (e.g., "Legazpi, Albay" → "albay")
//   const lguProvince = selectedLGU.name?.split(",")[1]?.trim().toLowerCase();

//   return livePNPKI.filter((pnpki) => {
//     const pnpkiProvince = pnpki.Province?.trim().toLowerCase();
//     return pnpkiProvince === lguProvince;
//   });
// }, [selectedLGU, livePNPKI]);

//#endregion




//#region ILCDB

const [liveILCDB, setLiveILCDB] = useState([]);
const [selectedILCDB, setSelectedILCDB] = useState(null);
const [showMapModalILCDB, setShowMapModalILCDB] = useState(false);
const [additionalInfoILCDB, setAdditionalInfoILCDB] = useState([]);
const [statShowILCDB, setStatShowILCDB] = useState(null);

const [statsILCDB, setStatsILCDB] = useState({
  Province: 0
});

useEffect(() => {

  const fetchILCDBData = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/wifiData`);
      const dataILCDB = response.data;

      const normalizedILCDB = dataILCDB
        .filter(item => item.Province?.trim().toLowerCase() === "albay")
        .map(item => ({
          ...item,
          Province: item.Province?.trim().toUpperCase(),
        }));

      const uniqueMapILCDB = new Map();

      normalizedILCDB.forEach(item => {
        uniqueMapILCDB.set(item._id, item);
      });

      setLiveILCDB(normalizedILCDB);

      const uniqueDataILCDB = Array.from(uniqueMapILCDB.values());

      const ILCDB = uniqueDataILCDB.filter(
        item => item.Province?.trim().toUpperCase() === 'ALBAY'
      ).length;

      setStatsILCDB({
        liveILCDB: ILCDB,
        total: uniqueDataILCDB.length
      });

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchILCDBData();

  const interval = setInterval(() => {
    fetchILCDBData();
  }, 5000);

  console.log("statShowILCDB =", statShowILCDB);
  console.log("currentILCDB =", currentILCDB);

  return () => clearInterval(interval);

}, []);

const getColorILCDB = (Province) => {
  switch (Province) {
    case 'Province':
      return '#22c55e';
    default:
      return '#6b7280';
  }
};

const columnHelperILCDB = createColumnHelper();

const columnsILCDB = [
  columnHelperILCDB.accessor("SiteType", {
    header: "Site Type",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("LocationName", {
    header: "Location",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("fundSource", {
    header: "fund Source",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("ProjectName", {
    header: "Project Name",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("Contact", {
    header: "Contact",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("LinkType", {
    header: "Link Type",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("ApCount", {
    header: "Ap Count",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("Coordinates", {
    header: "Coordinates",
    cell: (info) => {
      const coords = info.getValue();
      if (!coords || coords.length < 2) return <span>-</span>;
      return (
        <span className="text-white">
          {coords[1]}, {coords[0]}
        </span>
      );
    },
  }),
  columnHelperILCDB.accessor("LocationCode", {
    header: "Location Code",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("Barangay", {
    header: "Barangay",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("Municipality", {
    header: "Municipality",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("Province", {
    header: "Province",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("Remarks", {
    header: "Remarks",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperILCDB.accessor("NationWideID", {
    header: "NationWide ID",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
];

const statusConfigILCDB = {
  Province: {
    title: "LIVE ILCDB ALBAY",
    colorILCDB: "text-blue-400",
    Province: "ALBAY"
  },
};

const currentILCDB = statusConfigILCDB[statShowILCDB];

const filteredDataILCDB = useMemo(() => {
  if (!statShowILCDB) return liveILCDB;

  const targetStatusILCDB = statusConfigILCDB[statShowILCDB]?.Province;
  if (!targetStatusILCDB) return liveILCDB;

  return liveILCDB.filter(item => {
    const itemStatusILCDB = item.Province?.trim().toUpperCase();
    const compareStatusILCDB = targetStatusILCDB.trim().toUpperCase();
    return itemStatusILCDB === compareStatusILCDB;
  });

}, [statShowILCDB, liveILCDB]);

const tableILCDB = useReactTable({
  data: filteredDataILCDB,
  columns: columnsILCDB,
  getCoreRowModel: getCoreRowModel(),
});

const ilcdbNearSelectedLGU = useMemo(() => {
  if (!selectedLGU) return [];

  const lguMunicipality = normalizeMunicipality(
    selectedLGU.name?.split(",")[0]
  );

  return liveILCDB.filter((ilcdb) => {
    const ilcdbMunicipality = normalizeMunicipality(ilcdb.Municipality);
    return ilcdbMunicipality === lguMunicipality;
  });

}, [selectedLGU, liveILCDB]);

//#endregion




//#region Cybersec

const [liveCybersec, setLiveCybersec] = useState([]);
const [selectedCybersec, setSelectedCybersec] = useState(null);
const [showMapModalCybersec, setShowMapModalCybersec] = useState(false);
const [additionalInfoCybersec, setAdditionalInfoCybersec] = useState([]);
const [statShowCybersec, setStatShowCybersec] = useState(null);

const [statsCybersec, setStatsCybersec] = useState({
  Province: 0
});

useEffect(() => {

  const fetchCybersecData = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/wifiData`);
      const dataCybersec = response.data;

      const normalizedCybersec = dataCybersec
        .filter(item => item.Province?.trim().toLowerCase() === "albay")
        .map(item => ({
          ...item,
          Province: item.Province?.trim().toUpperCase(),
        }));

      const uniqueMapCybersec = new Map();

      normalizedCybersec.forEach(item => {
        uniqueMapCybersec.set(item._id, item);
      });

      setLiveCybersec(normalizedCybersec);

      const uniqueDataCybersec = Array.from(uniqueMapCybersec.values());

      const Cybersec = uniqueDataCybersec.filter(
        item => item.Province?.trim().toUpperCase() === 'ALBAY'
      ).length;

      setStatsCybersec({
        liveCybersec: Cybersec,
        total: uniqueDataCybersec.length
      });

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCybersecData();

  const interval = setInterval(() => {
    fetchCybersecData();
  }, 5000);

  console.log("statShowCybersec =", statShowCybersec);
  console.log("currentCybersec =", currentCybersec);

  return () => clearInterval(interval);

}, []);

const getColorCybersec = (Province) => {
  switch (Province) {
    case 'Province':
      return '#22c55e';
    default:
      return '#6b7280';
  }
};

const columnHelperCybersec = createColumnHelper();

const columnsCybersec = [
  columnHelperCybersec.accessor("SiteType", {
    header: "Site Type",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("LocationName", {
    header: "Location",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("fundSource", {
    header: "fund Source",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("ProjectName", {
    header: "Project Name",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("Contact", {
    header: "Contact",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("LinkType", {
    header: "Link Type",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("ApCount", {
    header: "Ap Count",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("Coordinates", {
    header: "Coordinates",
    cell: (info) => {
      const coords = info.getValue();
      if (!coords || coords.length < 2) return <span>-</span>;
      return (
        <span className="text-white">
          {coords[1]}, {coords[0]}
        </span>
      );
    },
  }),
  columnHelperCybersec.accessor("LocationCode", {
    header: "Location Code",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("Barangay", {
    header: "Barangay",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("Municipality", {
    header: "Municipality",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("Province", {
    header: "Province",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("Remarks", {
    header: "Remarks",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperCybersec.accessor("NationWideID", {
    header: "NationWide ID",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
];

const statusConfigCybersec = {
  Province: {
    title: "LIVE CYBERSEC ALBAY",
    colorCybersec: "text-blue-400",
    Province: "ALBAY"
  },
};

const currentCybersec = statusConfigCybersec[statShowCybersec];

const filteredDataCybersec = useMemo(() => {
  if (!statShowCybersec) return liveCybersec;

  const targetStatusCybersec = statusConfigCybersec[statShowCybersec]?.Province;
  if (!targetStatusCybersec) return liveCybersec;

  return liveCybersec.filter(item => {
    const itemStatusCybersec = item.Province?.trim().toUpperCase();
    const compareStatusCybersec = targetStatusCybersec.trim().toUpperCase();
    return itemStatusCybersec === compareStatusCybersec;
  });

}, [statShowCybersec, liveCybersec]);

const tableCybersec = useReactTable({
  data: filteredDataCybersec,
  columns: columnsCybersec,
  getCoreRowModel: getCoreRowModel(),
});

const cybersecNearSelectedLGU = useMemo(() => {
  if (!selectedLGU) return [];

  const lguMunicipality = normalizeMunicipality(
    selectedLGU.name?.split(",")[0]
  );

  return liveCybersec.filter((cybersec) => {
    const cybersecMunicipality = normalizeMunicipality(cybersec.Municipality);
    return cybersecMunicipality === lguMunicipality;
  });

}, [selectedLGU, liveCybersec]);


//#endregion



//#region EGOV PH

const [liveEgov, setLiveEgov] = useState([]);
const [selectedEgov, setSelectedEgov] = useState(null);
const [showMapModalEgov, setShowMapModalEgov] = useState(false);
const [additionalInfoEgov, setAdditionalInfoEgov] = useState([]);
const [statShowEgov, setStatShowEgov] = useState(null);

const [statsEgov, setStatsEgov] = useState({
  Province: 0
});

useEffect(() => {

  const fetchEgovData = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/wifiData`);
      const dataEgov = response.data;

      const normalizedEgov = dataEgov
        .filter(item => item.Province?.trim().toLowerCase() === "albay")
        .map(item => ({
          ...item,
          Province: item.Province?.trim().toUpperCase(),
        }));

      const uniqueMapEgov = new Map();

      normalizedEgov.forEach(item => {
        uniqueMapEgov.set(item._id, item);
      });

      setLiveEgov(normalizedEgov);

      const uniqueDataEgov = Array.from(uniqueMapEgov.values());

      const Egov = uniqueDataEgov.filter(
        item => item.Province?.trim().toUpperCase() === 'ALBAY'
      ).length;

      setStatsEgov({
        liveEgov: Egov,
        total: uniqueDataEgov.length
      });

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEgovData();

  const interval = setInterval(() => {
    fetchEgovData();
  }, 5000);

  console.log("statShowEgov =", statShowEgov);
  console.log("currentEgov =", currentEgov);

  return () => clearInterval(interval);

}, []);

const getColorEgov = (Province) => {
  switch (Province) {
    case 'Province':
      return '#22c55e';
    default:
      return '#6b7280';
  }
};

const columnHelperEgov = createColumnHelper();

const columnsEgov = [
  columnHelperEgov.accessor("SiteType", {
    header: "Site Type",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("LocationName", {
    header: "Location",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("fundSource", {
    header: "fund Source",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("ProjectName", {
    header: "Project Name",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("Contact", {
    header: "Contact",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("LinkType", {
    header: "Link Type",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("ApCount", {
    header: "Ap Count",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("Coordinates", {
    header: "Coordinates",
    cell: (info) => {
      const coords = info.getValue();
      if (!coords || coords.length < 2) return <span>-</span>;
      return (
        <span className="text-white">
          {coords[1]}, {coords[0]}
        </span>
      );
    },
  }),
  columnHelperEgov.accessor("LocationCode", {
    header: "Location Code",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("Barangay", {
    header: "Barangay",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("Municipality", {
    header: "Municipality",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("Province", {
    header: "Province",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("Remarks", {
    header: "Remarks",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  columnHelperEgov.accessor("NationWideID", {
    header: "NationWide ID",
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
];

const statusConfigEgov = {
  Province: {
    title: "LIVE EGOV ALBAY",
    colorEgov: "text-blue-400",
    Province: "ALBAY"
  },
};

const currentEgov = statusConfigEgov[statShowEgov];

const filteredDataEgov = useMemo(() => {
  if (!statShowEgov) return liveEgov;

  const targetStatusEgov = statusConfigEgov[statShowEgov]?.Province;
  if (!targetStatusEgov) return liveEgov;

  return liveEgov.filter(item => {
    const itemStatusEgov = item.Province?.trim().toUpperCase();
    const compareStatusEgov = targetStatusEgov.trim().toUpperCase();
    return itemStatusEgov === compareStatusEgov;
  });

}, [statShowEgov, liveEgov]);

const tableEgov = useReactTable({
  data: filteredDataEgov,
  columns: columnsEgov,
  getCoreRowModel: getCoreRowModel(),
});

const egovNearSelectedLGU = useMemo(() => {
  if (!selectedLGU) return [];

  const lguMunicipality = normalizeMunicipality(
    selectedLGU.name?.split(",")[0]
  );

  return liveEgov.filter((egov) => {
    const egovMunicipality = normalizeMunicipality(egov.Municipality);
    return egovMunicipality === lguMunicipality;
  });

}, [selectedLGU, liveEgov]);


//#endregion

// const [wifiDropdownOpen, setWifiDropdownOpen] = useState(false);
// const wifiCount = wifiNearSelectedLGU.length;

//#region for GLOBAL PROJECTS
  

  const getNearLGUData = (data, selectedLGU, key = "Municipality") => {
    if (!selectedLGU) return [];

    const lguName = normalizeMunicipality(selectedLGU.name?.split(",")[0]);

    return data.filter((item) => {
      const itemName = normalizeMunicipality(item?.[key]);
      return itemName === lguName;
    });
  };

  // 2. DATA SOURCES
  const projectData = {
    wifi: liveWIFI,
    pnpki: livePNPKI,
    ilcdb: liveILCDB,
    cyber: liveCybersec,
    egov: liveEgov,
  };

  // 3. DERIVED STATE (useMemo LAST)
  const nearData = useMemo(() => {
    if (!selectedLGU) return {};

    return Object.fromEntries(
      Object.entries(projectData).map(([key, value]) => [
        key,
        getNearLGUData(value, selectedLGU, "Municipality"),
      ])
    );
  }, [selectedLGU, liveWIFI, livePNPKI, liveILCDB, liveCybersec, liveEgov]);

  const hasServices =
  additionalInfo.length > 0 ||
  (nearData.wifi?.length > 0) ||
  (nearData.pnpki?.length > 0) ||
  (nearData.ilcdb?.length > 0) ||
  (nearData.cyber?.length > 0) ||
  (nearData.egov?.length > 0);

//#endregion

const [openProject, setOpenProject] = useState(null);
const projectSections = [
  {
    key: "wifi",
    title: "📡 WiFi Sites",
    data: wifiNearSelectedLGU,
    render: (item) => (
      <>
        <p className="text-white font-medium">{item.LocationName}</p>
        <p className="text-xs text-gray-400">{item.SiteType}</p>
        <p className="text-xs text-sky-300">📍 {item.Municipality}</p>
      </>
    ),
  },

  {
    key: "pnpki",
    title: "🔐 PNPKI",
    data: pnpkiNearSelectedLGU, // replace with your PNPKI filtered data
    render: (item) => (
      <>
        <p className="text-white font-medium">{item.AgencyName}</p>
        <p className="text-xs text-sky-300">📍 {item.Status}</p>
        <p className="text-xs text-gray-400">{item.Address}</p>
      </>
    ),
  },

  {
    key: "ilcdb",
    title: "🧠 ILCDB",
    data: [], // replace later
    render: (item) => (
      <p className="text-white">{item.title || "ILCDB Data"}</p>
    ),
  },

  {
    key: "cyber",
    title: "🛡 Cybersecurity",
    data: [], // replace later
    render: (item) => (
      <p className="text-white">{item.name || "Cyber Data"}</p>
    ),
  },
];
// console.log("PNPKI DATA", livePNPKI);
// console.log("PNPKI FILTERED", nearData.pnpki);
// console.log(nearData.pnpki?.[0]);
console.log("Additional Info: ",pnpkiNearSelectedLGU)
//#region FOR START LOADING

  if (loading) {

    return (

      <div className='flex min-h-screen bg-[#050816] text-white items-center justify-center'>

        <div className='flex flex-col items-center gap-4'>

          <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>

          <div className='text-2xl'>
            Loading...
          </div>

        </div>

      </div>

    );

  }

//#endregion

  const handleExportImage = async () => {
    // setShowMapModal(false);
    // setStatShow(null);

    const element = document.getElementById("dashboard-export");

    if (!element) return

    toast.info("Preparing your dashboard report...", { autoClose: 2000 });

    try {
      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: "#050816",
        pixelRatio: 2,
      })

      const link = document.createElement("a");
      link.download = "DigiGOV-Monitoring-Dashboard.png";
      link.href = dataUrl;
      link.click();

      toast.success("Dashboard report downloaded!", { autoClose: 2000 });
    } catch (err) {
      toast.error("Failed to export Dashboard")
      console.error("Export Error:", err);
    }
  };

  return (

    <div id="dashboard-export" className='flex min-h-screen overflow-x-hidden bg-[#050816] text-white'>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* SIDEBAR */}
      <div className='hidden lg:block lg:w-[250px] lg:shrink-0'>

        <div className='fixed top-0 left-0 h-screen w-[250px] z-50'>
          <Navbar />
        </div>

      </div>

      {/* MAIN */}
      <div className='flex flex-col w-full p-4 sm:p-6'>

        {/* HEADER */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>

          <div> 

            <div className='flex items-center justify-center gap-10'>
              <h1 className='tracking-wide font-semibold text-2xl'>
                ALBAY - PROVINCIAL
              </h1>
              <button onClick={handleExportImage} className='border border-blue-500/30 hover:bg-blue-500/10 transition rounded-xl py-1 px-5 flex items-center justify-center gap-2 text-blue-300 font-medium'>

                <HiOutlineDownload className='text-lg' />

                Export Report - Data

              </button>
            </div>

            <span className='text-sm text-gray-400'>
              Region V - Bicol Region
            </span>

          </div>
        </div>

        {/* CARDS */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 py-6'>

          {/* LIVE */}
          <button 
            onClick={() => setStatShow("live")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-[#071b12] to-[#041018] p-5 shadow-[0_0_25px_rgba(0,255,128,0.08)]'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center'>
                <TbRadar2 className='text-2xl text-green-400' />
              </div>

              <div>

                <h1 className='text-green-300 text-xs font-medium'>
                  LIVE eLGUs
                </h1>

                <h2 className='text-2xl font-bold text-green-400 leading-none mt-1'>
                  {stats.live}
                  
                </h2>
                {/* <h3 className='text-gray-400 text-sm mt-1'>
                  V1: {stats.v1}
                </h3> */}

              </div>

            </div>

          </button>

          {/* BUILDUP */}
          <button 
            onClick={() => setStatShow("uat")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-[#1a1405] to-[#100b03] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center'>
                <HiOutlineDocumentSearch className='text-2xl text-yellow-400' />
              </div>

              <div>

                <h1 className='text-yellow-300 text-sm font-medium'>
                  BUILD UP
                </h1>

                <h2 className='text-2xl font-bold text-yellow-400 leading-none mt-1'>
                  {stats.DATA}
                </h2>

              </div>

            </div>

          </button>


          {/* UAT */}
          <button 
            onClick={() => setStatShow("uat")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-[#1a1405] to-[#100b03] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center'>
                <HiOutlineDocumentSearch className='text-2xl text-yellow-400' />
              </div>

              <div>

                <h1 className='text-yellow-300 text-sm font-medium'>
                  UAT eLGUs
                </h1>

                <h2 className='text-2xl font-bold text-yellow-400 leading-none mt-1'>
                  {stats.uat}
                </h2>

              </div>

            </div>

          </button>

          {/* TRAINING */}
          {/* <button 
            onClick={() => setStatShow("training")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-[#1b1007] to-[#120803] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center'>
                <FaChalkboardTeacher className='text-2xl text-orange-400' />
              </div>

              <div>

                <h1 className='text-orange-300 text-sm font-medium'>
                  Admin Training
                </h1>

                <h2 className='text-2xl font-bold text-orange-400 leading-none mt-1'>
                  {stats.training}
                </h2>

              </div>

            </div>

          </button> */}

          {/* INACTIVE */}
          <button 
            onClick={() => setStatShow("inactive")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-[#1a0707] to-[#100303] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center'>
                <FaBan className='text-2xl text-red-400' />
              </div>

              <div>

                <h1 className='text-red-300 text-sm font-medium'>
                  Inactive
                </h1>

                <h2 className='text-2xl font-bold text-red-400 leading-none mt-1'>
                  {stats.inactive}
                </h2>

              </div>

            </div>

          </button>

          {/* no system */}
          <button 
            onClick={() => setStatShow("inactive")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-[#1a0707] to-[#100303] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center'>
                <FaBan className='text-2xl text-red-400' />
              </div>

              <div>

                <h1 className='text-red-300 text-sm font-medium'>
                  NO SYSTEM
                </h1>

                <h2 className='text-2xl font-bold text-red-400 leading-none mt-1'>
                  {stats.nosystem}
                </h2>

              </div>

            </div>

          </button>

          {/* THIRD PARTY */}
          <button 
            onClick={() => setStatShow("thirdParty")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#07101f] to-[#040916] p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center'>
                <FaCogs className='text-2xl text-blue-400' />
              </div>

              <div>

                <h1 className='text-blue-300 text-sm font-medium'>
                  OWN SYS
                </h1>

                <h2 className='text-2xl font-bold text-blue-400 leading-none mt-1'>
                  {stats.thirdParty}
                </h2>

              </div>

            </div>

          </button>

          {/* WIFI */}
          <button 
            onClick={() => setStatShowWIFI("Province")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-sky-400/30 bg-gradient-to-br from-sky-900/40 to-slate-950 p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center'>
                <TbRadar2 className='text-2xl text-sky-300' />
              </div>

              <div>
                <h1 className='text-sky-300 text-xs font-medium'>WIFI</h1>
                <h2 className='text-2xl font-bold text-sky-300 leading-none mt-1'>
                  {statsWIFI.liveWIFI}
                </h2>
              </div>

            </div>
          </button>

          {/* PNPKI */}
          <button 
            onClick={() => setStatShowPNPKI("Province")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-900/30 to-slate-950 p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center'>
                <HiOutlineDocumentSearch className='text-2xl text-amber-300' />
              </div>

              <div>
                <h1 className='text-amber-300 text-xs font-medium'>PNPKI</h1>
                <h2 className='text-2xl font-bold text-amber-300 leading-none mt-1'>
                  {statsPNPKI.livePNPKI}
                </h2>
              </div>

            </div>
          </button>

          {/* ILCDB */}
          <button 
            onClick={() => setStatShow("ilcdb")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-900/30 to-slate-950 p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center'>
                <FaChalkboardTeacher className='text-2xl text-violet-300' />
              </div>

              <div>
                <h1 className='text-violet-300 text-xs font-medium'>ILCDB</h1>
                <h2 className='text-2xl font-bold text-violet-300 leading-none mt-1'>
                  {stats.liveILCDB}
                </h2>
              </div>

            </div>
          </button>

          {/* CYBERSECURITY */}
          <button 
            onClick={() => setStatShow("cybersecurity")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-900/30 to-slate-950 p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center'>
                <FaShieldAlt className='text-2xl text-red-300' />
              </div>

              <div>
                <h1 className='text-red-300 text-xs font-medium'>Cybersecurity</h1>
                <h2 className='text-2xl font-bold text-red-300 leading-none mt-1'>
                  {stats.liveCybersec}
                </h2>
              </div>

            </div>
          </button>


          {/* EGOV PH */}
          <button 
            onClick={() => setStatShow("egov")}
            className='relative hover:scale-105 transition-all h-20 duration-300 overflow-hidden rounded-2xl border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-900/30 to-slate-950 p-5'>

            <div className='relative z-10 flex items-start gap-4'>

              <div className='w-12 h-12 rounded-full bg-fuchsia-500/10 flex items-center justify-center'>
                <FaGlobe className='text-2xl text-fuchsia-300' />
              </div>

              <div>
                <h1 className='text-fuchsia-300 text-xs font-medium'>eGOV PH</h1>
                <h2 className='text-2xl font-bold text-fuchsia-300 leading-none mt-1'>
                  {stats.egov}
                </h2>
              </div>

            </div>
          </button>
          {/* 2nd card End*/}

        </div>

        {/* modal for stat start */}

        {statShowPNPKI && (
          <div
            className="fixed inset-0 p-4 bg-black/10 flex items-center justify-center z-[9999]"
            onClick={() => setStatShowPNPKI(false)}
          >
            <div
              className="bg-gray-900 p-6 rounded-xl w-[1500px] max-h-[100vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setStatShowPNPKI(false)}
                className="float-right text-white"
              >
                ✕
              </button>

              <h2 className={`${currentPNPKI.colorPNPKI} text-xl font-bold`}>
                {currentPNPKI.title}
              </h2>
                {/* 
              <p className="text-white">
                Rows: {filteredData.length}
              </p> */}

              <div className="max-h-[400px] overflow-y-auto rounded-lg">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-900 z-10">
                    {tableWIFI.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="text-xs text-left py-3 px-4 text-slate-400 border-b border-white/10"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  <tbody>
                    {tablePNPKI.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b border-white/10">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-3 px-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* WIFI Modal */}
        {statShowWIFI && (
          <div
            className="fixed inset-0 p-4 bg-black/10 flex items-center justify-center z-[9999]"
            onClick={() => setStatShowWIFI(false)}
          >
            <div
              className="bg-gray-900 p-6 rounded-xl w-[1500px] max-h-[100vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setStatShowWIFI(false)}
                className="float-right text-white"
              >
                ✕
              </button>

              <h2 className={`${currentWIFI.colorWIFI} text-xl font-bold`}>
                {currentWIFI.title}
              </h2>
                {/* 
              <p className="text-white">
                Rows: {filteredData.length}
              </p> */}

              <div className="max-h-[400px] overflow-y-auto rounded-lg">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-900 z-10">
                    {tableWIFI.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="text-xs text-left py-3 px-4 text-slate-400 border-b border-white/10"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  <tbody>
                    {tableWIFI.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b border-white/10">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-3 px-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LGU Modal */}
        {statShow && (
          <div
            className="fixed inset-0 p-4 bg-black/10 flex items-center justify-center z-[9999]"
            onClick={() => setStatShow(false)}
          >
            <div
              className="bg-gray-900 p-6 rounded-xl w-[600px] max-h-[100vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setStatShow(false)}
                className="float-right text-white"
              >
                ✕
              </button>

              <h2 className={`${current.color} text-2xl font-bold`}>
                {current.title}
              </h2>
                {/* 
              <p className="text-white">
                Rows: {filteredData.length}
              </p> */}

              <div className="max-h-[400px] overflow-y-auto rounded-lg">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-900 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="text-left py-3 px-4 text-slate-400 border-b border-white/10"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b border-white/10">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-3 px-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* modal for stat end */}

        {/* DASHBOARD GRID */}
        <div className='grid grid-cols-1 xl:grid-cols-4 gap-5'>

          {/* MAP */}
          <div className='border border-[#1d2942] bg-[#091121] min-h-[400px] xl:col-span-2 p-5 rounded-2xl overflow-hidden'>

            <div className='flex items-center justify-between mb-5'>

              <h1 className='font-semibold text-lg'>
                eLGU Overview
              </h1>

            </div>

            <div className="w-full h-[700px] rounded-xl overflow-hidden border border-[#1d2942]">

              <MapContainer
                center={[13.3, 123.5]}
                zoom={9}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >

                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {liveLgus.map((lgu, i) => (

                  <CircleMarker
                    key={i}
                    center={[
                      lgu.coordinates[1],
                      lgu.coordinates[0]
                    ]}
                    radius={
                      selectedLGU?.name === lgu.name
                        ? 14
                        : 8
                    }
                    pathOptions={{
                      color: getColor(lgu.status),
                      fillColor: getColor(lgu.status),
                      fillOpacity: 0.8,
                      weight: 2
                    }}
                    //
                    eventHandlers={{
                      click: async () => {

                        setSelectedLGU(lgu);

                        await fetchAdditionalInfo(lgu.name);

                        setShowMapModal(true);

                      }
                    }}
                  />

                ))}

              </MapContainer>

            </div>

          </div>

          {/* CARDS */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5'>

            <DashboardCard />

            <EgovPromotional />

          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5'>

            <EGovPH />

          </div>

        </div>

      </div>

      {/* FULLSCREEN MAP MODAL */}
      {showMapModal && selectedLGU && (

        <div className='fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex'>

          {/* LEFT SIDE */}
          <div className='flex-1 relative'>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowMapModal(false)}
              className='absolute top-5 right-5 z-[99999] bg-red-500 hover:bg-red-600 transition w-12 h-12 rounded-full text-white text-2xl'
            >
              ✕
            </button>

            {/* FULLSCREEN MAP */}
            <MapContainer
              center={[
                selectedLGU.coordinates[1],
                selectedLGU.coordinates[0]
              ]}
              zoom={12}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >

              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {liveLgus.map((lgu, i) => (

                <CircleMarker
                  className='animate-pulse'
                  key={i}
                  center={[
                    lgu.coordinates[1],
                    lgu.coordinates[0]
                  ]}
                  radius={
                    selectedLGU.name === lgu.name
                      ? 15
                      : 9
                  }
                  pathOptions={{
                    color: getColor(lgu.status),
                    fillColor: getColor(lgu.status),
                    fillOpacity: 0.9,
                    weight: 3
                  }}
                  eventHandlers={{
                    click: async () => {

                      setSelectedLGU(lgu);

                      await fetchAdditionalInfo(lgu.name);

                    }
                  }}
                />

              ))}

              {/* WIFI MARKERS */}
              {/* WIFI MARKERS FOR SELECTED LGU ONLY */}
              {wifiNearSelectedLGU.map((wifi, i) => {

                return (
                  <>
                    <Marker
                      key={wifi._id || wifi.LocationName}
                      position={[
                        wifi.Coordinates[0],
                        wifi.Coordinates[1]
                      ]}
                      icon={wifiIcon}
                    />
                  </>
                );
              })}
              {pnpkiNearSelectedLGU.map((pnpki, i) => {
                return (
                  <>
                    <Marker
                      key={pnpki._id || pnpki.Address}
                      position={[
                        pnpki.Coordinates[0],
                        pnpki.Coordinates[1]
                      ]}
                      icon={pnpkiIcon}
                    />
                  </>
                );
              })}

            </MapContainer>

          </div>

          {/* RIGHT PANEL */}
          <div className='w-[420px] bg-[#091121] border-l border-[#1d2942] p-6 overflow-y-auto'>

            {/* TITLE */}
            <div className='mb-6'>

              <h1 className='text-3xl font-bold text-white'>
                {selectedLGU.name}
              </h1>

              <p className='text-gray-400 mt-2'>
                LGU Information Details
              </p>

            </div>

            {/* STATUS CARD */}
            <div className='bg-[#111827] rounded-2xl border border-[#1d2942] p-5 mb-5'>

              <p className='text-gray-400 text-sm mb-3'>
                Current Status
              </p>

              <div
                className='inline-flex px-5 py-2 rounded-xl text-white font-semibold'
                style={{
                  backgroundColor: getColor(selectedLGU.status)
                }}
              >
                {selectedLGU.status}
              </div>

            </div>

            {/* LGU DETAILS */}
            <div className='bg-[#111827] rounded-2xl border border-[#1d2942] p-5 mb-5'>

              <h2 className='text-xl font-semibold mb-5'>
                Municipality Details
              </h2>

              <div className='space-y-3 text-sm'>

                <div>
                  <p className='text-gray-400'>
                    Municipality
                  </p>

                  <p className='text-white text-lg'>
                    {selectedLGU.name}
                  </p>
                </div>

                <div>
                  <p className='text-gray-400'>
                    eLGU Version
                  </p>

                  <p className='text-white'>
                    {selectedLGU.version || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className='text-gray-400'>
                    Region
                  </p>

                  <p className='text-white'>
                    Region V - Bicol Region
                  </p>
                </div>

                <div>
                  <p className='text-gray-400'>
                    Province
                  </p>

                  <p className='text-white'>
                    {selectedLGU.name.split(',')[1]?.trim() || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className='text-gray-400'>
                    Coordinates
                  </p>

                  <p className='text-white'>
                    {selectedLGU.coordinates[1]},
                    {" "}
                    {selectedLGU.coordinates[0]}
                  </p>
                </div>

              </div>

            </div>
            
            {/* EXTRA CARD */}
            {/* PROJECTS DROPDOWN SYSTEM */}
            <div className="space-y-2">

              {projectSections.map((project) => {
                const isOpen = openProject === project.key;

                return (
                  <div
                    key={project.key}
                    className="border border-sky-500/20 rounded-xl overflow-hidden"
                  >

                    {/* HEADER */}
                    <button
                      onClick={() =>
                        setOpenProject(isOpen ? null : project.key)
                      }
                      className="w-full flex justify-between items-center px-4 py-3 bg-sky-500/10 hover:bg-sky-500/20 transition"
                    >
                      <span className="text-sky-300 font-medium">
                        {project.title} ({project.data.length})
                      </span>

                      <span className="text-sky-300">
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* CONTENT */}
                    {isOpen && (
                      <div className="max-h-[300px] overflow-y-auto p-3 space-y-3 bg-[#0b1220]">

                        {project.data.length > 0 ? (
                          project.data.map((item, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg border border-sky-500/20 bg-sky-500/5"
                            >
                              {project.render(item)}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No data available
                          </p>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          </div>

        </div>

      )}

    </div>

  )

}

export default Albay