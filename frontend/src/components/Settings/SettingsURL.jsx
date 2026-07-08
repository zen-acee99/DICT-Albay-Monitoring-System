import {
  Link,
  QrCode,
  Copy,
  Download,
  MousePointerClick
} from "lucide-react";

import Navbar from '../Layout/Navbar';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";


export default function UrlShortener() {
    
    const [originalUrl, setOriginalUrl] = useState("");
    const [customAlias, setCustomAlias] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    
    // ⭐ Fix: Create an array state to safely hold historical items 
    const [urlList, setUrlList] = useState([]);
    
    const qrRef = useRef(null);
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    // ⭐ Fix: Fetch function to pull data down from the database
    const fetchUrls = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/albay-urlShortener/all`);
        setUrlList(response.data);
      } catch (error) {
        console.error("Error fetching URLs:", error);
      }
    };

    // ⭐ Fix: Automatically fetch records on page refresh/mount
    useEffect(() => {
      fetchUrls();
      
      // Keep click statistics synchronized by running an automatic background pull every 4 seconds
      const timer = setInterval(fetchUrls, 4000);
      return () => clearInterval(timer);
    }, []);
    
    const createShortUrl = async () => {
    try {
      const payload = {
        originalUrl: originalUrl,
        customAlias: customAlias 
      };

      const response = await axios.post(
            `${VITE_API_URL}/albay-urlShortener`,
            payload
          );

      console.log("CREATED:", response.data);
      
      let incomingUrl = response.data.shortUrl;
      
      if (incomingUrl && incomingUrl.includes("undefined")) {
        const shortCode = incomingUrl.split("undefined/")[1];
        incomingUrl = `${window.location.origin}/${shortCode}`;
      }

      setShortUrl(incomingUrl);
      
      // Clear input fields and refresh the database list view instantly
      setOriginalUrl("");
      setCustomAlias("");
      fetchUrls();

    } catch(error){
      console.error("CREATE URL ERROR:", error);
      if(error.response){
        console.log(error.response.data);
      }
    }
  };

  const downloadQRCode = () => {
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, 300, 300);
      
      const png = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = png;
      downloadLink.download = `${customAlias || "short-url"}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    image.src = blobURL;
  };


  return (
    <div className="min-h-screen bg-[#050816] text-slate-200 lg:ml-[250px] p-6">

      <div className='hidden lg:block lg:w-[250px] lg:shrink-0'>
        <div className='fixed top-0 left-0 h-screen w-[250px] z-50'>
          <Navbar />
        </div>
      </div>

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">URL Shortener</h1>
        <p className="text-sm text-slate-400">Generate short links and QR codes</p>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-3 gap-6">

        {/* CREATE URL */}
        <div className="col-span-2 bg-[#0B1225] border border-[#1E293B] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Link className="text-purple-400"/>
            <h2 className="text-lg font-semibold">Create Short URL</h2>
          </div>

          <label className="text-sm">Original URL</label>
          <input
            value={originalUrl}
            onChange={(e)=>setOriginalUrl(e.target.value)}
            className="w-full mt-2 bg-[#050816] border border-[#1E293B] rounded-lg px-4 py-3 outline-none focus:border-purple-500"
            placeholder="https://example.com"
          />

          <label className="text-sm mt-5 block">Custom Alias (optional)</label>
          <input
            value={customAlias}
            onChange={(e)=>setCustomAlias(e.target.value)}
            className="w-full mt-2 bg-[#050816] border border-[#1E293B] rounded-lg px-4 py-3 outline-none focus:border-purple-500"
            placeholder="my-link"
          />

          <button
            onClick={createShortUrl}
            className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium"
          >
            Generate Short URL
          </button>

          {shortUrl && (
            <div className="mt-5">
              <p className="text-sm text-slate-400">Your Short URL</p>
              <p className="text-purple-400 mt-2">{shortUrl}</p>
            </div>
          )}
        </div>

        {/* QR PREVIEW CARD */}
        <div className="bg-[#0B1225] border border-[#1E293B] rounded-xl p-6 flex flex-col items-center">
          <QrCode size={32} className="text-purple-400" />
          <h2 className="mt-3 font-semibold">QR Preview</h2>

          <div
            ref={qrRef}
            className="mt-5 w-48 h-48 bg-white rounded-lg flex items-center justify-center p-4"
          >
            {shortUrl ? (
              <QRCodeSVG 
                value={shortUrl} 
                size={160}
                level={"H"}
              />
            ) : (
              <QrCode size={120} className="text-slate-300" />
            )}
          </div>

          <button
            onClick={downloadQRCode}
            disabled={!shortUrl}
            className={`mt-5 flex items-center gap-2 border px-5 py-2 rounded-lg transition-all ${
              shortUrl 
                ? "border-purple-500 text-purple-400 hover:bg-purple-500/10 cursor-pointer" 
                : "border-slate-700 text-slate-500 cursor-not-allowed opacity-50"
            }`}
          >
            <Download size={18}/>
            Download QR
          </button>
        </div>

      </div>

      {/* TABLE */}
      <div className="mt-6 bg-[#0B1225] border border-[#1E293B] rounded-xl p-6">
        <h2 className="font-semibold mb-5">Recent Short URLs</h2>
        <table className="w-full text-sm table-fixed">
          <thead className="text-slate-400">
            <tr className="border-b border-[#1E293B]">
              <th className="text-left py-3 w-[40%]">Original URL</th>
              <th className="w-[35%]">Short URL</th>
              <th className="w-[12%]">Clicks</th>
              <th className="w-[13%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {urlList.length > 0 ? (
              // ⭐ Fix: Map rows dynamically using database documents!
              urlList.map((urlItem) => {
                const absoluteLink = `${window.location.origin}/${urlItem.shortCode}`;
                return (
                  <tr key={urlItem._id} className="border-b border-[#1E293B]">
                    <td className="py-4 text-left truncate pr-4 max-w-0" title={urlItem.originalUrl}>
                      {urlItem.originalUrl}
                    </td>
                    <td className="text-purple-400 text-center truncate max-w-0">
                      <a href={absoluteLink} target="_blank" rel="noreferrer" className="hover:underline">
                        {absoluteLink}
                      </a>
                    </td>
                    <td className="text-center font-semibold text-slate-300">
                      {urlItem.clicks || 0}
                    </td>
                    <td className="flex justify-center py-4">
                      <Copy
                        size={18}
                        onClick={() => navigator.clipboard.writeText(absoluteLink)}
                        className="cursor-pointer text-slate-400 hover:text-purple-400 transition-colors"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-5 text-slate-400">
                  No shortened URLs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}