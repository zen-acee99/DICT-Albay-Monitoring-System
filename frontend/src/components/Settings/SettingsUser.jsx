import React, { useState } from 'react'
import Navbar from '../Layout/Navbar'

// Configuration for Pagination
const ITEMS_PER_PAGE = 5; 

// Mock initial data based on your design
const INITIAL_USERS = [
  { id: 1, name: 'Marvin McKinney', email: 'thomas55@example.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Cameron Williamson', email: 'thomas55@example.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Devon Lane', email: 'thomas55@example.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Brooklyn Simmons', email: 'thomas55@example.com', role: 'User', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Floyd Miles', email: 'thomas55@example.com', role: 'User', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60' },
  { id: 6, name: 'Arlene McCoy', email: 'thomas55@example.com', role: 'User', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60' },
  { id: 7, name: 'Courtney Henry', email: 'thomas55@example.com', role: 'User', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=60' },
]

const PERMISSION_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', read: true, edit: null, import: null, export: null },
  { id: 'catalog', label: 'My Catalog', read: false, edit: true, import: null, export: false },
  { id: 'competitors', label: 'Competitors - Competitors', read: true, edit: false, import: null, export: null },
  { id: 'monitored_urls', label: 'Competitors Monitored Urls', read: false, edit: false, import: false, export: false },
  { id: 'competitors_di', label: 'Competitors - Competitors Di...', read: false, edit: false, import: null, export: null },
  { id: 'map_infringement', label: 'Competitors - MAP Infringem...', read: false, edit: false, import: null, export: false },
  { id: 'repricing', label: 'Repricing', read: false, edit: false, import: null, export: null },
  { id: 'settings', label: 'Settings - General', read: false, edit: false, import: null, export: null },
  { id: 'alerts', label: 'Alerts', read: false, edit: false, import: null, export: null },
]

const SettingsUser = () => {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [modalMode, setModalMode] = useState('edit')
  
  // Form States
  const [formData, setFormData] = useState({
    id: 1,
    name: 'Marvin',
    surname: 'McKinney',
    email: 'thomas55@example.com',
    password: 'password123'
  })
  const [permissions, setPermissions] = useState(PERMISSION_SECTIONS)

  // Trigger Add Mode
  const handleOpenAddModal = () => {
    setModalMode('add')
    setFormData({ id: null, name: '', surname: '', email: '', password: '' })
    setPermissions(PERMISSION_SECTIONS.map(p => ({ ...p })))
    setIsModalOpen(true)
  }

  // Trigger Edit Mode populated with row data
  const handleOpenEditModal = (user) => {
    setModalMode('edit')
    const [firstName, ...lastNameArr] = user.name.split(' ')
    setFormData({
      id: user.id,
      name: firstName || '',
      surname: lastNameArr.join(' ') || '',
      email: user.email,
      password: '••••••••••••'
    })
    setIsModalOpen(true)
  }

  // Handle row deletion
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== userId))
      if (formData.id === userId) {
        setIsModalOpen(false)
      }
      // Readjust pagination page if current page becomes empty
      setCurrentPage(1)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleToggle = (sectionId, field) => {
    setPermissions(prev =>
      prev.map(sec =>
        sec.id === sectionId ? { ...sec, [field]: !sec[field] } : sec
      )
    )
  }

  // Search logic
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  })

  // Pagination Calculation Core Logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset back to first page when filtering
  }

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
            <h1 className='tracking-wide font-semibold text-2xl uppercase text-slate-100'>
              Albay - User Management
            </h1>
            <p className='text-xs text-slate-400 mt-1'>Region V - Bicol Region</p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="md:self-end px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            + Add New User
          </button>
        </div>

        {/* Content Area */}
        <div className='flex flex-col lg:flex-row gap-6 items-start w-full h-full'>
          
          {/* Left Panel: Table Grid */}
          <div className='w-full lg:flex-1 bg-[#0B112C] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-between min-h-[520px]'>
            <div>
              <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6'>
                <h2 className='text-lg font-medium text-slate-200'>
                  {searchQuery ? `Search Results (${filteredUsers.length})` : `Current Users (${users.length})`}
                </h2>
                
                {/* Table Search Input */}
                <div className='relative w-full sm:w-64'>
                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={handleSearchChange}
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
              </div>
              
              <div className='overflow-x-auto'>
                {paginatedUsers.length > 0 ? (
                  <table className='w-full text-left border-collapse'>
                    <thead>
                      <tr className='text-xs font-semibold text-slate-400 border-b border-[#1E293B] pb-3'>
                        <th className='pb-3 w-16'>User</th>
                        <th className='pb-3'>Name</th>
                        <th className='pb-3'>Email</th>
                        <th className='pb-3'>Role</th>
                        <th className='pb-3 w-24 text-right'>Actions</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#1E293B]/50 text-sm'>
                      {paginatedUsers.map((user) => (
                        <tr key={user.id} className={`hover:bg-[#111A3E]/50 transition-colors group ${formData.id === user.id && isModalOpen ? 'bg-[#111A3E]/30' : ''}`}>
                          <td className='py-3.5'>
                            <img src={user.avatar} alt={user.name} className='w-9 h-9 rounded-full object-cover border border-slate-700' />
                          </td>
                          <td className='py-3.5 font-medium text-[#60A5FA] group-hover:text-blue-400'>
                            {user.name} {user.role === 'Admin' && <span className='text-xs ml-1'>👑</span>}
                          </td>
                          <td className='py-3.5 text-slate-300 font-mono text-xs'>{user.email}</td>
                          <td className='py-3.5'>
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                              user.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-500/10 text-slate-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className='py-3.5 text-right'>
                            <div className='flex items-center justify-end gap-2'>
                              <button 
                                onClick={() => handleOpenEditModal(user)}
                                title="Edit User"
                                className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors'
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                title="Delete User"
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
                    <p className='text-sm text-slate-400 font-medium'>No users found matching "{searchQuery}"</p>
                    <p className='text-xs text-slate-500 mt-1'>Try adjusting your keywords or clearing the search box.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination UI Controls */}
            {totalPages > 1 && (
              <div className='flex items-center justify-between border-t border-[#1E293B] pt-4 mt-6 text-xs text-slate-400'>
                <div>
                  Showing <span className='font-medium text-slate-200'>{startIndex + 1}</span> to{' '}
                  <span className='font-medium text-slate-200'>
                    {endIndex > filteredUsers.length ? filteredUsers.length : endIndex}
                  </span>{' '}
                  of <span className='font-medium text-slate-200'>{filteredUsers.length}</span> entries
                </div>
                
                <div className='flex items-center gap-1.5'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2.5 py-1.5 rounded-md border border-[#1E293B] font-medium transition-colors ${
                      currentPage === 1 
                        ? 'text-slate-600 border-slate-800/40 cursor-not-allowed' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-7 h-7 rounded-md text-center transition-colors font-medium ${
                        currentPage === page
                          ? 'bg-[#8B5CF6] text-white'
                          : 'border border-[#1E293B] text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2.5 py-1.5 rounded-md border border-[#1E293B] font-medium transition-colors ${
                      currentPage === totalPages 
                        ? 'text-slate-600 border-slate-800/40 cursor-not-allowed' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Side Modal/Form */}
          {isModalOpen && (
            <div className='w-full lg:w-[480px] shrink-0 bg-[#0B112C] border border-[#1E293B] rounded-xl flex flex-col justify-between transition-all duration-300'>
              {/* Modal Dynamic Header */}
              <div className='p-6 border-b border-[#1E293B] flex justify-between items-center bg-gradient-to-r from-[#0B112C] to-[#161233] rounded-t-xl'>
                <h2 className='text-lg font-bold text-white tracking-wide'>
                  {modalMode === 'edit' ? 'Edit User' : 'Add New User'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className='text-slate-400 hover:text-white transition-colors p-1'
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Modal Body & Inputs */}
              <div className='p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name" 
                      className='w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5CF6] text-slate-200 placeholder-slate-600' 
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>Surname</label>
                    <input 
                      type="text" 
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      placeholder="Enter your surname" 
                      className='w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5CF6] text-slate-200 placeholder-slate-600' 
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email" 
                      className='w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5CF6] text-slate-200 placeholder-slate-600' 
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider'>Password</label>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••••••" 
                      className='w-full bg-[#050816] border border-[#1E293B] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5CF6] text-slate-200 placeholder-slate-600' 
                    />
                  </div>
                </div>

                {/* Permissions Subsection */}
                <div className='pt-4 border-t border-[#1E293B]/60'>
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
                            
                            {/* Read Toggle */}
                            <td className='py-2.5 text-center'>
                              {sec.read !== null ? (
                                <button 
                                  onClick={() => handleToggle(sec.id, 'read')}
                                  className={`mx-auto w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${sec.read ? 'bg-[#8B5CF6]' : 'bg-slate-700'}`}
                                >
                                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${sec.read ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              ) : <span className="text-slate-600">-</span>}
                            </td>

                            {/* Edit Toggle */}
                            <td className='py-2.5 text-center'>
                              {sec.edit !== null ? (
                                <button 
                                  onClick={() => handleToggle(sec.id, 'edit')}
                                  className={`mx-auto w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${sec.edit ? 'bg-[#8B5CF6]' : 'bg-slate-700'}`}
                                >
                                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${sec.edit ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              ) : <span className="text-slate-600">-</span>}
                            </td>

                            {/* Import Toggle */}
                            <td className='py-2.5 text-center'>
                              {sec.import !== null ? (
                                <button 
                                  onClick={() => handleToggle(sec.id, 'import')}
                                  className={`mx-auto w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${sec.import ? 'bg-[#8B5CF6]' : 'bg-slate-700'}`}
                                >
                                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${sec.import ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              ) : <span className="text-slate-600">-</span>}
                            </td>

                            {/* Export Toggle */}
                            <td className='py-2.5 text-center'>
                              {sec.export !== null ? (
                                <button 
                                  onClick={() => handleToggle(sec.id, 'export')}
                                  className={`mx-auto w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${sec.export ? 'bg-[#8B5CF6]' : 'bg-slate-700'}`}
                                >
                                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${sec.export ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              ) : <span className="text-slate-600">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className='p-4 border-t border-[#1E293B] bg-[#090E24] flex justify-between items-center rounded-b-xl'>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 border border-[#1E293B] text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors hover:bg-slate-800'
                >
                  Discard
                </button>
                <button className='px-5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-sm font-medium transition-colors'>
                  {modalMode === 'edit' ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default SettingsUser