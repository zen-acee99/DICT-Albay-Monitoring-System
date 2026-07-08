import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UrlRedirectHandler() {
  const { code } = useParams();
  const [error, setError] = useState("");
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  
  // ⭐ FIX: A mutable flag tracking reference to ensure we only execute the API call once
  const strictlyExecuted = useRef(false);

  useEffect(() => {
    // If this effect has already fired during this component's lifespan, stop right here!
    if (strictlyExecuted.current) return;

    const fetchOriginalUrl = async () => {
      try {
        strictlyExecuted.current = true; // Flag that execution is running
        console.log(`🔍 Routing lookup triggered for code: "${code}"`);
        
        const response = await axios.get(`${VITE_API_URL}/albay-urlShortener/info/${code}`);
        let destination = response.data.originalUrl;

        if (destination) {
          if (!/^https?:\/\//i.test(destination)) {
            destination = `https://${destination}`;
          }
          window.location.replace(destination);
        } else {
          setError("The database record has no valid destination URL attached.");
        }
        
      } catch (err) {
        console.error("❌ Link fetching failed:", err.response?.data || err.message);
        setError("URL not found or has expired.");
      }
    };

    if (code) {
      fetchOriginalUrl();
    }
  }, [code, VITE_API_URL]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-[#0B1225] border border-red-500/30 rounded-xl p-6 text-center max-w-sm">
          <p className="text-red-400 font-semibold text-lg mb-2">Routing Failure</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-slate-300">Redirecting you to your destination...</p>
        <p className="text-xs text-slate-500">Processing url: {code}</p>
      </div>
    </div>
  );
}