import React, { useState, useEffect } from 'react';
import { Printer, FileInput, Calendar, Loader2, Sparkles } from 'lucide-react';
import { DtrForm } from '../Pages/DtrForm';

import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function parseData() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [rawData, setRawData] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const [targetMonth, setTargetMonth] = useState(new Date().getMonth());
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [weekendRange, setWeekendRange] = useState('all');
  
  // DTR State
  const [employeeName, setEmployeeName] = useState('ACE M. MALTO');
  const [monthYear, setMonthYear] = useState('FEB 1 - 15 2026');
  const [supervisorName, setSupervisorName] = useState('NORLY A. TABO');
  const [supervisorTitle, setSupervisorTitle] = useState('OIC Chief - Technical Operations Division');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleaned = monthYear.toLowerCase();
    const yearMatch = cleaned.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      setTargetYear(parseInt(yearMatch[1], 10));
    }
    
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthIdx = months.findIndex(m => cleaned.includes(m));
    if (monthIdx !== -1) {
      setTargetMonth(monthIdx);
    }
    
    if (cleaned.includes('1 - 15') || cleaned.includes('1-15') || cleaned.includes('first part')) {
      setWeekendRange('first');
    } else if (cleaned.includes('16 -') || cleaned.includes('16-') || cleaned.includes('second part')) {
      setWeekendRange('second');
    } else {
      setWeekendRange('all');
    }
  }, [monthYear]);
  
  // Create 31-day empty state initially
  const [records, setRecords] = useState(
    Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      amArrival: '', amDeparture: '', pmArrival: '', pmDeparture: '',
      underHours: '', underMins: '', note: '', isMerged: false
    }))
  );

  const handleParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      const { records: parsedRecords, detectedMonth } = parseDTRData(rawData);
      setRecords(parsedRecords);
      if (detectedMonth !== null) {
        setTargetMonth(detectedMonth);
        
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        setMonthYear(prev => prev.replace(/[a-z]{3,}/i, monthNames[detectedMonth]));
      }
      setIsParsing(false);
    }, 400); // tiny fake delay for UX feedback
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
    }
  };

  const handlePrint = async () => {
    const element = document.getElementById('print-area');
    const scrollContainer = document.querySelector('main');
    if (!element) return;

    setIsGeneratingPDF(true);
    let oldScrollY = 0;
    
    try {
      // Temporarily expand viewing area to prevent html-to-image clipping
      if (scrollContainer) {
        oldScrollY = scrollContainer.scrollTop;
        scrollContainer.scrollTop = 0;
        scrollContainer.classList.remove('h-screen', 'overflow-y-auto');
        scrollContainer.classList.add('h-auto', 'overflow-visible');
      }
      
      element.classList.remove('shadow-2xl');

      // Add a slight delay to ensure React rendering is stable before capture
      await new Promise(resolve => setTimeout(resolve, 150));

      const nodeWidth = element.scrollWidth;
      const nodeHeight = element.scrollHeight;

      const imgData = await toJpeg(element, {
        quality: 1.0,
        backgroundColor: '#ffffff',
        pixelRatio: 2, // High resolution
        width: nodeWidth,
        height: nodeHeight,
      });
      
      if (scrollContainer) {
        scrollContainer.classList.add('h-screen', 'overflow-y-auto');
        scrollContainer.classList.remove('h-auto', 'overflow-visible');
        scrollContainer.scrollTop = oldScrollY;
      }
      element.classList.add('shadow-2xl');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter', // Match our 8.5x11 inches layout
        putOnlyUsedFonts: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let finalWidth = pdfWidth;
      let finalHeight = (nodeHeight * pdfWidth) / nodeWidth;

      // If the aspect ratio of the captured image is taller than a page, scale it down
      if (finalHeight > pageHeight) {
        finalHeight = pageHeight;
        finalWidth = (nodeWidth * pageHeight) / nodeHeight;
      }

      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
      
      // Remove OpenAction to prevent Adobe Acrobat warning for embedded actions
      const pdfBuffer = pdf.output('arraybuffer');
      const uint8Array = new Uint8Array(pdfBuffer);
      const targetString = '/OpenAction [3 0 R /FitH null]';
      const replacementString = '                                '; // Exactly 30 spaces

      const targetBytes = new TextEncoder().encode(targetString);
      const replacementBytes = new TextEncoder().encode(replacementString);

      let foundIndex = -1;
      for (let i = 0; i <= uint8Array.length - targetBytes.length; i++) {
        let match = true;
        for (let j = 0; j < targetBytes.length; j++) {
          if (uint8Array[i + j] !== targetBytes[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          foundIndex = i;
          break; // Replace the first match
        }
      }

      if (foundIndex !== -1) {
        for (let j = 0; j < replacementBytes.length; j++) {
          uint8Array[foundIndex + j] = replacementBytes[j];
        }
      }

      // Generate the Blob and trigger download
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DTR_${employeeName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF. You may need to try opening the app in a new tab.');
    } finally {
      setIsGeneratingPDF(false);
      const container = document.querySelector('main');
      if (container) {
        container.classList.add('h-screen', 'overflow-y-auto');
        container.classList.remove('h-auto', 'overflow-visible');
      }
      
      const element = document.getElementById('print-area');
      if (element) element.classList.add('shadow-2xl');
    }
  };

  const autofillWeekends = () => {
    try {
      let startDay = 1;
      let endDay = 31;
      
      if (weekendRange === 'first') {
        endDay = 15;
      } else if (weekendRange === 'second') {
        startDay = 16;
      }

      setRecords(prev => prev.map(record => {
        const hasData = record.amArrival || record.amDeparture || record.pmArrival || record.pmDeparture;
        
        if (record.day < startDay || record.day > endDay) {
          return record;
        }

        const d = new Date(targetYear, targetMonth, record.day);
        
        if (d.getMonth() === targetMonth) {
          const dayOfWeek = d.getDay();
          if (dayOfWeek === 6) {
            return {
              ...record,
              amArrival: '',
              amDeparture: '',
              pmArrival: '',
              pmDeparture: '',
              note: record.note && record.note.trim() !== '' ? record.note : 'Saturday',
              isMerged: true,
            };
          }
          if (dayOfWeek === 0) {
            return {
              ...record,
              amArrival: '',
              amDeparture: '',
              pmArrival: '',
              pmDeparture: '',
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">DTR Generator</h2>
          <p className="text-sm text-gray-500 mt-2">Loading application...</p>
        </div>
      )}
      <div className={`min-h-screen bg-neutral-100 flex font-sans transition-opacity duration-500 ${isInitialLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        <aside className="w-[380px] bg-white border-r border-gray-200 flex flex-col no-print h-screen overflow-y-auto shadow-xl z-10 shrink-0">
          <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-blue-50/50">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileInput className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 leading-tight">DTR Generator</h1>
              <p className="text-xs text-gray-500">Auto-parse & Format PDF Reports</p>
            </div>
          </div>

          <div className="p-6 space-y-6 flex-1">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-800">
                <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full inline-flex items-center justify-center text-xs">1</span>
                <span>Document Settings</span>
              </div>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Employee Name</label>
                  <input 
                    type="text" 
                    value={employeeName}
                    onChange={e => setEmployeeName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Period / Month</label>
                  <input 
                    type="text" 
                    value={monthYear}
                    onChange={e => setMonthYear(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-800">
                  <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full inline-flex items-center justify-center text-xs">2</span>
                  <span>Paste Raw Log Data</span>
                </div>
                <button 
                  onClick={handleParse}
                  disabled={!rawData.trim() || isParsing}
                  className="text-xs flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                >
                  {isParsing ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                  <span>Parse</span>
                </button>
              </div>
              
              <div>
                <textarea
                  value={rawData}
                  onChange={e => setRawData(e.target.value)}
                  placeholder="Paste the raw time logs here...&#10;Example:&#10;104-06 07:34 am 12:03 pm&#10;204-06 12:04 pm 06:36 pm"
                  className="w-full h-40 p-3 text-xs font-mono bg-neutral-900 text-neutral-100 rounded-xl border border-neutral-800 focus:ring-2 focus:ring-blue-500/40 outline-none resize-none custom-scrollbar shadow-inner"
                />
                <p className="text-[11px] text-gray-400 mt-2 px-1">
                  The smart parser will auto-fill the DTR sheet to the right based on dates matching 1-31.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-800">
                  <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full inline-flex items-center justify-center text-xs">3</span>
                  <span>Auto-Tag Weekends</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Month</label>
                    <select 
                      value={targetMonth}
                      onChange={(e) => setTargetMonth(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Year</label>
                    <input 
                      type="number" 
                      value={targetYear}
                      onChange={(e) => setTargetYear(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pb-1">
                   <div>
                     <label className="text-xs font-medium text-gray-600 mb-1.5 block">Date Range</label>
                     <select 
                       value={weekendRange}
                       onChange={(e) => setWeekendRange(e.target.value)}
                       className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                     >
                       <option value="all">Full Month (1-31)</option>
                       <option value="first">1st Half (1-15)</option>
                       <option value="second">2nd Half (16-31)</option>
                     </select>
                   </div>
                </div>

                <button 
                  onClick={autofillWeekends}
                  className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Apply Weekends</span>
                </button>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={handlePrint}
                  disabled={isGeneratingPDF}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                >
                  {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                  <span>{isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF (Save as PDF)'}</span>
                </button>
                <p className="text-center text-[10px] text-gray-500 uppercase tracking-wider font-semibold mt-2">
                  Tip: Direct-edit the preview on the right!
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 h-screen overflow-y-auto bg-neutral-200">
          <div className="p-4 md:p-12 print:p-0 flex justify-center w-full">
            <div id="print-area" className="w-[8.5in] min-h-[11in] pb-[0.4in] bg-white shadow-2xl print:shadow-none pt-[0.2in] px-[10px] dtr-page-wrapper flex justify-between gap-[10px]">
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
        </main>

      </div>
    </>
  );
}