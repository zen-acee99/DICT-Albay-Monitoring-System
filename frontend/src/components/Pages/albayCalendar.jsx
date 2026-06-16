import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { X, Calendar as CalendarIcon, Clock, MapPin, Tag, Users, AlertCircle } from 'lucide-react';

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1L_TU3zUFRqj5CS1avunjPt9a-psHkQqQVBUHYTaVzt0/edit?gid=18955515#gid=18955515";
const response = await fetch(GOOGLE_SHEET_URL);
const csvText = await response.text();

// HARDCODED FALLBACK: Your exact June 15 data from the screenshot if the fetch gets blocked
const FALLBACK_DATA = [
  {
    month: "June", startDate: "June 15, 2026", endDate: "June 15, 2026",
    startTime: "8:00 AM", endTime: "5:00 PM", duration: "8 hrs",
    title: "Provision of Temp. Internet Connectivity for the Distribution of Land titles and Certificates of condonation with Release of Mortgage - DAR",
    projectProgram: "WIFI", location: "Ibalong Centrum for Recreation, Legazpi City",
    targetSector: "All Sectors", mode: "Physical", status: "Rescheduled",
    assignedStaff: "N/A", remarks: "New schedule"
  },
  {
    month: "June", startDate: "June 15, 2026", endDate: "June 22, 2026",
    startTime: "8:00 AM", endTime: "2:00 PM", duration: "6 hrs",
    title: "Python Programming Essential with AI Integration",
    projectProgram: "ILCDB", location: "TBD",
    targetSector: "All Sectors", mode: "Online", status: "Pending",
    assignedStaff: "N/A", remarks: "RP: Sir Rufino - Already coordinated, waiting for confirmation"
  }
];

export default function DigiGovCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // June 2026 Grid Specs
  const currentYear = 2026;
  const currentMonthName = "June";
  const daysInMonth = 30;
  const emptyDaysBefore = 1; // June 1, 2026 is a Monday

  useEffect(() => {
    const fetchSpreadsheetData = async () => {
      try {
        console.log("Attempting to fetch Google Sheet through CORS proxy...");
        const response = await fetch(PROXIED_URL);
        
        if (!response.ok) throw new Error("Network response error");
        
        const csvText = await response.text();
        console.log("CSV Successfully downloaded. Parsing...");

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("Parsed rows count:", results.data.length);
            
            const formattedEvents = results.data.map((row) => ({
              month: row['Month']?.trim(),
              startDate: row['Start Date']?.trim(),
              endDate: row['End Date']?.trim(),
              startTime: row['Start Time']?.trim(),
              endTime: row['End Time']?.trim(),
              duration: row['Duration']?.trim(),
              title: row['Title']?.trim(),
              projectProgram: row['Project/Program']?.trim(),
              location: row['Location']?.trim(),
              targetSector: row['Target Sector']?.trim(),
              mode: row['Mode']?.trim(),
              status: row['Status']?.trim(),
              assignedStaff: row['Assigned Staff']?.trim(),
              remarks: row['Remarks']?.trim(),
            }));
            
            setEvents(formattedEvents);
            setLoading(false);
          },
          error: (error) => {
            console.error("PapaParse failed:", error);
            triggerFallback();
          }
        });
      } catch (error) {
        console.warn("CORS fetch blocked or failed. Activating screenshot fallback engine.", error);
        triggerFallback();
      }
    };

    const triggerFallback = () => {
      setEvents(FALLBACK_DATA);
      setUsingFallback(true);
      setLoading(false);
    };

    fetchSpreadsheetData();
  }, []);

  // Helper to extract day numbers out of textual formats like "June 15, 2026"
  const getDayFromDateString = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes(',')) {
      const parts = dateStr.replace(',', '').split(' ');
      return parseInt(parts[1], 10);
    }
    if (dateStr.includes('/')) {
      return parseInt(dateStr.split('/')[1], 10);
    }
    return null;
  };

  const getEventsForDay = (dayNumber) => {
    return events.filter(event => {
      const matchesMonth = event.month?.toLowerCase() === 'june' || event.startDate?.toLowerCase().includes('june');
      const eventDay = getDayFromDateString(event.startDate);
      return matchesMonth && eventDay === dayNumber;
    });
  };

  const handleDayClick = (dayNumber) => {
    setSelectedDate(dayNumber);
    setIsModalOpen(true);
  };

  // Build grid components array
  const calendarCells = [];
  for (let i = 0; i < emptyDaysBefore; i++) {
    calendarCells.push({ type: 'empty', id: `empty-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({ type: 'day', dayNumber: day, events: getEventsForDay(day) });
  }

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return 'bg-green-900/40 text-green-400 border border-green-700/50';
    if (s === 'pending') return 'bg-amber-900/40 text-amber-400 border border-amber-700/50';
    if (s === 'cancelled') return 'bg-red-900/40 text-red-400 border border-red-700/50';
    if (s === 'rescheduled') return 'bg-red-600 text-white font-bold px-2 py-0.5 rounded';
    if (s === 'ongoing') return 'bg-blue-900/40 text-blue-400 border border-blue-700/50';
    return 'bg-slate-800 text-slate-400';
  };

  const selectedDateEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="flex h-screen bg-[#060b13] text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0a1220] border-r border-slate-800 flex flex-col justify-between p-4 z-10">
        <div>
          <div className="flex items-center space-x-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center font-bold text-sm text-white">DG</div>
            <span className="text-xl font-bold tracking-wider text-slate-200">DigiGOV</span>
          </div>
          
          <nav className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border border-indigo-500/30 text-indigo-200 font-medium transition">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span>Overview</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition">
              <span className="w-2 h-2 rounded-full bg-transparent"></span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="bg-[#0e192b] p-4 rounded-2xl border border-slate-800 text-center space-y-3">
          <div className="text-xs font-bold text-blue-400 tracking-wider">eLGU DICT Region 5</div>
          <div className="text-lg font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">eGOV PH</div>
          <p className="text-[10px] text-slate-500 leading-relaxed">Build. Empower. Transform. eGovPH Ecosystem</p>
        </div>
      </aside>

      {/* MAIN MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto relative">
        
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">ALBAY PO - CALENDAR</h1>
            <p className="text-sm text-slate-400">Region V - Bicol Region</p>
          </div>
          <div className="flex items-center gap-4">
            {usingFallback && (
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg">
                ⚠️ Displaying Screenshot Fallback (CORS Active)
              </span>
            )}
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 text-sm">
              + Add New Schedule
            </button>
          </div>
        </header>

        {/* CALENDAR BLOCK */}
        <section className="bg-[#0a1220] border border-slate-800/80 rounded-2xl flex flex-col flex-1 overflow-hidden">
          
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0c1626]">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-5 h-5 text-indigo-400" />
              <span className="text-lg font-semibold text-slate-200">{currentMonthName} <span className="text-slate-500 font-normal">{currentYear}</span></span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">Today</span>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-800 bg-[#080f1a]">
            {['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map((day) => (
              <div key={day} className="py-2.5 text-center text-[10px] font-bold tracking-widest text-slate-500 border-r border-slate-800/40 last:border-0">
                {day}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400">Bypassing CORS filters...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 grid-rows-5 flex-1 bg-[#09101d]">
              {calendarCells.map((cell, index) => {
                if (cell.type === 'empty') {
                  return <div key={cell.id} className="bg-[#070d17]/40 border-b border-r border-slate-800/50" />;
                }

                const isJune15 = cell.dayNumber === 15;
                const hasEvents = cell.events.length > 0;

                return (
                  <div
                    key={`day-${cell.dayNumber}`}
                    onClick={() => handleDayClick(cell.dayNumber)}
                    className={`p-2 border-b border-r border-slate-800/60 relative cursor-pointer group flex flex-col justify-between transition-all duration-200 
                      ${isJune15 ? 'bg-indigo-950/40 border-indigo-500/50 border-2' : 'hover:bg-slate-800/30'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full
                        ${isJune15 ? 'bg-purple-600 text-white font-bold ring-4 ring-purple-600/20' : 'text-slate-400'}
                      `}>
                        {cell.dayNumber}
                      </span>
                      {hasEvents && (
                        <span className="text-[10px] bg-indigo-500/20 font-bold px-1.5 py-0.5 rounded text-indigo-300">
                          {cell.events.length} Items
                        </span>
                      )}
                    </div>

                    <div className="mt-2 space-y-1 flex-1 flex flex-col justify-end overflow-hidden max-h-[70px]">
                      {cell.events.map((ev, i) => (
                        <div 
                          key={i} 
                          className={`text-[9px] px-1 py-0.5 rounded truncate font-medium border
                            ${ev.status?.toLowerCase() === 'rescheduled' ? 'bg-red-600 text-white border-transparent' : 'bg-slate-900 text-slate-300 border-slate-800'}
                          `}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* FULL SIDE MODAL SYSTEM (H-FULL / RIGHT SIDE OVERLAY) */}
      <div className={`fixed inset-y-0 right-0 z-50 flex justify-end pointer-events-none transition-all duration-300 ${isModalOpen ? 'backdrop-blur-sm bg-black/40 w-full' : 'w-0'}`}>
        {isModalOpen && <div className="absolute inset-0 pointer-events-auto" onClick={() => setIsModalOpen(false)} />}

        <div className={`w-full max-w-xl bg-[#09101d] h-full shadow-2xl border-l border-slate-800 p-6 flex flex-col justify-between pointer-events-auto transform transition-transform duration-300 ease-out
          ${isModalOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Schedule Overview</span>
              </div>
              <h2 className="text-xl font-bold text-white">{currentMonthName} {selectedDate}, {currentYear}</h2>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 my-4 overflow-y-auto pr-1 space-y-4">
            {selectedDateEvents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2">
                <AlertCircle className="w-12 h-12 text-slate-600" />
                <h3 className="text-slate-300 font-semibold">No schedules recorded</h3>
              </div>
            ) : (
              selectedDateEvents.map((item, index) => (
                <div key={index} className={`p-4 rounded-xl border flex flex-col space-y-3 ${item.status?.toLowerCase() === 'rescheduled' ? 'bg-red-950/20 border-red-500/40' : 'bg-slate-900/60 border-slate-800'}`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-900 rounded">
                        {item.projectProgram}
                      </span>
                      <span className={getStatusBadgeClass(item.status)}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 leading-snug">{item.title}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-800/60 text-xs text-slate-300">
                    <div className="flex items-center space-x-2"><Clock className="w-3.5 h-3.5 text-slate-500" /><span>{item.startTime} - {item.endTime} ({item.duration})</span></div>
                    <div className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /><span>{item.location}</span></div>
                    <div className="flex items-center space-x-2"><Users className="w-3.5 h-3.5 text-slate-500" /><span>Sector: {item.targetSector}</span></div>
                    <div className="flex items-center space-x-2"><Tag className="w-3.5 h-3.5 text-slate-500" /><span>Mode: {item.mode}</span></div>
                  </div>

                  <div className="bg-[#070d16] p-2.5 rounded-lg border border-slate-800/40 text-[11px] space-y-1 text-slate-400">
                    <div><strong>Staff:</strong> {item.assignedStaff || 'N/A'}</div>
                    <div><strong>Remarks:</strong> {item.remarks}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition">
              Close Panel View
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

