import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Calendar, 
  Loader2, 
  Sparkles, 
  LogOut,
  User
} from 'lucide-react';
import { DtrForm } from './DtrForm';
import parseData from '../lib/parseDatas';
import Navbar from '../Layout/Navbar';

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

export default function Dtr() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [rawData, setRawData] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const [targetMonth, setTargetMonth] = useState(new Date().getMonth());
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [weekendRange, setWeekendRange] = useState('all');
  
  const [employeeName, setEmployeeName] = useState('PERSONNEL');
  const [monthYear, setMonthYear] = useState('MM DD-DD YYYY');
  const [supervisorName, setSupervisorName] = useState('NORLY A. TABO');
  const [supervisorTitle, setSupervisorTitle] = useState('OIC Chief - Technical Operations Division');

  const [records, setRecords] = useState(
    Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      amArrival: '', amDeparture: '', pmArrival: '', pmDeparture: '',
      underHours: '', underMins: '', note: '', isMerged: false
    }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleaned = monthYear.toLowerCase();
    const yearMatch = cleaned.match(/\b(20\d{2})\b/);
    if (yearMatch) setTargetYear(parseInt(yearMatch[1], 10));
    
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthIdx = months.findIndex(m => cleaned.includes(m));
    if (monthIdx !== -1) setTargetMonth(monthIdx);
    
    if (cleaned.includes('1 - 15') || cleaned.includes('1-15') || cleaned.includes('first part')) {
      setWeekendRange('first');
    } else if (cleaned.includes('16 -') || cleaned.includes('16-') || cleaned.includes('second part')) {
      setWeekendRange('second');
    } else {
      setWeekendRange('all');
    }
  }, [monthYear]);

  const handleParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      const { records: parsedRecords, detectedMonth } = parseData(rawData);
      setRecords(parsedRecords);
      if (detectedMonth !== null) {
        setTargetMonth(detectedMonth);
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        setMonthYear(prev => prev.replace(/[a-z]{3,}/i, monthNames[detectedMonth]));
      }
      setIsParsing(false);
    }, 400);
  };

  const handleRecordChange = (day, field, value) => {
    setRecords((prev) => 
      prev.map((r) => r.day === day ? { ...r, [field]: value } : r)
    );
  };

  const handleToggleMerge = (day) => {
    setRecords((prev) => 
      prev.map((r) => r.day === day ? { ...r, isMerged: !r.isMerged } : r)
    );
  };

  const handleGlobalUpdate = (field, value) => {
    switch (field) {
      case 'employeeName': setEmployeeName(value); break;
      case 'monthYear': setMonthYear(value); break;
      case 'supervisorName': setSupervisorName(value); break;
      case 'supervisorTitle': setSupervisorTitle(value); break;
      default: break;
    }
  };

  const handlePrint = async () => {
    setIsGeneratingPDF(true);

    try {
      // 1. Fetch the PDF directly from the public folder
      const templateRes = await fetch('/dtr_template.pdf');
      
      if (!templateRes.ok) {
        throw new Error(`Could not load template (Status: ${templateRes.status}). Please ensure dtr_template.pdf is placed inside the public/ folder.`);
      }
      
      const bytes = await templateRes.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      
      const pages = pdfDoc.getPages();
      if (!pages.length) {
        throw new Error("The PDF document has no pages.");
      }

      const page = pages[0];
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // 2. Layout Configuration 
      const table = {
        firstRowY: 575,
        rowHeight: 15,
        amArrival: 78,
        amDeparture: 104,
        pmArrival: 132,
        pmDeparture: 158,
        underHours: 186,
        underMins: 200,
      };

      // 3. Write Data into PDF
      records.forEach((row, index) => {
        const y = table.firstRowY - index * table.rowHeight;

        const amArrival = String(row.amArrival || "");
        const amDeparture = String(row.amDeparture || "");
        const pmArrival = String(row.pmArrival || "");
        const pmDeparture = String(row.pmDeparture || "");
        const underHours = String(row.underHours || "");
        const underMins = String(row.underMins || "");

        if (amArrival) page.drawText(amArrival, { x: table.amArrival, y, size: 8, font });
        if (amDeparture) page.drawText(amDeparture, { x: table.amDeparture, y, size: 8, font });
        if (pmArrival) page.drawText(pmArrival, { x: table.pmArrival, y, size: 8, font });
        if (pmDeparture) page.drawText(pmDeparture, { x: table.pmDeparture, y, size: 8, font });
        if (underHours) page.drawText(underHours, { x: table.underHours, y, size: 8, font });
        if (underMins) page.drawText(underMins, { x: table.underMins, y, size: 8, font });
      });

      // 4. Save and Export
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `DTR_${employeeName}.pdf`);
      
    } catch (err) {
      console.error("FULL ERROR:", err);
      alert(err?.message || "Unknown error occurred while generating PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const autofillWeekends = () => {
    try {
      let startDay = 1;
      let endDay = 31;
      if (weekendRange === 'first') endDay = 15;
      else if (weekendRange === 'second') startDay = 16;

      setRecords(prev => prev.map(record => {
        const hasData = record.amArrival || record.amDeparture || record.pmArrival || record.pmDeparture;
        if (record.day < startDay || record.day > endDay) return record;

        const d = new Date(targetYear, targetMonth, record.day);
        if (d.getMonth() === targetMonth) {
          const dayOfWeek = d.getDay();
          if (dayOfWeek === 6) {
            return {
              ...record,
              amArrival: '', amDeparture: '', pmArrival: '', pmDeparture: '',
              note: record.note && record.note.trim() !== '' ? record.note : 'Saturday',
              isMerged: true,
            };
          }
          if (dayOfWeek === 0) {
            return {
              ...record,
              amArrival: '', amDeparture: '', pmArrival: '', pmDeparture: '',
              note: record.note && record.note.trim() !== '' ? record.note : 'Sunday',
              isMerged: true,
            };
          }
          if (record.note && (record.note.toLowerCase() === 'saturday' || record.note.toLowerCase() === 'sunday')) {
            return { ...record, note: '', isMerged: false };
          }
        } else {
          if (!hasData) return { ...record, note: '', isMerged: false };
        }
        return record;
      }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {isInitialLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
          <h2 className="text-lg font-medium text-zinc-200 tracking-tight">Loading DTR Generator...</h2>
        </div>
      )}

      <div className={`min-h-screen bg-[#050816] flex text-zinc-100 font-sans transition-opacity duration-500 ${isInitialLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#050816] border-zinc-800 flex flex-col justify-between no-print shrink-0 h-screen sticky top-0">
          <div>
            <div className='hidden lg:block lg:w-[250px] lg:shrink-0'>
              <div className='fixed top-0 left-0 h-screen w-[250px] z-50'>
                <Navbar />
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/40 space-y-2">
            <div className="flex items-center space-x-3 p-1.5">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-200 truncate">Admin Account</p>
                <p className="text-[10px] text-zinc-500 truncate">TOD Personnel</p>
              </div>
            </div>
            <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all">
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <main id="workspace-container" className="flex-1 h-screen overflow-y-auto bg-zinc-900/40 custom-scrollbar">
          
          <header className="no-print h-16 border-b border-zinc-800/60 bg-[#050816] backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h1 className='tracking-wide font-semibold text-2xl'>DigiGOV Dashboard</h1>
              <span className='text-sm text-gray-400'>Region V - Bicol Region</span>
            </div>
          </header>

          <div className="p-8 flex flex-col xl:flex-row gap-6 items-start justify-start max-w-[1700px] mx-auto">
            
            {/* Configuration Panel */}
            <div className="no-print w-full xl:w-[350px] bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-6 shrink-0 shadow-xl">
              
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase">DTR Generator for Personnel</h3>
                <p className="text-xs text-zinc-400">Fine-tune settings dynamically</p>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">1. PERSONNEL Configurations</label>
                <div className="space-y-3 bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-800/80">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Employee Full Name</label>
                    <input 
                      type="text" 
                      value={employeeName}
                      onChange={e => setEmployeeName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">TOD - Fullname</label>
                    <input 
                      type="text" 
                      value={supervisorName}
                      onChange={e => setSupervisorName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Period / Target Month Range</label>
                    <input 
                      type="text" 
                      value={monthYear}
                      onChange={e => setMonthYear(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">2. OTC Input Parser</label>
                    <label className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider block">select all in the OTC and Paste here ↓↓</label>
                  </div>
                  <button 
                    onClick={handleParse}
                    disabled={!rawData.trim() || isParsing}
                    className="text-[11px] flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 font-medium px-2.5 py-1 rounded transition-colors"
                  >
                    {isParsing ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                    <span>Execute Parse</span>
                  </button>
                </div>
                
                <textarea
                  value={rawData}
                  onChange={e => setRawData(e.target.value)}
                  placeholder="Paste log stream here...&#10;Example:&#10;104-06 07:34 am 12:03 pm"
                  className="w-full h-32 p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg focus:border-emerald-500 outline-none resize-none custom-scrollbar shadow-inner placeholder-zinc-600"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">3. Holiday / Weekend Auto-fill</label>
                <div className="bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-800/80 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-500 mb-1 block">Month Target</label>
                      <select 
                        value={targetMonth}
                        onChange={(e) => setTargetMonth(Number(e.target.value))}
                        className="w-full text-xs px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 outline-none focus:border-emerald-500"
                      >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                          <option key={i} value={i}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 mb-1 block">Year Target</label>
                      <input 
                        type="number" 
                        value={targetYear}
                        onChange={(e) => setTargetYear(Number(e.target.value))}
                        className="w-full text-xs px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 mb-1 block">Action Scope</label>
                    <select 
                      value={weekendRange}
                      onChange={(e) => setWeekendRange(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 outline-none focus:border-emerald-500"
                    >
                      <option value="all">Full Month (1-31)</option>
                      <option value="first">1st Half (1-15)</option>
                      <option value="second">2nd Half (16-31)</option>
                    </select>
                  </div>

                  <button 
                    onClick={autofillWeekends}
                    className="w-full flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 px-3 py-1.5 rounded text-xs font-medium transition-all shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Apply Smart Tags</span>
                  </button>
                </div>
              </div>
              
              <div className="pt-2 border-t border-zinc-800">
                <button 
                  onClick={handlePrint}
                  disabled={isGeneratingPDF}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isGeneratingPDF ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
                  <span>{isGeneratingPDF ? 'Compiling File Layers...' : 'Export Document ( PDF )'}</span>
                </button>
              </div>

            </div>

            {/* DTR Print View */}
            <div className="flex-1 w-full flex justify-center xl:justify-start">
              <div 
                id="print-area" 
                className="w-[8.5in] min-h-[11in] pb-[-10in] bg-white text-zinc-900 shadow-2xl print:shadow-none pt-[0.10in] px-[4px] dtr-page-wrapper flex justify-between gap-[4px] print:border-none"
              >
                <DtrForm
                  records={records}
                  employeeName={employeeName}
                  monthYear={monthYear}
                  supervisorName={supervisorName}
                  supervisorTitle={supervisorTitle}
                  onChangeRecord={handleRecordChange}
                  onUpdateField={handleGlobalUpdate}
                  onToggleMerge={handleToggleMerge}
                />

                <DtrForm 
                  records={records}
                  employeeName={employeeName}
                  monthYear={monthYear}
                  supervisorName={supervisorName}
                  supervisorTitle={supervisorTitle}
                  onChangeRecord={handleRecordChange}
                  onUpdateField={handleGlobalUpdate}
                  onToggleMerge={handleToggleMerge}
                />
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}