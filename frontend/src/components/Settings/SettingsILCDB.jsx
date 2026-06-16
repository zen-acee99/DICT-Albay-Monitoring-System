import React, { useState,useEffect, useRef } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx' 
import Navbar from '../Layout/Navbar'

const ITEMS_PER_PAGE = 9; 


const SettingsILCDB = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('edit')
  
  const fileInputRef = useRef(null)

  //#region Trigger Add Mode
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedILCDB(null);

    setFormData({
      id: null,
      title: '',
      location: '',
      Coordinates: '',
      targetSectors: '',
      mode: ''
    });

    setInputTitle('');
    setInputLocation('');
    setInputCoordinates('');
    setInputTargetSectors('');
    setInputMode('');
    setValue('');
    setError('');

    setIsModalOpen(true);
  };


  // Trigger Edit Mode populated with row data

  const handleOpenEditModal = (ilcdb) => {
    setModalMode('edit');

    setSelectedILCDB(ilcdb);

    setFormData({
      id: ilcdb.id || null,
      title: ilcdb.title || '',
      location: ilcdb.location || '',
      Coordinates: ilcdb.coordinates || '',
      targetSectors: ilcdb.targetSectors || '',
      mode: ilcdb.mode || ''
    });

    setInputTitle(ilcdb.title || '');
    setInputLocation(ilcdb.location || '');
    setInputCoordinates(ilcdb.coordinates || '');
    setInputTargetSectors(ilcdb.targetsetInputTargetSectors || '');
    setInputMode(ilcdb.Mode || '');

    if (Array.isArray(ilcdb.mode)) {
      setValue(ilcdb.mode.join(', '));
    } else {
      setValue(ilcdb.mode || '');
    }

    setIsModalOpen(true);
  };

//#endregion






  //#region Handle row deletion
  const handleDeleteILCDB = async (ilcdbID) => {
    if (!window.confirm("Are you sure you want to terminate this ilcdb?")) {
      return;
    }

    try {
      await axios.patch(
        `${VITE_API_URL}/ilcdb/${ilcdbID}`,
        {
          location: "TERMINATED"
        }
      );

      await fetchILCDB();

      if (formData.id === ilcdbID) {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const VITE_API_URL = import.meta.env.VITE_API_URL
  const [liveILCDB, setLiveILCDB] = useState([]);
  const [loading, setLoading] = useState(true)
  const [selectedILCDB, setSelectedILCDB] = useState(null)

  //#region UPDATE
  const updateILCDB = async () => {
  try {
    const coordinatesArray = value
    .split(",")
    .map(coord => Number(coord.trim()));
    const payload = {
      title: inputTitle,
      location: inputLocation,
      Coordinates: inputCoordinates,
      targetSectors: inputTargetSectors,
      mode: coordinatesArray
    };

    await axios.patch(
      `${VITE_API_URL}/ilcdb/${selectedILCDB.id}`,
      payload
    );

    await fetchILCDB();
    setIsModalOpen(false);

  } catch (err) {
    console.error("ERROR:", err);

    if (err.response) {
      console.error("location:", err.response.location);
      console.error("DATA:", err.response.data);
    }
  }
};


//#region FETCH ILCDB
  const [selectedRegion, setSelectedRegion] = useState("ALL")
  const fetchILCDB = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${VITE_API_URL}/ilcdb`);
      const data = response.data;

      const normalized = data
        .filter(item => {
          if (selectedRegion === "ALL") return true;

          const parts = item.title?.split(",").map(s => s.trim().toLowerCase());
          return parts?.[1] === selectedRegion.toLowerCase();
        })
        .map(item => ({
          id: item._id,
          title: item.title,
          location: item.location?.trim(),
          targetSectors: item.targetSectors,
          mode: item.mode,
        }));

      console.log("Filtered Data:", normalized);
      setLiveILCDB(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchILCDB()
    }, [selectedRegion])

  // Handle Excel File Import/Parsing
  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        console.log("Imported Excel Data Rows:", data);

        if (data.length > 0) {
          const row = data[0];

          setInputTitle(row.title || '');
          setInputLocation(row.location || '');
          setInputCoordinates(row.Coordinates || '');
          setInputTargetSectors(row.targetSectors || '');
          setInputMode(row.Mode || '');
          setValue(row.mode || '');
        }

      } catch (error) {
        console.error("Error reading excel file:", error);
      }
    };

    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  //#region Handle Excel Export Functionality
  const handleExcelExport = () => {
    if (!liveILCDB || liveILCDB.length === 0) {
      alert("No data available to export.")
      return
    }

    const exportData = liveILCDB.map(ilcdb => ({
      "ilcdb title": ilcdb.title || "",
      targetSectors: ilcdb.targetSectors || "",
      location: ilcdb.location || "",
      mode: Array.isArray(ilcdb.mode)
        ? ilcdb.mode.join(", ")
        : (ilcdb.mode || "")
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "ilcdb ilcdb List"
    )

    XLSX.writeFile(workbook, "ILCDB_template_export.xlsx")
  }

  // Form States
    const [formData, setFormData] = useState({
      id: null,
      title: '',
      location: '',
      Coordinates: '',
      targetSectors: '',
      mode: ''
    })
  // Search logic
  
 const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;

    const filteredILCDB = liveILCDB.filter((item) => {
    const query = searchQuery.toLowerCase();

    return (
      item.title?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query) ||
      item.Coordinates?.join(", ").toLowerCase().includes(query) ||
      item.targetSectors?.toLowerCase().includes(query) ||
      item.mode?.toLowerCase().includes(query)
    );
  });

console.log("SEARCH QUERY:", searchQuery)
console.log("LIVE LGUS:", liveILCDB)
console.log("FILTERED:", filteredILCDB)

  // Pagination Calculation Core Logic
  const totalPages = Math.ceil(filteredILCDB.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedLgus = filteredILCDB.slice(startIndex, endIndex)

  console.log("liveILCDB:", liveILCDB)
  console.log("filteredILCDB:", filteredILCDB)
  console.log("Paginated:", paginatedLgus)

  
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset back to first page when filtering
  }

//#region   data for input

  const [inputTitle, setInputTitle] = useState("")
  const [inputLocation, setInputLocation] = useState("")
  const [inputCoordinates, setInputCoordinates] = useState("")
  const [inputTargetSectors, setInputTargetSectors] = useState("")
  const [inputMode, setInputMode] = useState("")

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

const handleChange = (e) => {
  const input = e.target.value;
  setValue(input);

  if(input.trim() == ""){
    setError("")
    return  
  }

  const regex = /^\d+,\d+,\s?\d+,\d+$/;

  if (!regex.test(input)) {
      setError("Invalid format. Use: 123,12345, 12,1234");
    } else {
      setError("");
      }
      console.log(input);
  console.log(regex.test(input));
  };

  // const filteredStatus = location.filter(item =>(
  //   item.toLowerCase().includes(inputLocation.toLowerCase())
  // ))
  // const filteredVersion = targetSectors.filter(item =>(
  //   item.toLowerCase().includes(inputCoordinates.toLowerCase())
  // ))
  // const filtered = municipalities.filter(item =>
  //   item.toLowerCase().includes(inputTitle.toLowerCase())
  // )

  const [ShowDropdown, setShowDropdown] = useState(true)
  const [ShowTitle, setShowTitle] = useState(true)
  const [ShowTargetSectors, setShowTargetSectors] = useState(true)

  return (
    <div id="dashboard-export" className='flex min-h-screen overflow-x-hidden bg-[#050816] text-white font-sans'>
      {/* Sidebar Container */}
      <div className='hidden lg:block lg:w-[250px] lg:shrink-0'>
        <div className='fixed top-0 left-0 h-screen w-[250px] z-50'>
          <Navbar />
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className='flex flex-col flex-1 p-4 sm:p-6 min-w-0'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <div>
            <h1 className='tracking-wide font-semibold text-2xl text-slate-100'>
              ALBAY - ILCDB
            </h1>
            <p className='text-xs text-slate-400 mt-1'>Region V - Bicol Region</p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="md:self-end px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            + Add New ILCDB
          </button>
        </div>

        {/* Content Area */}
        <div className='flex flex-col lg:flex-row gap-6 items-start w-full h-full'>
          
          {/* Left Panel: Table Grid */}
          <div className='w-full lg:flex-1 bg-[#0B112C] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-between min-h-[520px]'>
            <div>
              <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6'>
                <h2 className='text-lg font-medium text-slate-200'>
                  {searchQuery ? `Search Results (${filteredILCDB.length})` : `Current ilcdb (${liveILCDB.length})`}
                </h2>
                
                {/* Search & Export Controls Row */}
                <div className='flex items-center gap-3 w-full sm:w-auto'>
                  {/* Table Search Input */}
                    <div className='flex space-x-5 '>
                      <h1 className='text-gray-600'>Select Province:</h1>
                      <select title="" id="" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className='text-white bg-transparent outline-none border-0'>
                        <option className='bg-[#050816] text-white' value="ALL">ALL</option>
                        <option className='bg-[#050816] text-white' value="albay">ALBAY</option>
                        <option className='bg-[#050816] text-white' value="Camarines Sur">CAM SUR</option>
                        <option className='bg-[#050816] text-white' value="Camarines Norte">CAM NOR</option>
                        <option className='bg-[#050816] text-white' value="Sorsogon">SORSOGON</option>
                        <option className='bg-[#050816] text-white' value="Masbate">MASBATE</option>
                        <option className='bg-[#050816] text-white' value="Catanduanes">CATANDUANES</option>
                      </select>
                    </div>
                  <div className='relative flex-1 sm:w-64 sm:flex-initial'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500'>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Search title, email, or role..." 
                      className='w-full bg-[#050816] border border-[#1E293B] rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#8B5CF6] text-slate-200 placeholder-slate-500 transition-colors'
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                        className='absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500 hover:text-slate-300'
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Export Excel Action Button */}
                  <button 
                    onClick={handleExcelExport}
                    title="Export Current Results to Excel"
                    className='flex items-center justify-center gap-1.5 px-3 py-2 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs rounded-lg transition-all font-medium h-[34px] shrink-0'
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export Excel
                  </button>
                </div>
              </div>
              
              <div className='overflow-x-auto'>
                {liveILCDB.length > 0 ? (
                  <table className='w-full text-left border-collapse'>
                    <thead>
                      <tr className='text-xs font-semibold text-slate-400 border-b border-[#1E293B] pb-3'>
                        <th className='pb-3'>title</th>
                        <th className='pb-3'>targetSectors</th>
                        <th className='pb-3'>location</th>
                        <th className='pb-3'>mode</th>
                        <th className='pb-3 w-24 text-right'>Actions</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#1E293B]/50 text-sm'>
                      {paginatedLgus.map((ilcdb) => (
                        <tr key={ilcdb.id} className={`hover:bg-[#111A3E]/50 transition-colors group ${formData.id === ilcdb.id && isModalOpen ? 'bg-[#111A3E]/30' : ''}`}>
                          <td className='py-3.5 font-medium text-[#60A5FA] group-hover:text-blue-400'>
                            {ilcdb.title} {ilcdb.role === 'Admin' && <span className='text-xs ml-1'>👑</span>}
                          </td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{ilcdb.targetSectors}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs' style={{ color: getColor(ilcdb.location) }}>{ilcdb.location}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{Array.isArray(ilcdb.mode)
                            ? ilcdb.mode.join(', ')
                            : ilcdb.mode}
                          </td>
                          <td className='py-3.5 text-right'>
                            <div className='flex items-center justify-end gap-2'>
                              <button 
                                onClick={() => handleOpenEditModal(ilcdb)}
                                title="Edit ILCDB"
                                className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors'
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                              {/* <button 
                                onClick={() => handleDeleteUser(ilcdb.id)}
                                title="Deactive eLGU"
                                className='p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors'
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className='text-center py-12 border border-dashed border-[#1E293B] rounded-lg bg-[#050816]/30'>
                    <svg className="mx-auto h-8 w-8 text-slate-600 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <p className='text-sm text-slate-400 font-medium'>No ilcdb found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className='flex items-center justify-between border-t border-[#1E293B] pt-4 mt-6 text-xs text-slate-400'>
                <div>
                  Showing <span className='font-medium text-slate-200'>{startIndex + 1}</span> to{' '}
                  <span className='font-medium text-slate-200'>
                    {endIndex > filteredILCDB.length ? filteredILCDB.length : endIndex}
                  </span>{' '}
                  of <span className='font-medium text-slate-200'>{filteredILCDB.length}</span> entries
                </div>
                <div className='flex items-center gap-1.5'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2.5 py-1.5 rounded-md border border-[#1E293B] transition-colors ${currentPage === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-7 h-7 rounded-md transition-colors ${currentPage === page ? 'bg-[#8B5CF6] text-white' : 'border border-[#1E293B] text-slate-400 hover:bg-slate-800'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2.5 py-1.5 rounded-md border border-[#1E293B] transition-colors ${currentPage === totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Side Modal Form */}
          {isModalOpen && (
            <div className='w-full lg:w-[480px] shrink-0 bg-[#0B112C] border border-[#1E293B] rounded-xl flex flex-col justify-between transition-all duration-300'>
              {/* Modal Header */}
              <div className='p-6 border-b border-[#1E293B] flex justify-between items-center bg-gradient-to-r from-[#0B112C] to-[#161233] rounded-t-xl'>
                <div>
                  <h2 className='text-lg font-bold text-white tracking-wide'>
                    {modalMode === 'edit' ? 'Edit eLGU' : 'Add New ILCDB'}
                  </h2>
                </div>
                
                {/* Excel Import button */}
                <div className='flex items-center gap-3'>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleExcelImport}
                    accept=".xlsx, .xls"
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    title="Upload Excel Document"
                    className='flex items-center gap-1.5 px-2.5 py-1.5 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs rounded-lg transition-all font-medium'
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    Import Excel
                  </button>

                  <button onClick={() => setIsModalOpen(false)} className='text-slate-400 hover:text-white transition-colors p-1'>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              {/* Modal Body Fields */}
              <div className='p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>ilcdb title</label>
                    <input
                        type="text"
                        value={inputTitle}
                        onChange={(e) => {
                            setInputTitle(e.target.value);
                            setShowDropdown(true);
                        }}
                        placeholder="Search ilcdb..."
                        className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                    />
                    {ShowDropdown && inputTitle && filtered.length > 0 && (
                        <div className="absolute z-50 w-80 mt-1 bg-[#0B112C] border border-[#1E293B] rounded-lg shadow-lg max-h-60 overflow-y-auto">

                            {filtered.map((item, index) => (
                              <div
                                key={`${item}-${index}`}
                                onMouseDown={() => {
                                  setInputTitle(item);
                                  setShowDropdown(false);
                                }}
                                className="px-3 py-2 hover:bg-[#111A3E] cursor-pointer text-slate-200"
                              >
                                {item}
                              </div>
                            ))}

                        </div>
                    )}
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>location</label>
                    <input 
                        value={inputLocation}
                        onChange={(e) => {
                            setInputLocation(e.target.value);
                            setShowTitle(true);
                        }}
                      className='w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5CF6] text-slate-200' 
                    />
                    {
                        ShowTitle && inputLocation && filteredStatus.length > 0 && (
                          <div className="absolute z-50 w-36 mt-1 bg-[#0B112C] border border-[#1E293B] rounded-lg shadow-lg max-h-60 overflow-y-auto">

                            {filteredStatus.map((item) => (
                                <div
                                    key={item}
                                    onMouseDown={() => {
                                    setInputLocation(item);
                                    setShowTitle(false);
                                    }}
                                    className="px-3 py-2 hover:bg-[#111A3E] cursor-pointer text-slate-200"
                                >
                                    {item}
                                </div>
                            ))}

                        </div>
                        )
                    }
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                      <label className='block text-xs font-semibold text-slate-300 mb-1.5 tracking-wider'>mode</label>
                      <input 
                        type="text"
                        value={value}
                        onChange={handleChange}
                        className='w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5CF6] text-slate-200' 
                      />
                      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                    </div>
                    <div>
                      <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>targetSectors</label>
                      <input 
                        value={inputCoordinates}
                        onChange={(e) => {
                          setInputCoordinates(e.target.value)
                          setShowTargetSectors(true)
                        }}
                        className='w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5CF6] text-slate-200' 
                      />
                      {
                        ShowTargetSectors && inputCoordinates && filteredVersion.length > 0 && (
                          <div className="absolute z-50 w-36 mt-1 bg-[#0B112C] border border-[#1E293B] rounded-lg shadow-lg max-h-60 overflow-y-auto">

                            {filteredVersion.map((item) => (
                                <div
                                    key={item}
                                    onMouseDown={() => {
                                    setInputCoordinates(item);
                                    setShowTargetSectors(false);
                                    }}
                                    className="px-3 py-2 hover:bg-[#111A3E] cursor-pointer text-slate-200"
                                >
                                    {item}
                                </div>
                            ))}

                        </div>
                        )
                      }
                    </div>
                  </div>
                
                {/* Permissions Subsection */}
                {/* <div className='pt-4 border-t border-[#1E293B]/60'>
                  <h3 className='text-sm font-semibold text-white mb-0.5'>User Permissions</h3>
                  <p className='text-xs text-slate-400 mb-4'>Select what a user can see or do in the app</p>

                  <div className='overflow-x-auto'>
                    <table className='w-full text-left text-xs'>
                      <thead>
                        <tr className='text-slate-400 border-b border-[#1E293B]'>
                          <th className='pb-2 font-semibold'>Section</th>
                          <th className='pb-2 font-semibold text-center'>Read</th>
                          <th className='pb-2 font-semibold text-center'>Edit</th>
                          <th className='pb-2 font-semibold text-center'>Import</th>
                          <th className='pb-2 font-semibold text-center'>Export</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-[#1E293B]/30'>
                        {permissions.map((sec) => (
                          <tr key={sec.id} className='text-slate-300'>
                            <td className='py-2.5 max-w-[140px] truncate pr-2 font-medium'>{sec.label}</td>
                            <td className='py-2.5 text-center'>
                              {sec.read !== null ? (
                                <button onClick={() => handleToggle(sec.id, 'read')} className={`mx-auto w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${sec.read ? 'bg-[#8B5CF6]' : 'bg-slate-700'}`}>
                                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${sec.read ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              ) : <span className="text-slate-600">-</span>}
                            </td>
                            <td className='py-2.5 text-center'>
                              {sec.edit !== null ? (
                                <button onClick={() => handleToggle(sec.id, 'edit')} className={`mx-auto w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${sec.edit ? 'bg-[#8B5CF6]' : 'bg-slate-700'}`}>
                                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${sec.edit ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              ) : <span className="text-slate-600">-</span>}
                            </td>
                            <td className='py-2.5 text-center'>
                              {sec.import !== null ? (
                                <button onClick={() => handleToggle(sec.id, 'import')} className={`mx-auto w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${sec.import ? 'bg-[#8B5CF6]' : 'bg-slate-700'}`}>
                                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${sec.import ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              ) : <span className="text-slate-600">-</span>}
                            </td>
                            <td className='py-2.5 text-center'>
                              {sec.export !== null ? (
                                <button onClick={() => handleToggle(sec.id, 'export')} className={`mx-auto w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${sec.export ? 'bg-[#8B5CF6]' : 'bg-slate-700'}`}>
                                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${sec.export ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              ) : <span className="text-slate-600">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div> */}
              </div>

              {/* Modal Footer Controls */}
              <div className='p-4 border-t border-[#1E293B] bg-[#090E24] flex justify-between items-center rounded-b-xl'>
                <button onClick={() => setIsModalOpen(false)} className='px-4 py-2 border border-[#1E293B] text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors hover:bg-slate-800'>
                  Discard
                </button>
                <button onClick={updateILCDB} className='px-5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-sm font-medium transition-colors'>
                  {modalMode === 'edit' ? 'Save Changes' : 'Create ILCDB'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default SettingsILCDB