import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, parse, format, isToday, parseISO 
} from 'date-fns';
import { 
  Search, RefreshCw, Plus, X, MapPin, 
  Briefcase, Clock, Layers, User, FileText, 
  ArrowUpRight, LayoutDashboard, Settings as SettingsIcon 
} from 'lucide-react';
import { isValid } from 'date-fns';
import Navbar from '../Layout/Navbar';

// Initialize core TanStack Query Client instance for data orchestration
const queryClient = new QueryClient();

// Configuration Constant
const SPREADSHEET_ID = '1L_TU3zUFRqj5CS1avunjPt9a-psHkQqQVBUHYTaVzt0';

const STATUS_COLORS = {
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Approved: "bg-green-500/20 text-green-400 border-green-500/30",
  Completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};


const STATUS_BADGE = {
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Approved: "bg-green-500/20 text-green-400 border-green-500/30",
  Completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};


const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const VITE_API_URL = import.meta.env.VITE_API_URL;
// ==========================================
// 1. SERVICE LAYER (Data Extraction)
// ==========================================
  const fetchSpreadsheetData = async () => {
    const response = await axios.get(`${VITE_API_URL}/albayCalendar`);

    return response.data;
  };


const parseCustomDate = (value) => {

  if (!value) return null;

  // Already a Date object
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  // Google Apps Script format:
  // Date(2026,5,2)
  const googleDateMatch = String(value).match(
    /Date\((\d+),(\d+),(\d+)\)/
  );

  if (googleDateMatch) {

    const [, year, month, day] = googleDateMatch;

    return new Date(
      Number(year),
      Number(month),
      Number(day)
    );
  }

  // ISO string
  const iso = parseISO(String(value));

  if (isValid(iso)) {
    return iso;
  }

  const formats = [
    'M/d/yyyy',
    'MM/dd/yyyy',
    'yyyy-MM-dd',
    'dd-MMM-yyyy',
    'MMMM d, yyyy'
  ];

  for (const fmt of formats) {

    const parsed = parse(
      String(value),
      fmt,
      new Date()
    );

    if (isValid(parsed)) {
      return parsed;
    }
  }

  console.log("FAILED DATE PARSE:", value);

  return null;
};
// ==========================================
// 2. UTILITY LAYER (Transformations)
// ==========================================
const groupEvents = (events, filters) => {

  const grouped = {};


  const filteredEvents = events.filter(event => {

    if (filters.status && event.status !== filters.status)
      return false;


    if (filters.mode && event.mode !== filters.mode)
      return false;


    if (filters.project && event.project !== filters.project)
      return false;


    if (
      filters.search &&
      !event.title
        ?.toLowerCase()
        .includes(filters.search.toLowerCase())
    ) {
      return false;
    }


    return true;

  });



  filteredEvents.forEach(event => {


    const dateObj = parseCustomDate(event.startDate);



    if (!dateObj || !isValid(dateObj)) {

      // console.warn(
      //   "Invalid date skipped:",
      //   event.startDate,
      //   event
      // );

      return;

    }



    const dateKey = format(
      dateObj,
      "yyyy-MM-dd"
    );



    const monthKey = format(
      dateObj,
      "MMMM yyyy"
    );




    if (!grouped[monthKey]) {

      grouped[monthKey] = {

        monthLabel: monthKey,

        days:{}

      };

    }




    if (!grouped[monthKey].days[dateKey]) {

      grouped[monthKey].days[dateKey] = [];

    }




    grouped[monthKey]
      .days[dateKey]
      .push(event);



  });



  console.log(
    "GROUPED RESULT:",
    JSON.stringify(grouped,null,2)
  );



  return grouped;

};
// ==========================================
// 3. PRESENTATION COMPONENTS
// ==========================================

// --- Individual Day Block Component ---
const DayCell = ({ date, events = [], onClick }) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const hasEvents = events.length > 0;

  return (
    <div
      onClick={() => onClick(dateStr, events)}
      className={`min-h-[115px] bg-[#0d1527] border border-slate-800/60 p-2 transition-all cursor-pointer flex flex-col justify-between hover:bg-[#14203e] ${
        isToday(date) ? 'ring-2 ring-indigo-500 ring-inset shadow-lg shadow-indigo-500/10' : ''
      }`}
    >
      <div className="flex justify-between items-center">
        <span className={`text-sm font-semibold ${hasEvents ? 'text-slate-200' : 'text-slate-500'}`}>
          {format(date, 'd')}
        </span>
        {hasEvents && (
          <span className="bg-indigo-600/30 text-indigo-400 text-[10px] px-1.5 py-0.5 rounded font-medium border border-indigo-500/20">
            {events.length} Items
          </span>
        )}
      </div>

      <div className="space-y-1 mt-2 flex-grow overflow-hidden">
        {events.slice(0, 2).map((event, idx) => (
          <div
            key={idx}
            className={`text-[11px] px-2 py-1 rounded border truncate font-medium ${
              STATUS_COLORS[event.status] || 'bg-slate-700/20 text-slate-300 border-slate-600/30'
            }`}
          >
            {event.title}
          </div>
        ))}
        {events.length > 2 && (
          <div className="text-[10px] text-indigo-400 font-semibold pl-1 pt-0.5">
            +{events.length - 2} More
          </div>
        )}
      </div>
    </div>
  );
};

// --- Monthly Grid Layout Matrix ---
const CalendarGrid = ({ monthLabel, dayEventsMap, onDateSelect }) => {
  const monthDate = parse(
    monthLabel,
    'MMMM yyyy',
    new Date()
  );
  if (!isValid(monthDate)) {
    return null;
  }
  
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const daysGrid = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="bg-[#0b111e] rounded-xl border border-slate-800 overflow-hidden mb-8 shadow-xl">
      <div className="grid grid-cols-7 border-b border-slate-800/80 bg-[#090f1c]">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-slate-400 tracking-wider py-3 border-r border-slate-800/40 last:border-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-slate-900">
        {daysGrid.map((date, index) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isCurrentMonth = date.getMonth() === monthDate.getMonth();
          const events = isCurrentMonth ? dayEventsMap[dateStr] || [] : [];
          
          return (
            <DayCell
              key={index}
              date={date}
              events={events}
              onClick={onDateSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

// --- Slide-Over View Agenda Panel ---
const AgendaPanel = ({ isOpen, onClose, selectedDate, events = [] }) => {
  if (!isOpen) return null;
  const formattedDate = selectedDate ? format(parseISO(selectedDate), 'MMMM dd, yyyy') : '';

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[460px] bg-[#090f1c] border-l border-slate-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
      <div className="p-5 border-b border-slate-800 bg-[#0d1527] flex justify-between items-center">
        <div>
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Agenda Schedule</span>
          <h3 className="text-lg font-bold text-slate-200 mt-0.5">{formattedDate}</h3>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#070c16]">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
            <p className="text-sm font-medium">No events scheduled for this day.</p>
          </div>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className="bg-[#0d1527] border border-slate-800/80 rounded-xl p-5 shadow-lg space-y-4 hover:border-slate-700/60 transition-all">
              <div className="flex justify-between items-start gap-3">
                <h4 className="font-bold text-slate-200 text-sm md:text-md leading-snug">{event.title}</h4>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_BADGE[event.status] || 'bg-slate-800 text-slate-400'}`}>
                  {event.status}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 border-t border-slate-800/60 pt-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-indigo-400 shrink-0" />
                  <span className="font-medium">Duration: ({event.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-400 shrink-0" />
                  <span className="truncate">Locations: {event.location || 'TBD'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-indigo-400 shrink-0" />
                  <span>Project: <strong className="text-slate-200">{event.project}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-indigo-400 shrink-0" />
                  <span>Mode: <span className="capitalize">{event.mode}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-indigo-400 shrink-0" />
                  <span>Staff: <span className="text-slate-400">{event.assignedStaff || 'N/A'}</span></span>
                </div>
              </div>

              {event.remarks && (
                <div className="bg-[#121c35] border border-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
                  <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <FileText size={12} /> Remarks:
                  </div>
                  {event.remarks}
                </div>
              )}

              {event.movLink && (
                <a
                  href={event.movLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs py-2 px-4 rounded-lg transition-colors shadow-md"
                >
                  View Attachment / MOV <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN CONTAINER FRAMEWORK
// ==========================================
export function SchedulerDashboard() {
  const [filters, setFilters] = useState({ search: '', status: '', mode: '', project: '' });
  const [activeMonth, setActiveMonth] = useState('');
  const [agenda, setAgenda] = useState({ isOpen: false, date: null, events: [] });

  const { data: rawEvents = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['schedules'],
    queryFn: fetchSpreadsheetData,
    staleTime: 1000 * 60 * 5,
  });
  console.log("RAW EVENTS",rawEvents);

  // Calculate distinct criteria parameters across full remote arrays
  const filterOptions = useMemo(() => {
    const statuses = new Set();
    const modes = new Set();
    const projects = new Set();
    rawEvents.forEach(e => {
      if (e.status) statuses.add(e.status);
      if (e.mode) modes.add(e.mode);
      if (e.project) projects.add(e.project);
    });
    return {
      statuses: Array.from(statuses),
      modes: Array.from(modes),
      projects: Array.from(projects),
    };
  }, [rawEvents]);

  const groupedData = useMemo(() => {

    return groupEvents(
      rawEvents,
      filters
    );

  }, [rawEvents, filters]);



  const monthKeys = Object.keys(groupedData);



  React.useEffect(() => {

  if (monthKeys.length > 0) {

    if (!activeMonth || !groupedData[activeMonth]) {

      setActiveMonth(monthKeys[0]);

    }

  }

  }, [groupedData]);
  console.log("MONTH KEYS", monthKeys);
  console.log("ACTIVE MONTH", activeMonth);
  console.log(
    "ACTIVE DATA",
    groupedData[activeMonth]
  );

  return (
    <div className="min-h-screen bg-[#070c16] text-slate-200 flex font-sans antialiased">
      {/* Structural Workspace Sidebar Component */}
      {/* SIDEBAR */}
      <div className='hidden lg:block lg:w-[250px] lg:shrink-0'>

        <div className='fixed top-0 left-0 h-screen w-[250px] z-50'>
          <Navbar />
        </div>

      </div>

      {/* Main Framework Context Window */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-y-auto">
        <header className="p-5 border-b border-slate-800/60 bg-[#090f1c]/50 backdrop-blur-md flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              ALBAY PO - CALENDAR
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Region V - Bicol Region</p>
          </div>
          {/* <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 flex items-center gap-2 transition-colors self-stretch sm:self-auto justify-center">
            <Plus size={16} /> Add New Schedule
          </button> */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="bg-[#0d1527] border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
            >
              <option value="">All Statuses</option>
              {filterOptions.statuses.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
            <select
              value={filters.mode}
              onChange={(e) => setFilters(prev => ({ ...prev, mode: e.target.value }))}
              className="bg-[#0d1527] border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
            >
              <option value="">All Modes</option>
              {filterOptions.modes.map(md => <option key={md} value={md}>{md}</option>)}
            </select>
            <select
              value={filters.project}
              onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
              className="bg-[#0d1527] border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
            >
              <option value="">All Programs</option>
              {filterOptions.projects.map(pr => <option key={pr} value={pr}>{pr}</option>)}
            </select>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-6 flex-1 w-full max-w-[1500px] mx-auto">
          {/* Controls Filters Console Bar */}
          {/* <div className="bg-[#090f1c] border border-slate-800/80 rounded-xl p-4 flex flex-col xl:flex-row gap-3 shadow-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search agenda titles..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full bg-[#0d1527] border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            
          </div> */}

          {/* Tabbed Month Switcher Bar Component */}
          {monthKeys.length > 1 && (
            <div className="flex gap-1.5 border-b border-slate-800/80 pb-2 overflow-x-auto no-scrollbar">
              {monthKeys.map(month => (
                <button
                  key={month}
                  onClick={() => setActiveMonth(month)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all tracking-wider ${
                    activeMonth === month
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-[#090f1c] text-slate-400 hover:text-slate-200 border border-slate-800/60'
                  }`}
                >
                  {month.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Engine Processing Spinner Loading Fallbacks */}
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-slate-800/40 rounded-xl w-44"></div>
              <div className="grid grid-cols-7 gap-px bg-slate-800 rounded-xl overflow-hidden h-[500px]">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="bg-[#0d1527]/60 p-2"></div>
                ))}
              </div>
            </div>
          )}

          {/* Framework Data Failure Intercept Layer */}
          {isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-md mx-auto space-y-4 shadow-xl mt-12">
              <p className="text-sm font-semibold text-red-400">Unable to connection-fetch schedule configurations.</p>
              <button
                onClick={refetch}
                className="mx-auto flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 text-xs font-bold rounded-lg transition-colors"
              >
                <RefreshCw size={14} /> Retry Handshake Connection
              </button>
            </div>
          )}

          {/* Interactive Core Calendar Matrix Component */}
          {
            !isLoading &&
            !isError &&
            Object.keys(groupedData).length > 0 &&
            activeMonth &&
            groupedData[activeMonth] &&
            (
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-100 mb-4 px-1">
                {activeMonth}
              </div>
              <CalendarGrid
                monthLabel={activeMonth}
                dayEventsMap={groupedData[activeMonth].days}
                onDateSelect={(dateStr, events) => setAgenda({ isOpen: true, date: dateStr, events })}
              />
            </div>
          )}
        </div>
      </main>

      {/* Flyout Component Trigger Panel */}
      <AgendaPanel
        isOpen={agenda.isOpen}
        onClose={() => setAgenda(prev => ({ ...prev, isOpen: false }))}
        selectedDate={agenda.date}
        events={agenda.events}
      />
    </div>
  );
}

// Wrapper to safely append query hooks context engines seamlessly inside standalone setups
export default function EntrypointAppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <SchedulerDashboard />
    </QueryClientProvider>
  );
}