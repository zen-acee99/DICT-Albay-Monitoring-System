import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Edit, Users, Building2, Plus } from "lucide-react";
import Navbar from "../Layout/Navbar";

export default function AdministratorModule() {
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [lgus, setLGUS] = useState([]);
  const [egovs, setEgovs] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLGU, setSelectedLGU] = useState(null);
  const [selectedEGOV, setSelectedEGOV] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchLGUS();
    fetchEGOV();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3001/users");
    setUsers(res.data);
  };

  const fetchLGUS = async () => {
    const res = await axios.get("http://localhost:3001/operational");
    setLGUS(res.data);
  };

  const fetchEGOV = async () => {
    const res = await axios.get("http://localhost:3001/egovph");
    setEgovs(res.data);
  };

  const updateUser = async () => {
    await axios.put(`http://localhost:3001/users/${selectedUser._id}`, selectedUser);
    fetchUsers();
    setSelectedUser(null);
  };

  const updateLGU = async () => {
    await axios.patch(`http://localhost:3001/operational/${selectedLGU._id}`, selectedLGU);
    fetchLGUS();
    setSelectedLGU(null);
  };

  const updateEGOV = async () => {
    await axios.put(`http://localhost:3001/egovph/${selectedEGOV._id}`, selectedEGOV);
    fetchEGOV();
    setSelectedEGOV(null);
  };

  const Field = ({ label, children }) => (
    <div className="flex items-center gap-3">
      <label className="w-[140px] text-sm text-gray-300">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );

  const inputStyle =
    "w-full p-2 rounded-lg bg-[#0b1224] text-white border border-white/10 outline-none focus:border-blue-500 placeholder-gray-400";

  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#081028] p-6 rounded-xl w-[450px] space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );

  const filteredUsers = users.filter((u) =>
  u.username?.toLowerCase().includes(search.toLowerCase()) ||
  u.email?.toLowerCase().includes(search.toLowerCase()) ||
  u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLGUS = lgus.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.status?.toLowerCase().includes(search.toLowerCase()) ||
    l.version?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEGOVS = egovs.filter((e) =>
    e.provinceName?.toLowerCase().includes(search.toLowerCase()) ||
    e.municipalities?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-[#050816] text-white flex">

      <div className="hidden lg:block w-[250px] fixed h-screen">
        <Navbar />
      </div>

      <div className="flex-1 lg:ml-[250px] p-6 overflow-y-auto">

        <div className="bg-[#081028] border border-white/10 rounded-2xl p-6">

          {/* TABS (STICKY) */}
          <div className="sticky top-0 z-20 bg-[#081028] flex gap-6 border-b border-white/10 pb-4 mb-6">

            <button onClick={() => setActiveTab("users")}
              className={activeTab === "users"
                ? "text-blue-400 border-b-2 border-blue-500 pb-2"
                : "text-gray-400"}>
              <Users size={18} /> Users
            </button>

            <button onClick={() => setActiveTab("lgu")}
              className={activeTab === "lgu"
                ? "text-orange-400 border-b-2 border-orange-500 pb-2"
                : "text-gray-400"}>
              <Building2 size={18} /> LGU Operational
            </button>

            <button onClick={() => setActiveTab("egov")}
              className={activeTab === "egov"
                ? "text-green-400 border-b-2 border-green-500 pb-2"
                : "text-gray-400"}>
              <Building2 size={18} /> eGOV PH Data
            </button>

          </div>

          {/* SEARCH */}
          <div className="relative w-[300px] mb-6">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className={`${inputStyle} pl-10`}
            />
          </div>

          {/* USERS TABLE */}
          {activeTab === "users" && (
            <div className="overflow-auto max-h-[65vh]">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-500/10 text-blue-300 sticky top-0">
                    <th className="p-4 text-left">Username</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="border-b border-white/5">
                      <td className="p-4">{u.username}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">{u.role}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedUser(u)}>
                          <Edit size={14} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* LGU TABLE */}
          {activeTab === "lgu" && (
            <div className="overflow-auto max-h-[65vh]">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-500/10 text-orange-300 sticky top-0">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Coordinates</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Version</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLGUS.map((l) => (
                    <tr key={l._id} className="border-b border-white/5">
                      <td className="p-4">{l.name}</td>
                      <td className="p-4">{l.coordinates?.join(", ")}</td>
                      <td className="p-4">{l.status}</td>
                      <td className="p-4">{l.version}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedLGU(l)}>
                          <Edit size={14} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* EGOV TABLE */}
          {activeTab === "egov" && (
            <div className="overflow-auto max-h-[65vh]">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-500/10 text-green-300 sticky top-0">
                    <th className="p-4 text-left">Province</th>
                    <th className="p-4 text-left">Municipality</th>
                    <th className="p-4 text-left">Users</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEGOVS.map((e) => (
                    <tr key={e._id} className="border-b border-white/5">
                      <td className="p-4">{e.provinceName}</td>
                      <td className="p-4">{e.municipalities}</td>
                      <td className="p-4">{e.registeredUsers}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedEGOV(e)}>
                          <Edit size={14} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* USER MODAL */}
      {selectedUser && (
        <Modal onClose={() => setSelectedUser(null)}>
          <h2 className="text-blue-400">Edit User</h2>

          <Field label="Username">
            <input className={inputStyle}
              value={selectedUser.username || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, username: e.target.value })
              }
            />
          </Field>

          <Field label="Email">
            <input className={inputStyle}
              value={selectedUser.email || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
          </Field>

          <Field label="Role">
            <input className={inputStyle}
              value={selectedUser.role || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
            />
          </Field>

          <button onClick={updateUser} className="bg-blue-500 px-4 py-2 rounded-lg">
            Save
          </button>
        </Modal>
      )}

      {/* LGU MODAL */}
      {selectedLGU && (
        <Modal onClose={() => setSelectedLGU(null)}>
          <h2 className="text-orange-400">Edit LGU</h2>

          <Field label="Name">
            <input className={inputStyle}
              value={selectedLGU.name || ""}
              onChange={(e) =>
                setSelectedLGU({ ...selectedLGU, name: e.target.value })
              }
            />
          </Field>

          <Field label="Coordinates">
            <input className={inputStyle}
              value={selectedLGU.coordinates || ""}
              onChange={(e) =>
                setSelectedLGU({ ...selectedLGU, coordinates: e.target.value })
              }
            />
          </Field>

          <Field label="Status">
            <select className={inputStyle}
              value={selectedLGU.status || ""}
              onChange={(e) =>
                setSelectedLGU({ ...selectedLGU, status: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="LIVE">LIVE</option>
              <option value="UAT">UAT</option>
              <option value="OWN SYSTEM">OWN SYSTEM</option>
              <option value="NO SYSTEM">NO SYSTEM</option>
            </select>
          </Field>

          <button onClick={updateLGU} className="bg-orange-500 px-4 py-2 rounded-lg">
            Save
          </button>
        </Modal>
      )}

      {/* EGOV MODAL */}
      {selectedEGOV && (
        <Modal onClose={() => setSelectedEGOV(null)}>
          <h2 className="text-green-400">Edit eGOV</h2>

          <Field label="Province">
            <input className={inputStyle}
              value={selectedEGOV.provinceName || ""}
              onChange={(e) =>
                setSelectedEGOV({ ...selectedEGOV, provinceName: e.target.value })
              }
            />
          </Field>

          <Field label="Municipality">
            <input className={inputStyle}
              value={selectedEGOV.municipalities || ""}
              onChange={(e) =>
                setSelectedEGOV({ ...selectedEGOV, municipalities: e.target.value })
              }
            />
          </Field>

          <Field label="Users">
            <input className={inputStyle}
              type="number"
              value={selectedEGOV.registeredUsers || 0}
              onChange={(e) =>
                setSelectedEGOV({
                  ...selectedEGOV,
                  registeredUsers: Number(e.target.value),
                })
              }
            />
          </Field>

          <button onClick={updateEGOV} className="bg-green-500 px-4 py-2 rounded-lg">
            Save
          </button>
        </Modal>
      )}

    </div>
  );
}