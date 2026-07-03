import React from 'react';

export const DtrForm = ({
  records = [],
  employeeName = '',
  monthYear = '',
  supervisorName = '',
  supervisorTitle = '',
  onChangeRecord,
  onUpdateField,
  onToggleMerge,
}) => {
  return (
    <div className="flex-1 w-full flex flex-col font-sans text-black page-break-inside-avoid">
      <div className="flex flex-col items-center mb-2 w-full">
        <div className="text-[10px] italic w-full text-left font-serif mb-3 leading-none">Civil Service Form No. 48</div>
        <div className="font-bold text-[13px] uppercase tracking-wide leading-none mb-1">Daily Time Record</div>
        <span className="text-[10px] mb-2 leading-none">-----o0o-----</span>
        
        <div className="w-full mt-2">
          <input
            className="font-bold text-[14px] w-full text-center border-b border-black outline-none uppercase bg-transparent pb-0 mb-0 leading-tight"
            value={employeeName}
            onChange={(e) => onUpdateField('employeeName', e.target.value)}
            placeholder="Employee Name"
          />
          <div className="text-[10px] text-center w-full mt-0 leading-none">(Name)</div>
        </div>
      </div>

      <div className="flex justify-between items-end text-[11px] mb-2 mt-3 space-x-2">
        <div className="flex w-full items-end">
          <span className="italic mr-2">For the month of</span>
          <input
            className="font-bold border-b border-black outline-none text-center uppercase bg-transparent pb-0 flex-1 leading-tight"
            value={monthYear}
            onChange={(e) => onUpdateField('monthYear', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-start text-[10px] mb-2">
        <div className="italic leading-snug text-left pt-1 whitespace-nowrap mr-3">
          Office hours for arrival<br />and departure
        </div>
        <div className="flex flex-col flex-1 pl-2">
          <div className="flex items-end justify-between">
            <span className="italic whitespace-nowrap mr-2">Regular days</span>
            <div className="border-b border-black flex-1 h-4"></div>
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="italic whitespace-nowrap mr-2 pl-6">Saturdays</span>
            <div className="border-b border-black flex-1 h-4"></div>
          </div>
        </div>
      </div>

      <table className="w-full h-full border-collapse border border-black text-center text-[10px] leading-tight">
        <thead>
          <tr>
            <th rowSpan={2} className="border border-black font-medium align-middle w-8">Days</th>
            <th colSpan={2} className="border border-black font-medium py-1">A.M.</th>
            <th colSpan={2} className="border border-black font-medium py-1">P.M.</th>
            <th colSpan={2} className="border border-black font-medium py-1">Undertime</th>
          </tr>
          <tr>
            <th className="border border-black font-medium py-0.5 w-[16%]">Arrival</th>
            <th className="border border-black font-medium py-0.5 w-[16%]">Departure</th>
            <th className="border border-black font-medium py-0.5 w-[16%]">Arrival</th>
            <th className="border border-black font-medium py-0.5 w-[16%]">Departure</th>
            <th className="border border-black font-medium py-0.5 w-[12%]">Hours</th>
            <th className="border border-black font-medium py-0.5 w-[12%]">Minutes</th>
          </tr>
        </thead>
        <tbody>
          {records.map((row) => {
            const isMerged = row.isMerged ?? !!row.note;
            return (
              <tr key={row.day} className="group">
                <td className="border border-black font-bold relative group-hover:bg-gray-50 print:group-hover:bg-transparent transition-colors">
                  {row.day}
                  {onToggleMerge && (
                    <button
                      onClick={() => onToggleMerge(row.day)}
                      title={isMerged ? "Split into time columns" : "Merge into note column"}
                      className="absolute -left-5 top-1/2 -translate-y-1/2 bg-blue-50 text-blue-600 border border-blue-200 text-[8px] px-1 py-[1px] rounded opacity-0 group-hover:opacity-100 print:hidden transition-opacity z-10 shadow-sm"
                    >
                      {isMerged ? '><' : '<>'}
                    </button>
                  )}
                </td>
                {isMerged ? (
                  <>
                    <td colSpan={4} className="border border-black p-0 relative">
                      <input
                        className="w-full h-full absolute inset-0 text-center text-black font-semibold outline-none bg-transparent hover:bg-gray-50 focus:bg-white print:hover:bg-transparent"
                        value={row.note || ''}
                        onChange={(e) => onChangeRecord(row.day, 'note', e.target.value)}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-black p-0 relative overflow-hidden">
                      <input
                        className="w-full text-center text-black outline-none bg-transparent hover:bg-gray-50 focus:bg-white print:hover:bg-transparent h-full min-h-[22px]"
                        value={row.amArrival || ''}
                        onChange={(e) => onChangeRecord(row.day, 'amArrival', e.target.value)}
                      />
                    </td>
                    <td className="border border-black p-0 relative overflow-hidden">
                      <input
                        className="w-full text-center text-black outline-none bg-transparent hover:bg-gray-50 focus:bg-white print:hover:bg-transparent h-full min-h-[22px]"
                        value={row.amDeparture || ''}
                        onChange={(e) => onChangeRecord(row.day, 'amDeparture', e.target.value)}
                      />
                    </td>
                    <td className="border border-black p-0 relative overflow-hidden">
                      <input
                        className="w-full text-center text-black outline-none bg-transparent hover:bg-gray-50 focus:bg-white print:hover:bg-transparent h-full min-h-[22px]"
                        value={row.pmArrival || ''}
                        onChange={(e) => onChangeRecord(row.day, 'pmArrival', e.target.value)}
                      />
                    </td>
                    <td className="border border-black p-0 relative overflow-hidden">
                      <input
                        className="w-full text-center text-black outline-none bg-transparent hover:bg-gray-50 focus:bg-white print:hover:bg-transparent h-full min-h-[22px]"
                        value={row.pmDeparture || ''}
                        onChange={(e) => onChangeRecord(row.day, 'pmDeparture', e.target.value)}
                      />
                    </td>
                  </>
                )}
                <td className="border border-black p-0 relative overflow-hidden">
                  <input
                    className="w-full text-center text-black outline-none bg-transparent hover:bg-gray-50 focus:bg-white print:hover:bg-transparent h-full min-h-[22px]"
                    value={row.underHours || ''}
                    onChange={(e) => onChangeRecord(row.day, 'underHours', e.target.value)}
                  />
                </td>
                <td className="border border-black p-0 relative overflow-hidden">
                  <input
                    className="w-full text-center text-black outline-none bg-transparent hover:bg-gray-50 focus:bg-white print:hover:bg-transparent h-full min-h-[22px]"
                    value={row.underMins || ''}
                    onChange={(e) => onChangeRecord(row.day, 'underMins', e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={5} className="border border-black font-bold uppercase text-right pr-2">Total</td>
            <td className="border border-black p-0 text-center"></td>
            <td className="border border-black p-0 text-center font-bold">0</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-3 text-[10px] leading-tight italic text-black pr-2">
        I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.
      </div>

      <div className="mt-7 flex flex-col items-center w-full">
        <input 
          className="font-bold border-b border-black w-full text-center pb-0 outline-none uppercase text-[12px] bg-transparent text-black"
          value={employeeName}
          onChange={(e) => onUpdateField('employeeName', e.target.value)}
        />
      </div>

      <div className="mt-5 text-[10px] italic text-black font-sans text-left w-full">
        VERIFIED as to the prescribed office hours.
      </div>

      <div className="mt-1 flex flex-col items-center w-full">
        <input 
          className="font-bold border-b border-black w-full text-center pb-0 outline-none uppercase text-[12px] bg-transparent text-black"
          value={supervisorName}
          onChange={(e) => onUpdateField('supervisorName', e.target.value)}
        />
        <input 
          className="text-center italic mt-0.5 outline-none w-full text-[10px] bg-transparent text-black"
          value={supervisorTitle}
          onChange={(e) => onUpdateField('supervisorTitle', e.target.value)}
        />
      </div>
    </div>
  );
};