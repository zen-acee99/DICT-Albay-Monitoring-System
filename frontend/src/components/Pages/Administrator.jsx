import React, { useState } from "react";
import { Search, Eye, Edit, Users, Building2 } from "lucide-react";
import Navbar from "../Layout/Navbar";

export default function AdministratorModule() {
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLGU, setSelectedLGU] = useState(null);

  const users = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      email: "juan@email.com",
      role: "Administrator",
      status: "Active",
      username: "juandc",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      role: "Staff",
      status: "Active",
      username: "marias",
    },
  ];

  const lgus = [
    {
      id: 1,
      name: "Albay Province",
      coordinates: "13.1775, 123.5280",
      status: "Active",
    },
    {
      id: 2,
      name: "Camarines Sur",
      coordinates: "13.5250, 123.3486",
      status: "Active",
    },
  ];

  return (
    <div className="h-screen bg-[#050816 border border-white text-white flex">

      {/* SIDEBAR */}
      <div className="hidden lg:block w-[250px] fixed h-screen">
        <Navbar />
      </div>

      {/* MAIN */}
      <div className="flex-1 lg:ml-[250px] p-3 sm:p-4 lg:p-6 border border-orange-500">

        <div className="bg-[#081028] h-[650px] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">

          {/* TABS */}
          <div className="flex flex-wrap gap-4 sm:gap-8 border-b border-white/10 pb-4 mb-6">
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-2 ${
                activeTab === "users"
                  ? "text-blue-400 border-b-2 border-blue-500"
                  : "text-gray-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Users
              </div>
            </button>

            <button
              onClick={() => setActiveTab("lgu")}
              className={`pb-2 ${
                activeTab === "lgu"
                  ? "text-blue-400 border-b-2 border-blue-500"
                  : "text-gray-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                LGU Management
              </div>
            </button>
          </div>

          {/* HEADER + SEARCH */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {activeTab === "users" ? "Users List" : "LGU Management"}
            </h2>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full md:w-[260px] bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 outline-none"
              />
            </div>
          </div>

          {/* TABLE WRAPPER */}
          <div className="overflow-x-auto">

            {/* USERS */}
            {activeTab === "users" && (
              <table className="min-w-[700px] w-full">
                <thead>
                  <tr className="text-blue-300 bg-blue-500/10">
                    <th className="p-4 text-left">Province Name</th>
                    <th className="p-4 text-left">Coordinates</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users
                    .filter((u) =>
                      u.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-white/5">
                        <td className="p-4">{u.name}</td>
                        <td className="p-4">{u.coordinates}</td>
                        <td className="p-4 text-green-400">{u.status}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="border border-blue-500 text-blue-400 px-3 py-1 rounded-lg"
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {/* LGU */}
            {activeTab === "lgu" && (
              <table className="min-w-[700px] w-full">
                <thead>
                  <tr className="text-orange-300 bg-orange-500/10">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Coordinates</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {lgus
                    .filter((l) =>
                      l.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((l) => (
                      <tr key={l.id} className="hover:bg-white/5">
                        <td className="p-4">{l.name}</td>
                        <td className="p-4">{l.coordinates}</td>
                        <td className="p-4 text-green-400">{l.status}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedLGU(l)}
                            className="border border-orange-500 text-orange-400 px-3 py-1 rounded-lg"
                          >
                            <Edit size={14} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </div>

      {/* USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#081028] w-full max-w-md p-6 rounded-xl">
            <h2 className="text-blue-400 text-xl mb-4">User Details</h2>
            <p>{selectedUser.name}</p>
            <p>{selectedUser.email}</p>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 bg-blue-500 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* LGU MODAL */}
      {selectedLGU && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#081028] w-full max-w-md p-6 rounded-xl">
            <h2 className="text-orange-400 text-xl mb-4">Edit LGU</h2>

            <input
              className="w-full mb-3 p-2 bg-white/5"
              defaultValue={selectedLGU.name}
            />

            <input
              className="w-full mb-3 p-2 bg-white/5"
              defaultValue={selectedLGU.coordinates}
            />

            <button className="bg-orange-500 px-4 py-2 rounded mr-2">
              Save
            </button>

            <button
              onClick={() => setSelectedLGU(null)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}