import React, { useState,useEffect, useRef } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx' 
import Navbar from '../Layout/Navbar'

const ITEMS_PER_PAGE = 9; 


const SettingsWIFI = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('edit')
  
  const fileInputRef = useRef(null)

  // Trigger Add Mode
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedWIFI(null);

    setFormData({
      id: null,
      SiteType: '',
      LocationName: '',
      fundSource: '',
      ProjectName: '',
      Contact: '',
      LinkType: '',
      ApCount: '',
      Coordinates: '',
      LocationCode: '',
      Barangay: '',
      Municipality: '',
      Province: '',
      Remarks: '',
      NationWideID: ''
    });

    setInputSiteType('')
    setInputLocationName('')
    setInputFundSource('')
    setInputProjectName('')
    setInputContact('')
    setInputLinkType('')
    setInputApCount('')
    setInputCoordinates('')
    setInputLocationCode('')
    setInputBarangay('')
    setInputMunicipality('')
    setInputProvince('')
    setInputRemarks('')
    setInputNationWideID('')
    setValue('') 
    setError('')
    setIsModalOpen(true)    
    
  };


  //#region Trigger Edit Mode populated with row data

  const handleOpenEditModal = (wifi) => {
    setModalMode('edit');

    setSelectedWIFI(wifi);

    setFormData({
      id: wifi.id || '',
      SiteType: wifi.SiteType || '',
      LocationName: wifi.LocationName || '',
      fundSource: wifi.fundSource || '',
      ProjectName: wifi.ProjectName || '',
      Contact: wifi.Contact || '',
      LinkType: wifi.LinkType || '',
      ApCount: wifi.ApCount || '',
      Coordinates: wifi.Coordinates || '',
      LocationCode: wifi.LocationCode || '',
      Barangay: wifi.Barangay || '',
      Municipality: wifi.Municipality || '',
      Province: wifi.Province || '',
      Remarks: wifi.Remarks || '',
      NationWideID: wifi.NationWideID || ''
    });

    setInputSiteType(wifi.SiteType || ''),
    setInputLocationName(wifi.LocationName || ''),
    setInputFundSource(wifi.fundSource || ''),
    setInputProjectName(wifi.ProjectName || ''),
    setInputContact(wifi.Contact || ''),
    setInputLinkType(wifi.LinkType || ''),
    setInputApCount(wifi.ApCount || ''),
    setInputCoordinates(wifi.Coordinates || ''),
    setInputLocationCode(wifi.LocationCode || ''),
    setInputBarangay(wifi.Barangay || ''),
    setInputMunicipality(wifi.Municipality || ''),
    setInputProvince(wifi.Province || ''),
    setInputRemarks(wifi.Remarks || ''),
    setInputNationWideID(wifi.NationWideID || '')

    if (Array.isArray(wifi.coordinates)) {
      setValue(wifi.coordinates.join(', '));
    } else {
      setValue(wifi.coordinates || '');
    }

    setIsModalOpen(true);

  };

  // Handle row deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to terminate this wifi?")) {
      return;
    }

    try {
      await axios.patch(
        `${VITE_API_URL}/wifiData/${userId}`,
        {
          status: "TERMINATED"
        }
      );

      await fetchWIFI();

      if (formData.id === userId) {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target
  //   setFormData(prev => ({ ...prev, [name]: value }))
  // }

  // const handleToggle = (sectionId, field) => {
  //   setPermissions(prev =>
  //     prev.map(sec =>
  //       sec.id === sectionId ? { ...sec, [field]: !sec[field] } : sec
  //     )
  //   )
  // }

//#region UPDATE
  const VITE_API_URL = import.meta.env.VITE_API_URL
  const [liveWIFI, setLiveWIFI] = useState([]);
  const [loading, setLoading] = useState(true)
  const [selectedWIFI, setSelectedWIFI] = useState(null)

  const updateWIFI = async () => {
  try {
    const coordinatesArray = value
    .split(",")
    .map(coord => Number(coord.trim()));
    const payload = {
      SiteType: inputSiteType,
      LocationName: inputLocationName,
      FundSource: inputFundSource,
      ProjectName: inputProjectName,
      Contact: inputContact,
      LinkType: inputLinkType,
      ApCount: inputApCount,
      Coordinates: inputCoordinates,
      LocationCode: inputLocationCode,
      Barangay: inputBarangay,
      Municipality: inputMunicipality,
      Province: inputProvince,
      Remarks: inputRemarks,
      NationWideID: inputNationWideID
    };

    await axios.patch(
      `${VITE_API_URL}/wifiData/${selectedWIFI.id}`,
      payload
    );

    await fetchWIFI();
    setIsModalOpen(false);

  } catch (err) {
    console.error("ERROR:", err);

    if (err.response) {
      console.error("STATUS:", err.response.status);
      console.error("DATA:", err.response.data);
    }
  }
};

  useEffect(() => {
    fetchWIFI()
  }, [])

//#endregion



//#region CREATE
const createWIFI = async () => {
  try {
    // 1. Prepare your payload exactly like updateWIFI
    const payload = {
      SiteType: inputSiteType,
      LocationName: inputLocationName,
      FundSource: inputFundSource,
      ProjectName: inputProjectName,
      Contact: inputContact,
      LinkType: inputLinkType,
      ApCount: inputApCount,
      Coordinates: inputCoordinates, // Note: If Coordinates needs to be an array from 'value', use coordinatesArray here
      LocationCode: inputLocationCode,
      Barangay: inputBarangay,
      Municipality: inputMunicipality,
      Province: inputProvince,
      Remarks: inputRemarks,
      NationWideID: inputNationWideID
    };

    // 2. CHANGE: Use axios.post instead of patch, and remove the /${selectedWIFI.id} from the URL
    await axios.post(
      `${VITE_API_URL}/wifiData`,
      payload
    );

    // 3. Refresh data and close modal
    await fetchWIFI();
    setIsModalOpen(false);

  } catch (err) {
    console.error("ERROR CREATING:", err);
    if (err.response) {
      console.error("STATUS:", err.response.status);
      console.error("DATA:", err.response.data);
    }
  }
};



//#region FETCH DATA
  
  const fetchWIFI = async () => {
    try{
      const response = await axios.get(`${VITE_API_URL}/wifiData`)
      const data = response.data
      console.log("API DATA:", response.data);
      const normalized = data
      .filter(item => item.Province === "Albay" || item.Province === "ALBAY")
      .map(item => ({
        id: item._id,
        SiteType: item.SiteType,
        LocationName: item.LocationName,
        fundSource: item.fundSource,
        ProjectName: item.ProjectName,
        Contact: item.Contact,
        LinkType: item.LinkType,
        ApCount: item.ApCount,
        Coordinates: item.Coordinates,
        LocationCode: item.LocationCode,
        Barangay: item.Barangay,
        Municipality: item.Municipality,
        Province: item.Province,
        Remarks: item.Remarks,
        NationWideID: item.NationWideID,
      }));

      console.log("filter",normalized)
      setLiveWIFI(normalized)
      } catch(err) {
        console.error(err)
      } finally {
        setLoading(false)
    }
  }
//#endregion


//#region FILE IMPORT
  // Handle Excel File Import/Parsing
  const handleExcelImport = async (e) => {
      const file = e.target.files[0];
  
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = async (event) => {
          const data = new Uint8Array(event.target.result);
  
          const workbook = XLSX.read(data, {
              type: "array",
          });
  
          const sheetName = workbook.SheetNames[0];
  
          const worksheet = workbook.Sheets[sheetName];
  
          // First row = header
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
          console.log(jsonData);
  
          try {
              await axios.post(`${VITE_API_URL}/wifiData/import`, jsonData);
              
              await fetchWIFI();
          } catch (err) {
              console.error(err);
          }
      };
  
      reader.readAsArrayBuffer(file);
  };

  // // Handle Excel Export Functionality
  const handleExcelExport = () => {
    if (filteredWIFI.length === 0) {
      alert("No data available to export.")
      return
    }

    // Map rows to custom object layout to exclude UI artifacts like avatar URLs
    const exportData = filteredWIFI.map(wifi => ({
      'SiteType': wifi.SiteType,
      'LocationName': wifi.LocationName,
      'fundSource': wifi.fundSource,
      'ProjectName': wifi.ProjectName,
      'Contact': wifi.Contact,
      'LinkType': wifi.LinkType,
      'ApCount': wifi.ApCount,
      'Coordinates': wifi.Coordinates,
      'LocationCode': wifi.LocationCode,
      'Barangay': wifi.Barangay,
      'Municipality': wifi.Municipality,
      'Province': wifi.Province,
      'Remarks': wifi.Remarks,
      'NationWideID': wifi.NationWideID,
    }))

    // Generate sheet structures and download workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "WIFI List")
    
    // Trigger localized file download system
    XLSX.writeFile(workbook, "wifi_export_format.xlsx")
  }

  // Form States
    const [formData, setFormData] = useState({
      id: null,
      SiteType: '',
      LocationName: '',
      fundSource: '',
      ProjectName: '',
      Contact: '',
      LinkType: '',
      ApCount: '',
      Coordinates: '',
      LocationCode: '',
      Barangay: '',
      Municipality: '',
      Province: '',
      Remarks: '',
      NationWideID: ''
    })
  // Search logic
  
 const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;

    const filteredWIFI = liveWIFI.filter((item) => {
    const query = searchQuery.toLowerCase();

    return (
      item.SiteType?.toLowerCase().includes(query) ||
      item.LocationName?.toLowerCase().includes(query) ||
      item.fundSource?.toLowerCase().includes(query) ||
      item.ProjectName?.toLowerCase().includes(query) ||
      item.Contact?.toLowerCase().includes(query) ||
      item.LinkType?.toLowerCase().includes(query) ||
      item.ApCount?.toLowerCase().includes(query) ||
      item.Coordinates?.join(", ").toLowerCase().includes(query) ||
      item.LocationCode?.toLowerCase().includes(query) ||
      item.Barangay?.toLowerCase().includes(query) ||
      item.Municipality?.toLowerCase().includes(query) ||
      item.Province?.toLowerCase().includes(query) ||
      item.Remarks?.toLowerCase().includes(query) ||
      item.NationWideID?.includes(query)
    );
  });

console.log("SEARCH QUERY:", searchQuery)
console.log("FILTERED:", filteredWIFI)

  // Pagination Calculation Core Logic
  const totalPages = Math.ceil(filteredWIFI.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedWIFI = filteredWIFI.slice(startIndex, endIndex)

  console.log("liveWIFI:", liveWIFI)
  console.log("filteredWIFI:", filteredWIFI)
  console.log("Paginated:", paginatedWIFI)

  
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset back to first page when filtering
  }

//   data for input
  const [inputSiteType , setInputSiteType] = useState("")
  const [inputLocationName , setInputLocationName] = useState("")
  const [inputFundSource , setInputFundSource] = useState("")
  const [inputProjectName , setInputProjectName] = useState("")
  const [inputContact , setInputContact] = useState("")
  const [inputLinkType , setInputLinkType] = useState("")
  const [inputApCount , setInputApCount] = useState("")
  const [inputCoordinates , setInputCoordinates] = useState("")
  const [coordinates, setCoordinates] = useState([])
  const [inputLocationCode , setInputLocationCode] = useState("")
  const [inputBarangay , setInputBarangay] = useState("")
  const [inputMunicipality , setInputMunicipality] = useState("")
  const [inputProvince , setInputProvince] = useState("")
  const [inputRemarks , setInputRemarks] = useState("")
  const [inputNationWideID , setInputNationWideID] = useState("")

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [err, setErr] = useState("");

  const handleProvince = (e) => {
    const input = e.target.value;
    setInputProvince(input);

    if (!input.trim().toLowerCase().includes("Albay")) {
      setErr("Province must be Albay");
      const submitButton = document.getElementById('SubmitButton');
      if (submitButton) {
        submitButton.disabled = true;
      }
    } else {
      setErr("");
    }
  }

const handleChange = (e) => {
  const input = e.target.value;
  setValue(input);

  if(input.trim() == ""){
    setError("")
    return  
  }

  const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;

    if (!regex.test(input)) {
      setError("Invalid format. Use: 123.456, 123.456");
      // i put id='SubmitButton' i want to disable the button if the error is not empty
      const submitButton = document.getElementById('SubmitButton');
      if (submitButton) {
        submitButton.disabled = true;
      }
    }
    else {
      setError("");
      // Enable the button if there's no error
      const submitButton = document.getElementById('SubmitButton');
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  };


  // const filteredStatus = status.filter(item =>(
  //   item.toLowerCase().includes(inputStatus.toLowerCase())
  // ))
  // const filteredVersion = version.filter(item =>(
  //   item.toLowerCase().includes(inputVersion.toLowerCase())
  // ))
  // const filtered = municipalities.filter(item =>
  //   item.toLowerCase().includes(inputData.toLowerCase())
  // )

  const [ShowDropdown, setShowDropdown] = useState(true)
  const [ShowStatus, setShowStatus] = useState(true)
  const [ShowVersion, setShowVersion] = useState(true)

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
              ALBAY - WIFI
            </h1>
            <p className='text-xs text-slate-400 mt-1'>Region V - Bicol Region</p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="md:self-end px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            + Add New WIFI
          </button>
        </div>

        {/* Content Area */}
        <div className='flex flex-col lg:flex-row gap-6 items-start w-full h-full'>
          
          {/* Left Panel: Table Grid */}
          <div className='w-full lg:flex-1 bg-[#0B112C] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-between min-h-[520px]'>
            <div>
              <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6'>
                <h2 className='text-lg font-medium text-slate-200'>
                  {searchQuery ? `Search Results (${filteredWIFI.length})` : `Current WIFI (${liveWIFI.length})`}
                </h2>
                
                {/* Search & Export Controls Row */}
                <div className='flex items-center gap-3 w-full sm:w-auto'>
                  {/* Table Search Input */}
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
                      placeholder="Search name, email, or role..." 
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
                {liveWIFI.length > 0 ? (
                  <table className='w-full text-left border-collapse'>
                    <thead>
                      <tr className='text-xs font-semibold text-slate-400 border-b border-[#1E293B] pb-3'>
                        <th className='pb-3 text-wrap'>SiteType</th>
                        <th className='pb-3 text-wrap'>LocationName</th>
                        <th className='pb-3 text-wrap'>fundSource</th>
                        <th className='pb-3 text-wrap'>ProjectName</th>
                        <th className='pb-3 text-wrap'>Contact</th>
                        <th className='pb-3 text-wrap'>LinkType</th>
                        <th className='pb-3 text-wrap'>ApCount</th>
                        <th className='pb-3 text-wrap'>Coordinates</th>
                        <th className='pb-3 text-wrap'>LocationCode</th>
                        <th className='pb-3 text-wrap'>Barangay</th>
                        <th className='pb-3 text-wrap'>Municipality</th>
                        <th className='pb-3 text-wrap'>Province</th>
                        <th className='pb-3 text-wrap'>Remarks</th>
                        <th className='pb-3 text-wrap'>NationWideID</th>
                        {/* <th className='pb-3 text-wrap'>Coordinates</th> */}
                        <th className='pb-3 w-24 text-right'>Actions</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#1E293B]/50 text-sm'>
                      {paginatedWIFI.map((wifi) => (
                        <tr key={wifi.id} className={`hover:bg-[#111A3E]/50 transition-colors group ${formData.id === wifi.id && isModalOpen ? 'bg-[#111A3E]/30' : ''}`}>
                          
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.SiteType}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.LocationName}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.fundSource}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.ProjectName}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.Contact}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.LinkType}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.ApCount}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.Coordinates}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.LocationCode}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.Barangay}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.Municipality}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.Province}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.Remarks}</td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{wifi.NationWideID}</td>
                          {/* <td className='py-3.5 text-slate-300 font-mono text-xs'>{Array.isArray(wifi.Coordinates)
                            ? wifi.Coordinates.join(', ')
                            : wifi.Coordinates}
                          </td> */}
                          <td className='py-3.5 text-right'>
                            <div className='flex items-center justify-end gap-2'>
                              <button 
                                onClick={() => handleOpenEditModal(wifi)}
                                title="Edit eLGU"
                                className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors'
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                              {/* <button 
                                onClick={() => handleDeleteUser(wifi.id)}
                                title="Archive WIFI"
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
                    <p className='text-sm text-slate-400 font-medium'>No PROVINCE WIFI DATA found matching "{searchQuery}"</p>
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
                    {endIndex > filteredWIFI.length ? filteredWIFI.length : endIndex}
                  </span>{' '}
                  of <span className='font-medium text-slate-200'>{filteredWIFI.length}</span> entries
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
                    {modalMode === 'edit' ? 'Edit WIFI' : 'Add New WIFI'}
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
                {/* SiteType */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>Site type</label>
                  <input
                      type="text"
                      value={inputSiteType}
                      onChange={(e) => {
                          setInputSiteType(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* locational name */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>locational name</label>
                  <input
                      type="text"
                      value={inputLocationName}
                      onChange={(e) => {
                          setInputLocationName(e.target.value);
                      }}
                      placeholder="Search wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* fund source */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>fund source</label>
                  <input
                      type="text"
                      value={inputFundSource}
                      onChange={(e) => {
                          setInputFundSource(e.target.value);
                      }}
                      placeholder="Search wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* project name */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>project name</label>
                  <input
                      type="text"
                      value={inputProjectName}
                      onChange={(e) => {
                          setInputProjectName(e.target.value);
                      }}
                      placeholder="project name wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* contact */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>contact</label>
                  <input
                      type="text"
                      value={inputContact}
                      onChange={(e) => {
                          setInputContact(e.target.value);
                      }}
                      placeholder="contact wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* link type */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>link type</label>
                  <input
                      type="text"
                      value={inputLinkType}
                      onChange={(e) => {
                          setInputLinkType(e.target.value);
                      }}
                      placeholder="link type wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* ap account */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>ap account</label>
                  <input
                      type="text"
                      value={inputApCount}
                      onChange={(e) => {
                          setInputApCount(e.target.value);
                      }}
                      placeholder="ap account wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* coordinates */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>coordinates</label>
                  <input
                      type="text"
                        value={value}
                      onChange={handleChange}
                      readOnly={modalMode === "edit" && value !== ""} // added for validation to prevent editing coordinates in edit mode
                      placeholder="sample: 120.9842, 14.5995"
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                  {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                </div>
                {/* location code */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>location code</label>
                  <input
                      type="text"
                      value={inputLocationCode}
                      onChange={(e) => {
                          setInputLocationCode(e.target.value);
                      }}
                      placeholder="location code wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* barangay */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>barangay</label>
                  <input
                      type="text"
                      value={inputBarangay}
                      onChange={(e) => {
                          setInputBarangay(e.target.value);
                      }}
                      placeholder="barangay wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* municipality */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>municipality</label>
                  <input
                      type="text"
                      value={inputMunicipality}
                      onChange={(e) => {
                          setInputMunicipality(e.target.value);
                      }}
                      placeholder="municipality ..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div> 
                {/* Province */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>Province</label>
                  <input
                      type="text"
                      value={inputProvince}
                      onChange={handleProvince}
                      placeholder="Province wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                  {err && <p className="text-red-400 text-xs mt-1">{err}</p>}
                </div>
                {/* Remarks */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>Remarks</label>
                  <input
                      type="text"
                      value={inputRemarks}
                      onChange={(e) => {
                          setInputRemarks(e.target.value);
                      }}
                      placeholder="Remarks wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* national wideID */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>national wideID</label>
                  <input
                      type="text"
                      value={inputNationWideID}
                      onChange={(e) => {
                          setInputNationWideID(e.target.value);
                      }}
                      placeholder="national wideID wifi..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className='p-4 border-t border-[#1E293B] bg-[#090E24] flex justify-between items-center rounded-b-xl'>
                <button onClick={() => setIsModalOpen(false)} className='px-4 py-2 border border-[#1E293B] text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors hover:bg-slate-800'>
                  Discard
                </button>
                <button id='SubmitButton' onClick={modalMode === 'edit' ? updateWIFI : createWIFI} className='px-5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-sm font-medium transition-colors'>
                  {modalMode === 'edit' ? 'Save Changes' : 'Create '}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default SettingsWIFI