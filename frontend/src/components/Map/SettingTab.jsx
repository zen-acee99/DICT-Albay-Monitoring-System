import React, { useState } from "react";
import {
  Search,
  Eye,
  Edit,
  Users,
  Building2,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#050816] text-white p-6">
      {/* MAIN CONTAINER */}
      <div className="bg-[#081028] border border-white/10 rounded-2xl p-6 shadow-2xl">
        
        {/* TABS */}
        <div className="flex gap-8 border-b border-white/10 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-2 transition-all ${
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
            className={`pb-2 transition-all ${
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {activeTab === "users"
              ? "Users List"
              : "LGU Management"}
          </h2>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-500/10 text-blue-300">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {users
                  .filter((user) =>
                    user.name
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.role}</td>

                      <td className="p-4">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          {user.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="border border-blue-500 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition"
                        >
                          <div className="flex items-center gap-2">
                            <Eye size={16} />
                            View
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* LGU TAB */}
        {activeTab === "lgu" && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500/10 text-orange-300">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Coordinates</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {lgus
                  .filter((lgu) =>
                    lgu.name
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((lgu) => (
                    <tr
                      key={lgu.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4">{lgu.name}</td>
                      <td className="p-4">{lgu.coordinates}</td>

                      <td className="p-4">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          {lgu.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedLGU(lgu)}
                          className="border border-orange-500 text-orange-400 px-4 py-2 rounded-lg hover:bg-orange-500/20 transition"
                        >
                          <div className="flex items-center gap-2">
                            <Edit size={16} />
                            Edit
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#081028] border border-blue-500/20 rounded-2xl p-8 w-[450px]">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">
              User Credentials
            </h2>

            <div className="space-y-4">
              <p>
                <span className="text-gray-400">Full Name:</span>{" "}
                {selectedUser.name}
              </p>

              <p>
                <span className="text-gray-400">Username:</span>{" "}
                {selectedUser.username}
              </p>

              <p>
                <span className="text-gray-400">Email:</span>{" "}
                {selectedUser.email}
              </p>

              <p>
                <span className="text-gray-400">Role:</span>{" "}
                {selectedUser.role}
              </p>

              <p>
                <span className="text-gray-400">Status:</span>{" "}
                {selectedUser.status}
              </p>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LGU MODAL */}
      {selectedLGU && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#081028] border border-orange-500/20 rounded-2xl p-8 w-[450px]">
            <h2 className="text-2xl font-semibold mb-6 text-orange-400">
              Edit LGU
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedLGU.name}
                  className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">
                  Coordinates
                </label>
                <input
                  type="text"
                  defaultValue={selectedLGU.coordinates}
                  className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">
                  Status
                </label>

                <select className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setSelectedLGU(null)}
                className="border border-white/10 px-5 py-2 rounded-lg hover:bg-white/5 transition"
              >
                Cancel
              </button>

              <button className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}