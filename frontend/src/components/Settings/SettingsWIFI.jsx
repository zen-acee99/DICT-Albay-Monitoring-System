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
    setSelectedPNPKI(null);

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

    setSiteType('')
    setLocationName('')
    setfundSource('')
    setProjectName('')
    setContact('')
    setLinkType('')
    setApCount('')
    setCoordinates('')
    setLocationCode('')
    setBarangay('')
    setMunicipality('')
    setProvince('')
    setRemarks('')
    setNationWideID('')
    setValue('') 
    setError('')
    setIsModalOpen(true)    
    
  };


  // Trigger Edit Mode populated with row data

  const handleOpenEditModal = (pnpki) => {
    setModalMode('edit');

    setSelectedPNPKI(pnpki);

    setFormData({
      id: pnpki.id || '',
      Province: pnpki.Province || '',
      Date: pnpki.Date || '',
      Raa: pnpki.Raa || '',
      Region: pnpki.Region || '',
      LastName_firstName_Sign: pnpki.LastName_firstName_Sign || '',
      fullName: pnpki.fullName || '',
      EmailAddress: pnpki.EmailAddress || '',
      ContactNumber: pnpki.ContactNumber || '',
      Municipality: pnpki.Municipality || '',
      CongressionalDistrict: pnpki.CongressionalDistrict || '',
      AgencyName: pnpki.AgencyName || '',
      followS_NConvention: pnpki.followS_NConvention || '',
      Tax: pnpki.Tax || '',
      Status: pnpki.Status || ''
    });

    setInputSiteType(Wifi. || ''),
    setInputLocationName(Wifi. || ''),
    setInputfundSource(Wifi. || ''),
    setInputProjectName(Wifi. || ''),
    setInputContact(Wifi. || ''),
    setInputLinkType(Wifi. || ''),
    setInputApCount(Wifi. || ''),
    setInputCoordinates(Wifi. || ''),
    setInputLocationCode(Wifi. || ''),
    setInputBarangay(Wifi. || ''),
    setInputMunicipality(Wifi. || ''),
    setInputProvince(Wifi. || ''),
    setInputRemarks(Wifi. || ''),
    setInputNationWideID(Wifi. || ''),
    setInputValue(Wifi. || ''),
    setInputError(Wifi. || ''),
    setInputIsModalOpen(Wifi. || '')

    if (Array.isArray(pnpki.coordinates)) {
      setValue(pnpki.coordinates.join(', '));
    } else {
      setValue(pnpki.coordinates || '');
    }

    setIsModalOpen(true);
  };

  // Handle row deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to terminate this pnpki?")) {
      return;
    }

    try {
      await axios.patch(
        `${VITE_API_URL}/pnpki/${userId}`,
        {
          status: "TERMINATED"
        }
      );

      await fetchPNPKI();

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
  const [liveWIFI, setLivePNPKI] = useState([]);
  const [loading, setLoading] = useState(true)
  const [selectedPNPKI, setSelectedPNPKI] = useState(null)

  const updatePNPKI = async () => {
  try {
    const coordinatesArray = value
    .split(",")
    .map(coord => Number(coord.trim()));
    const payload = {
      Province: inputprovince,
      Date: inputdate,
      Raa: inputraa,
      Region: inputregion,
      LastName_firstName_Sign: inputLastName_firstName_Sign,
      fullName: inputfullName,
      EmailAddress: inputEmailAddress,
      ContactNumber: inputContactNumber,
      Municipality: inputMunicipality,
      CongressionalDistrict: inputCongressionalDistrict,
      AgencyName: inputAgencyName,
      followS_NConvention: inputfollowS_NConvention,
      Tax: inputtax,
      Status: inputstatus
    };

    await axios.patch(
      `${VITE_API_URL}/pnpki/${selectedPNPKI.id}`,
      payload
    );

    await fetchPNPKI();
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
    fetchPNPKI()
  }, [])

//#endregion


//#region FETCH DATA
  
  const fetchPNPKI = async () => {
    try{
      const response = await axios.get(`${VITE_API_URL}/pnpki`)
      const data = response.data
      console.log("API DATA:", response.data);
      const normalized = data
      .filter(item => item.Province === "ALBAY")
      .map(item => ({
        id: item._id,
        Province: item.Province,
        Date: item.Date,
        Raa: item.Raa,
        Region: item.Region,
        LastName_firstName_Sign: item.LastName_firstName_Sign,
        fullName: item.fullName,
        EmailAddress: item.EmailAddress,
        ContactNumber: item.ContactNumber,
        Municipality: item.Municipality,
        CongressionalDistrict: item.CongressionalDistrict,
        AgencyName: item.AgencyName,
        followS_NConvention: item.followS_NConvention,
        Tax: item.Tax,
        Status: item.Status,
      }));

      console.log("filter",normalized)
      setLivePNPKI(normalized)
      } catch(err) {
        console.error(err)
      } finally {
        setLoading(false)
    }
  }
//#endregion


//#region FILE IMPORT
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

          setInputData(row.name || '');
          setInputStatus(row.status || '');
          setInputVersion(row.version || '');
          setValue(row.coordinates || '');
        }

      } catch (error) {
        console.error("Error reading excel file:", error);
      }
    };

    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // // Handle Excel Export Functionality
  const handleExcelExport = () => {
    if (filteredWIFI.length === 0) {
      alert("No data available to export.")
      return
    }

    // Map rows to custom object layout to exclude UI artifacts like avatar URLs
    const exportData = filteredWIFI.map(pnpki => ({
      'pnpki Name': pnpki.name,
      'Full Name': pnpki.version,
      'Email Address': pnpki.status,
      'Account Role': pnpki.coordinates
    }))

    // Generate sheet structures and download workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users List")
    
    // Trigger localized file download system
    XLSX.writeFile(workbook, "pnpki_export.xlsx")
  }

  // Form States
    const [formData, setFormData] = useState({
      id: null,
      name: '',
      status: '',
      version: '',  
      coordinates: ''
    })
  // Search logic
  
 const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;

    const filteredWIFI = liveWIFI.filter((item) => {
    const query = searchQuery.toLowerCase();

    return (
      item.Date?.toLowerCase().includes(query) ||
      item.Raa?.toLowerCase().includes(query) ||
      item.Region?.toLowerCase().includes(query) ||
      item.LastName_firstName_Sign?.toLowerCase().includes(query) ||
      item.fullName?.toLowerCase().includes(query) ||
      item.EmailAddress?.toLowerCase().includes(query) ||
      item.ContactNumber?.toLowerCase().includes(query) ||
      item.Municipality?.toLowerCase().includes(query) ||
      item.CongressionalDistrict?.toLowerCase().includes(query) ||
      item.AgencyName?.toLowerCase().includes(query) ||
      item.followS_NConvention?.toLowerCase().includes(query) ||
      item.Tax?.toLowerCase().includes(query) ||
      item.Status?.toLowerCase().includes(query) ||
      item.coordinates?.join(", ").toLowerCase().includes(query)
    );
  });

console.log("SEARCH QUERY:", searchQuery)
console.log("FILTERED:", filteredWIFI)

  // Pagination Calculation Core Logic
  const totalPages = Math.ceil(filteredWIFI.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedPNPKI = filteredWIFI.slice(startIndex, endIndex)

  console.log("liveWIFI:", liveWIFI)
  console.log("filteredWIFI:", filteredWIFI)
  console.log("Paginated:", paginatedPNPKI)

  
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
  const [SiteType, setSiteType] = useState("")
  const [LocationName, setLocationName] = useState("")
  const [fundSource, setfundSource] = useState("")
  const [ProjectName, setProjectName] = useState("")
  const [Contact, setContact] = useState("")
  const [LinkType, setLinkType] = useState("")
  const [ApCount, setApCount] = useState("")
  const [Coordinates, setCoordinates] = useState("")
  const [LocationCode, setLocationCode] = useState("")
  const [Barangay, setBarangay] = useState("")
  const [Municipality, setMunicipality] = useState("")
  const [Province, setProvince] = useState("")
  const [Remarks, setRemarks] = useState("")
  const [NationWideID, setNationWideID] = useState("")

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
              ALBAY - PNPKI
            </h1>
            <p className='text-xs text-slate-400 mt-1'>Region V - Bicol Region</p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="md:self-end px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            + Add New PNPKI
          </button>
        </div>

        {/* Content Area */}
        <div className='flex flex-col lg:flex-row gap-6 items-start w-full h-full'>
          
          {/* Left Panel: Table Grid */}
          <div className='w-full lg:flex-1 bg-[#0B112C] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-between min-h-[520px]'>
            <div>
              <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6'>
                <h2 className='text-lg font-medium text-slate-200'>
                  {searchQuery ? `Search Results (${filteredWIFI.length})` : `Current PNPKI (${liveWIFI.length})`}
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
                      {paginatedPNPKI.map((wifi) => (
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
                          {/* <td className='py-3.5 text-slate-300 font-mono text-xs'>{Array.isArray(pnpki.Coordinates)
                            ? pnpki.Coordinates.join(', ')
                            : pnpki.Coordinates}
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
                              <button 
                                onClick={() => handleDeleteUser(wifi.id)}
                                title="Deactive eLGU"
                                className='p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors'
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
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
                    <p className='text-sm text-slate-400 font-medium'>No WIFI DATA found matching "{searchQuery}"</p>
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
                    {modalMode === 'edit' ? 'Edit PNPKI' : 'Add New PNPKI'}
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
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>PROVINCE</label>
                  <input
                      type="text"
                      value={inputprovince}
                      onChange={(e) => {
                          setInputprovince(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* DATE */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>DATE</label>
                  <input
                      type="text"
                      value={inputdate}
                      onChange={(e) => {
                          setInputdate(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* RAA */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>RAA</label>
                  <input
                      type="text"
                      value={inputraa}
                      onChange={(e) => {
                          setInputraa(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* REGION */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>REGION</label>
                  <input
                      type="text"
                      value={inputregion}
                      onChange={(e) => {
                          setInputregion(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* LastName_firstName_Sign */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>LastName_firstName_Sign</label>
                  <input
                      type="text"
                      value={inputLastName_firstName_Sign}
                      onChange={(e) => {
                          setInputLastName_firstName_Sign(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* fullName */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>fullName</label>
                  <input
                      type="text"
                      value={inputfullName}
                      onChange={(e) => {
                          setInputfullName(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* EmailAddress */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>EmailAddress</label>
                  <input
                      type="text"
                      value={inputEmailAddress}
                      onChange={(e) => {
                          setInputEmailAddress(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* ContactNumber */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>ContactNumber</label>
                  <input
                      type="text"
                      value={inputContactNumber}
                      onChange={(e) => {
                          setInputContactNumber(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* MUNICIPALITIES */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>MUNICIPALITIES</label>
                  <input
                      type="text"
                      value={inputMunicipality}
                      onChange={(e) => {
                          setInputMunicipality(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* CongressionalDistrict */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>CongressionalDistrict</label>
                  <input
                      type="text"
                      value={inputCongressionalDistrict}
                      onChange={(e) => {
                          setInputCongressionalDistrict(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* AgencyName */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>AgencyName</label>
                  <input
                      type="text"
                      value={inputAgencyName}
                      onChange={(e) => {
                          setInputAgencyName(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* followS_NConvention */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>followS_NConvention</label>
                  <input
                      type="text"
                      value={inputfollowS_NConvention}
                      onChange={(e) => {
                          setInputfollowS_NConvention(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* Tax */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>Tax</label>
                  <input
                      type="text"
                      value={inputtax}
                      onChange={(e) => {
                          setInputtax(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                {/* Status */}
                <div>
                  <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>Status</label>
                  <input
                      type="text"
                      value={inputstatus}
                      onChange={(e) => {
                          setInputstatus(e.target.value);
                          setShowDropdown(true);
                      }}
                      placeholder="Search pnpki..."
                      className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm"
                  />
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className='p-4 border-t border-[#1E293B] bg-[#090E24] flex justify-between items-center rounded-b-xl'>
                <button onClick={() => setIsModalOpen(false)} className='px-4 py-2 border border-[#1E293B] text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors hover:bg-slate-800'>
                  Discard
                </button>
                <button onClick={updatePNPKI} className='px-5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-sm font-medium transition-colors'>
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