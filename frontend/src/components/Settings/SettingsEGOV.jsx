import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx' 
import Navbar from '../Layout/Navbar'

const ITEMS_PER_PAGE = 5; 

const SettingsEGOV = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  // --- CORE DATA STATES ---
  const [liveegov, setLiveEGOV] = useState([]);
  const [promotionalList, setPromotionalList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CONTROL STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryPro, setSearchQueryPro] = useState('');
  const [searchQueryAct, setSearchQueryAct] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagePro, setCurrentPagePro] = useState(1);
  const [currentPageAct, setCurrentPageAct] = useState(1);

  // --- MODAL SYSTEM STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit'); 
  const [selectedItem, setSelectedItem] = useState(null);
  const fileInputRef = useRef(null);

  // --- INPUT STATES ---
  const [inputProvince, setInputProvince] = useState("");
  const [inputMunicipality, setInputMunicipality] = useState("");
  const [inputRegisteredUsers, setInputRegisteredUsers] = useState("");
  const [inputPromotionalActivities, setInputPromotionalActivities] = useState("");
  const [inputTechnicalAssistance, setInputTechnicalAssistance] = useState("");
  const [inputCoordinates, setInputCoordinates] = useState("");
  
  // Promotional Dynamic Fields
  const [inputProActivityOnly, setInputProActivityOnly] = useState("");

  // Egov Activity Dynamic Fields
  const [inputTechnicalDate, setInputTechnicalDate] = useState("");
  const [inputActAssistanceOnly, setInputActAssistanceOnly] = useState("");

  // --- FETCH API LOGIC ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Main EGOV
      const resEgov = await axios.get(`${VITE_API_URL}/egov`);
      const normalizedEgov = (resEgov.data || [])
        .filter(item => item.Province === "Albay" || item.Province === "ALBAY")
        .map(item => ({
          id: item._id,
          Province: item.Province,
          municipalities: item.municipalities,
          registeredUsers: item.registeredUsers,
          PromotionalActivities: item.PromotionalActivities,
          TechnicalAssistance: item.TechnicalAssistance,
          Coordinates: item.Coordinates
        }));
      setLiveEGOV(normalizedEgov);

      // 2. Fetch Promotional Activities
      const resPro = await axios.get(`${VITE_API_URL}/egovpro`);
      const normalizedPro = (resPro.data || []).map(item => ({
        id: item._id,
        PromotionalActivities: item.PromotionalActivities
      }));
      setPromotionalList(normalizedPro);

      // 3. Fetch Egov Activities
      const resAct = await axios.get(`${VITE_API_URL}/egovact`);
      const normalizedAct = (resAct.data || []).map(item => ({
        id: item._id,
        TechnicalDate: item.TechnicalDate,
        TechnicalAssistance: item.TechnicalAssistance
      }));
      setActivityList(normalizedAct);

    } catch (err) {
      console.error("Error retrieving dashboard tables data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- TRIGGER MODALS OPEN ---
  const handleOpenAddModal = (type = 'egov') => {
    setSelectedItem(null);
    if (type === 'egov') {
      setModalMode('add');
      setInputProvince(''); setInputMunicipality(''); setInputRegisteredUsers('');
      setInputPromotionalActivities(''); setInputTechnicalAssistance(''); setInputCoordinates('');
    } else if (type === 'pro') {
      setModalMode('addPro');
      setInputProActivityOnly('');
    } else if (type === 'act') {
      setModalMode('addAct');
      setInputTechnicalDate(''); setInputActAssistanceOnly('');
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item, type = 'egov') => {
    setSelectedItem(item);
    if (type === 'egov') {
      setModalMode('edit');
      setInputProvince(item.Province || '');
      setInputMunicipality(item.municipalities || '');
      setInputRegisteredUsers(item.registeredUsers || '');
      setInputPromotionalActivities(item.PromotionalActivities || '');
      setInputTechnicalAssistance(item.TechnicalAssistance || '');
      setInputCoordinates(item.Coordinates || '');
    } else if (type === 'pro') {
      setModalMode('editPro');
      setInputProActivityOnly(item.PromotionalActivities || '');
    } else if (type === 'act') {
      setModalMode('editAct');
      setInputTechnicalDate(item.TechnicalDate || '');
      setInputActAssistanceOnly(item.TechnicalAssistance || '');
    }
    setIsModalOpen(true);
  };

  // --- CREATE & UPDATE ACTIONS ---
  const handleSubmitAction = async () => {
    try {
      if (modalMode === 'add') {
        const payload = {
          Province: inputProvince, municipalities: inputMunicipality, registeredUsers: inputRegisteredUsers,
          PromotionalActivities: inputPromotionalActivities, TechnicalAssistance: inputTechnicalAssistance, Coordinates: inputCoordinates
        };
        await axios.post(`${VITE_API_URL}/egov`, payload);
      } 
      else if (modalMode === 'edit') {
        const payload = {
          Province: inputProvince, municipalities: inputMunicipality, registeredUsers: inputRegisteredUsers,
          PromotionalActivities: inputPromotionalActivities, TechnicalAssistance: inputTechnicalAssistance, Coordinates: inputCoordinates
        };
        await axios.patch(`${VITE_API_URL}/egov/${selectedItem.id}`, payload);
      } 
      else if (modalMode === 'addPro') {
        await axios.post(`${VITE_API_URL}/egovpro`, { PromotionalActivities: inputProActivityOnly });
      } 
      else if (modalMode === 'editPro') {
        await axios.patch(`${VITE_API_URL}/egovpro/${selectedItem.id}`, { PromotionalActivities: inputProActivityOnly });
      } 
      else if (modalMode === 'addAct') {
        await axios.post(`${VITE_API_URL}/egovact`, { TechnicalDate: inputTechnicalDate, TechnicalAssistance: inputActAssistanceOnly });
      } 
      else if (modalMode === 'editAct') {
        await axios.patch(`${VITE_API_URL}/egovact/${selectedItem.id}`, { TechnicalDate: inputTechnicalDate, TechnicalAssistance: inputActAssistanceOnly });
      }

      await fetchAllData();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Submission failed parsing request error:", err);
    }
  };

  // --- CORRECTED DELETE / TERMINATE SYSTEM ACTION ---
  // Using exact backend architecture logic: PATCH with status TERMINATED
  const handleDeleteItem = async (id, targetRoute) => {
    if (!window.confirm(`Are you sure you want to terminate this ${targetRoute} entry?`)) return;
    try {
      await axios.patch(`${VITE_API_URL}/${targetRoute}/${id}`, {
        status: "TERMINATED"
      });
      await fetchAllData();
    } catch (err) {
      console.error("Error executing collection termination sequence:", err);
    }
  };

  // --- FILTER & PAGINATION MATRIX ---
  const filteredEGOV = liveegov.filter(item => {
    const q = searchQuery.toLowerCase();
    return item.Province?.toLowerCase().includes(q) || item.municipalities?.toLowerCase().includes(q);
  });

  const filteredPro = promotionalList.filter(item => 
    item.PromotionalActivities?.toLowerCase().includes(searchQueryPro.toLowerCase())
  );

  const filteredAct = activityList.filter(item => 
    item.TechnicalDate?.toLowerCase().includes(searchQueryAct.toLowerCase()) ||
    item.TechnicalAssistance?.toLowerCase().includes(searchQueryAct.toLowerCase())
  );

  const paginateData = (dataset, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return dataset.slice(start, start + ITEMS_PER_PAGE);
  };

  const paginatedEgov = paginateData(filteredEGOV, currentPage);
  const paginatedPro = paginateData(filteredPro, currentPagePro);
  const paginatedAct = paginateData(filteredAct, currentPageAct);

  const totalPagesEgov = Math.ceil(filteredEGOV.length / ITEMS_PER_PAGE);
  const totalPagesPro = Math.ceil(filteredPro.length / ITEMS_PER_PAGE);
  const totalPagesAct = Math.ceil(filteredAct.length / ITEMS_PER_PAGE);

  // --- EXPORT TO EXCEL SYSTEM ---
  const handleExcelExport = () => {
    if (filteredEGOV.length === 0) return alert("No operational dataset selected to download.");
    const worksheet = XLSX.utils.json_to_sheet(filteredEGOV);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Albay Matrix");
    XLSX.writeFile(workbook, "Albay_Egov_Report.xlsx");
  };

  return (
    <div className='flex min-h-screen overflow-x-hidden bg-[#050816] text-white font-sans'>
      {/* Sidebar navigation */}
      <div className='hidden lg:block lg:w-[250px] lg:shrink-0'>
        <div className='fixed top-0 left-0 h-screen w-[250px] z-50'>
          <Navbar />
        </div>
      </div>

      {/* Main Framework Dashboard Content */}
      <div className='flex flex-col flex-1 p-4 sm:p-6 min-w-0 space-y-10'>
        {/* Main Interface Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1E293B] pb-5'>
          <div>
            <h1 className='tracking-wide font-semibold text-2xl text-slate-100 uppercase'>ALBAY - eGOVPH OPERATIONAL</h1>
            <p className='text-xs text-slate-400 mt-1'>Region V - Bicol Region</p>
          </div>
          <div className='flex flex-wrap gap-2.5'>
            <button onClick={() => handleOpenAddModal('egov')} className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-medium rounded-lg transition-colors shadow-sm">+ Add Main EGOV</button>
            <button onClick={() => handleOpenAddModal('pro')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-medium rounded-lg transition-colors shadow-sm">+ Add Promotional Entry</button>
            <button onClick={() => handleOpenAddModal('act')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-medium rounded-lg transition-colors shadow-sm">+ Add Activity Track</button>
          </div>
        </div>

        {/* ==================== TABLE 1: MAIN EGOV DATA ==================== */}
        <div className='bg-[#0B112C] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-between'>
          <div>
            <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4'>
              <h2 className='text-lg font-medium text-slate-200'>Current egov ({filteredEGOV.length})</h2>
              <div className='flex items-center gap-3'>
                <input 
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search main datasets..." className='bg-[#050816] border border-[#1E293B] rounded-lg pl-3 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#8B5CF6]'
                />
                <button onClick={handleExcelExport} className='flex items-center gap-1 px-3 py-1.5 border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs rounded-lg hover:bg-blue-500/20'>Export Excel</button>
              </div>
            </div>
            
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='text-xs font-semibold text-slate-400 border-b border-[#1E293B] pb-3'>
                    <th className='pb-3'>Province</th>
                    <th className='pb-3'>Municipalities</th>
                    <th className='pb-3'>Registered User</th>
                    <th className='pb-3'>Promotional Act.</th>
                    <th className='pb-3'>Technical Assistance</th>
                    <th className='pb-3 text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#1E293B]/50 text-sm'>
                  {paginatedEgov.map((egov) => (
                    <tr key={egov.id} className='hover:bg-[#111A3E]/50 transition-colors'>
                      <td className='py-3 text-slate-300 font-mono text-xs'>{egov.Province}</td>
                      <td className='py-3 text-slate-300 font-mono text-xs'>{egov.municipalities}</td>
                      <td className='py-3 text-slate-300 font-mono text-xs'>{egov.registeredUsers}</td>
                      <td className='py-3 text-slate-300 font-mono text-xs'>{egov.PromotionalActivities}</td>
                      <td className='py-3 text-slate-300 font-mono text-xs'>{egov.TechnicalAssistance}</td>
                      <td className='py-3 text-right'>
                        <div className='flex justify-end items-center gap-2'>
                          <button onClick={() => handleOpenEditModal(egov, 'egov')} className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors'>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteItem(egov.id, 'egov')} className='p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors'>
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
            </div>
          </div>
        </div>

        {/* GRID STRUCTURE SPLITTING PROMOTIONAL & ACTIVITY MANAGEMENT */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          
          {/* ==================== TABLE 2: PROMOTIONAL TABLE ==================== */}
          <div className='bg-[#0B112C] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-between'>
            <div>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-md font-medium text-slate-200 tracking-wide'>Promotional Activities List</h2>
                <input 
                  type="text" value={searchQueryPro} onChange={(e) => setSearchQueryPro(e.target.value)}
                  placeholder="Filter activity string..." className='bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-emerald-500'
                />
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='text-xs font-semibold text-slate-400 border-b border-[#1E293B] pb-2'>
                      <th className='pb-2'>Promotional Activities Value</th>
                      <th className='pb-2 text-right'>Control</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-[#1E293B]/40 text-xs'>
                    {paginatedPro.map((pro) => (
                      <tr key={pro.id} className='hover:bg-[#111A3E]/30 transition-all'>
                        <td className='py-2.5 text-slate-300 font-mono'>{pro.PromotionalActivities || 'Unassigned Value'}</td>
                        <td className='py-2.5 text-right'>
                          <div className='flex justify-end gap-3'>
                            <button onClick={() => handleOpenEditModal(pro, 'pro')} className='text-emerald-400 hover:text-emerald-300 font-medium'>Update</button>
                            <button onClick={() => handleDeleteItem(pro.id, 'egovpro')} className='text-slate-500 hover:text-red-400 font-medium'>Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ==================== TABLE 3: EGOV ACTIVITY TRACK ==================== */}
          <div className='bg-[#0B112C] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-between'>
            <div>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-md font-medium text-slate-200 tracking-wide'>Egov Technical Activities Tracker</h2>
                <input 
                  type="text" value={searchQueryAct} onChange={(e) => setSearchQueryAct(e.target.value)}
                  placeholder="Search technical matrix..." className='bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-blue-500'
                />
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='text-xs font-semibold text-slate-400 border-b border-[#1E293B] pb-2'>
                      <th className='pb-2'>Technical Date</th>
                      <th className='pb-2'>Technical Assistance Description</th>
                      <th className='pb-2 text-right'>Control</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-[#1E293B]/40 text-xs'>
                    {paginatedAct.map((act) => (
                      <tr key={act.id} className='hover:bg-[#111A3E]/30 transition-all'>
                        <td className='py-2.5 text-slate-400 font-mono'>{act.TechnicalDate || 'N/A'}</td>
                        <td className='py-2.5 text-slate-200'>{act.TechnicalAssistance || 'Empty Log'}</td>
                        <td className='py-2.5 text-right'>
                          <div className='flex justify-end gap-3'>
                            <button onClick={() => handleOpenEditModal(act, 'act')} className='text-blue-400 hover:text-blue-300 font-medium'>Modify</button>
                            <button onClick={() => handleDeleteItem(act.id, 'egovact')} className='text-slate-500 hover:text-red-400 font-medium'>Purge</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* ==================== SIDE MODAL INPUT ENGINE ==================== */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-[9999]'>
            <div className='w-full lg:w-[480px] h-full bg-[#0B112C] border-l border-[#1E293B] flex flex-col justify-between animate-slide-in'>
              
              {/* Modal Head context */}
              <div className='p-6 border-b border-[#1E293B] flex justify-between items-center bg-gradient-to-r from-[#0B112C] to-[#161233]'>
                <h2 className='text-lg font-bold text-white tracking-wide uppercase'>
                  {modalMode.startsWith('add') ? 'Create Schema Entry' : 'Update Existing Entry'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className='text-slate-400 hover:text-white text-xl'>&times;</button>
              </div>

              {/* Form Input fields routing based on modalMode target */}
              <div className='p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar'>
                
                {/* Conditionally Render Inputs Based on Operation Type */}
                {(modalMode === 'add' || modalMode === 'edit') && (
                  <>
                    <div>
                      <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase'>Province Name</label>
                      <input type="text" value={inputProvince} onChange={(e) => setInputProvince(e.target.value)} className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-200"/>
                    </div>
                    <div>
                      <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase'>Municipal name</label>
                      <input type="text" value={inputMunicipality} onChange={(e) => setInputMunicipality(e.target.value)} className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-200"/>
                    </div>
                    <div>
                      <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase'>Registered Users Count</label>
                      <input type="text" value={inputRegisteredUsers} onChange={(e) => setInputRegisteredUsers(e.target.value)} className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-200"/>
                    </div>
                    <div>
                      <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase'>Promotional Focus</label>
                      <input type="text" value={inputPromotionalActivities} onChange={(e) => setInputPromotionalActivities(e.target.value)} className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-200"/>
                    </div>
                    <div>
                      <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase'>Technical Assistance Summary</label>
                      <input type="text" value={inputTechnicalAssistance} onChange={(e) => setInputTechnicalAssistance(e.target.value)} className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-200"/>
                    </div>
                  </>
                )}

                {(modalMode === 'addPro' || modalMode === 'editPro') && (
                  <div>
                    <label className='block text-xs font-semibold text-emerald-400 mb-1.5 uppercase tracking-wide'>Promotional Activities Action (String)</label>
                    <textarea rows={4} value={inputProActivityOnly} onChange={(e) => setInputProActivityOnly(e.target.value)} placeholder="Type activity summary details..." className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 outline-none"/>
                  </div>
                )}

                {(modalMode === 'addAct' || modalMode === 'editAct') && (
                  <>
                    <div>
                      <label className='block text-xs font-semibold text-blue-400 mb-1.5 uppercase'>Technical Date String</label>
                      <input type="text" value={inputTechnicalDate} onChange={(e) => setInputTechnicalDate(e.target.value)} placeholder="e.g., 2026-07-07 or Q3 Active" className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none"/>
                    </div>
                    <div>
                      <label className='block text-xs font-semibold text-blue-400 mb-1.5 uppercase'>Technical Assistance Log</label>
                      <textarea rows={4} value={inputActAssistanceOnly} onChange={(e) => setInputActAssistanceOnly(e.target.value)} placeholder="Describe systemic technical support provided..." className="w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none"/>
                    </div>
                  </>
                )}

              </div>

              {/* Dynamic Footer Controls */}
              <div className='p-4 border-t border-[#1E293B] bg-[#090E24] flex justify-between items-center'>
                <button onClick={() => setIsModalOpen(false)} className='px-4 py-2 border border-[#1E293B] text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors hover:bg-slate-800'>Discard</button>
                <button onClick={handleSubmitAction} className='px-5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-xs font-medium transition-colors'>
                  {modalMode.startsWith('edit') ? 'Commit Changes' : 'Save Record'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default SettingsEGOV;